import os
from typing import Dict, Any
from app.models.yolo_model import YOLOv8Model
from app.config.settings import settings

class ModelLoader:
    """Factory class để load các loại model khác nhau"""
    
    _models: Dict[str, Any] = {}
    
    @classmethod
    def get_model(cls, model_name: str = None):
        """Get model instance (singleton pattern)"""
        if model_name is None:
            model_name = settings.default_model
        
        if model_name not in cls._models:
            cls._models[model_name] = cls._load_model(model_name)
        
        return cls._models[model_name]
    
    @classmethod
    def _load_model(cls, model_name: str):
        """Load specific model"""
        model_path = os.path.join(settings.models_path, f"{model_name}.onnx")  # Cập nhật từ model_path thành models_path
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        # Có thể mở rộng để hỗ trợ các loại YOLO khác
        if model_name.startswith("yolov8"):
            return YOLOv8Model(
                model_path=model_path,
                input_size=settings.input_size,
                num_classes=settings.num_classes,
                confidence_threshold=settings.confidence_threshold,
                nms_threshold=settings.nms_threshold
            )
        # elif model_name.startswith("yolov9"):
        #     return YOLOv9Model(...)
        # elif model_name.startswith("yolov10"):
        #     return YOLOv10Model(...)
        else:
            raise ValueError(f"Unsupported model: {model_name}")
    
    @classmethod
    def list_available_models(cls):
        """List all available model files"""
        models = []
        if os.path.exists(settings.models_path):  # Cập nhật từ model_path thành models_path
            for file in os.listdir(settings.models_path):
                if file.endswith('.onnx'):
                    models.append(file[:-5])  # Remove .onnx extension
        return models