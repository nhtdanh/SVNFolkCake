from typing import List, Dict, Any, Optional
import numpy as np
from app.utils.model_loader import ModelLoader
from app.utils.image_processing import load_image_from_bytes, validate_image
from app.config.settings import settings

class DetectionService:
    def __init__(self):
        self.default_model = ModelLoader.get_model()
    
    async def detect_objects(
        self, 
        image_bytes: bytes, 
        model_name: str = None, 
        config_overrides: Dict = None
    ) -> Dict[str, Any]:
        try:
            image = load_image_from_bytes(image_bytes)
            if not validate_image(image):
                raise ValueError("Invalid image format")
            model = ModelLoader.get_model(model_name, config_overrides)
            
            detections = model.detect(image)
            
            results = []
            for detection in detections:
                class_id = detection["class_id"]
                class_name = (model.config.class_names[class_id] 
                            if class_id < len(model.config.class_names) 
                            else f"class_{class_id}")
                
                detection["class_name"] = class_name
                results.append(detection)
            
            return {
                "success": True,
                "model_used": model_name or settings.default_model,
                "config_used": {
                    "confidence_threshold": model.config.confidence_threshold,
                    "nms_threshold": model.config.nms_threshold,
                    "input_size": model.config.input_size
                },
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
        return ModelLoader.list_available_models()