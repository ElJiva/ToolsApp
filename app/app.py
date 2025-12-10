import os
import json
import numpy as np
from flask import Flask, request, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
import cv2
from PIL import Image, ImageOps
import io
import datetime

app = Flask(__name__)

DB_HOST = os.environ.get('DB_HOST', 'db')
DB_NAME = os.environ.get('DB_NAME', 'toolScan_db')
DB_USER = os.environ.get('DB_USER', 'admin')
DB_PASS = os.environ.get('DB_PASS', 'admin123')

MODEL_PATH = "modelo_herramientas.h5"
CLASS_MAPPING_PATH = "class_mapping.json"

# Variables globales para el modelo
modelo = None
class_mapping = None

def cargar_modelo():
  """Carga el modelo de TensorFlow y el mapeo de clases"""
  global modelo, class_mapping

  if not os.path.exists(MODEL_PATH):
    print("⚠️  ADVERTENCIA: Modelo no encontrado. Ejecuta train_model.py primero.")
    return False

  try:
    import tensorflow as tf
    modelo = tf.keras.models.load_model(MODEL_PATH)
    print(f"✅ Modelo cargado desde: {MODEL_PATH}")

    # Cargar mapeo de clases
    if os.path.exists(CLASS_MAPPING_PATH):
      with open(CLASS_MAPPING_PATH, 'r') as f:
        class_mapping = json.load(f)
      print(f"✅ Mapeo de clases cargado: {list(class_mapping.values())}")
    else:
      print("⚠️  Mapeo de clases no encontrado")
      return False

    return True
  except Exception as e:
    print(f"❌ Error cargando modelo: {e}")
    return False

def get_db_conn():
  """Establece conexión con la base de datos PostgreSQL"""
  try:
    return psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
  except Exception as e:
    print(f"Error conectando a DB: {e}")
    return None

def preprocesar_imagen(img_bytes):
  """Preprocesa la imagen: Corrige rotación y redimensiona"""
  try:
    img = Image.open(io.BytesIO(img_bytes))

    img = ImageOps.exif_transpose(img)

    # 3. Convertir a RGB
    if img.mode != 'RGB':
      img = img.convert('RGB')

    # Esto guardará la foto en tu carpeta del proyecto para que la revises
    timestamp = datetime.datetime.now().strftime("%H%M%S")
    img.save(f"debug_received_{timestamp}.jpg")

    # 4. Redimensionar a 224x224 (Lo que pide MobileNetV2)
    img = img.resize((224, 224))

    # 5. Normalizar (0 a 1)
    img_array = np.array(img) / 255.0

    # 6. Expandir dimensiones (Batch size de 1)
    img_array = np.expand_dims(img_array, axis=0)

    return img_array
  except Exception as e:
    print(f"Error preprocesando imagen: {e}")
    return None

def predecir_con_dl(img_bytes):
  """Realiza la predicción usando Deep Learning"""
  if modelo is None or class_mapping is None:
    return None, 0.0

  # Preprocesar imagen
  img_array = preprocesar_imagen(img_bytes)
  if img_array is None:
    return None, 0.0

  # Realizar predicción
  predicciones = modelo.predict(img_array, verbose=0)[0]

  # Obtener clase con mayor probabilidad
  clase_idx = np.argmax(predicciones)
  confianza = float(predicciones[clase_idx]) * 100

  # Obtener nombre de la clase
  nombre_clase = class_mapping.get(str(clase_idx), "Desconocido")

  return nombre_clase, confianza

@app.route('/detectar', methods=['POST'])
def detectar():
  if 'foto' not in request.files:
    return jsonify({"error": "No se envió el archivo 'foto'"}), 400

  file = request.files['foto']
  img_bytes = file.read()

  if not img_bytes:
    return jsonify({"error": "Imagen inválida o corrupta"}), 400

  # Verificar si el modelo está cargado
  if modelo is None:
    return jsonify({
      "error": "Modelo no disponible. Ejecuta train_model.py para entrenar el modelo primero."
    }), 503

  # Realizar predicción
  nombre_herramienta, confianza = predecir_con_dl(img_bytes)

  if nombre_herramienta is None:
    return jsonify({"error": "Error procesando la imagen"}), 500

  # Umbral de confianza mínimo
  UMBRAL_CONFIANZA = 40.0

  conn = get_db_conn()
  if not conn:
    return jsonify({"error": "Error de conexión a Base de Datos"}), 500

  cur = conn.cursor(cursor_factory=RealDictCursor)

  resultado = {}

  if confianza >= UMBRAL_CONFIANZA:
    # Buscar información de la herramienta en la BD
    try:
      cur.execute("""
                  SELECT nombre_mostrar, archivo_stl, imagen_referencia_front
                  FROM herramientas
                  WHERE nombre_carpeta = %s
                  """, (nombre_herramienta,))

      herramienta_info = cur.fetchone()

      if herramienta_info:
        resultado = {
          "encontrado": True,
          "herramienta": herramienta_info['nombre_mostrar'],
          "confianza": round(confianza, 2),
          "archivo_stl": herramienta_info['archivo_stl'],
          "imagen_frontend": herramienta_info['imagen_referencia_front'],
          "metodo": "deep_learning"
        }

        # Guardar en historial
        cur.execute(
          "INSERT INTO historial (herramienta_detectada, confianza) VALUES (%s, %s)",
          (herramienta_info['nombre_mostrar'], confianza)
        )
        conn.commit()
      else:
        resultado = {
          "encontrado": False,
          "mensaje": f"Herramienta detectada ({nombre_herramienta}) no está en la base de datos",
          "confianza_detectada": round(confianza, 2)
        }
    except Exception as e:
      print(f"Error consultando BD: {e}")
      resultado = {
        "encontrado": True,
        "herramienta": nombre_herramienta.capitalize(),
        "confianza": round(confianza, 2),
        "archivo_stl": f"{nombre_herramienta}.stl",
        "imagen_frontend": f"{nombre_herramienta}_cover.png",
        "metodo": "deep_learning"
      }
  else:
    resultado = {
      "encontrado": False,
      "mensaje": "No se pudo identificar la herramienta con certeza",
      "herramienta_posible": nombre_herramienta,
      "confianza": round(confianza, 2)
    }

    # Guardar en historial
    try:
      cur.execute(
        "INSERT INTO historial (herramienta_detectada, confianza) VALUES (%s, %s)",
        ("DESCONOCIDO", 0)
      )
      conn.commit()
    except Exception as e:
      print(f"Error guardando historial: {e}")

  cur.close()
  conn.close()

  return jsonify(resultado)

@app.route('/historial', methods=['GET'])
def ver_historial():
  conn = get_db_conn()
  if not conn:
    return jsonify({"error": "Error de base de datos"}), 500

  try:
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM historial ORDER BY fecha DESC LIMIT 50")
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)
  except Exception as e:
    return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET'])
def health_check():
  modelo_status = "✅ Cargado" if modelo is not None else "❌ No disponible"
  return jsonify({
    "status": "online",
    "message": "API de Reconocimiento de Herramientas Activa",
    "modelo": modelo_status,
    "metodo": "Deep Learning (MobileNetV2)" if modelo is not None else "Modelo no entrenado"
  })

@app.route('/info', methods=['GET'])
def info_modelo():
  """Endpoint para ver información del modelo"""
  if modelo is None:
    return jsonify({
      "modelo_cargado": False,
      "mensaje": "Ejecuta train_model.py para entrenar el modelo"
    })

  return jsonify({
    "modelo_cargado": True,
    "clases": list(class_mapping.values()) if class_mapping else [],
    "num_clases": len(class_mapping) if class_mapping else 0,
    "arquitectura": "MobileNetV2 + Transfer Learning"
  })

if __name__ == '__main__':
  print("\n" + "=" * 50)
  print("INICIANDO API DE DETECCIÓN DE HERRAMIENTAS")
  print("=" * 50)

  if cargar_modelo():
    print("✅ Sistema listo con Deep Learning")
  else:
    print("⚠️  Sistema iniciado SIN modelo")
    print("   Ejecuta: docker exec -it api_herramientas python train_model.py")

  print("=" * 50 + "\n")

  app.run(host='0.0.0.0', port=5050)