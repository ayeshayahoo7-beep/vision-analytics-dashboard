from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


import os
import tempfile

from detector import (
    detect_image,
    detect_uploaded_file,
    detect_video_file,
)
app = FastAPI()

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
    "detections": []
}

@app.get("/")
def home():
    return {
        "status": "online",
        "model": "YOLO26 Nano"
    }

@app.post("/detect")
def detect(req: DetectionRequest):
    global latest_result
    
    latest_result = detect_image(req.image)
    return latest_result

@app.post("/detect-image")
async def detect_uploaded_image(file: UploadFile = File(...)):
    global latest_result
    temp_path = None

    try:
        suffix = os.path.splitext(file.filename)[1] if file.filename else ".jpg"

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp_file:
            contents = await file.read()
            temp_file.write(contents)
            temp_path = temp_file.name

        result = detect_uploaded_file(temp_path)
        latest_result = result
        return result

    except Exception as e:
        # Changed to raise HTTPException for correct HTTP error status codes (500)
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/detect-video")
async def detect_video(
    file: UploadFile = File(...)
):
    temp_path = None

    try:
        suffix = os.path.splitext(
            file.filename
        )[1]

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp_file:

            temp_file.write(
                await file.read()
            )

            temp_path = temp_file.name

        return detect_video_file(
            temp_path
        )

    except Exception as e:
        return {
            "error": str(e)
        }

    finally:
        if (
            temp_path
            and os.path.exists(temp_path)
        ):
            os.remove(temp_path)
@app.get("/latest")
def latest():
    return latest_result

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "YOLO26 Nano"
    }
