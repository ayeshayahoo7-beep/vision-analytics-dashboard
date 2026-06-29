<<<<<<< Updated upstream
import { useEffect, useState } from "react";
import Detector from "../components/Detector";

type Camera = {
  id: number;
  name: string;
  detections: number;
};

export default function Dashboard() {
  const [cameras, setCameras] = useState<Camera[]>([
    { id: 1, name: "Entrance Cam", detections: 3 },
    { id: 2, name: "Parking Cam", detections: 7 },
    { id: 3, name: "Lobby Cam", detections: 2 },
  ]);

import { useState } from "react";
import type { CSSProperties } from "react";

import Detector from "../components/Detector";
import LiveCamera from "../components/LiveCamera";
import ImageUploader from "../components/ImageUploader";
import VideoUploader from "../components/VideoUploader";
import LiveVideoDetection from "../components/LiveVideoDetection";

export default function Dashboard() {
  const [videoId, setVideoId] = useState<string | null>(null);

  return (
    <div style={styles.page}>
      <div style={styles.glow}></div>


  const [alerts, setAlerts] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCameras((prev) =>
        prev.map((cam) => ({
          ...cam,
          detections: Math.max(
            0,
            cam.detections + Math.floor(Math.random() * 3 - 1)
          ),
        }))
      );

      setAlerts((a) =>
        Math.max(0, a + Math.floor(Math.random() * 3 - 1))
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Vision Analytics Dashboard</h1>
        <p style={styles.subtitle}>Live AI monitoring system</p>
      </header>


      <div style={styles.hero}>
        <h2 style={{ marginTop: 0 }}>
          Intelligent Vision Analytics Platform
        </h2>

        <p style={{ color: "#94a3b8" }}>
          Real-time object detection, people counting,
          image analysis and AI-powered surveillance
          monitoring using YOLO26 Nano and FastAPI.
        </p>

        <div style={styles.badges}>
          <span style={styles.badge}>🎯 YOLO26 Nano</span>
          <span style={styles.badge}>⚡ FastAPI</span>
          <span style={styles.badge}>📡 Live Detection</span>
          <span style={styles.badge}>👥 People Counting</span>
          <span style={styles.badge}>🖼 Image Upload</span>
          <span style={styles.badge}>🎥 Video Analytics</span>
        </div>
      </div>


      <div style={styles.statsGrid}>
        <Detector />

        <div style={styles.card}>
          <h3>Total Cameras</h3>
          <p style={styles.bigNumber}>{cameras.length}</p>
        </div>

        <div style={styles.card}>
          <h3>Active Alerts</h3>
          <p style={styles.bigNumber}>{alerts}</p>
        </div>

        <div style={styles.card}>
          <h3>Total Detections</h3>
          <p style={styles.bigNumber}>
            {cameras.reduce((sum, c) => sum + c.detections, 0)}
          </p>
        </div>
      </div>


      <h2 style={{ marginTop: 30 }}>Live Camera Feeds</h2>

      <div style={{ marginTop: "25px" }}>
        <ImageUploader />
      </div>

      <div style={{ marginTop: "25px" }}>
        <VideoUploader onUpload={setVideoId} />
      </div>

      <div style={{ marginTop: "25px" }}>
        <LiveVideoDetection videoId={videoId} />
      </div>


      <div style={styles.cameraGrid}>
        {cameras.map((cam) => (
          <div key={cam.id} style={styles.cameraCard}>
            <div style={styles.videoBox}>
              <div style={styles.overlay}>
                🎥 LIVE FEED
              </div>
            </div>


            <div style={styles.cameraInfo}>
              <h3>{cam.name}</h3>
              <p>Detections: {cam.detections}</p>
            </div>
          </div>
        ))}
=======
        <p>🎯 Model: YOLO26 Nano</p>
        <p>⚛️ Frontend: React + TypeScript</p>
        <p>🚀 Backend: FastAPI</p>
        <p>📡 Inference: Real-Time Detection</p>
        <p>🖼 Upload Support: Images & Videos</p>
        <p>👥 Multi-Person Counting Enabled</p>

      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "30px",
    fontFamily: "system-ui",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    minHeight: "100vh",
    color: "white",

    fontFamily: "Inter, system-ui, sans-serif",
    position: "relative",
    overflowX: "hidden",
  },

  glow: {
    position: "absolute",
    top: "-150px",
    right: "-150px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle,#22c55e22,transparent)",
    pointerEvents: "none",

  },

  header: {
    marginBottom: "20px",
  },

  title: {
    fontSize: "30px",
    margin: 0,
  },

  subtitle: {
    opacity: 0.7,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
    marginTop: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.06)",
    padding: "15px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  bigNumber: {
    fontSize: "28px",
    fontWeight: 700,
  },

  cameraGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "15px",
  },

  cameraCard: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "14px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.1)",
  },


  videoBox: {
    height: "180px",
    background: "black",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    position: "absolute",
    color: "#22c55e",
    fontWeight: 700,
    fontSize: "14px",
    letterSpacing: "2px",
  },

  cameraInfo: {
    padding: "10px",
  },
};