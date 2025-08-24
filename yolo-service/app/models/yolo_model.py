import cv2
import numpy as np
import onnxruntime as ort
from typing import List, Dict, Any
from .base_model import BaseDetectionModel
from app.config.settings import ModelConfig

class YOLOv8Model(BaseDetectionModel):
    
    def __init__(self, model_path: str, config: ModelConfig):
        super().__init__(model_path, config.input_size, config.num_classes)
        self.config = config
        self.load_model()
    
    def update_config(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self.config, key):
                setattr(self.config, key, value)
    
    def load_model(self):
        try:
            self.model = ort.InferenceSession(self.model_path)
            self.input_name = self.model.get_inputs()[0].name
            self.output_names = [output.name for output in self.model.get_outputs()]
            print(f"Model loaded successfully: {self.model_path}")
        except Exception as e:
            raise Exception(f"Failed to load model: {str(e)}")
    
    def preprocess(self, image: np.ndarray) -> np.ndarray:
        resized = cv2.resize(image, (self.config.input_size, self.config.input_size))
        rgb_image = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
        normalized = rgb_image.astype(np.float32) / 255.0
        transposed = np.transpose(normalized, (2, 0, 1))
        batch_input = np.expand_dims(transposed, axis=0)
        return batch_input
    
    def predict(self, input_data: np.ndarray) -> np.ndarray:
        try:
            outputs = self.model.run(self.output_names, {self.input_name: input_data})
            return outputs[0]
        except Exception as e:
            raise Exception(f"Prediction failed: {str(e)}")
    
    def postprocess(self, predictions: np.ndarray, original_shape: tuple) -> List[Dict[str, Any]]:
        results = []
        orig_height, orig_width = original_shape
        
        scale_x = orig_width / self.config.input_size
        scale_y = orig_height / self.config.input_size
        
        if len(predictions.shape) == 3:
            predictions = predictions[0]
        
        if predictions.shape[0] < predictions.shape[1]:
            predictions = predictions.T
        
        boxes = []
        scores = []
        class_ids = []
        
        for detection in predictions:
            x_center, y_center, width, height = detection[:4]
            class_scores = detection[4:4+self.config.num_classes]
            
            class_id = np.argmax(class_scores)
            confidence = class_scores[class_id]

            if confidence >= self.config.confidence_threshold:
                x1 = x_center - width / 2
                y1 = y_center - height / 2
                x2 = x_center + width / 2
                y2 = y_center + height / 2
                
                # Scale to original size
                x1 = int(x1 * scale_x)
                y1 = int(y1 * scale_y)
                x2 = int(x2 * scale_x)
                y2 = int(y2 * scale_y)
                
                boxes.append([x1, y1, x2, y2])
                scores.append(float(confidence))
                class_ids.append(int(class_id))
        
        # Apply NMS
        if len(boxes) > 0:
            boxes = np.array(boxes)
            scores = np.array(scores)
            class_ids = np.array(class_ids)
            
            indices = cv2.dnn.NMSBoxes(
                boxes.tolist(),
                scores.tolist(),
                self.config.confidence_threshold,
                self.config.nms_threshold
            )
            
            if len(indices) > 0:
                indices = indices.flatten()
                for i in indices:
                    x1, y1, x2, y2 = boxes[i]
                    results.append({
                        "class_id": int(class_ids[i]),
                        "confidence": float(scores[i]),
                        "bbox": {
                            "x1": int(x1),
                            "y1": int(y1),
                            "x2": int(x2),
                            "y2": int(y2),
                            "width": int(x2 - x1),
                            "height": int(y2 - y1)
                        }
                    })
        
        return results