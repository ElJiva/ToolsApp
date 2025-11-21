import os
import cv2
import numpy as np
from flask import Flask, request, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)


DB_HOST = os.environ.get('DB_HOST', 'db')
DB_NAME = os.environ.get('DB_NAME', 'toolScan_db')
DB_USER = os.environ.get('DB_USER', 'admin')
DB_PASS = os.environ.get('DB_PASS', 'admin123')

# Configuración de ORB (Algoritmo de visión)
orb = cv2.ORB_create(nfeatures=1500)
bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

def get_db_conn():
  """Establece conexión con la base de datos PostgreSQL"""
  try:
    return psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
  except Exception as e:
    print(f"Error conectando a DB: {e}")
    return None

def comparar_orb(img_input, ruta_referencia):
  """Compara la imagen de entrada con una referencia local usando ORB"""
  try:
    # Leer la imagen de referencia en escala de grises
    img_ref = cv2.imread(ruta_referencia, cv2.IMREAD_GRAYSCALE)
    if img_ref is None: return 0

    # Calcular Keypoints y Descriptors
    kp1, des1 = orb.detectAndCompute(img_input, None)
    kp2, des2 = orb.detectAndCompute(img_ref, None)

    # Si no se encuentran descriptores, la imagen es muy plana o borrosa
    if des1 is None or des2 is None: return 0

    # Comparar puntos
    matches = bf.match(des1, des2)
    # Ordenar matches por distancia (los más parecidos primero)
    matches = sorted(matches, key=lambda x: x.distance)

    # Retornar cantidad de coincidencias
    return len(matches)
  except Exception as e:
    print(f"Error en comparación con {ruta_referencia}: {e}")
    return 0

@app.route('/detectar', methods=['POST'])
def detectar():
  if 'foto' not in request.files:
    return jsonify({"error": "No se envió el archivo 'foto'"}), 400

  file = request.files['foto']

  # 1. Leer imagen recibida en memoria (sin guardarla en disco)
  filestr = file.read()
  npimg = np.frombuffer(filestr, np.uint8)
  img_input = cv2.imdecode(npimg, cv2.IMREAD_GRAYSCALE)

  if img_input is None:
    return jsonify({"error": "Imagen inválida o corrupta"}), 400

  # 2. Obtener referencias de la BD
  conn = get_db_conn()
  if not conn:
    return jsonify({"error": "Error de conexión a Base de Datos"}), 500

  cur = conn.cursor(cursor_factory=RealDictCursor)

  # Traemos rutas y datos de la herramienta
  try:
    cur.execute("""
                SELECT r.ruta_interna, h.nombre_mostrar, h.archivo_stl, h.imagen_referencia_front
                FROM referencias_orb r
                         JOIN herramientas h ON r.herramienta_id = h.id
                """)
    referencias = cur.fetchall()
  except Exception as e:
    conn.rollback()
    return jsonify({"error": f"Error leyendo referencias: {str(e)}"}), 500

  mejor_herramienta = None
  max_score = 0

  # 3. Comparar contra todas las referencias (fuerza bruta optimizada)
  for ref in referencias:
    score = comparar_orb(img_input, ref['ruta_interna'])
    if score > max_score:
      max_score = score
      mejor_herramienta = ref

  # 4. Evaluar resultado
  # UMBRAL: Número mínimo de puntos coincidentes para considerar que es un match.
  # Ajusta esto si tienes muchos falsos positivos.
  UMBRAL_MINIMO = 35

  resultado = {}

  if max_score > UMBRAL_MINIMO and mejor_herramienta:
    # Simulación de porcentaje de confianza (max 99.9%)
    confianza = min((max_score / 150) * 100, 99.9)

    resultado = {
      "encontrado": True,
      "herramienta": mejor_herramienta['nombre_mostrar'],
      "confianza": round(confianza, 2),
      "archivo_stl": mejor_herramienta['archivo_stl'],
      "imagen_frontend": mejor_herramienta['imagen_referencia_front']
    }

    # Guardar en historial
    try:
      cur.execute("INSERT INTO historial (herramienta_detectada, confianza) VALUES (%s, %s)",
                  (mejor_herramienta['nombre_mostrar'], confianza))
      conn.commit()
    except Exception as e:
      print(f"Error guardando historial: {e}")

  else:
    resultado = {
      "encontrado": False,
      "mensaje": "No se pudo identificar la herramienta con certeza.",
      "score_maximo": max_score  # Útil para debug
    }
    try:
      cur.execute("INSERT INTO historial (herramienta_detectada, confianza) VALUES (%s, 0)",
                  ("DESCONOCIDO",))
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
  return jsonify({"status": "online", "message": "API de Reconocimiento de Herramientas Activa"})

if __name__ == '__main__':
  # IMPORTANTE: Puerto 5050 para coincidir con tu docker-compose.yml
  app.run(host='0.0.0.0', port=5050)
