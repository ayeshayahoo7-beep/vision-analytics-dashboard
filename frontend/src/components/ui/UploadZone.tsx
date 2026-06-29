import { UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface Props {
  onFile: (file: File) => void;
  accept: Record<string, string[]>;
  title: string;
}

export default function UploadZone({
  onFile,
  accept,
  title,
}: Props) {
  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      accept,
      multiple: false,
      onDrop: (files) => {
        if (files.length) onFile(files[0]);
      },
    });

  return (
    <div
      {...getRootProps()}
      className={`upload-zone ${
        isDragActive ? "active" : ""
      }`}
    >
      <input {...getInputProps()} />

      <UploadCloud size={55} />

      <h2>{title}</h2>

      <p>
        Drag & Drop or Click to Upload
      </p>
    </div>
  );
}