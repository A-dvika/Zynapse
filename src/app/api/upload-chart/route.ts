import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!, // "dufy5k0xj"
  api_key: process.env.CLOUDINARY_API_KEY!,       // "754566821241876"
  api_secret: process.env.CLOUDINARY_API_SECRET!, // "VKAcgYAfS5qCV_ZRtqGwLfgCGXs"
});

export async function POST(req: Request) {
  const body = await req.json();
  const { image, public_id } = body;
  if (!image) {
    return NextResponse.json({ error: "Missing image data" }, { status: 400 });
  }
  try {
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "github-charts",
      public_id: public_id || undefined,
    });
    return NextResponse.json({ secure_url: uploadResponse.secure_url }, { status: 200 });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
