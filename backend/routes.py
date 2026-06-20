from fastapi import APIRouter
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Detection
from detector import run_detection

router = APIRouter()


@router.post("/detect")
def detect():

    result = run_detection()

    db: Session = SessionLocal()

    detection = Detection(
        object_name=result["class"],
        confidence=result["confidence"],
        timestamp=result["timestamp"]
    )

    db.add(detection)
    db.commit()

    db.close()

    return result


@router.get("/logs")
def logs():

    db: Session = SessionLocal()

    data = db.query(Detection).all()

    db.close()

    return data


@router.get("/stats")
def stats():

    db: Session = SessionLocal()

    detections = db.query(Detection).all()

    total = len(detections)

    avg_confidence = (
        sum(d.confidence for d in detections) / total
        if total
        else 0
    )

    db.close()

    return {
        "totalDetections": total,
        "averageConfidence": round(
            avg_confidence * 100,
            2
        )
    }
@router.get("/latest")
def latest():

    db: Session = SessionLocal()

    latest_detection = (
        db.query(Detection)
        .order_by(Detection.id.desc())
        .first()
    )

    db.close()

    if not latest_detection:
        return {}

    return {
        "class": latest_detection.object_name,
        "confidence": latest_detection.confidence,
        "timestamp": latest_detection.timestamp
    }
