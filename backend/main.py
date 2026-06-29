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

from detector import (
    model,
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

            results = model.track(
                frame,
                persist=True,
                verbose=False,
            )

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
        "model": "YOLO26 Nano",
    }


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
            detail=str(e),
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
            detail=str(e),
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

        for frame in stream_video(str(video_file)):
            await websocket.send_json(frame)

        await websocket.send_json({
            "finished": True
        })

        video_file.unlink()

    except Exception as e:
        print("WEBSOCKET ERROR:", e)

        await websocket.send_json({
            "error": str(e)
        })

    finally:
        await websocket.close()


@app.get("/latest")
def latest():
    return latest_result


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "YOLO26 Nano",
    }