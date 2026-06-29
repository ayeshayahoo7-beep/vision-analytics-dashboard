import os
import uuid
import tempfile
from pathlib import Path

import cv2
from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException,
    WebSocket,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

import detector
from detector import (
    detect_image,
    detect_uploaded_file,
    detect_video_file,
)

from video_stream import stream_video


app = FastAPI()

UPLOAD_FOLDER = Path("uploads/videos")
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DetectionRequest(BaseModel):
    image: str


active_model_name = "yolo26n"

latest_result = {
    "class": "Waiting...",
    "confidence": 0.0,
    "people_count": 0,
    "detections": [],
}

def generate_frames():
    cap = cv2.VideoCapture(0)

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    try:
        while True:
            success, frame = cap.read()

            if not success:
                break

            results = detector.model.track(
                frame,
                persist=True,
                verbose=False,
            )

            # Update latest_result with actual tracking telemetry
            detections = []
            people_count = 0
            highest_confidence = 0.0

            if len(results) > 0 and results[0].boxes is not None:
                for box in results[0].boxes:
                    cls_id = int(box.cls.item())
                    confidence = float(box.conf.item())
                    label = detector.model.names[cls_id]
                    x1, y1, x2, y2 = box.xyxy[0].tolist()

                    detections.append({
                        "class": label,
                        "confidence": round(confidence, 3),
                        "box": [int(x1), int(y1), int(x2), int(y2)]
                    })

                    if label == "person":
                        people_count += 1

                    highest_confidence = max(highest_confidence, confidence)

            global latest_result
            latest_result = {
                "class": detections[0]["class"] if detections else "None",
                "confidence": round(highest_confidence, 3),
                "people_count": people_count,
                "detections": detections,
            }

            annotated = results[0].plot()

            _, buffer = cv2.imencode(".jpg", annotated)

            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n"
                + buffer.tobytes()
                + b"\r\n"
            )

    finally:
        cap.release()


@app.get("/video-feed")
def video_feed():
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )

@app.get("/")
def home():
    return {
        "status": "online",
        "model": "YOLO26 Nano" if active_model_name == "yolo26n" else "YOLOv8 Nano"
    }


@app.post("/set-model")
def set_model(model_name: str):
    global active_model_name
    if model_name not in ["yolo26n", "yolov8n"]:
        raise HTTPException(status_code=400, detail="Invalid model name. Choose yolo26n or yolov8n.")
    
    from ultralytics import YOLO
    try:
        new_model = YOLO(f"{model_name}.pt")
        detector.model = new_model
        active_model_name = model_name
        return {"status": "success", "model": model_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/detect")
def detect(req: DetectionRequest):
    global latest_result

    latest_result = detect_image(req.image)

    return latest_result


@app.post("/detect-image")
async def detect_uploaded_image(
    file: UploadFile = File(...)
):
    global latest_result

    temp_path = None

    try:
        suffix = (
            Path(file.filename).suffix
            if file.filename
            else ".jpg"
        )

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp_file:

            temp_file.write(await file.read())

            temp_path = temp_file.name

        result = detect_uploaded_file(
            temp_path
        )

        latest_result = result

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)


@app.post("/upload-video")
async def upload_video(
    file: UploadFile = File(...)
):
    try:

        extension = Path(file.filename).suffix

        video_id = str(uuid.uuid4())

        save_path = (
            UPLOAD_FOLDER /
            f"{video_id}{extension}"
        )

        with open(save_path, "wb") as buffer:
            buffer.write(await file.read())

        return {
            "video_id": video_id
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@app.websocket("/ws/video/{video_id}")
async def websocket_video(
    websocket: WebSocket,
    video_id: str,
):
    await websocket.accept()

    try:

        video_file = None

        for file in UPLOAD_FOLDER.iterdir():
            if file.stem == video_id:
                video_file = file
                break

        if video_file is None:
            await websocket.send_json({
                "error": "Video not found"
            })
            return

        for frame in stream_video(
            str(video_file)
        ):
            await websocket.send_json(frame)

        await websocket.send_json({
            "finished": True
        })

        video_file.unlink()

    except Exception as e:

        await websocket.send_json({
            "error": str(e)
        })

    finally:
        await websocket.close()


@app.get("/latest")
def latest():
    res = latest_result.copy()
    res["active_model"] = "YOLO26 Nano" if active_model_name == "yolo26n" else "YOLOv8 Nano"
    return res


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "YOLO26 Nano" if active_model_name == "yolo26n" else "YOLOv8 Nano"
    }