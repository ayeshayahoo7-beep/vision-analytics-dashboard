import { useEffect, useState } from "react";

interface Props {
  videoId: string | null;
}

interface FrameData {
  frame: string;
  people: number;
  detections: Record<string, number>;
  finished?: boolean;
}

export default function LiveVideoDetection({
  videoId,
}: Props) {
  const [frame, setFrame] = useState("");
  const [people, setPeople] = useState(0);
  const [detections, setDetections] = useState<
    Record<string, number>
  >({});
  const [status, setStatus] = useState(
    "Waiting for video..."
  );

  useEffect(() => {
    if (!videoId) return;

    setStatus("Connecting...");

    const socket = new WebSocket(
      `ws://localhost:8000/ws/video/${videoId}`
    );

    socket.onopen = () => {
      console.log("✅ WebSocket Connected");
      setStatus("Processing Video...");
    };

    socket.onmessage = (event) => {
      const data: FrameData = JSON.parse(event.data);

      console.log("Received:", data);

      if (data.finished) {
        setStatus("Processing Complete");
        socket.close();
        return;
      }

      setFrame(data.frame);
      setPeople(data.people);
      setDetections(data.detections);
    };

    socket.onerror = (e) => {
      console.error("WebSocket Error:", e);
      setStatus("WebSocket Error");
    };

    socket.onclose = () => {
      console.log("WebSocket Closed");
    };

    return () => {
      socket.close();
    };
  }, [videoId]);

  return (
    <div
      style={{
        marginTop: "25px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "20px",
        padding: "24px",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "white",
      }}
    >
      <h2>🎥 Processed Video</h2>

      <p>{status}</p>

      {frame ? (
        <img
          src={`data:image/jpeg;base64,${frame}`}
          alt="Processed Video"
          style={{
            width: "100%",
            borderRadius: "16px",
            marginBottom: "20px",
          }}
        />
      ) : (
        <div
          style={{
            height: "350px",
            background: "#111827",
            borderRadius: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#94a3b8",
          }}
        >
          Waiting for uploaded video...
        </div>
      )}

      <div
        style={{
          marginTop: "20px",
          padding: "16px",
          background: "rgba(34,197,94,0.15)",
          borderRadius: "12px",
        }}
      >
        <h3>👥 People Detected: {people}</h3>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        {Object.entries(detections).map(
          ([label, count]) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.05)",
                padding: "15px",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <h4
                style={{
                  margin: 0,
                  textTransform: "capitalize",
                }}
              >
                {label}
              </h4>

              <p
                style={{
                  fontSize: "26px",
                  fontWeight: "bold",
                  marginTop: "10px",
                }}
              >
                {count}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}