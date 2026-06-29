import { useEffect, useRef } from "react";
import { Terminal } from "lucide-react";

interface LogItem {
  id: string;
  time: string;
  class: string;
  confidence: number;
}

interface Props {
  logs: LogItem[];
}

const icons: Record<string, string> = {
  person: "👤",
  car: "🚗",
  backpack: "🎒",
  laptop: "💻",
  bottle: "🍾",
  chair: "🪑",
  dog: "🐶",
  cat: "🐱",
};

export default function ActivityFeed({ logs }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-card">
      <div className="dashboard-panel-header">
        <h2>
          <Terminal size={18} />
          Real-time Event Feed
        </h2>
      </div>

      <div className="activity-log" ref={containerRef}>
        {logs.length === 0 ? (
          <div className="empty-activity">
            <Terminal size={24} style={{ opacity: 0.3 }} />
            <span>Awaiting telemetry stream...</span>
          </div>
        ) : (
          logs.map((log) => {
            const isHigh = log.confidence >= 0.75;
            const isMedium = log.confidence >= 0.5 && log.confidence < 0.75;
            const confClass = isHigh
              ? "high"
              : isMedium
              ? "medium"
              : "low";
            
            const itemClass = `activity-item ${
              isHigh ? "high-conf" : isMedium ? "medium-conf" : ""
            }`;

            return (
              <div key={log.id} className={itemClass}>
                <span className="activity-time">[{log.time}]</span>
                <span className="activity-text">
                  {icons[log.class.toLowerCase()] || "📦"}{" "}
                  <strong style={{ textTransform: "capitalize" }}>
                    {log.class}
                  </strong>{" "}
                  identified
                </span>
                <span className={`activity-conf ${confClass}`}>
                  {(log.confidence * 100).toFixed(1)}%
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
