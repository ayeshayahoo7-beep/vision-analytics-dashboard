import base64
import cv2
import numpy as np
from ultralytics import YOLO

# Load model once at startup
model = YOLO("yolo26n.pt")

def process_results(results):
    detections = []
    people_count = 0
    highest_confidence = 0.0

    for result in results:
        for box in result.boxes:
            # Modern Ultralytics boxes return 0-dimensional tensors or scalars
            # Using .item() or directly converting to int/float prevents index errors
            cls_id = int(box.cls.item() if hasattr(box.cls, 'item') else box.cls[0])
            confidence = float(box.conf.item() if hasattr(box.conf, 'item') else box.conf[0])

            label = model.names[cls_id]

            detections.append(
                {
                    "class": label,
                    "confidence": round(confidence, 3)
                }
            )

            if label.lower() == "person":
                people_count += 1

            highest_confidence = max(
                highest_confidence,
                confidence
            )

    return {
        "class": detections[0]["class"] if detections else "No objects detected",
        "confidence": round(highest_confidence, 3),
        "people_count": people_count,
        "detections": detections
    }

def detect_image(base64_image):
    try:
        if "," in base64_image:
            base64_image = base64_image.split(",")[1]

        image_bytes = base64.b64decode(base64_image)
        np_array = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        
        if image is None:
            raise ValueError("OpenCV failed to decode image from buffer.")

        results = model(image)
        return process_results(results)

    except Exception as e:
        return {
            "class": "Error",
            "confidence": 0.0,
            "people_count": 0,
            "detections": [],
            "error": str(e)
        }

def detect_uploaded_file(file_path):
    try:
        results = model(file_path)
        return process_results(results)

    except Exception as e:
        return {
            "class": "Error",
            "confidence": 0.0,
            "people_count": 0,
            "detections": [],
            "error": str(e)
        }
