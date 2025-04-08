// pages/api/upload-chart.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using environment variables.
// Make sure you add these variables to your .env.local file:
//   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Expect the client to send { image: string, public_id?: string }
    const { image, public_id } = req.body;

    // Cloudinary accepts a data URL directly.
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "github-charts",
      public_id: public_id || undefined,
    });

    return res.status(200).json({ secure_url: uploadResponse.secure_url });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Something went wrong" });
  }
}
