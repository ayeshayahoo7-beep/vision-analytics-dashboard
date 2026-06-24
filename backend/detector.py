from ultralytics import YOLO
import base64
import cv2
import numpy as np

model = YOLO("yolo26n.pt")

def detect_image(base64_image):
    image_bytes = base64.b64decode(base64_image)

    np_array = np.frombuffer(image_bytes, np.uint8)

    image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    results = model(image)

    if len(results) > 0:
        boxes = results[0].boxes

        if len(boxes) > 0:
            box = boxes[0]

            cls_id = int(box.cls[0])
            conf = float(box.conf[0])

            return {
                "class": model.names[cls_id],
                "confidence": conf
            }

    return {
        "class": "No object",
        "confidence": 0.0
    }