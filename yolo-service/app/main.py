import sys
import os
from pathlib import Path

# Thêm thư mục root vào Python path để có thể import app
root_dir = Path(__file__).parent.parent
sys.path.insert(0, str(root_dir))

from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn

from app.services.detection_service import DetectionService
from app.config.settings import settings

# Create FastAPI app
app = FastAPI(
    title="YOLO Detection Service",
    description="YOLO Object Detection API with ONNX models",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Điều chỉnh theo nhu cầu
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize detection service
detection_service = DetectionService()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "YOLO Detection Service is running",
        "version": "1.0.0",
        "available_models": detection_service.get_available_models()
    }

@app.get("/models")
async def get_available_models():
    """Get list of available models"""
    return {
        "models": detection_service.get_available_models(),
        "default_model": settings.default_model
    }

@app.post("/detect")
async def detect_objects(
    file: UploadFile = File(...),
    model: Optional[str] = Query(None, description="Model name to use"),
    confidence: Optional[float] = Query(None, ge=0.1, le=1.0, description="Confidence threshold")
):
    """
    Detect objects in uploaded image
    
    - **file**: Image file (jpg, png, etc.)
    - **model**: Model name (optional, defaults to configured model)
    - **confidence**: Confidence threshold (optional, defaults to configured threshold)
    """
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read image bytes
        image_bytes = await file.read()
        
        # Update confidence if provided
        if confidence:
            # Tạm thời cập nhật threshold (có thể cải thiện bằng cách truyền parameter)
            original_threshold = settings.confidence_threshold
            settings.confidence_threshold = confidence
        
        # Run detection
        result = await detection_service.detect_objects(image_bytes, model)
        
        # Restore original threshold
        if confidence:
            settings.confidence_threshold = original_threshold
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "YOLO Detection API"}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )