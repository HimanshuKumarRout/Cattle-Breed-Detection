# 🐄 Cattle Breed Classifier

A modular project template for classifying cattle breeds using Deep Learning (PyTorch), a FastAPI REST backend, and a React web frontend.

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
│   ├── .env.example          # Backend environment variable template
│   ├── main.py               # FastAPI entry point
│   └── requirements.txt      # Python dependencies for Backend
├── frontend/                 # React / Vite Web Frontend Application
│   ├── public/               # Static assets
│   ├── src/                  # React components & UI logic
│   ├── .env.example          # Frontend environment variable template
│   ├── index.html            # Web app entry HTML
│   └── package.json          # Node.js dependencies and scripts
├── ml/                       # Machine Learning Pipeline
│   ├── artifacts/
│   │   ├── checkpoints/      # Trained model weights (.pth files - git ignored)
│   │   └── reports/          # Metrics, confusion matrices, figures
│   ├── data/                 # Raw and processed datasets (git ignored)
│   ├── notebooks/            # Jupyter notebooks for experimentation
│   ├── src/                  # Model architectures, training scripts, data loaders
│   └── requirements.txt      # Python dependencies for ML training
├── .env.example              # Root environment template
├── .gitignore                # Rules for excluding cache, logs, virtual environments, and weights
├── LICENSE                   # Project license (MIT)
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

# Copy environment settings
cp .env.example .env

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

# Copy environment settings
cp .env.example .env

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
   - `main`: Production-ready code.
   - `feature/<feature-name>`: New features (e.g., `feature/image-upload-ui`, `feature/resnet-model`).
   - `bugfix/<fix-name>`: Bug fixes (e.g., `bugfix/cors-headers`).

2. **Environment Files**:
   - Never commit `.env` or sensitive credentials to Git. Always update `.env.example` when adding new configuration variables.

3. **Model Weights & Datasets**:
   - Model weights (`*.pth`, `*.pt`) and raw dataset images are excluded from Git via `.gitignore` to prevent repository bloat.

---

## 📤 Pushing to GitHub

To link this local project to your GitHub repository and push your initial commit, run:

```bash
# 1. Add your GitHub repository as remote URL
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# 2. Rename branch to main (if not already set)
git branch -M main

# 3. Push to GitHub
git push -u origin main
```
