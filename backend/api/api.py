from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

# Ajoute le dossier courant au path pour éviter les problèmes d'import
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from model_loader import load_trained_model
    from predict_utils import prepare_image, get_prediction
except ImportError:
    from .model_loader import load_trained_model
    from .predict_utils import prepare_image, get_prediction

app = FastAPI(title="Dogs vs Cats Classifier API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to the model
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'model/model.keras')

# Global model variable
model = None

@app.on_event("startup")
def startup_event():
    global model
    print(f"DEBUG: Starting application... BASE_DIR: {BASE_DIR}")
    print(f"DEBUG: Looking for model at: {MODEL_PATH}")
    if os.path.exists(MODEL_PATH):
        print(f"DEBUG: Model file found! Size: {os.path.getsize(MODEL_PATH)} bytes")
    else:
        print(f"DEBUG: CRITICAL - Model file NOT found at {MODEL_PATH}")
        
    try:
        model = load_trained_model(MODEL_PATH)
        print("DEBUG: Model loaded successfully")
    except Exception as e:
        print(f"DEBUG: CRITICAL - Error loading model: {e}")
        import traceback
        traceback.print_exc()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Dogs vs Cats Classifier API"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Modèle non chargé sur le serveur.")
    
    image_bytes = await file.read()
    prediction = get_prediction(model, image_bytes)
    print(f"Prediction result: {prediction}")
    return prediction

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
