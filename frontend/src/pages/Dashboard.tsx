import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Video, 
  UploadCloud, 
  Users, 
  Car, 
  Layers, 
  Activity, 
  Cpu, 
  RefreshCw 
} from "lucide-react";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import Navbar from "../components/layout/Navbar";
import StatsCard from "../components/dashboard/StatsCard";

import AnalyticsChart from "../components/dashboard/AnalyticsChart";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import SystemStatus from "../components/dashboard/SystemStatus";
import DetectionTable from "../components/DetectionTable";
import ImageUploader from "../components/upload/ImageUploader";
import VideoUploader from "../components/upload/VideoUploader";

interface LogItem {
  id: string;
  time: string;
  class: string;
  confidence: number;
}

interface ChartPoint {
  time: string;
  People: number;
  Vehicles: number;
  Objects: number;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "live" | "media">("dashboard");
  const [isConnected, setIsConnected] = useState(false);
  const [activeModel, setActiveModel] = useState("YOLO26 Nano");
  const [isModelLoading, setIsModelLoading] = useState(false);

  // Live telemetry states
  const [peopleCount, setPeopleCount] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [objectsCount, setObjectsCount] = useState(0);
  const [inferenceLatency, setInferenceLatency] = useState(13);
  const [detections, setDetections] = useState<any[]>([]);

  // Logs and chart histories
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  // Periodically query /latest to sync webcam analytics
  useEffect(() => {
    let logCounter = 0;
    
    // Initialize chart with empty points
    const initialChart: ChartPoint[] = [];
    const now = new Date();
    for (let i = 9; i >= 0; i--) {
      const timeStr = new Date(now.getTime() - i * 3000).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      });
      initialChart.push({ time: timeStr, People: 0, Vehicles: 0, Objects: 0 });
    }
    setChartData(initialChart);

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:8000/latest");
        if (!res.ok) throw new Error("Offline");
        
        const data = await res.json();
        setIsConnected(true);
        
        if (data.active_model) {
          setActiveModel(data.active_model);
        }

        // Extract detection items
        const webcamDetections = data.detections || [];
        setDetections(webcamDetections);
        
        // Count People, Vehicles, Objects
        const people = data.people_count || 0;
        setPeopleCount(people);

        let vehicles = 0;
        webcamDetections.forEach((d: any) => {
          const cls = d.class.toLowerCase();
          if (["car", "truck", "bus", "motorcycle", "bicycle"].includes(cls)) {
            vehicles++;
          }
        });
        setVehicleCount(vehicles);
        setObjectsCount(webcamDetections.length);
        
        // Inference latency mock based on selected model
        const baseLatency = data.active_model === "YOLOv8 Nano" ? 21 : 12;
        const randomJitter = (Math.random() - 0.5) * 2;
        setInferenceLatency(Math.max(8, Math.round(baseLatency + randomJitter)));

        // Add to logs feed
        const timeNow = new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: false 
        });
        
        const newLogs: LogItem[] = [];
        webcamDetections.forEach((d: any) => {
          if (d.confidence > 0.45) {
            logCounter++;
            newLogs.push({
              id: `log-${Date.now()}-${logCounter}`,
              time: timeNow,
              class: d.class,
              confidence: d.confidence
            });
          }
        });

        if (newLogs.length > 0) {
          setLogs((prev) => [...prev, ...newLogs].slice(-30));
        }

        // Add to charts history
        setChartData((prev) => {
          const next = [...prev];
          next.shift();
          next.push({
            time: timeNow,
            People: people,
            Vehicles: vehicles,
            Objects: webcamDetections.length
          });
          return next;
        });

      } catch (err) {
        setIsConnected(false);
      }
    }, 1500);

    return () => clearInterval(pollInterval);
  }, []);

  const handleModelChange = async (modelKey: "yolo26n" | "yolov8n") => {
    setIsModelLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/set-model?model_name=${modelKey}`, {
        method: "POST"
      });
      if (res.ok) {
        setActiveModel(modelKey === "yolo26n" ? "YOLO26 Nano" : "YOLOv8 Nano");
      }
    } catch (e) {
      console.error("Failed to set model:", e);
    } finally {
      setIsModelLoading(false);
    }
  };

  // Convert detections to DetectionTable format
  const tableData = detections.map((d: any, idx: number) => ({
    id: idx + 1,
    object: d.class,
    confidence: `${(d.confidence * 100).toFixed(1)}%`,
    time: new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    }),
  }));

  return (
    <div className="dashboard">
      <AnimatedBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Vision AI Telemetry Center</h1>
          <p>Real-time edge analytics stream • YOLO Architecture Core • FastAPI Endpoint WebSocket Integration</p>
        </div>
        <div className="hero-badges">
          <span className="active-badge">🚀 FastAPI Engine</span>
          <span className="active-badge">⚡ WebSocket Gate</span>
          <span className={activeModel === "YOLO26 Nano" ? "active-badge" : ""}>🧠 YOLO26 Nano</span>
          <span className={activeModel === "YOLOv8 Nano" ? "active-badge" : ""}>🧠 YOLOv8 Nano</span>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="tabs-navigation">
        <button 
          onClick={() => setActiveTab("dashboard")} 
          className={`tab-button ${activeTab === "dashboard" ? "active" : ""}`}
        >
          <LayoutDashboard size={15} />
          Telemetry Workspace
        </button>
        <button 
          onClick={() => setActiveTab("live")} 
          className={`tab-button ${activeTab === "live" ? "active" : ""}`}
        >
          <Video size={15} />
          Live Stream Player
        </button>
        <button 
          onClick={() => setActiveTab("media")} 
          className={`tab-button ${activeTab === "media" ? "active" : ""}`}
        >
          <UploadCloud size={15} />
          Media Analyzer
        </button>
      </div>

      {/* Stats Grid */}
      {activeTab !== "media" && (
        <section className="stats-grid">
          <StatsCard
            title="People Detected"
            value={peopleCount}
            icon={<Users size={22} />}
          />
          <StatsCard
            title="Active Vehicles"
            value={vehicleCount}
            icon={<Car size={22} />}
          />
          <StatsCard
            title="Total Objects"
            value={objectsCount}
            icon={<Layers size={22} />}
          />
          <StatsCard
            title="Inference Latency"
            value={inferenceLatency}
            icon={<Activity size={22} />}
          />
        </section>
      )}

      {/* Tab Panels */}
      {activeTab === "dashboard" && (
        <div className="dashboard-grid">
          {/* Main Telemetry Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="glass-card">
              <div className="dashboard-panel-header">
                <h2>
                  <Activity size={18} />
                  Real-time Object Class Trends
                </h2>
              </div>
              <AnalyticsChart data={chartData} />
            </div>

            <div className="glass-card">
              <div className="dashboard-panel-header">
                <h2>
                  <Layers size={18} />
                  Active Visual Targets
                </h2>
              </div>
              {tableData.length === 0 ? (
                <div style={{ color: "var(--text-dark)", textAlign: "center", padding: "40px 20px" }}>
                  No active detections on stream. Start webcam or upload files to begin.
                </div>
              ) : (
                <div className="table-container">
                  <DetectionTable data={tableData} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Telemetry Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <ActivityFeed logs={logs} />
            <SystemStatus isConnected={isConnected} activeModel={activeModel} latency={inferenceLatency} />
          </div>
        </div>
      )}

      {activeTab === "live" && (
        <div className="live-grid">
          {/* Live Camera Feed */}
          <div className="glass-card" style={{ display: "flex", flexDirection: "column" }}>
            <div className="dashboard-panel-header">
              <h2>
                <Video size={18} />
                Live Camera Source Feed
              </h2>
              <span className={`status-indicator ${isConnected ? "" : "offline"}`}>
                <span className="stats-pulse" />
                {isConnected ? "WEBCAM FEED ACTIVE" : "ENGINE OFFLINE"}
              </span>
            </div>
            <div className="camera-container">
              {isConnected ? (
                <img 
                  className="camera-stream" 
                  src="http://localhost:8000/video-feed" 
                  alt="Live Telemetry Video Feed" 
                />
              ) : (
                <div className="camera-placeholder">
                  <Video size={48} style={{ strokeWidth: 1.2, opacity: 0.4 }} />
                  <span>Awaiting webcam stream connection...</span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Controls */}
          <div className="camera-controls-panel">
            <div className="glass-card">
              <div className="dashboard-panel-header">
                <h2>
                  <Cpu size={18} />
                  Pipeline Weights Engine
                </h2>
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px", lineHeight: "1.5" }}>
                Hot-swap the active neural weights file loaded in memory on the FastAPI server.
              </p>
              
              <div className="model-selector-container">
                <div 
                  onClick={() => handleModelChange("yolo26n")}
                  className={`model-option ${activeModel === "YOLO26 Nano" ? "selected" : ""}`}
                >
                  <div className="model-info-text">
                    <h4>YOLO26 Nano</h4>
                    <p>Optimized edge inference (11-14ms latency)</p>
                  </div>
                  <div className="model-select-radio" />
                </div>

                <div 
                  onClick={() => handleModelChange("yolov8n")}
                  className={`model-option ${activeModel === "YOLOv8 Nano" ? "selected" : ""}`}
                >
                  <div className="model-info-text">
                    <h4>YOLOv8 Nano</h4>
                    <p>Standard COCO weights (18-24ms latency)</p>
                  </div>
                  <div className="model-select-radio" />
                </div>
              </div>

              {isModelLoading && (
                <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--color-secondary)" }}>
                  <RefreshCw size={14} className="animate-spin" style={{ animation: "spin 2s linear infinite" }} />
                  <span>Hot-swapping weights...</span>
                </div>
              )}
            </div>

            <SystemStatus isConnected={isConnected} activeModel={activeModel} latency={inferenceLatency} />
          </div>
        </div>
      )}

      {activeTab === "media" && (
        <div className="file-upload-layout">
          <ImageUploader />
          <VideoUploader />
        </div>
      )}
    </div>
  );
}