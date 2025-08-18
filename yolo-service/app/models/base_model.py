from abc import ABC, abstractmethod
from typing import List, Dict, Any
import numpy as np

class BaseDetectionModel(ABC):
    
    def __init__(self, model_path: str, input_size: int, num_classes: int):
        self.model_path = model_path
        self.input_size = input_size
        self.num_classes = num_classes
        self.model = None
        self.input_name = None
        self.output_names = None
    
    @abstractmethod
    def load_model(self):
        pass
    
    @abstractmethod
    def preprocess(self, image: np.ndarray) -> np.ndarray:
        pass
    
    @abstractmethod
    def predict(self, input_data: np.ndarray) -> np.ndarray:
        pass
    
    @abstractmethod
    def postprocess(self, predictions: np.ndarray, original_shape: tuple) -> List[Dict[str, Any]]:
        pass
    
    def detect(self, image: np.ndarray) -> List[Dict[str, Any]]:
        original_shape = image.shape[:2]
        input_data = self.preprocess(image)
        predictions = self.predict(input_data)
        results = self.postprocess(predictions, original_shape)
        return results