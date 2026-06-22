import { useEffect, useState } from "react";
import Detector from "../components/Detector";

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
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Vision Analytics Dashboard</h1>
          <p style={styles.subtitle}>
            Real-Time AI Surveillance & Object Detection
          </p>
        </div>

        <div style={styles.status}>
          <span style={styles.dot}></span>
          AI Online
        </div>
      </header>

      <div style={styles.statsGrid}>
        <div style={styles.card}>
          <h3>🎥 Cameras Online</h3>
          <p style={styles.bigNumber}>{cameras.length}</p>
        </div>

        <div style={styles.card}>
          <h3>🚨 Active Alerts</h3>
          <p style={styles.bigNumber}>5</p>
        </div>

        <div style={styles.card}>
          <h3>📦 Total Detections</h3>
          <p style={styles.bigNumber}>{totalDetections}</p>
        </div>

        <div style={styles.card}>
          <h3>🤖 AI Accuracy</h3>
          <p style={styles.bigNumber}>94%</p>
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <Detector />
      </div>

      <h2 style={styles.sectionTitle}>Live Camera Monitoring</h2>

      <div style={styles.cameraGrid}>
        {cameras.map((cam) => (
          <div key={cam.id} style={styles.cameraCard}>
            <div style={styles.videoBox}>
              <div style={styles.liveBadge}>LIVE</div>
            </div>

            <div style={styles.cameraInfo}>
              <h3>{cam.name}</h3>

              <p style={styles.smallText}>
                🟢 Detection Stream Active
              </p>

              <p style={styles.smallText}>
                Detections Today: {cam.detections}
              </p>
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
    background: "linear-gradient(180deg,#020617,#0f172a)",
    color: "white",
    padding: "40px",
    fontFamily: "Inter, system-ui, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    margin: 0,
    fontSize: "42px",
    fontWeight: 800,
    background: "linear-gradient(90deg,#22c55e,#38bdf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: "8px",
  },

  status: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(34,197,94,0.15)",
    color: "#22c55e",
    padding: "10px 16px",
    borderRadius: "999px",
    fontWeight: 700,
  },

  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#22c55e",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "20px",
    backdropFilter: "blur(10px)",
  },

  bigNumber: {
    fontSize: "36px",
    fontWeight: 800,
    margin: "10px 0 0",
  },

  sectionTitle: {
    marginTop: "40px",
    marginBottom: "20px",
  },

  cameraGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: "20px",
  },

  cameraCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    overflow: "hidden",
  },

  videoBox: {
    height: "220px",
    background: "linear-gradient(135deg,#111827,#1e293b)",
    position: "relative",
  },

  liveBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#ef4444",
    color: "white",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
  },

  cameraInfo: {
    padding: "16px",
  },

  smallText: {
    color: "#cbd5e1",
  },
};