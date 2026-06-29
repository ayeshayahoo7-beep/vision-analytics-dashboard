import cv2
import base64
from detector import model


def stream_video(video_path):
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise Exception("Unable to open video.")

    while True:
        success, frame = cap.read()

        if not success:
            break

        # Run YOLO tracking
        results = model.track(
            frame,
            persist=True,
            verbose=False
        )

        annotated = results[0].plot()

        _, buffer = cv2.imencode(".jpg", annotated)

        frame_base64 = base64.b64encode(
            buffer
        ).decode("utf-8")

        detections = {}
        people = 0

        for box in results[0].boxes:

            cls = int(box.cls.item())
            label = model.names[cls]

            detections[label] = (
                detections.get(label, 0) + 1
            )

            if label == "person":
                people += 1

        yield {
            "frame": frame_base64,
            "people": people,
            "detections": detections
        }

    cap.release()