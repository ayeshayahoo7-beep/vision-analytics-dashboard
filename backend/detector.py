import base64
import cv2
import numpy as np
from ultralytics import YOLO

# -------------------------------------------------------
# Load YOLO once
# -------------------------------------------------------

model = YOLO("yolo26n.pt")


# -------------------------------------------------------
# Process image results
# -------------------------------------------------------

def process_results(results):
    detections = []
    people_count = 0
    highest_confidence = 0.0

    for result in results:

        if result.boxes is None:
            continue

        for box in result.boxes:

            cls_id = int(box.cls.item())
            confidence = float(box.conf.item())

            label = model.names[cls_id]

            x1, y1, x2, y2 = box.xyxy[0].tolist()

            detections.append({
                "class": label,
                "confidence": round(confidence, 3),
                "box": [
                    int(x1),
                    int(y1),
                    int(x2),
                    int(y2)
                ]
            })

            if label == "person":
                people_count += 1

            highest_confidence = max(
                highest_confidence,
                confidence
            )

    return {
        "class": detections[0]["class"] if detections else "None",
        "confidence": round(highest_confidence, 3),
        "people_count": people_count,
        "detections": detections
    }


# -------------------------------------------------------
# Detect Base64 image
# -------------------------------------------------------

def detect_image(base64_image):

    try:

        if "," in base64_image:
            base64_image = base64_image.split(",")[1]

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

        return process_results(results)

    except Exception as e:

        return {
            "class": "Error",
            "confidence": 0,
            "people_count": 0,
            "detections": [],
            "error": str(e)
        }


# -------------------------------------------------------
# Detect uploaded image
# -------------------------------------------------------

def detect_uploaded_file(file_path):

    try:

        image = cv2.imread(file_path)

        results = model(image)

        annotated = results[0].plot()

        cv2.imwrite(file_path, annotated)

        result = process_results(results)

        result["image_path"] = file_path

        return result

    except Exception as e:

        return {
            "class": "Error",
            "confidence": 0,
            "people_count": 0,
            "detections": [],
            "error": str(e)
        }


# -------------------------------------------------------
# Detect uploaded video
# -------------------------------------------------------

def detect_video_file(video_path):

    cap = cv2.VideoCapture(video_path)

    tracked = {}

    while True:

        success, frame = cap.read()

        if not success:
            break

        results = model.track(
            frame,
            persist=True,
            verbose=False
        )

        if len(results) == 0:
            continue

        boxes = results[0].boxes

        if boxes is None:
            continue

        for box in boxes:

            if box.id is None:
                continue

            cls = int(box.cls.item())
            label = model.names[cls]

            track_id = int(box.id.item())

            if label not in tracked:
                tracked[label] = set()

            tracked[label].add(track_id)

    cap.release()

    counts = {}

    for label in tracked:
        counts[label] = len(tracked[label])

    return {

        "people_count": len(
            tracked.get("person", set())
        ),

        "detections": counts

    }