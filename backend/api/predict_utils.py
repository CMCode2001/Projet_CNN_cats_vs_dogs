import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import io
from PIL import Image

IMG_SIZE = (224, 224)
CLASS_NAMES = ["cat", "dog"]
# Seuil de confiance très strict pour la détection "inconnu"
STRICT_THRESHOLD = 0.98

def prepare_image(image_bytes, flip=False, zoom=1.0):
    """
    Prépare l'image avec des options de transformation pour le TTA
    """
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert("RGB")
    
    if flip:
        img = img.transpose(Image.FLIP_LEFT_RIGHT)
    
    if zoom > 1.0:
        w, h = img.size
        nw, nh = int(w/zoom), int(h/zoom)
        left = (w - nw) / 2
        top = (h - nh) / 2
        img = img.crop((left, top, left + nw, top + nh))
        
    img = img.resize(IMG_SIZE)
    img_array = image.img_to_array(img)
    # EfficientNetB0 gère le rescaling interne, on ne divise pas par 255
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def get_prediction(model, image_bytes):
    """
    Effectue une prédiction robuste via Test Time Augmentation (TTA)
    """
    # On génère 3 versions de l'image pour tester la stabilité du modèle
    versions = [
        prepare_image(image_bytes), # Original
        prepare_image(image_bytes, flip=True), # Miroir
        prepare_image(image_bytes, zoom=1.2) # Zoom
    ]
    
    all_preds = []
    for img_array in versions:
        all_preds.append(model.predict(img_array)[0])
    
    # Moyenne des prédictions
    mean_preds = np.mean(all_preds, axis=0)
    # Écart-type (si élevé = le modèle est instable/perdu)
    stability = np.std(all_preds, axis=0)
    
    confidence = float(np.max(mean_preds))
    class_index = int(np.argmax(mean_preds))
    label = CLASS_NAMES[class_index]
    
    # CRITÈRES POUR "INCONNU" :
    # 1. Confiance moyenne trop basse
    # 2. OU Instabilité trop forte (le modèle change d'avis selon les angles)
    is_unstable = np.max(stability) > 0.15 
    
    if confidence < STRICT_THRESHOLD or is_unstable:
        return {
            "label": "unknown",
            "confidence": confidence,
            "status": "inconnu",
            "reason": "instabilité" if is_unstable else "faible_confiance"
        }
    
    return {
        "label": label,
        "confidence": confidence,
        "status": "success"
    }
