import os
import cv2
import numpy as np
from pathlib import Path
from typing import Tuple, List, Optional
import torch
from torch.utils.data import Dataset
import albumentations as A
from albumentations.pytorch import ToTensorV2
try:
    from .config import IMG_SIZE
except ImportError:
    from config import IMG_SIZE


class ImageClassificationDataset(Dataset):
    def __init__(
        self,
        root_dir: str,
        transform: Optional[A.Compose] = None,
        is_train: bool = True
    ):
        self.root_dir = Path(root_dir)
        self.transform = transform
        self.is_train = is_train
        
        self.classes = sorted([
            d.name for d in self.root_dir.iterdir() 
            if d.is_dir()
        ])
        self.class_to_idx = {cls: idx for idx, cls in enumerate(self.classes)}
        self.idx_to_class = {idx: cls for cls, idx in self.class_to_idx.items()}
        
        self.image_paths, self.labels = self._load_dataset()

    def _load_dataset(self) -> Tuple[List[str], List[int]]:
        image_paths = []
        labels = []
        
        for cls in self.classes:
            cls_dir = self.root_dir / cls
            if cls_dir.is_dir():
                for img_path in cls_dir.glob("*.*"):
                    if img_path.suffix.lower() in [".jpg", ".jpeg", ".png", ".bmp"]:
                        image_paths.append(str(img_path))
                        labels.append(self.class_to_idx[cls])
        
        return image_paths, labels

    def __len__(self) -> int:
        return len(self.image_paths)

    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, int]:
        img_path = self.image_paths[idx]
        label = self.labels[idx]
        
        img = cv2.imread(img_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        if self.transform:
            transformed = self.transform(image=img)
            img = transformed["image"]
        else:
            img = cv2.resize(img, IMG_SIZE)
            img = img.astype(np.float32) / 255.0
            img = ToTensorV2()(image=img)["image"]
        
        return img, label


def get_train_transforms(img_size: Tuple[int, int] = IMG_SIZE) -> A.Compose:
    return A.Compose([
        A.Resize(height=img_size[0], width=img_size[1]),
        A.RandomRotate90(),
        A.HorizontalFlip(p=0.5),
        A.RandomBrightnessContrast(p=0.2),
        A.GaussNoise(p=0.1),
        A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ToTensorV2(),
    ])


def get_val_test_transforms(img_size: Tuple[int, int] = IMG_SIZE) -> A.Compose:
    return A.Compose([
        A.Resize(height=img_size[0], width=img_size[1]),
        A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ToTensorV2(),
    ])
