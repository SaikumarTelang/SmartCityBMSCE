import sys
from pathlib import Path

ROOT = Path(__file__).parent

print("Checking model files...")
garbage_pt = ROOT / "models" / "garbage" / "garbage_best.pt"
potholes_pt = ROOT / "models" / "potholes" / "potholes_best.pt"
wire_pt = ROOT / "models" / "pytorch" / "best_model.pth"

print(f"garbage_pt exists: {garbage_pt.exists()} - {garbage_pt}")
print(f"potholes_pt exists: {potholes_pt.exists()} - {potholes_pt}")
print(f"wire_pt exists: {wire_pt.exists()} - {wire_pt}")

print("\nTrying to load YOLO models...")
try:
    from ultralytics import YOLO
    print("YOLO imported successfully")
    
    print(f"\nLoading garbage model from: {garbage_pt}")
    garbage_model = YOLO(str(garbage_pt))
    print("Garbage model loaded!")
    
    print(f"\nLoading potholes model from: {potholes_pt}")
    potholes_model = YOLO(str(potholes_pt))
    print("Potholes model loaded!")
    
    print("\nAll models loaded successfully!")
except Exception as e:
    print(f"\nError: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
