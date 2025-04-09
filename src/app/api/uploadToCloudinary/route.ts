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

export async function POST(
  req: Request
) {
  const { image, public_id } = await req.json();

  // Cloudinary accepts a data URL directly.
  const uploadResponse = await cloudinary.uploader.upload(image, {
    folder: "github-charts",
    public_id: public_id || undefined,
  });

  return new Response(JSON.stringify({ secure_url: uploadResponse.secure_url }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
  
