from fastapi import FastAPI, File, UploadFile
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
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
    try:
        model = load_trained_model(MODEL_PATH)
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Dogs vs Cats Classifier API"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        return {"error": "Model not loaded"}
    
    image_bytes = await file.read()
    prediction = get_prediction(model, image_bytes)
    
    return prediction

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
