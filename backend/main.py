from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from detector import detect_from_webcam

app = FastAPI()

# allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Request(BaseModel):
    image: str

@app.post("/detect")
def detect(req: Request):

    return detect_from_webcam()
@app.get("/latest")
def get_latest():
    return {
        "class": "person",
        "confidence": 0.95,
        "timestamp": "12:34 PM"
    }