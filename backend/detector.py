from ultralytics import YOLO
import cv2

# Load YOLO model once
model = YOLO("yolov8n.pt")


def detect_image(image):
    results = model(image)

    detections = {}
    people_count = 0
    top_class = "none"
    top_conf = 0.0

    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            conf = float(box.conf[0])

            label = model.names[cls]

            detections[label] = detections.get(label, 0) + 1

            if label == "person":
                people_count += 1

            if conf > top_conf:
                top_conf = conf
                top_class = label

    return {
        "class": top_class,
        "confidence": round(top_conf, 2),
        "people_count": people_count,
        "detections": detections,
    }


def detect_uploaded_file(image_path):
    image = cv2.imread(image_path)

    if image is None:
        raise Exception("Unable to read uploaded image.")

    return detect_image(image)


def detect_video_file(video_path):
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise Exception("Unable to open uploaded video.")

    detections = {}
    people_count = 0

    while True:
        success, frame = cap.read()

        if not success:
            break

        results = model(frame)

        for r in results:
            for box in r.boxes:
                cls = int(box.cls[0])
                label = model.names[cls]

                detections[label] = (
                    detections.get(label, 0) + 1
                )

                if label == "person":
                    people_count += 1

    cap.release()

    return {
        "people_count": people_count,
        "detections": detections,
    }