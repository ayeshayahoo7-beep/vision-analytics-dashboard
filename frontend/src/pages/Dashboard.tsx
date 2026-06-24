import { useState } from "react";
import type { CSSProperties } from "react";
import Detector from "../components/Detector";
import LiveCamera from "../components/LiveCamera";
type Camera = {
  id: number;
  name: string;
};

export default function Dashboard() {
  const [cameras] = useState<Camera[]>([
    {
      id: 1,
      name: "Primary Live Camera",
    },
  ]);

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
          SYSTEM ONLINE
        </div>
      </header>

      <div style={styles.hero}>
        <h2 style={{ marginTop: 0 }}>
          Intelligent Vision Analytics Platform
        </h2>

        <p style={{ color: "#94a3b8" }}>
          Real-time object detection, people counting,
          surveillance monitoring and AI-powered insights
          using YOLO26 Nano and FastAPI.
        </p>

        <div style={styles.badges}>
          <span style={styles.badge}>
            🎯 YOLO26 Nano
          </span>

          <span style={styles.badge}>
            ⚡ FastAPI
          </span>

          <span style={styles.badge}>
            📡 Live Detection
          </span>

          <span style={styles.badge}>
            👥 People Counting
          </span>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.card}>
          <div style={styles.icon}>📹</div>
          <h3>Live Cameras</h3>
          <p style={styles.bigNumber}>1</p>
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
          <h3>People Count</h3>
          <p style={styles.bigNumber}>LIVE</p>
        </div>
      </div>

      <div style={styles.mainGrid}>
        <LiveCamera />
        <Detector />
      </div>

      <div style={styles.timeline}>
        <h3 style={{ marginTop: 0 }}>
          System Information
        </h3>

        <p>Model: YOLO26 Nano</p>
        <p>Frontend: React + TypeScript</p>
        <p>Backend: FastAPI</p>
        <p>Inference: Real-Time</p>
        <p>Status: Operational</p>
      </div>

      <h2 style={styles.sectionTitle}>
        Monitoring Nodes
      </h2>

      <div style={styles.cameraGrid}>
        {cameras.map((cam) => (
          <div
            key={cam.id}
            style={styles.cameraCard}
          >
            <div style={styles.cameraHeader}>
              <span>{cam.name}</span>

              <span
                style={{
                  color: "#22c55e",
                  fontWeight: 700,
                }}
              >
                ● ONLINE
              </span>
            </div>

            <div style={styles.cameraBody}>
              🎥 Live Feed Connected
            </div>

            <div style={styles.cameraFooter}>
              YOLO26 Detection Active
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    color: "white",
    background:
      "linear-gradient(180deg,#020617,#0f172a)",
    fontFamily:
      "Inter, system-ui, sans-serif",
    position: "relative",
  },

  glow: {
    position: "absolute",
    top: "-150px",
    right: "-150px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle,#22c55e22,transparent)",
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
    background:
      "linear-gradient(90deg,#22c55e,#38bdf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: "8px",
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
    background:
      "linear-gradient(135deg,#1e293b,#0f172a)",
    borderRadius: "24px",
    padding: "30px",
    marginBottom: "30px",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  badges: {
    display: "flex",
    gap: "12px",
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
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
  },

  icon: {
    fontSize: "28px",
  },

  bigNumber: {
    fontSize: "34px",
    fontWeight: 800,
    marginBottom: 0,
  },

  timeline: {
    background: "rgba(255,255,255,0.05)",
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  sectionTitle: {
    marginTop: "35px",
    marginBottom: "15px",
  },

  cameraGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(300px,1fr))",
    gap: "20px",
  },

  cameraCard: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  cameraHeader: {
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    borderBottom:
      "1px solid rgba(255,255,255,0.08)",
  },

  cameraBody: {
    height: "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    fontSize: "18px",
  },

  cameraFooter: {
    padding: "16px",
    borderTop:
      "1px solid rgba(255,255,255,0.08)",
  },
};onabort