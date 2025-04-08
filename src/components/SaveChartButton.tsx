// src/components/SaveChartButton.tsx
"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { useChartCapture } from "../../hooks/useChartCapture";


interface SaveChartButtonProps {
  fileName: string;
  children: React.ReactNode;
}

export default function SaveChartButton({
  fileName,
  children,
}: SaveChartButtonProps) {
  const { ref } = useChartCapture();
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!ref.current) {
      console.error("Chart container not found.");
      return;
    }
    setUploading(true);
    try {
      // Capture the element as a PNG data URL.
      const dataUrl = await toPng(ref.current);
      
      // Send the image data to our API endpoint.
      const response = await fetch("/api/upload-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: dataUrl,
          public_id: fileName,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Upload failed:", errorData.error);
        throw new Error("Upload failed");
      }
      
      const data = await response.json();
      setUploadUrl(data.secure_url);
      console.log("Uploaded image URL:", data.secure_url); // Log URL on console
    } catch (error) {
      console.error("Error during upload:", error);
      alert("Upload failed, please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div ref={ref}>{children}</div>
      <Button onClick={handleUpload} disabled={uploading} className="mt-4">
        {uploading ? "Uploading..." : "Save & Upload Chart"}
      </Button>
      {uploadUrl && (
        <p className="mt-2 text-sm text-cyan-400 break-all">
          Public URL:{" "}
          <a
            href={uploadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {uploadUrl}
          </a>
        </p>
      )}
    </>
  );
}
