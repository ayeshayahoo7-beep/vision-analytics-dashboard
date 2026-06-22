import { useEffect, useState } from "react";

type DetectionResult = {
  class: string;
  confidence: number;
  timestamp?: string;
};

export default function Detector() {
  const [data, setData] = useState<DetectionResult>({
    class: "Waiting for detections...",
    confidence: 0,
  });

  const [online, setOnline] = useState(false);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/latest"
        );

        const result = await response.json();

        setData(result);
        setOnline(true);
      } catch (error) {
        console.error("Backend offline:", error);
        setOnline(false);
      }
    };

    fetchLatest();

    const interval = setInterval(fetchLatest, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        padding: "15px",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <h3 style={{ marginTop: 0 }}>
        AI Detection Status
      </h3>

      <p>
        {online ? "🟢 Model Online" : "🔴 Backend Offline"}
      </p>

      <p>
        <strong>Latest Detection:</strong>{" "}
        {data.class}
      </p>

      <p>
        <strong>Confidence:</strong>{" "}
        {(data.confidence * 100).toFixed(1)}%
      </p>

      {data.timestamp && (
        <p>
          <strong>Last Updated:</strong>{" "}
          {data.timestamp}
        </p>
      )}
    </div>
  );
}