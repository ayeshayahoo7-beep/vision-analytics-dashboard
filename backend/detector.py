from ultralytics import YOLO
import cv2

# Load YOLO model once
model = YOLO("yolov8n.pt")

# Open webcam once
cap = cv2.VideoCapture(0)

def detect_from_webcam():
    success, frame = cap.read()

    if not success:
        return {
            "class": "none",
            "confidence": 0.0
        }

    results = model(frame)

    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            conf = float(box.conf[0])

            return {
                "class": model.names[cls],
                "confidence": round(conf, 2)
            }

    return {
        "class": "none",
        "confidence": 0.0
    }