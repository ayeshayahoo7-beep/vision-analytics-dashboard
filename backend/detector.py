from datetime import datetime

def run_detection():

    return {
        "class": "Laptop",
        "confidence": 0.96,
        "timestamp": datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )
    }