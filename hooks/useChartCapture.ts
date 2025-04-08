// hooks/useChartCapture.ts

import { useRef } from "react";
import * as htmlToImage from "html-to-image";

export function useChartCapture() {
  const ref = useRef<HTMLDivElement>(null);

  // Optional: you can capture as a Blob if needed.
  const captureAsBlob = async (): Promise<Blob | null> => {
    if (!ref.current) return null;
    return await htmlToImage.toBlob(ref.current);
  };

  return { ref, captureAsBlob };
}
