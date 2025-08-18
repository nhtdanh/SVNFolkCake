from abc import ABC, abstractmethod
from typing import List, Dict, Any
import numpy as np

class BaseDetectionModel(ABC):
    """Base class cho tất cả các YOLO models"""
    
    def __init__(self, model_path: str, input_size: int, num_classes: int):
        self.model_path = model_path
        self.input_size = input_size
        self.num_classes = num_classes
        self.model = None
        self.input_name = None
        self.output_names = None
    
    @abstractmethod
    def load_model(self):
        """Load model từ file"""
        pass
    
    @abstractmethod
    def preprocess(self, image: np.ndarray) -> np.ndarray:
        """Tiền xử lý ảnh đầu vào"""
        pass
    
    @abstractmethod
    def predict(self, input_data: np.ndarray) -> np.ndarray:
        """Dự đoán từ model"""
        pass
    
    @abstractmethod
    def postprocess(self, predictions: np.ndarray, original_shape: tuple) -> List[Dict[str, Any]]:
        """Xử lý kết quả dự đoán"""
        pass
    
    def detect(self, image: np.ndarray) -> List[Dict[str, Any]]:
        """Pipeline hoàn chỉnh: preprocess -> predict -> postprocess"""
        original_shape = image.shape[:2]
        
        # Preprocess
        input_data = self.preprocess(image)
        
        # Predict
        predictions = self.predict(input_data)
        
        # Postprocess
        results = self.postprocess(predictions, original_shape)
        
        return results