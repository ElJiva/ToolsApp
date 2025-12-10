import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
import psycopg2

DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_NAME = os.environ.get('DB_NAME', 'toolScan_db')
DB_USER = os.environ.get('DB_USER', 'admin')
DB_PASS = os.environ.get('DB_PASS', 'admin123')
BASE_IMG_DIR = "imagenes_base"
MODEL_PATH = "modelo_herramientas.h5"

def preparar_datos():
  """Prepara el dataset con data augmentation"""

  train_datagen = ImageDataGenerator(
    rescale=1. / 255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest',
    validation_split=0.2
  )

  train_generator = train_datagen.flow_from_directory(
    BASE_IMG_DIR,
    target_size=(224, 224),
    batch_size=16,
    class_mode='categorical',
    subset='training'
  )

  validation_generator = train_datagen.flow_from_directory(
    BASE_IMG_DIR,
    target_size=(224, 224),
    batch_size=16,
    class_mode='categorical',
    subset='validation'
  )

  return train_generator, validation_generator

def crear_modelo(num_clases):
  """Crea el modelo usando MobileNetV2 pre-entrenado"""

  base_model = MobileNetV2(
    weights='imagenet',
    include_top=False,
    input_shape=(224, 224, 3)
  )

  for layer in base_model.layers[:-20]:
    layer.trainable = False

  x = base_model.output
  x = GlobalAveragePooling2D()(x)
  x = Dense(256, activation='relu')(x)
  x = Dropout(0.5)(x)
  x = Dense(128, activation='relu')(x)
  x = Dropout(0.3)(x)
  predictions = Dense(num_clases, activation='softmax')(x)

  model = Model(inputs=base_model.input, outputs=predictions)

  model.compile(
    optimizer=Adam(learning_rate=0.0001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
  )

  return model

def entrenar():
  """Entrena el modelo"""

  print("=" * 50)
  print("ENTRENANDO MODELO DE DEEP LEARNING")
  print("=" * 50)

  # Verificar que existan imágenes
  if not os.path.exists(BASE_IMG_DIR):
    print(f"ERROR: No existe {BASE_IMG_DIR}")
    return

  carpetas = [d for d in os.listdir(BASE_IMG_DIR)
              if os.path.isdir(os.path.join(BASE_IMG_DIR, d))]

  if len(carpetas) < 2:
    print("ERROR: Necesitas al menos 2 categorías de herramientas")
    return

  print(f"\nCategorías encontradas: {carpetas}")
  print(f"Total de clases: {len(carpetas)}\n")

  for carpeta in carpetas:
    path = os.path.join(BASE_IMG_DIR, carpeta)
    imgs = [f for f in os.listdir(path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    print(f"  - {carpeta}: {len(imgs)} imágenes")

  print("\nPreparando datos...")
  train_gen, val_gen = preparar_datos()

  num_clases = len(train_gen.class_indices)
  print(f"\nCreando modelo para {num_clases} clases...")

  model = crear_modelo(num_clases)

  print("\nIniciando entrenamiento...")
  print("Esto puede tomar varios minutos...\n")

  early_stop = tf.keras.callbacks.EarlyStopping(
    monitor='val_loss',
    patience=5,
    restore_best_weights=True
  )

  reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.5,
    patience=3,
    min_lr=1e-7
  )

  history = model.fit(
    train_gen,
    epochs=30,
    validation_data=val_gen,
    callbacks=[early_stop, reduce_lr],
    verbose=1
  )

  model.save(MODEL_PATH)
  print(f"\n✅ Modelo guardado en: {MODEL_PATH}")

  import json
  class_mapping = {v: k for k, v in train_gen.class_indices.items()}
  with open('class_mapping.json', 'w') as f:
    json.dump(class_mapping, f)
  print(f"✅ Mapeo de clases guardado en: class_mapping.json")

  print("\n" + "=" * 50)
  print("ENTRENAMIENTO COMPLETO")
  print("=" * 50)
  print(f"Precisión final (entrenamiento): {history.history['accuracy'][-1] * 100:.2f}%")
  print(f"Precisión final (validación): {history.history['val_accuracy'][-1] * 100:.2f}%")
  print("=" * 50)

if __name__ == "__main__":
  entrenar()