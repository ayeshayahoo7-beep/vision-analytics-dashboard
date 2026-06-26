import { useState } from "react";

export default function LiveDetection() {
  const [streamError, setStreamError] = useState<boolean>(false);
  const feedUrl = "http://localhost:8000/video-feed";

  const handleRetry = () => {
    setStreamError(false);
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        padding: "20px",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <h3 style={{ marginTop: 0 }}>🎥 Live AI Detection</h3>

      <div 
        style={{ 
          width: "100%", 
          position: "relative",
          background: "#000",
          borderRadius: "12px",
          overflow: "hidden",
          aspectRatio: "16/9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {!streamError ? (
          <img
            src={feedUrl}
            alt="Live Detection Stream"
            onError={() => setStreamError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p style={{ color: "#ef4444", margin: "0 0 12px 0" }}>
              ⚠️ Camera feed disconnected or offline.
            </p>
            <button
              onClick={handleRetry}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Retry Connection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
