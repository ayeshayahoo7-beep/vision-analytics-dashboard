import { useState, useRef } from "react";

interface UploadResponse {
  video_id: string;
}

interface Props {
  onUpload: (videoId: string) => void;
}

export default function VideoUploader({
  onUpload,
}: Props) {
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
        "http://localhost:8000/upload-video",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data: UploadResponse =
        await response.json();

      console.log("Video ID:", data.video_id);

      // Send videoId to Dashboard
      onUpload(data.video_id);
    } catch (err) {
      console.error(err);
      alert("Video upload failed.");
    } finally {
      setLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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

      {loading && (
        <p
          style={{
            color: "#aaa",
            marginTop: "15px",
          }}
        >
          Uploading video...
        </p>
      )}
    </div>
  );
}