"""Run garbage, pothole, and broken-wire detection on one image."""
import json
from pathlib import Path

import torch
from PIL import Image
from torchvision import transforms

ROOT = Path(__file__).parent
MODELS = {}

CLASS_LABELS = {
    "garbage": "Garbage",
    "potholes": "Pothole",
    "wire": "Broken Wire",
}

WIRE_TRANSFORM = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ]
)

_orig_torch_load = torch.load


def _torch_load_compat(*args, **kwargs):
    kwargs.setdefault("weights_only", False)
    return _orig_torch_load(*args, **kwargs)


torch.load = _torch_load_compat


def get_model_paths():
    return {
        "garbage": ROOT / "models" / "garbage" / "garbage_best.pt.zip",
        "potholes": ROOT / "models" / "potholes" / "potholes_best.pt.zip",
        "wire": ROOT / "models" / "pytorch" / "best_model.pth",
    }


def load_models():
    if MODELS:
        return MODELS

    from ultralytics import YOLO

    from wire_model import load_wire_model

    paths = get_model_paths()
    for key, path in paths.items():
        if not path.exists():
            raise FileNotFoundError(f"Missing model: {path}")

    MODELS["garbage"] = YOLO(str(paths["garbage"]))
    MODELS["potholes"] = YOLO(str(paths["potholes"]))
    MODELS["wire"] = load_wire_model(paths["wire"])
    return MODELS


def detect_wire(model, image: Image.Image):
    tensor = WIRE_TRANSFORM(image).unsqueeze(0)
    with torch.no_grad():
        logits = model(tensor)
        probs = torch.softmax(logits, dim=1)[0]
    conf, idx = torch.max(probs, dim=0)
    # index 1 = broken wire (typical binary setup)
    is_broken = int(idx.item()) == 1
    confidence = float(conf.item())
    if not is_broken:
        confidence = 1.0 - confidence
    return confidence if is_broken else 0.0


def detect_yolo(model, image: Image.Image, label: str):
    results = model.predict(image, verbose=False)
    if not results or results[0].boxes is None or len(results[0].boxes) == 0:
        return 0.0
    return float(max(results[0].boxes.conf.tolist()))


def run_detection(image_path: str):
    load_models()
    image = Image.open(image_path).convert("RGB")

    detections = []

    garbage_conf = detect_yolo(MODELS["garbage"], image, CLASS_LABELS["garbage"])
    detections.append(
        {"type": CLASS_LABELS["garbage"], "confidence": round(garbage_conf, 4)}
    )

    pothole_conf = detect_yolo(MODELS["potholes"], image, CLASS_LABELS["potholes"])
    detections.append(
        {"type": CLASS_LABELS["potholes"], "confidence": round(pothole_conf, 4)}
    )

    wire_conf = detect_wire(MODELS["wire"], image)
    detections.append(
        {"type": CLASS_LABELS["wire"], "confidence": round(wire_conf, 4)}
    )

    best = max(detections, key=lambda d: d["confidence"])
    threshold = 0.25

    if best["confidence"] < threshold:
        category = "Unknown"
        severity = "Low"
    else:
        category = best["type"]
        severity = (
            "High"
            if best["confidence"] >= 0.7
            else "Medium"
            if best["confidence"] >= 0.4
            else "Low"
        )

    return {
        "category": category,
        "confidence": best["confidence"],
        "severity": severity,
        "detections": detections,
    }


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: py inference.py <image_path>"}))
        sys.exit(1)

    try:
        print(json.dumps(run_detection(sys.argv[1])))
    except Exception as exc:
        print(json.dumps({"error": str(exc)}))
        sys.exit(1)
