from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from detector import detect_image

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
    "confidence": 0.0
}

@app.post("/detect")
def detect(req: DetectionRequest):
    global latest_result

    latest_result = detect_image(req.image)

    return latest_result


@app.get("/latest")
def latest():
    return latest_result