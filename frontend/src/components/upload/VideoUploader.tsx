import { useState } from "react";
import UploadZone from "../ui/UploadZone";
import DetectionCard from "../dashboard/DetectionCard";
const icons: Record<string, string> = {
  person: "👤",
  car: "🚗",
  bicycle: "🚲",
  motorcycle: "🏍️",
  bus: "🚌",
  truck: "🚚",
  backpack: "🎒",
  laptop: "💻",
  bottle: "🍾",
};

interface StreamFrame {
  frame: string;
  people: number;
  detections: Record<string, number>;
  finished?: boolean;
  error?: string;
}

export default function VideoUploader() {
  const [loading, setLoading] = useState(false);
  const [frame, setFrame] = useState("");
  const [people, setPeople] = useState(0);
  const [detections, setDetections] = useState<Record<string, number>>({});

  const uploadVideo = async (file: File) => {
    setLoading(true);

    setFrame("");
    setPeople(0);
    setDetections({});

    const formData = new FormData();
    formData.append("file", file);

    try {
      const upload = await fetch(
        "http://localhost:8000/upload-video",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await upload.json();

      const socket = new WebSocket(
        `ws://localhost:8000/ws/video/${data.video_id}`
      );

      socket.onmessage = (event) => {
        const msg: StreamFrame = JSON.parse(event.data);

        if (msg.finished) {
          socket.close();
          setLoading(false);
          return;
        }

        setFrame(msg.frame);
        setPeople(msg.people);
        setDetections(msg.detections);
      };
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">

      <h2>🎥 Video Detection</h2>

      <UploadZone
        title="Upload Video"
        accept={{ "video/*": [] }}
        onFile={uploadVideo}
      />

      {loading && (
        <div className="progress">
          <div className="progress-fill"/>
        </div>
      )}

      {frame && (
        <div className="live-preview">
          <img
            src={`data:image/jpeg;base64,${frame}`}
            alt=""
          />
        </div>
      )}

      <div className="hero-number">

        👤 {people}

      </div>

      <div className="detection-grid">

        {Object.entries(detections).map(
          ([label,count])=>(
            <DetectionCard
              key={label}
              label={label}
              count={count}
              icon={icons[label] ?? "📦"}
            />
          )
        )}

      </div>

    </div>
  );
}