import { useState } from "react";

export default function ImageUploader() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/detect-image",
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
        background: "#111827",
        padding: "24px",
        borderRadius: "20px",
        color: "white",
      }}
    >
      <h2>🖼 Upload Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={uploadImage}
      />

      {loading && <p>Detecting...</p>}

      {result && (
        <>
          <p>
            👥 People Count: {result.people_count}
          </p>

          <h3>Detections</h3>

          {result.detections?.map(
            (item: any, index: number) => (
              <div key={index}>
                {item.class} (
                {(item.confidence * 100).toFixed(1)}
                %)
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}