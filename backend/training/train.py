# ==============================
# IMPORTS
# ==============================
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import os

# ==============================
# PARAMÈTRES GÉNÉRAUX
# ==============================
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 25
LEARNING_RATE = 1e-4

DATA_DIR = "data"  # data/train, data/val, data/test
MODEL_PATH = "model/model.keras"

# ==============================
# DATA AUGMENTATION (TRAIN)
# ==============================
train_datagen = ImageDataGenerator(
    rotation_range=20,
    zoom_range=0.2,
    width_shift_range=0.1,
    height_shift_range=0.1,
    horizontal_flip=True
)

# VALIDATION & TEST (PAS D’AUGMENTATION NI DE RESCALE)
val_test_datagen = ImageDataGenerator()

train_generator = train_datagen.flow_from_directory(
    os.path.join(DATA_DIR, "train"),
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical"
)

val_generator = val_test_datagen.flow_from_directory(
    os.path.join(DATA_DIR, "val"),
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical"
)

test_generator = val_test_datagen.flow_from_directory(
    os.path.join(DATA_DIR, "test"),
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False
)

# ==============================
# MODÈLE : EFFICIENTNETB0
# ==============================

# Chargement du backbone pré-entraîné sur ImageNet
base_model = EfficientNetB0(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

# On gèle le backbone pour éviter le sur-apprentissage
base_model.trainable = False

# ==============================
# TÊTE DE CLASSIFICATION
# ==============================
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation="relu")(x)
x = Dropout(0.5)(x)
outputs = Dense(2, activation="softmax")(x)  # dog / cat

model = Model(inputs=base_model.input, outputs=outputs)

# ==============================
# COMPILATION
# ==============================
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

# ==============================
# CALLBACKS
# ==============================
early_stopping = EarlyStopping(
    monitor="val_loss",
    patience=5,
    restore_best_weights=True
)

checkpoint = ModelCheckpoint(
    MODEL_PATH,
    monitor="val_accuracy",
    save_best_only=True
)

# ==============================
# ENTRAÎNEMENT
# ==============================
history = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=EPOCHS,
    callbacks=[early_stopping, checkpoint]
)

# ==============================
# ÉVALUATION
# ==============================
test_loss, test_accuracy = model.evaluate(test_generator)
print(f"Test accuracy : {test_accuracy:.4f}")

# ==============================
# SAUVEGARDE FINALE
# ==============================
model.save(MODEL_PATH)
print("Modèle sauvegardé avec succès")
