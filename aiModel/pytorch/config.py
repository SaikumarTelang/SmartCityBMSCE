import os
import torch
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"
OUTPUTS_DIR = BASE_DIR / "outputs"
LOGS_DIR = BASE_DIR / "logs"

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 50
LEARNING_RATE = 1e-4
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
NUM_WORKERS = 4

MODEL_TYPE = "custom"  # "custom", "resnet50", "mobilenet_v2", "efficientnet_b0"

EARLY_STOPPING_PATIENCE = 10
REDUCE_LR_PATIENCE = 5
WEIGHT_DECAY = 1e-5
