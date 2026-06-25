import { useState } from "react";

export default function VideoUploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const uploadVideo = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://localhost:8000/detect-video",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setResult(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        padding: "24px",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <h3>🎥 Upload Video</h3>

      <input
        type="file"
        accept="video/*"
        onChange={uploadVideo}
      />

      {loading && (
        <p>Processing video...</p>
      )}

      {result && (
        <>
          <h4>
            👥 People Count:
            {" "}
            {result.people_count}
          </h4>

          <h4>Detections</h4>

          <pre
            style={{
              overflowX: "auto",
            }}
          >
            {JSON.stringify(
              result.detections,
              null,
              2
            )}
          </pre>
        </>
      )}
    </div>
  );
}