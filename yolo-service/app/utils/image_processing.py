import cv2
import numpy as np
from PIL import Image
from io import BytesIO
# from typing import Union

def load_image_from_bytes(image_bytes: bytes) -> np.ndarray:
    try:
        pil_image = Image.open(BytesIO(image_bytes))
        if pil_image.mode != 'RGB':
            pil_image = pil_image.convert('RGB')
        cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        return cv_image
    except Exception as e:
        raise Exception(f"Failed to load image: {str(e)}")

def validate_image(image: np.ndarray) -> bool:
    if image is None:
        return False
    if len(image.shape) != 3:
        return False
    if image.shape[2] != 3:
        return False
    return True