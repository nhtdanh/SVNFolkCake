"""
Models package

Contains all YOLO model implementations.
"""

from .base_model import BaseDetectionModel
from .yolo_model import YOLOv8Model

__all__ = [
    'BaseDetectionModel',
    'YOLOv8Model'
]