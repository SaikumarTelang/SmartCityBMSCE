"""Long-running worker: reads JSON lines from stdin, writes results to stdout."""
import json
import sys

from inference import load_models, run_detection

if __name__ == "__main__":
    print("Loading AI models...", file=sys.stderr, flush=True)
    load_models()
    print(json.dumps({"status": "ready"}), flush=True)

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        req = None
        try:
            req = json.loads(line)
            image_path = req.get("imagePath")
            if not image_path:
                raise ValueError("imagePath is required")
            result = run_detection(image_path)
            result["requestId"] = req.get("requestId")
            print(json.dumps(result), flush=True)
        except Exception as exc:
            print(
                json.dumps(
                    {
                        "error": str(exc),
                        "requestId": req.get("requestId") if req else None,
                    }
                ),
                flush=True,
            )
