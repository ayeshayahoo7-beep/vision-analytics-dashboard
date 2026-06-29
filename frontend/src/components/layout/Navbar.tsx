import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function Navbar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="navbar">
      <div>
        <h1>Vision Telemetry Workspace</h1>
        <p>Real-time edge intelligence stream</p>
      </div>

      <div className="navbar-right">
        <span className="time-badge">
          <Clock 
            size={13} 
            style={{ 
              marginRight: "6px", 
              display: "inline-block", 
              verticalAlign: "middle",
              marginTop: "-2px"
            }} 
          />
          {time}
        </span>
      </div>
    </div>
  );
}