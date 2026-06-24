from ultralytics import YOLO
import base64
import cv2
import numpy as np

# Load YOLO26 Nano
model = YOLO("yolo26n.pt")


def detect_image(base64_image):
    try:
        image_bytes = base64.b64decode(base64_image)

        np_array = np.frombuffer(
            image_bytes,
            np.uint8
        )

        image = cv2.imdecode(
            np_array,
            cv2.IMREAD_COLOR
        )

        results = model(image)

        detections = []
        people_count = 0

        latest_detection = "No object"
        latest_confidence = 0.0

        for result in results:

            for box in result.boxes:

                cls_id = int(box.cls[0])

                label = model.names[cls_id]

                confidence = float(box.conf[0])

                detections.append(
                    {
                        "class": label,
                        "confidence": round(
                            confidence,
                            2
                        ),
                    }
                )

                if label == "person":
                    people_count += 1

                if confidence > latest_confidence:
                    latest_detection = label
                    latest_confidence = confidence

        return {
            "latest_detection": latest_detection,
            "confidence": round(
                latest_confidence,
                2
            ),
            "people_count": people_count,
            "detections": detections,
        }

    except Exception as e:

        print(
            "Detection Error:",
            e
        )

        return {
            "latest_detection": "Error",
            "confidence": 0.0,
            "people_count": 0,
            "detections": [],
        }