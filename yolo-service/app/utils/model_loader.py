import os
from typing import Dict, Any
from app.models.yolo_model import YOLOv8Model
from app.config.settings import settings

class ModelLoader:
    
    _models: Dict[str, Any] = {}
    
    @classmethod
    def get_model(cls, model_name: str = None):
        if model_name is None:
            model_name = settings.default_model
        if model_name not in cls._models:
            cls._models[model_name] = cls._load_model(model_name)
        
        return cls._models[model_name]
    
    @classmethod
    def _load_model(cls, model_name: str):
        model_path = os.path.join(settings.models_path, f"{model_name}.onnx") 
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        if model_name.startswith("yolov8"):
            return YOLOv8Model(
                model_path=model_path,
                input_size=settings.input_size,
                num_classes=settings.num_classes,
                confidence_threshold=settings.confidence_threshold,
                nms_threshold=settings.nms_threshold
            )
        # elif model_name.startswith("yolovX"):
        #     return YOLOvXModel(...)
        else:
            raise ValueError(f"Unsupported model: {model_name}")
    
    @classmethod
    def list_available_models(cls):
        models = []
        if os.path.exists(settings.models_path):  
            for file in os.listdir(settings.models_path):
                if file.endswith('.onnx'):
                    models.append(file[:-5])  # remove .onnx 
        return models