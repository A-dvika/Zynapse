import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { marked } from "marked";

// Load environment variables from .env file
dotenv.config();

// Configure Cloudinary for URL generation (no API credentials needed for public images)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // e.g. "dufy5k0xj"
});

// Generate the public URL of the chart image (adjust the image path as needed)
const chartUrl = cloudinary.url(
  "https://res.cloudinary.com/dufy5k0xj/image/upload/v1744098177/github-charts/test-chart.png",
  {
    format: "png",
    secure: true,
  }
);

// This is your actual email template from your sendWeeklyReportEmail function,
// now enhanced to include a Cloudinary chart section. In production, "report"
// would be retrieved from your database (weeklyReportData.summary converted with marked).
const emailTemplate = (name: string, report: string, chartUrl: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Weekly Tech Report</title>
    <style>
      /* Basic reset */
      body, p, h1, h2, h3, h4, h5, h6 {
        margin: 0;
        padding: 0;
      }
      body {
        background-color: #f5f7fa;
        font-family: Arial, sans-serif;
        color: #333;
        line-height: 1.6;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      .header {
        background: linear-gradient(90deg, #7f00ff, #e100ff);
        text-align: center;
        padding: 20px;
        color: #fff;
      }
      .header h1 {
        font-size: 26px;
        margin-bottom: 5px;
      }
      .header p {
        font-size: 14px;
      }
      .content {
        padding: 20px;
      }
      .content h2 {
        color: #7f00ff;
        font-size: 20px;
        margin-bottom: 10px;
      }
      .content p {
        margin-bottom: 15px;
        font-size: 15px;
      }
      .report {
        padding: 15px;
        background-color: #f9f9f9;
        border-left: 4px solid #7f00ff;
        margin-bottom: 20px;
      }
      .chart {
        text-align: center;
        margin: 20px 0;
      }
      .chart img {
        max-width: 100%;
        height: auto;
        border: 1px solid #ddd;
      }
      .cta {
        text-align: center;
        margin-bottom: 20px;
      }
      .cta a {
        background-color: #7f00ff;
        color: #ffffff;
        padding: 12px 25px;
        text-decoration: none;
        border-radius: 5px;
        font-size: 16px;
      }
      .footer {
        background-color: #f0f0f0;
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #777;
      }
      .footer a {
        color: #777;
        text-decoration: underline;
      }
      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .container {
          margin: 10px;
        }
        .header h1 {
          font-size: 22px;
        }
        .cta a {
          font-size: 14px;
          padding: 10px 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header Section -->
      <div class="header">
        <h1>Weekly Tech Report</h1>
        <p>Your curated tech trends & insights</p>
      </div>
      <!-- Content Section -->
      <div class="content">
        <h2>Hello, ${name}!</h2>
        <p>Below is your comprehensive update for the week:</p>
        <div class="report">
          ${report}
        </div>
        <div class="chart">
          <h2>Language Distribution Chart</h2>
          <img src="${chartUrl}" alt="Language Distribution Chart" />
        </div>
        <div class="cta">
          <a href="https://example.com">View More Details</a>
        </div>
      </div>
      <!-- Footer Section -->
      <div class="footer">
        <p>You are receiving this email because you subscribed to our tech newsletter.</p>
        <p><a href="https://example.com/unsubscribe">Unsubscribe</a></p>
      </div>
    </div>
  </body>
</html>
`;

// Instead of using dummy content, in your production code you would retrieve the
// weekly report from your database. For preview purposes, convert your actual Markdown
// report (or a sample version) with marked. Replace the markdown below with your actual data.
const actualReportMarkdown = `
# Weekly Summary

Here’s a detailed review of our tech trends:

- **GitHub:** Projects achieved new milestone stars.
- **Hacker News:** Discussions sparked innovative ideas.
- **Social Media:** Buzzing trends and insights were captured.

_For more details, please visit our site._
`;

// Convert the Markdown report into HTML
const reportHtml = marked(actualReportMarkdown);

// Build the final email HTML using your actual template along with the Cloudinary chart
const finalEmailHtml = emailTemplate("Valued Subscriber", reportHtml, chartUrl);

// Write the generated HTML to a file so you can preview it in your browser
fs.writeFileSync("newsletter-preview.html", finalEmailHtml, "utf-8");

console.log("Newsletter preview generated and saved to newsletter-preview.html");
