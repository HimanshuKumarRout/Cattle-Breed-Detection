"""
Cattle Breed Classifier - FastAPI Backend Starter
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Cattle Breed Classifier API",
    description="Backend service for Cattle Breed classification and model inference.",
    version="0.1.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Cattle Breed Classifier API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "cattle-breed-classifier-backend"}
