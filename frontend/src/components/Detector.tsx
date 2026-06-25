import { useEffect, useState } from "react";

type Detection = {
  class: string;
  confidence: number;
};

type DetectionResponse = {
  detections: Detection[];
  people_count: number;
  confidence: number;
};

export default function Detector() {
  const [result, setResult] =
    useState<DetectionResponse>({
      detections: [],
      people_count: 0,
      confidence: 0,
    });

  const [online, setOnline] =
    useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/latest"
        );

        const data = await response.json();

        setResult(data);
        setOnline(true);
      } catch {
        setOnline(false);
      }
    };

    fetchData();

    const interval = setInterval(
      fetchData,
      2000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        background:
          "rgba(255,255,255,0.05)",
        padding: "24px",
        borderRadius: "20px",
        border:
          "1px solid rgba(255,255,255,0.08)",
        color: "white",
      }}
    >
      <h2>🤖 AI Detection Panel</h2>

      <p>
        {online
          ? "🟢 Backend Online"
          : "🔴 Backend Offline"}
      </p>

      <div
        style={{
          background:
            "rgba(34,197,94,0.12)",
          padding: "12px",
          borderRadius: "12px",
          marginBottom: "15px",
        }}
      >
        <strong>
          👥 People Detected:
        </strong>{" "}
        {result.people_count}
      </div>

      <div
        style={{
          background:
            "rgba(59,130,246,0.12)",
          padding: "12px",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      >
        <strong>
          🎯 Highest Confidence:
        </strong>{" "}
        {(result.confidence * 100).toFixed(
          1
        )}
        %
      </div>

      <h3>Detected Objects</h3>

      {result.detections.length === 0 ? (
        <p>No detections yet</p>
      ) : (
        result.detections.map(
          (item, index) => (
            <div
              key={index}
              style={{
                background:
                  "rgba(255,255,255,0.05)",
                padding: "10px",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            >
              <strong>
                {item.class}
              </strong>{" "}
              —{" "}
              {(
                item.confidence * 100
              ).toFixed(1)}
              %
            </div>
          )
        )
      )}
    </div>
  );
}