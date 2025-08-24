import os
from typing import List, Dict, Any
from pydantic import ConfigDict, Field
from pydantic_settings import BaseSettings

class ModelConfig:
    def __init__(
        self,
        input_size: int = 416,
        num_classes: int = 16,
        confidence_threshold: float = 0.5,
        nms_threshold: float = 0.4,
        class_names: List[str] = None
    ):
        self.input_size = input_size
        self.num_classes = num_classes
        self.confidence_threshold = confidence_threshold
        self.nms_threshold = nms_threshold
        self.class_names = class_names or []
    
    def update_threshold(self, confidence: float = None, nms: float = None):
        if confidence is not None:
            self.confidence_threshold = confidence
        if nms is not None:
            self.nms_threshold = nms
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'input_size': self.input_size,
            'num_classes': self.num_classes,
            'confidence_threshold': self.confidence_threshold,
            'nms_threshold': self.nms_threshold,
            'class_names': self.class_names
        }

class Settings(BaseSettings):
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    
    default_model: str = "yolov8"
    models_path: str = "./models/"
    
    # create ModelConfig
    input_size: int = 416
    num_classes: int = 20
    confidence_threshold: float = 0.5
    nms_threshold: float = 0.4
    class_names: str = "Bánh Bò,Bánh Cam,Bánh Chuối Hấp,Bánh Cống,Bánh Còng,Bánh Cuốn Ngọt,Bánh Da Lợn,Bánh Đúc Mặn,Bánh Ít Trần,Bánh Khoai Mì Nướng,Bánh Khọt,Bánh Lá Mơ,Bánh Lọt,Bánh Phục Linh,Bánh Pía,Bánh Tai Yến,Bánh Tằm Bì,Bánh Tằm Khoai Mì,Bánh Tét,Bánh Xèo"
    
    @property
    def class_names_list(self) -> List[str]:
        return [name.strip() for name in self.class_names.split(",") if name.strip()]
    
    def get_model_config(self) -> ModelConfig:
        """Create ModelConfig instance from settings"""
        return ModelConfig(
            input_size=self.input_size,
            num_classes=self.num_classes,
            confidence_threshold=self.confidence_threshold,
            nms_threshold=self.nms_threshold,
            class_names=self.class_names_list
        )
    
    # Pydantic configuration
    model_config = ConfigDict(
        env_file=".env",
        protected_namespaces=()
    )

settings = Settings()