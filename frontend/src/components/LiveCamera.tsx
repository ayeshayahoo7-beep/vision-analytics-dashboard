import { useEffect, useRef } from "react";

export default function LiveCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream;
    let interval: number;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        interval = window.setInterval(sendFrame, 1000);
      } catch (error) {
        console.error("Camera Error:", error);
      }
    };

    const sendFrame = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.videoWidth === 0) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.drawImage(video, 0, 0);

      const imageData = canvas.toDataURL(
        "image/jpeg",
        0.8
      );

      const base64 = imageData.split(",")[1];

      try {
        await fetch(
          "http://localhost:8000/detect",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              image: base64,
            }),
          }
        );
      } catch (error) {
        console.error(
          "Detection request failed:",
          error
        );
      }
    };

    startCamera();

    return () => {
      clearInterval(interval);

      if (stream) {
        stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div
      style={{
        background:
          "rgba(255,255,255,0.05)",
        borderRadius: "24px",
        overflow: "hidden",
        border:
          "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 20px 40px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          padding: "16px 20px",
          borderBottom:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
            }}
          >
            📹 Live Camera Feed
          </h3>

          <p
            style={{
              margin: "4px 0 0",
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            Real-time YOLO Detection
          </p>
        </div>

        <div
          style={{
            color: "#22c55e",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          ● LIVE
        </div>
      </div>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          height: "500px",
          objectFit: "cover",
          background: "black",
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          display: "none",
        }}
      />
    </div>
  );
}