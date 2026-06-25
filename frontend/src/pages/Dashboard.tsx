import type { CSSProperties } from "react";
import Detector from "../components/Detector";
import LiveCamera from "../components/LiveCamera";
import ImageUploader from "../components/ImageUploader";
import VideoUploader from "../components/VideoUploader";

export default function Dashboard() {
  return ( 
    <div style={styles.page}> 
      <div style={styles.glow}></div>

      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Vision Analytics Dashboard
          </h1>

          <p style={styles.subtitle}>
            AI-Powered Surveillance & Real-Time Object Detection
          </p>
        </div>

        <div style={styles.onlineBadge}>
          <span style={styles.onlineDot}></span>
          YOLO26 ONLINE
        </div>
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
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.card}>
          <div style={styles.icon}>📹</div>
          <h3>Camera Feed</h3>
          <p style={styles.bigNumber}>LIVE</p>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>🤖</div>
          <h3>AI Model</h3>
          <p style={styles.bigNumber}>YOLO26</p>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>⚡</div>
          <h3>Backend</h3>
          <p style={styles.bigNumber}>ONLINE</p>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>👥</div>
          <h3>People Counter</h3>
          <p style={styles.bigNumber}>ACTIVE</p>
        </div>
      </div>

      <div style={styles.mainGrid}>
        <LiveCamera />
        <Detector />
      </div>

      <div style={{ marginTop: "25px" }}>
        <ImageUploader />
      </div>
   
      <div style={{ marginTop: "25px" }}>
        <VideoUploader />
      </div>

      <div style={styles.infoCard}>
        <h3>System Information</h3>

        <p>🎯 Model: YOLO26 Nano</p>
        <p>⚛️ Frontend: React + TypeScript</p>
        <p>🚀 Backend: FastAPI</p>
        <p>📡 Inference: Real-Time Detection</p>
        <p>🖼 Upload Support: Images</p>
        <p>👥 Multi-Person Counting Enabled</p>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    background: "linear-gradient(180deg,#020617,#0f172a)",
    color: "white",
    fontFamily: "Inter, system-ui, sans-serif",
    position: "relative",
    overflowX: "hidden", // Prevents glowing circle from breaking horizontal layout
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    margin: 0,
    fontSize: "48px",
    fontWeight: 800,
    background: "linear-gradient(90deg,#22c55e,#38bdf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: "10px",
  },

  onlineBadge: {
    background: "rgba(34,197,94,0.15)",
    border: "1px solid rgba(34,197,94,0.3)",
    color: "#22c55e",
    padding: "12px 20px",
    borderRadius: "999px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: 700,
  },

  onlineDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#22c55e",
  },

  hero: {
    background: "linear-gradient(135deg,#1e293b,#0f172a)",
    borderRadius: "24px",
    padding: "30px",
    marginBottom: "30px",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  badges: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "20px",
  },

  badge: {
    background: "rgba(34,197,94,0.15)",
    color: "#22c55e",
    padding: "10px 16px",
    borderRadius: "999px",
    fontWeight: 600,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
  },

  icon: {
    fontSize: "30px",
  },

  bigNumber: {
    fontSize: "30px",
    fontWeight: 800,
    marginBottom: 0,
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
  },

  infoCard: {
    marginTop: "25px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
};
