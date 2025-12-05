# 🏅 Decathlon AI Sportive Platform

> **Nuit de l'Info 2024** - Défi "Le Nexus Connecté" (Adapté)

Une plateforme intelligente de recommandation de produits et de conseils sportifs personnalisés.

![Decathlon AI](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Decathlon_Logo.svg/1200px-Decathlon_Logo.svg.png)

## 🌟 Fonctionnalités

### 1. Profilage Intelligent 🧘‍♂️
Un formulaire interactif qui comprend vos besoins :
- **Sport & Niveau** : Running, Yoga, Fitness, etc.
- **Objectifs** : Perte de poids, Prise de muscle, Santé...
- **Bobologie** : Prise en compte des douleurs (dos, genoux) pour adapter les conseils.

### 2. Moteur de Recommandation "Smart Light ML" 🧠
Une intelligence artificielle optimisée pour tourner sans GPU :
- **Analyse Sémantique** : Comprend le sens des mots (ex: "Running" est lié à "Course à pied").
- **Hashing Vectorizer** : Technologie légère et rapide pour matcher votre profil avec les produits Decathlon.
- **Fallback Robuste** : Fonctionne même sans les lourdes librairies de Data Science.

### 3. Conseils & "Infos du Web" 💡
- **Coach Virtuel** : Génère des conseils d'entraînement sur mesure.
- **Infos du Web** : Agrège des astuces santé et bien-être pertinentes (ex: conseils posturaux pour le mal de dos).

---

## 🚀 Installation & Démarrage

### Prérequis
- **Python 3.9+**
- **Node.js 18+**
- Accès réseau à la BDD PostgreSQL (`10.8.0.1`)

### 1️⃣ Backend (API & IA)

Le cerveau de l'application.

```bash
cd backend

# 1. Créer un environnement virtuel
python3 -m venv venv
source venv/bin/activate  # (Windows: venv\Scripts\activate)

# 2. Installer les dépendances
pip install -r requirements.txt

# 3. Lancer le serveur
uvicorn app.main:app --reload --port 8000
```
✅ *L'API tourne sur : [http://localhost:8000](http://localhost:8000)*

### 2️⃣ Frontend (Interface)

L'interface utilisateur moderne.

```bash
cd frontend

# 1. Installer les dépendances
npm install

# 2. Lancer le site
npm run dev
```
✅ *Le site est accessible sur : [http://localhost:3000](http://localhost:3000)*

---

## 🛠️ Configuration des Données (Important !)

Pour avoir des produits à recommander, vous devez initialiser la base de données.

**Depuis la racine du projet :**

1.  **Générer les produits (Scraping/Mock)** :
    ```bash
    python3 scraper/scrape.py
    ```
    *Cela va créer la table `products` dans PostgreSQL et y insérer des données réalistes.*

2.  **Créer l'index IA** :
    ```bash
    python3 ml/index_products.py
    ```
    *Cela va lire les produits et créer le fichier `data/faiss_index.bin.npy` utilisé par le moteur de recherche.*

---

## 🏗️ Architecture Technique

| Composant | Technologie | Description |
|-----------|-------------|-------------|
| **Frontend** | Next.js 14, TailwindCSS | Interface réactive et animations (Shadcn/UI). |
| **Backend** | FastAPI (Python) | API REST rapide et performante. |
| **Database** | PostgreSQL | Stockage des produits et métadonnées. |
| **ML Engine** | Numpy, Hashing | Recherche de similarité vectorielle (Cosine Similarity). |

## 🐛 Dépannage

- **Erreur "Connection refused"** : Vérifiez que le Backend tourne bien sur le port `8000`.
- **Erreur 422 (Validation)** : Le formulaire Frontend envoie peut-être des données mal formatées. Assurez-vous d'avoir la dernière version du code.
- **Pas de résultats** : Relancez `python3 ml/index_products.py` pour être sûr que l'index est à jour.
