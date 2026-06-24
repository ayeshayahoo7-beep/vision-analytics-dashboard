import { useEffect, useState } from "react";
import Detector from "../components/Detector";
import LiveCamera from "../components/LiveCamera";

type Camera = {
  id: number;
  name: string;
  detections: number;
};

export default function Dashboard() {
  const [cameras, setCameras] = useState<Camera[]>([
    { id: 1, name: "Entrance Camera", detections: 24 },
    { id: 2, name: "Parking Camera", detections: 42 },
    { id: 3, name: "Lobby Camera", detections: 17 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCameras((prev) =>
        prev.map((cam) => ({
          ...cam,
          detections: cam.detections + Math.floor(Math.random() * 2),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalDetections = cameras.reduce(
    (sum, cam) => sum + cam.detections,
    0
  );

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
          Intelligent Monitoring Platform
        </h2>

        <p style={{ color: "#94a3b8" }}>
          Real-time video analysis, object detection,
          surveillance monitoring, and AI-powered insights.
        </p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.card}>
          <div style={styles.icon}>🎥</div>
          <h3>Cameras</h3>
          <p style={styles.bigNumber}>{cameras.length}</p>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>🚨</div>
          <h3>Alerts</h3>
          <p style={styles.bigNumber}>5</p>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>📦</div>
          <h3>Detections</h3>
          <p style={styles.bigNumber}>{totalDetections}</p>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>🤖</div>
          <h3>Accuracy</h3>
          <p style={styles.bigNumber}>94%</p>
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <LiveCamera />
      </div>

      <div style={{ marginTop: "30px" }}>
        <Detector />
      </div>

      <div style={styles.timeline}>
        <h3 style={{ marginTop: 0 }}>
          Recent Detection Activity
        </h3>

        <p>10:41 — Person detected</p>
        <p>10:42 — Laptop detected</p>
        <p>10:43 — Mobile phone detected</p>
        <p>10:44 — Chair detected</p>
      </div>

      <h2 style={styles.sectionTitle}>
        Monitoring Nodes
      </h2>

      <div style={styles.cameraGrid}>
        {cameras.map((cam) => (
          <div key={cam.id} style={styles.cameraCard}>
            <div style={styles.cameraHeader}>
              <span>{cam.name}</span>

              <span style={{ color: "#22c55e" }}>
                ● ONLINE
              </span>
            </div>

            <div style={styles.cameraBody}>
              Detection Stream Active
            </div>

            <div style={styles.cameraFooter}>
              Detections Today: {cam.detections}
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
      "Inter, system-ui, -apple-system, sans-serif",
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

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.25)",
  },

  icon: {
    fontSize: "28px",
  },

  bigNumber: {
    fontSize: "38px",
    fontWeight: 800,
    marginBottom: 0,
  },

  timeline: {
    marginTop: "30px",
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
      "repeat(auto-fit,minmax(280px,1fr))",
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
  },

  cameraFooter: {
    padding: "16px",
    borderTop:
      "1px solid rgba(255,255,255,0.08)",
  },
};