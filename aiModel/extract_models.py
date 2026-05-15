import zipfile
from pathlib import Path

ROOT = Path(__file__).parent
GARBAGE_ZIP = ROOT / "models" / "garbage" / "garbage_best.pt.zip"
POTHOLES_ZIP = ROOT / "models" / "potholes" / "potholes_best.pt.zip"
GARBAGE_DIR = ROOT / "models" / "garbage"
POTHOLES_DIR = ROOT / "models" / "potholes"

print("Extracting garbage model...")
with zipfile.ZipFile(GARBAGE_ZIP, 'r') as zip_ref:
    zip_ref.extractall(GARBAGE_DIR)
print("Garbage model extracted!")

print("\nExtracting potholes model...")
with zipfile.ZipFile(POTHOLES_ZIP, 'r') as zip_ref:
    zip_ref.extractall(POTHOLES_DIR)
print("Potholes model extracted!")

print("\nChecking extracted files...")
print("Garbage directory contents:")
for f in GARBAGE_DIR.iterdir():
    print(f"  {f.name}")

print("\nPotholes directory contents:")
for f in POTHOLES_DIR.iterdir():
    print(f"  {f.name}")
