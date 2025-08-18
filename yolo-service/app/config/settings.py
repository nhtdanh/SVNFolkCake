import os
from typing import List
from pydantic import ConfigDict
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Server settings
    host: str = "0.0.0.0"
    port: int = 8001
    debug: bool = True
    
    # Model settings
    default_model: str = "yolov8s"
    models_path: str = "./models/"  # Đổi từ model_path thành models_path
    input_size: int = 416
    num_classes: int = 16
    confidence_threshold: float = 0.5
    nms_threshold: float = 0.4
    
    # Class names
    class_names: str = "Bánh Bò,Bánh Chuối Hấp,Bánh Cống,Bánh Da Lợn,Bánh Đúc Mặn,Bánh Ít Trần,Bánh Khoai Mì Nướng,Bánh Lá Mơ,Bánh Lọt,Bánh Phục Linh,Bánh Pía,Bánh Tai Yến,Bánh Tằm Bì,Bánh Tét,Bánh Ướt Ngọt,Bánh Xèo"
    
    @property
    def class_names_list(self) -> List[str]:
        return self.class_names.split(",")
    
    # Cấu hình Pydantic v2
    model_config = ConfigDict(
        env_file=".env",
        protected_namespaces=()  # Tắt protected namespaces
    )

settings = Settings()