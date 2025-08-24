import os
from typing import Dict, Any
from app.models.yolo_model import YOLOv8Model
from app.config.settings import settings, ModelConfig

class ModelLoader:
    
    _models: Dict[str, Any] = {}
    _configs: Dict[str, ModelConfig] = {}
    
    @classmethod
    def get_model(cls, model_name: str = None, config_overrides: Dict = None):
        if model_name is None:
            model_name = settings.default_model
        config_key = f"{model_name}_{hash(str(config_overrides)) if config_overrides else 'default'}"
        
        if config_key not in cls._models:
            model_config = settings.get_model_config()
            if config_overrides:
                for key, value in config_overrides.items():
                    if hasattr(model_config, key):
                        setattr(model_config, key, value)
            
            cls._configs[config_key] = model_config
            cls._models[config_key] = cls._load_model(model_name, model_config)
        
        return cls._models[config_key]
    
    @classmethod
    def _load_model(cls, model_name: str, config: ModelConfig):
        model_path = os.path.join(settings.models_path, f"{model_name}.onnx")
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
            
        if model_name.startswith("yolov8"):
            return YOLOv8Model(model_path=model_path, config=config)
        else:
            raise ValueError(f"Unsupported model: {model_name}")
    
    @classmethod
    def update_model_config(cls, model_name: str = None, **kwargs):
        if model_name is None:
            model_name = settings.default_model
            
        keys_to_update = [key for key in cls._models.keys() if key.startswith(model_name)]
        
        for key in keys_to_update:
            if key in cls._models:
                cls._models[key].update_config(**kwargs)
                cls._configs[key].update_threshold(**kwargs)
    
    @classmethod
    def list_available_models(cls):
        models = []
        if os.path.exists(settings.models_path):
            for file in os.listdir(settings.models_path):
                if file.endswith('.onnx'):
                    models.append(file[:-5])
        return models