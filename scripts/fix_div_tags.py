from pathlib import Path

root = Path(__file__).resolve().parents[1]
for path in root.rglob("*.jsx"):
    text = path.read_text(encoding="utf-8")
    fixed = (
        text.replace("<motion ", "<div ")
        .replace("<motion>", "<div>")
        .replace("</motion>", "</div>")
    )
    if fixed != text:
        path.write_text(fixed, encoding="utf-8")
        print("fixed", path)
