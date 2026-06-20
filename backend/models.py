from sqlalchemy import Column, Integer, String, Float

from database import Base

class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)

    object_name = Column(String)
    confidence = Column(Float)

    timestamp = Column(String)