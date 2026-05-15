"""Resolve paths to YOLO checkpoint archives."""
from pathlib import Path

ROOT = Path(__file__).parent / "models"


def ensure_models():
    garbage_zip = ROOT / "garbage" / "garbage_best.pt.zip"
    potholes_zip = ROOT / "potholes" / "potholes_best.pt.zip"

    if not garbage_zip.exists():
        raise FileNotFoundError(f"Missing: {garbage_zip}")
    if not potholes_zip.exists():
        raise FileNotFoundError(f"Missing: {potholes_zip}")

    return {"garbage": garbage_zip, "potholes": potholes_zip}


if __name__ == "__main__":
    paths = ensure_models()
    for name, path in paths.items():
        print(f"{name}: {path}")
