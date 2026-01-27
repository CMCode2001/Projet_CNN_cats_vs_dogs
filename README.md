# Dogs vs Cats Classifier - Deep Learning Project CNN

Ce projet est un classificateur d'images (chiens vs chats) utilisant un modèle de Réseau de Neurones Convolutifs (CNN) entraîné avec TensorFlow/Keras. L'application dispose d'une interface web moderne et d'une API FastAPI performante.

**Master UIDT - Projet Deep Learning CNN**

## 🚀 Fonctionnalités
- **Classification instantanée** : Identifiez si une image contient un chien ou un chat.
- **Interface Premium** : Design futuriste "Glassmorphism" avec mode sombre (style ChatGPT Carbon).
- **Galerie de Test** : Testez le modèle rapidement avec des exemples pré-chargés.
- **Test Time Augmentation (TTA)** : Analyse robuste utilisant plusieurs angles de l'image.
- **Détection d'Inconnu** : Le modèle identifie s'il est incertain ou si l'image ne correspond pas.

---

## 🛠️ Installation et Lancement (De A à Z)

### Option 1 : Utilisation de Docker (Recommandé)
C'est la méthode la plus simple pour lancer tout l'écosystème en une commande.

1. **Prérequis** : Avoir Docker et Docker Compose installés.
2. **Lancement** :
   ```bash
   docker-compose up --build
   ```
3. **Accès** :
   - Frontend : [http://localhost](http://localhost)
   - API Backend : [http://localhost:8000](http://localhost:8000)

---

### Option 2 : Installation Locale (Développement)

#### 1. Configuration du Backend (FastAPI)
- Allez dans le dossier backend : `cd backend`
- Créez un environnement virtuel : `python -m venv venv`
- Activez-le : 
  - Windows : `venv\Scripts\activate`
  - Linux/Mac : `source venv/bin/activate`
- Installez les dépendances : `pip install -r requirements.txt`
- Assurez-vous que votre modèle est dans `backend/model/model.keras`.
- Lancez l'API : `uvicorn api.api:app --reload --port 8000`

#### 2. Configuration du Frontend (React + Vite)
- Allez dans le dossier frontend : `cd frontend`
- Installez les dépendances : `npm install`
- Lancez le serveur de développement : `npm run dev`
- Accédez à l'application sur [http://localhost:5173](http://localhost:5173)

---

## 📂 Structure du Projet

```text
dogs-cats-classifier/
├── backend/
│   ├── api/                # Code de l'API FastAPI
│   ├── model/              # Modèle .keras entraîné
│   ├── requirements.txt    # Dépendances Python
│   └── Dockerfile          # Configuration Docker Backend
├── frontend/
│   ├── src/                # Code source React (TSX)
│   ├── assets/             # Images et GIFs
│   ├── package.json        # Dépendances Node.js
│   └── Dockerfile          # Configuration Docker Frontend (Nginx)
├── docker-compose.yml       # Orchestration des services
└── README.md               # Ce fichier
```

## 🧠 Modèle et Analyse
Le backend utilise un modèle **EfficientNetB0** (ou CNN personnalisé) pour la classification. 
- **Seuil de confiance** : 98% pour garantir la précision.
- **Réduction du bruit** : Utilisation de la moyenne de 3 transformations d'image (Original, Miroir, Zoom) pour une prédiction stabilisée.

## 👥 Auteur
Projet réalisé dans le cadre du **Master UIDT**.
Deep Learning Project CNN.
