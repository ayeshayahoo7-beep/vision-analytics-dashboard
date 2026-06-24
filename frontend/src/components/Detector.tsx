import { useEffect, useState } from "react";

type Detection = {
  class: string;
  confidence: number;
};

type DetectionResponse = {
  latest_detection: string;
  confidence: number;
  people_count: number;
  detections: Detection[];
};

export default function Detector() {
  const [online, setOnline] = useState(false);

  const [data, setData] =
    useState<DetectionResponse>({
      latest_detection: "Waiting...",
      confidence: 0,
      people_count: 0,
      detections: [],
    });

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
        console.error(
          "Backend offline:",
          error
        );

        setOnline(false);
      }
    };

    fetchLatest();

    const interval = setInterval(
      fetchLatest,
      1000
    );

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        background:
          "rgba(255,255,255,0.06)",
        padding: "20px",
        borderRadius: "16px",
        border:
          "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: "15px",
        }}
      >
        🤖 AI Detection Status
      </h2>

      <p>
        {online
          ? "🟢 Model Online"
          : "🔴 Backend Offline"}
      </p>

      <h3>
        Latest Detection:
        {" "}
        {data.latest_detection}
      </h3>

      <p>
        <strong>Confidence:</strong>{" "}
        {(
          data.confidence * 100
        ).toFixed(1)}
        %
      </p>

      <h2
        style={{
          color: "#22c55e",
        }}
      >
        👥 People Detected:
        {" "}
        {data.people_count}
      </h2>

      <hr
        style={{
          borderColor:
            "rgba(255,255,255,0.1)",
        }}
      />

      <h3>Detected Objects</h3>

      {data.detections.length === 0 ? (
        <p>No objects detected</p>
      ) : (
        data.detections.map(
          (item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                padding: "6px 0",
              }}
            >
              <span>
                {item.class}
              </span>

              <span>
                {(
                  item.confidence * 100
                ).toFixed(1)}
                %
              </span>
            </div>
          )
        )
      )}
    </div>
  );
}