import { useState, useRef } from "react";

interface DetectionResponse {
  people_count: number;
  unique_people: number;
  detections: Record<string, number>;
}

export default function VideoUploader() {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<DetectionResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/detect-video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data: DetectionResponse = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to process the video. Please check your backend.");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        padding: "24px",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#fff",
        fontFamily: "sans-serif"
      }}
    >
      <h3>🎥 Upload Video</h3>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={uploadVideo}
        disabled={loading}
      />

      {loading && <p style={{ color: "#aaa" }}>Processing video...</p>}

      {result && (
        <>
          <div
            style={{
              background: "rgba(34,197,94,0.1)",
              padding: "16px",
              borderRadius: "12px",
              marginTop: "20px",
              border: "1px solid rgba(34,197,94,0.3)",
            }}
          >
            <h3 style={{ margin: 0 }}>
              👥 Unique People: {result.people_count}
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            {Object.entries(result.detections).map(([label, count]) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  padding: "15px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  textAlign: "center",
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    textTransform: "capitalize",
                    color: "#aaa"
                  }}
                >
                  {label}
                </h4>

                <p
                  style={{
                    fontSize: "28px",
                    fontWeight: 700,
                    margin: "10px 0 0 0",
                  }}
                >
                  {count}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
