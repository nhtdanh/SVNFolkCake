import cv2
import numpy as np
from PIL import Image
from io import BytesIO
from typing import Union

def load_image_from_bytes(image_bytes: bytes) -> np.ndarray:
    """Load image from bytes"""
    try:
        # Convert bytes to PIL Image
        pil_image = Image.open(BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if pil_image.mode != 'RGB':
            pil_image = pil_image.convert('RGB')
        
        # Convert to OpenCV format (BGR)
        cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        
        return cv_image
    except Exception as e:
        raise Exception(f"Failed to load image: {str(e)}")

def validate_image(image: np.ndarray) -> bool:
    """Validate if image is valid"""
    if image is None:
        return False
    if len(image.shape) != 3:
        return False
    if image.shape[2] != 3:
        return False
    return True