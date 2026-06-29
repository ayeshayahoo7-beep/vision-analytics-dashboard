import { useEffect, useState } from "react";
import { Cpu } from "lucide-react";

interface Props {
  isConnected: boolean;
  activeModel: string;
  latency?: number;
}

export default function SystemStatus({ isConnected, activeModel, latency = 14 }: Props) {
  const [metrics, setMetrics] = useState({
    cpu: 24,
    gpu: 32,
    gpuTemp: 46,
    vram: 1.2,
  });

  useEffect(() => {
    if (!isConnected) return;
    
    const interval = setInterval(() => {
      setMetrics((prev) => {
        const cpuDelta = (Math.random() - 0.5) * 6;
        const gpuDelta = (Math.random() - 0.5) * 8;
        const tempDelta = (Math.random() - 0.5) * 2;
        
        return {
          cpu: Math.max(10, Math.min(85, Math.round(prev.cpu + cpuDelta))),
          gpu: Math.max(15, Math.min(95, Math.round(prev.gpu + gpuDelta))),
          gpuTemp: Math.max(40, Math.min(75, Math.round(prev.gpuTemp + tempDelta))),
          vram: parseFloat(Math.max(1.0, Math.min(4.0, prev.vram + (Math.random() - 0.5) * 0.05)).toFixed(2)),
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isConnected]);

  return (
    <div className="glass-card">
      <div className="dashboard-panel-header">
        <h2>
          <Cpu size={18} />
          System Diagnostics
        </h2>
      </div>

      <div 
        className="system-status-summary" 
        style={{
          borderColor: isConnected ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
          background: isConnected ? "rgba(16, 185, 129, 0.04)" : "rgba(239, 68, 68, 0.04)",
          color: isConnected ? "#10b981" : "#ef4444"
        }}
      >
        <span>SYSTEM LOGIC ENGINE</span>
        <span style={{ fontWeight: 800 }}>
          {isConnected ? "● OPERATIONAL" : "○ OFFLINE"}
        </span>
      </div>

      <div className="system-status-grid">
        <div className="system-metric">
          <div className="system-metric-label">Inference Speed</div>
          <div className="system-metric-value" style={{ color: "var(--color-secondary)" }}>
            {isConnected ? `${latency} ms` : "0 ms"}
          </div>
          <div className="system-metric-progress">
            <div 
              className="system-metric-fill" 
              style={{ 
                width: isConnected ? `${Math.min(100, (latency / 50) * 100)}%` : "0%",
                background: "var(--color-secondary)" 
              }} 
            />
          </div>
        </div>

        <div className="system-metric">
          <div className="system-metric-label">Active Weights</div>
          <div className="system-metric-value" style={{ fontSize: "14px", marginTop: "8px" }}>
            {isConnected ? activeModel : "None"}
          </div>
          <div className="system-metric-progress">
            <div 
              className="system-metric-fill" 
              style={{ 
                width: isConnected ? "100%" : "0%",
                background: "var(--color-accent)" 
              }} 
            />
          </div>
        </div>

        <div className="system-metric">
          <div className="system-metric-label">AI Pipeline Load (GPU)</div>
          <div className="system-metric-value">
            {isConnected ? `${metrics.gpu}%` : "0%"}
          </div>
          <div className="system-metric-progress">
            <div 
              className="system-metric-fill" 
              style={{ 
                width: isConnected ? `${metrics.gpu}%` : "0%",
                background: metrics.gpu > 80 ? "var(--color-danger)" : "var(--color-primary)"
              }} 
            />
          </div>
        </div>

        <div className="system-metric">
          <div className="system-metric-label">GPU Core Temp</div>
          <div className="system-metric-value">
            {isConnected ? `${metrics.gpuTemp}°C` : "0°C"}
          </div>
          <div className="system-metric-progress">
            <div 
              className="system-metric-fill" 
              style={{ 
                width: isConnected ? `${(metrics.gpuTemp / 100) * 100}%` : "0%",
                background: metrics.gpuTemp > 70 ? "var(--color-danger)" : "var(--color-success)"
              }} 
            />
          </div>
        </div>

        <div className="system-metric">
          <div className="system-metric-label">Memory footprint</div>
          <div className="system-metric-value">
            {isConnected ? `${metrics.vram} GB` : "0 GB"}
          </div>
          <div className="system-metric-progress">
            <div 
              className="system-metric-fill" 
              style={{ 
                width: isConnected ? `${(metrics.vram / 8.0) * 100}%` : "0%",
                background: "var(--text-muted)" 
              }} 
            />
          </div>
        </div>

        <div className="system-metric">
          <div className="system-metric-label">Processor Load (CPU)</div>
          <div className="system-metric-value">
            {isConnected ? `${metrics.cpu}%` : "0%"}
          </div>
          <div className="system-metric-progress">
            <div 
              className="system-metric-fill" 
              style={{ 
                width: isConnected ? `${metrics.cpu}%` : "0%",
                background: "var(--color-primary)" 
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
