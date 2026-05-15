import sys
from pathlib import Path

ROOT = Path(__file__).parent

print("Checking model files...")
garbage_zip = ROOT / "models" / "garbage" / "garbage_best.pt.zip"
potholes_zip = ROOT / "models" / "potholes" / "potholes_best.pt.zip"
wire_pt = ROOT / "models" / "pytorch" / "best_model.pth"

print(f"garbage_zip exists: {garbage_zip.exists()} - {garbage_zip}")
print(f"potholes_zip exists: {potholes_zip.exists()} - {potholes_zip}")
print(f"wire_pt exists: {wire_pt.exists()} - {wire_pt}")

print("\nTrying to load YOLO models...")
try:
    from ultralytics import YOLO
    print("YOLO imported successfully")
    
    print(f"\nLoading garbage model from: {garbage_zip}")
    garbage_model = YOLO(str(garbage_zip))
    print("Garbage model loaded!")
    
    print(f"\nLoading potholes model from: {potholes_zip}")
    potholes_model = YOLO(str(potholes_zip))
    print("Potholes model loaded!")
    
    print("\nAll models loaded successfully!")
except Exception as e:
    print(f"\nError: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
