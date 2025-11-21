import os
import time
import psycopg2
from psycopg2.extras import RealDictCursor

DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_NAME = os.environ.get('DB_NAME', 'taller_db')
DB_USER = os.environ.get('DB_USER', 'usuario_taller')
DB_PASS = os.environ.get('DB_PASS', 'password_segura_123')

BASE_IMG_DIR = "imagenes_base"

MAPA_FRONTEND = {
  "cintaAmericana": {"stl": "cinta_americana.stl", "img": "cinta_americana_cover.png"},
  "cintaMetrica": {"stl": "cinta_metrica.stl", "img": "cinta_metrica_cover.png"},
  "destornillador": {"stl": "destornillador.stl", "img": "destornillador_cover.png"},
  "llaveAllen": {"stl": "llave_allen.stl", "img": "llave_allen_cover.png"},
  "llaveBoca": {"stl": "llave_boca.stl", "img": "llave_boca_cover.png"},
  "llaveInglesa": {"stl": "llave_inglesa.stl", "img": "llave_inglesa_cover.png"},
  "martillo": {"stl": "martillo.stl", "img": "martillo_cover.png"},
  "pinzas": {"stl": "pinzas.stl", "img": "pinzas_cover.png"},
  "tijeras": {"stl": "tijeras.stl", "img": "tijeras_cover.png"}
}

def esperar_db():
  """Espera a que Postgres esté listo antes de intentar conectar"""
  retries = 5
  while retries > 0:
    try:
      conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
      print("Conexión a BD exitosa.")
      return conn
    except psycopg2.OperationalError:
      print("Esperando a la base de datos...")
      time.sleep(3)
      retries -= 1
  raise Exception("No se pudo conectar a la base de datos")

def inicializar():
  conn = esperar_db()
  cur = conn.cursor()

  # 1. Crear Tablas
  print("Creando tablas si no existen...")
  cur.execute("""
              CREATE TABLE IF NOT EXISTS herramientas
              (
                  id
                  SERIAL
                  PRIMARY
                  KEY,
                  nombre_carpeta
                  VARCHAR
              (
                  100
              ) UNIQUE,
                  nombre_mostrar VARCHAR
              (
                  100
              ),
                  archivo_stl VARCHAR
              (
                  200
              ),
                  imagen_referencia_front VARCHAR
              (
                  200
              )
                  );
              """)

  cur.execute("""
              CREATE TABLE IF NOT EXISTS referencias_orb
              (
                  id
                  SERIAL
                  PRIMARY
                  KEY,
                  herramienta_id
                  INTEGER
                  REFERENCES
                  herramientas
              (
                  id
              ),
                  ruta_interna VARCHAR
              (
                  300
              )
                  );
              """)

  cur.execute("""
              CREATE TABLE IF NOT EXISTS historial
              (
                  id
                  SERIAL
                  PRIMARY
                  KEY,
                  fecha
                  TIMESTAMP
                  DEFAULT
                  CURRENT_TIMESTAMP,
                  herramienta_detectada
                  VARCHAR
              (
                  100
              ),
                  confianza FLOAT
                  );
              """)
  conn.commit()

  # 2. Escanear carpetas y popular BD
  print(f"Escaneando directorio: {BASE_IMG_DIR}")

  if not os.path.exists(BASE_IMG_DIR):
    print(f"ADVERTENCIA: No se encontró la carpeta {BASE_IMG_DIR}")
    os.makedirs(BASE_IMG_DIR)

  herramientas_encontradas = [d for d in os.listdir(BASE_IMG_DIR) if os.path.isdir(os.path.join(BASE_IMG_DIR, d))]

  for nombre_carpeta in herramientas_encontradas:
    # Insertar herramienta si no existe
    datos_front = MAPA_FRONTEND.get(nombre_carpeta, {"stl": "default.stl", "img": "default.png"})

    cur.execute("""
                INSERT INTO herramientas (nombre_carpeta, nombre_mostrar, archivo_stl, imagen_referencia_front)
                VALUES (%s, %s, %s, %s) ON CONFLICT (nombre_carpeta) DO NOTHING
            RETURNING id;
                """, (nombre_carpeta, nombre_carpeta.capitalize(), datos_front['stl'], datos_front['img']))

    # Obtener ID (ya sea recién insertado o existente)
    res = cur.fetchone()
    if res:
      h_id = res[0]
    else:
      cur.execute("SELECT id FROM herramientas WHERE nombre_carpeta = %s", (nombre_carpeta,))
      h_id = cur.fetchone()[0]

    # Insertar las imágenes de esa carpeta como referencias para ORB
    ruta_herramienta = os.path.join(BASE_IMG_DIR, nombre_carpeta)
    archivos = os.listdir(ruta_herramienta)

    contador_refs = 0
    for archivo in archivos:
      if archivo.lower().endswith(('.png', '.jpg', '.jpeg')):
        ruta_final = os.path.join(ruta_herramienta, archivo)
        # Verificar si ya existe esta referencia para no duplicar
        cur.execute("SELECT id FROM referencias_orb WHERE ruta_interna = %s", (ruta_final,))
        if not cur.fetchone():
          cur.execute("INSERT INTO referencias_orb (herramienta_id, ruta_interna) VALUES (%s, %s)", (h_id, ruta_final))
          contador_refs += 1

    print(f"Procesado {nombre_carpeta}: {contador_refs} nuevas referencias.")

  conn.commit()
  cur.close()
  conn.close()
  print("Inicialización completa.")

if __name__ == "__main__":
  inicializar()
