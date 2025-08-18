from typing import List, Dict, Any
import numpy as np
from app.utils.model_loader import ModelLoader
from app.utils.image_processing import load_image_from_bytes, validate_image
from app.config.settings import settings

class DetectionService:
    """Service xử lý detection"""
    
    def __init__(self):
        self.model = ModelLoader.get_model()
    
    async def detect_objects(self, image_bytes: bytes, model_name: str = None) -> Dict[str, Any]:
        """Detect objects in image"""
        try:
            # Load image
            image = load_image_from_bytes(image_bytes)
            
            # Validate image
            if not validate_image(image):
                raise ValueError("Invalid image format")
            
            # Get model (allow switching models)
            if model_name and model_name != settings.default_model:
                model = ModelLoader.get_model(model_name)
            else:
                model = self.model
            
            # Run detection
            detections = model.detect(image)
            
            # Add class names to results
            results = []
            for detection in detections:
                class_id = detection["class_id"]
                class_name = (settings.class_names_list[class_id] 
                            if class_id < len(settings.class_names_list) 
                            else f"class_{class_id}")
                
                detection["class_name"] = class_name
                results.append(detection)
            
            return {
                "success": True,
                "model_used": model_name or settings.default_model,
                "image_shape": {
                    "height": image.shape[0],
                    "width": image.shape[1],
                    "channels": image.shape[2]
                },
                "detections": results,
                "total_detections": len(results)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "detections": [],
                "total_detections": 0
            }
    
    def get_available_models(self) -> List[str]:
        """Get list of available models"""
        return ModelLoader.list_available_models()