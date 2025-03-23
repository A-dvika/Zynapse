import fs from 'fs';
 import { marked } from 'marked';
 import prisma from '../lib/db';
 
 
  const emailTemplate = (name: string, report: string) => `
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
 
 async function previewEmail() {
   const weeklyReportData = await prisma.dataSummary.findUnique({
     where: { source: 'weekly' },
   });
 
   if (!weeklyReportData) {
     console.log('No weekly report found.');
     return;
   }
 
   const fakeName = 'Test User';
 
   
   const reportHtml = await marked(weeklyReportData.summary);
 
   
   const htmlContent = emailTemplate(fakeName, reportHtml);
 
   
   fs.writeFileSync('preview.html', htmlContent, 'utf8');
   console.log('✅ Preview file generated: preview.html');
   console.log('👉 Open preview.html in your browser to see your full email layout.');
 }
 
 previewEmail().catch(console.error);