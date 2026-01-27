import os
from PIL import Image

def clean_dataset(data_dir):
    print(f"Scanning directory: {data_dir}")
    corrupted_files = 0
    total_files = 0

    for root, dirs, files in os.walk(data_dir):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                total_files += 1
                file_path = os.path.join(root, file)
                try:
                    img = Image.open(file_path)
                    img.verify()  # Verifie l'intégrité du fichier
                except (IOError, SyntaxError, Image.UnidentifiedImageError) as e:
                    print(f"Fichier corrompu détecté et supprimé : {file_path}")
                    os.remove(file_path)
                    corrupted_files += 1

    print(f"\nScan terminé.")
    print(f"Total de fichiers scannés : {total_files}")
    print(f"Fichiers corrompus supprimés : {corrupted_files}")

if __name__ == "__main__":
    DATA_PATH = "data"
    if os.path.exists(DATA_PATH):
        clean_dataset(DATA_PATH)
    else:
        print(f"Le dossier {DATA_PATH} n'existe pas.")
