// /pages/api/uploadToCloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})
async function captureAndUploadChart() {
    try {
      const chartClone = document.getElementById("chart-screenshot-clone")
      if (!chartClone) {
        console.error("No screenshot clone found!")
        return
      }
  
      const canvas = await html2canvas(chartClone)
      const imageData = canvas.toDataURL("image/png")
  
      const res = await fetch("/api/uploadToCloudinary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData, publicId: "producthunt-upvote-chart" }),
      })
  
      const { url } = await res.json()
      console.log("Uploaded chart to Cloudinary:", url)
    } catch (err) {
      console.error("Error capturing/uploading chart:", err)
    }
  }
  