// lib/cloudinary.ts
export async function uploadToCloudinary(blob: Blob, fileName: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // 💡 from Cloudinary dashboard
    formData.append("folder", "github-charts");
    formData.append("public_id", fileName);
  
    const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
      method: "POST",
      body: formData,
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Upload failed");
  
    return data.secure_url;
  }
  