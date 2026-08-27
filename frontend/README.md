# 🐄 Cattle Breed Classifier - Web Frontend

A modern, responsive React web application for classifying 26 indigenous Indian cattle and buffalo breeds using deep learning models via a FastAPI REST backend.

---

## 💻 Tech Stack

- **Framework**: React 18 + Vite
- **Routing**: React Router DOM (v7)
- **Icons**: Lucide React
- **Styling**: Modern CSS3 (Glassmorphism design system with responsive layouts)
- **Tooling**: ESLint, PostCSS, Tailwind CSS

---

## ✨ Features

- 📸 **Multiple Input Modes**:
  - **File Upload**: Drag and drop or browse local image files (JPG, PNG, WebP).
  - **Live Camera**: Capture real-time photos directly from device camera with permission handling.
  - **Image URL**: Paste external image web addresses.
- 🎯 **Deep Learning Prediction View**:
  - Displays predicted breed name, confidence badge, and confidence progress bar.
  - Shows **Top-K ranking candidates** with probability distribution.
  - Renders detailed breed information (region, primary use, milk yield, lifespan, description).
  - Displays inference latency in milliseconds.
- 🌾 **Breed Explorer**:
  - Browse and filter all 26 indigenous Indian cattle (21) and buffalo (5) breeds.
  - Interactive search bar and breed-type filter (Cow vs Buffalo).
- 📜 **Prediction History**:
  - Saves recent classification history locally using `localStorage`.
- ⚡ **Resilient Backend Connection**:
  - Configurable API client with automatic error fallback messages if the backend server is unreachable.

---

## 📁 Directory Structure

```text
frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and design assets
│   ├── hooks/              # Custom React hooks (e.g. usePredictionHistory)
│   ├── pages/              # Main page components
│   │   ├── AboutPage.jsx          # Model & dataset information
│   │   ├── BreedExplorerPage.jsx  # Interactive breed directory
│   │   ├── HomePage.jsx           # Landing page & feature showcase
│   │   └── PredictPage.jsx        # Image classification page
│   ├── services/           # Backend API integration (api.js)
│   ├── App.css             # Component-specific styles
│   ├── App.jsx             # Router and navigation shell
│   ├── index.css           # Global design system tokens and variables
│   └── main.jsx            # Application entry point
├── index.html              # HTML entry template
├── package.json            # Node.js dependencies & scripts
├── requirements.txt        # Package and prerequisite list
├── vite.config.js          # Vite build & dev server configuration
└── README.md               # Frontend documentation
```

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have Node.js installed:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 2. Installation
Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

### 3. Development Server
Start the local Vite development server:
```bash
npm run dev
```
Open your browser and navigate to: `http://localhost:5173`

---

## ⚙️ Configuration & Environment Variables

By default, the frontend connects to the backend running at `http://localhost:8000`.

To point the frontend to a custom backend URL (e.g., in production), create a `.env` file in the `frontend` root:

```env
VITE_API_URL=http://localhost:8000
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite local development server on port 5173 |
| `npm run build` | Builds optimized production bundle in `dist/` |
| `npm run preview` | Previews production build locally |
| `npm run lint` | Runs ESLint to check for code syntax issues |

---

## 🔗 Backend API Expectations

The frontend interacts with the FastAPI backend using the following REST endpoints:

- `POST /predict/file?top_k=3` - Upload multipart image file
- `POST /predict/url` - Send `{ "url": "...", "top_k": 3 }`
- `POST /predict/base64` - Send `{ "image": "data:image/jpeg;base64,...", "top_k": 3 }`
- `GET /breeds` - Fetch breed metadata list
- `GET /health` - Health check status
