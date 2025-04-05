import fs from "fs";
import path from "path";
import open from "open";

// Dummy weekly summary
const weeklySummary = `
**Highlights This Week:**
- 🧠 AI tools dominated Product Hunt
- 🔥 React dev tools trending on GitHub
- 📱 Cool new gadgets dropped
`;

const chartImageUrl = "https://quickchart.io/chart?c={type:'bar',data:{labels:['A','B','C'],datasets:[{label:'Stars',data:[100,200,150]}]}}";
const dashboardUrl = "https://zynapse-sigma.vercel.app/";

const emailHtml = `
  <html>
    <head>
      <title>Zynapse Weekly Digest</title>
      <style>
        body {
          font-family: sans-serif;
          padding: 30px;
          background: #f9f9f9;
          color: #333;
        }
        .container {
          background: #fff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 0 8px rgba(0,0,0,0.05);
          max-width: 700px;
          margin: auto;
        }
        img {
          max-width: 100%;
          border-radius: 6px;
        }
        a {
          color: #007bff;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>📩 Your Weekly Tech Digest</h2>
        <p>${weeklySummary.replace(/\n/g, "<br>")}</p>

        <h3>📊 Trending GitHub Repos</h3>
        <img src="${chartImageUrl}" alt="GitHub Trend Chart" />

        <p style="margin-top: 20px;">
          👉 <a href="${dashboardUrl}">Explore full interactive insights on the dashboard</a>
        </p>

        <hr />
        <small style="color: #888;">You are receiving this because you subscribed to Zynapse weekly insights.</small>
      </div>
    </body>
  </html>
`;

// Write to file and open
const filePath = path.join(process.cwd(), "emailPreview.html");
fs.writeFileSync(filePath, emailHtml, "utf-8");

console.log("✅ Email preview written to:", filePath);
open(filePath);
