# 🐄 Cattle Breed Classifier

A modular project template for classifying cattle breeds using Deep Learning (PyTorch), a FastAPI REST backend, and a React web frontend.

> [!IMPORTANT]
> **Team Notice**: All team members should conduct active work in the `development` branch (or feature branches targeting `development`). Direct commits to `main` should be reserved for stable releases.

---

## 📁 Repository Structure

```text
Cattle Breed Classifier/
├── backend/                  # FastAPI REST Backend Service
│   ├── app/
│   │   ├── api/              # API endpoints and router endpoints
│   │   ├── core/             # Application configs and logging
│   │   ├── models/           # Database / ORM models
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   └── services/         # Business logic and ML inference wrappers
│   ├── main.py               # FastAPI entry point
│   └── requirements.txt      # Python dependencies for Backend
├── frontend/                 # React / Vite Web Frontend Application
│   ├── public/               # Static assets
│   ├── src/                  # React components & UI logic
│   ├── index.html            # Web app entry HTML
│   └── package.json          # Node.js dependencies and scripts
├── ml/                       # Machine Learning Pipeline
│   ├── artifacts/
│   │   ├── checkpoints/      # Trained model weights (.pth files - git ignored)
│   │   └── reports/          # Metrics, confusion matrices, figures
│   ├── data/                 # Raw and processed datasets 
│   ├── notebooks/            # Jupyter notebooks for experimentation
│   ├── src/                  # Model architectures, training scripts, data loaders
│   └── requirements.txt      # Python dependencies for ML training
├── .gitignore                # Rules for excluding cache, logs, virtual environments, weights
└── README.md                 # Project documentation and team collaboration guide
```

---

## 🛠️ Prerequisites

Before running the application modules, ensure you have the following installed:
- **Python**: `3.10` or higher
- **Node.js**: `18.x` or higher
- **Git**: `2.x` or higher

---

## 🚀 Quick Start Guide

### 1. Setting Up the Backend

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# On Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt


# Run the backend development server
uvicorn app.main:app --reload --port 8000
```
- Interactive Swagger API docs will be available at: `http://localhost:8000/docs`

---

### 2. Setting Up the Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the Vite development server
npm run dev
```
- Web application will be available at: `http://localhost:5173`

---

### 3. Setting Up Machine Learning Development

```bash
# Navigate to the ml directory
cd ml

# Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

---

## 👥 Team Workflow & Git Guidelines

1. **Branching**:
   - `development`: Primary active development branch. **All team members should work here or branch off of this.**
   - `main`: Production-ready, stable releases.
   - `feature/<feature-name>`: New features created off `development` (e.g., `feature/image-upload-ui`, `feature/resnet-model`).
   - `bugfix/<fix-name>`: Bug fixes (e.g., `bugfix/cors-headers`).

2. **Model Weights & Datasets**:
   - Model weights (`*.pth`, `*.pt`) and raw dataset images are excluded from Git via `.gitignore` to prevent repository bloat.

---

## 📤 Initializing Repository & Pushing to GitHub (Project Owner)

To link this local project to your GitHub repository and push your initial commit, run:

```bash
# 1. Add your GitHub repository as remote URL
git remote add origin https://github.com/HimanshuKumarRout/Cattle-Breed-Detection.git

# 2. Rename branch to main (if not already set)
git branch -M main

# 3. Push to GitHub
git push -u origin main
```

---

## 🍴 Team Forking & Contribution Workflow (For Team Members)

Team members contributing via GitHub forks can follow these steps:

### 1. Fork the Repository
1. Navigate to the main repository: `https://github.com/HimanshuKumarRout/Cattle-Breed-Detection`
2. Click the **Fork** button (top-right) to create your personal copy (`https://github.com/YOUR_USERNAME/Cattle-Breed-Detection`).

### 2. Clone Your Fork & Add Upstream Remote
```bash
# Clone your fork to your machine
git clone https://github.com/YOUR_USERNAME/Cattle-Breed-Detection.git
cd "Cattle Breed Detection"

# Add the main team repository as 'upstream' remote
git remote add upstream https://github.com/HimanshuKumarRout/Cattle-Breed-Detection.git
```

### 3. Create a Feature Branch
```bash
# Sync local main with main repo
git checkout main
git fetch upstream
git merge upstream/main

# Create and switch to a new feature branch
git checkout -b feature/your-feature-name
```

### 4. Commit Changes & Push to Your Fork
```bash
# Stage and commit your work
git add .
git commit -m "feat(module): description of changes made"

# Push the branch to your fork on GitHub
git push -u origin feature/your-feature-name
```

### 5. Open a Pull Request (PR)
1. Go to your fork on GitHub: `https://github.com/YOUR_USERNAME/Cattle-Breed-Detection`
2. Click **Compare & pull request**.
3. Describe your implementation and click **Create pull request** for team review.

### 6. Keeping Your Local Branch & Fork Synced
To pull the latest updates added by teammates into your local copy:
```bash
git checkout main
git pull upstream main
git push origin main
```

