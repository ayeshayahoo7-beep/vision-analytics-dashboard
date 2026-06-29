import { Camera, Activity } from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function LiveCamera() {
  return (
    <GlassCard>

      <div className="camera-header">

        <div className="camera-title">

          <Camera size={22} />

          <h2>Live Camera</h2>

        </div>

        <div className="live-pill">

          <span className="pulse" />

          LIVE

        </div>

      </div>

      <div className="camera-frame">

        <img
          src="http://localhost:8000/video-feed"
          alt="Live Camera"
        />

      </div>

      <div className="camera-footer">

        <div>

          <small>MODEL</small>

          <h3>YOLO26 Nano</h3>

        </div>

        <div>

          <small>STATUS</small>

          <h3>

            <Activity
              size={16}
            />

            Tracking

          </h3>

        </div>

      </div>

    </GlassCard>
  );
}