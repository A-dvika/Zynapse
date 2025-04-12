import nodemailer from 'nodemailer';
import prisma from '../lib/db';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary using your .env settings
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

async function sendWeeklyReportEmail() {
  // Define Cloudinary URLs for the charts
  const chartReddit = cloudinary.url(
    "https://res.cloudinary.com/dufy5k0xj/image/upload/v1744346697/429058da-7b74-4a1b-a0bc-c7479f9e4f17.png", 
    { format: "png", secure: true }
  );
  const chartGitHub = cloudinary.url(
    "https://res.cloudinary.com/dufy5k0xj/image/upload/v1744102945/73a0e702-ed03-4fcc-aaaa-a8d3d97bcc66.png", 
    { format: "png", secure: true }
  );
  const chartTechNews = cloudinary.url(
    "https://res.cloudinary.com/dufy5k0xj/image/upload/v1744345087/be20b882-1da3-4c58-aa5e-28bff8933e7d.png", 
    { format: "png", secure: true }
  );
  const chartGadgetGossip = cloudinary.url(
    "https://res.cloudinary.com/dufy5k0xj/image/upload/v1744103026/56f9d80f-807b-48ff-adbe-7fa8ecb521b7.png", 
    { format: "png", secure: true }
  );

  // Updated newsletter content with modern design
  const newsletterContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Weekly Tech Report</title>
      <style>
        /* Base styles */
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f7f9fc;
          color: #333;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        
        /* Container */
        .container {
          max-width: 650px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
        }
        
        /* Header styles */
        .header {
          background: linear-gradient(135deg, #00c6ff, #0072ff);
          padding: 25px 20px;
          text-align: center;
          color: white;
        }
        
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        
        .header p {
          margin: 8px 0 0;
          font-size: 16px;
          opacity: 0.9;
        }
        
        /* Content area */
        .content {
          padding: 30px 25px;
        }
        
        /* Section styling */
        .section {
          margin-bottom: 30px;
          padding-bottom: 25px;
          border-bottom: 1px solid #e8eef4;
        }
        
        .section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .section-icon {
          font-size: 22px;
          margin-right: 10px;
          color: #00FFFF;
        }
        
        /* Headings */
        h2 {
          color: #0056b3;
          font-size: 22px;
          font-weight: 600;
          margin: 0 0 15px 0;
        }
        
        /* Text styles */
        p {
          margin: 0 0 15px;
          font-size: 16px;
          color: #4a4a4a;
        }
        
        /* Lists */
        ul {
          padding-left: 20px;
          margin: 15px 0;
        }
        
        li {
          margin-bottom: 10px;
          color: #4a4a4a;
        }
        
        /* Chart containers */
        .chart-container {
          margin: 20px 0;
          text-align: center;
          background-color: #f9fbfe;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        .chart-container img {
          max-width: 100%;
          height: auto;
          border-radius: 6px;
        }
        
        .chart-caption {
          margin-top: 8px;
          font-size: 14px;
          color: #666;
          font-style: italic;
        }
        
        /* Highlight box */
        .highlight-box {
          background-color: #f0f7ff;
          border-left: 4px solid #0072ff;
          padding: 15px;
          margin: 20px 0;
          border-radius: 0 6px 6px 0;
        }
        
        /* Quote styling */
        .quote {
          background-color: #f7f9fc;
          padding: 20px;
          border-radius: 8px;
          font-style: italic;
          position: relative;
          margin: 25px 0;
        }
        
        .quote:before {
          content: '"';
          font-size: 60px;
          color: #0072ff;
          opacity: 0.2;
          position: absolute;
          top: -15px;
          left: 5px;
          font-family: Georgia, serif;
        }
        
        .quote p {
          margin: 0;
          padding-left: 20px;
          font-size: 17px;
          color: #555;
        }
        
        .quote-author {
          text-align: right;
          margin-top: 10px;
          font-weight: 500;
          color: #0056b3;
          font-style: normal;
        }
        
        /* Code styling */
        code {
          background-color: #f2f7ff;
          color: #0056b3;
          padding: 3px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
        }
        
        /* Button styling */
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #0072ff;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          margin: 15px 0;
          text-align: center;
        }
        
        /* Footer styling */
        .footer {
          background-color: #f0f7ff;
          padding: 25px 20px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        
        .footer p {
          margin: 5px 0;
          font-size: 14px;
        }
        
        .footer a {
          color: #0072ff;
          text-decoration: none;
        }
        
        .social-links {
          margin: 15px 0;
        }
        
        .social-links a {
          margin: 0 10px;
          color: #0072ff;
          text-decoration: none;
        }

        /* Emoji styling */
        .emoji {
          font-size: 18px;
          vertical-align: middle;
          line-height: 1;
        }
        
        /* Responsive adjustments */
        @media only screen and (max-width: 600px) {
          .container {
            width: 100%;
            border-radius: 0;
          }
          
          .content {
            padding: 20px 15px;
          }
          
          h2 {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>Zynapse</h1>
          <p>Your Weekly Tech Insights & Trends</p>
        </div>
        
        <!-- Content -->
        <div class="content">
          <!-- Intro Section -->
          <div class="section">
            <p>Hey tech enthusiasts! 👋</p>
            <p>Welcome to this week's edition of <strong>Zynapse</strong>. We've gathered the hottest trends, most engaging discussions, and key insights from across the tech landscape, all wrapped up in one beautiful newsletter. Let's dive in!</p>
          </div>
          
          <!-- Reddit Section -->
          <div class="section">
            <div class="section-header">
              <span class="section-icon">📱</span>
              <h2>Reddit Rundown: Tariffs & Tech</h2>
            </div>
            <p>Reddit's tech communities were buzzing about the potential impact of revived Trump tariffs on the tech industry. The conversation centered around financial implications, particularly for CEOs who previously backed Trump.</p>
            <div class="highlight-box">
              <p><strong>Hot Topic:</strong> Could we see iPhone prices soar as high as $2,300? That's what some analysts are predicting! 😱</p>
            </div>
            <p>Users also expressed concerns about budget cuts to Social Security and YouTube's recent policy changes that affect content creators.</p>
            
            <div class="chart-container">
              <img src="${chartReddit}" alt="Reddit Engagement Chart">
              <div class="chart-caption">Weekly Reddit engagement across top tech communities</div>
            </div>
          </div>
          
          <!-- GitHub Section -->
          <div class="section">
            <div class="section-header">
              <span class="section-icon">💻</span>
              <h2>GitHub Gems: Trending Repositories</h2>
            </div>
            <p>This week's GitHub landscape was dominated by some impressive repositories:</p>
            <ul>
              <li><code>antiwork/gumroad</code> - This repository is on fire with nearly 3,000 stars and 300+ forks in just one week! 🔥</li>
              <li><code>FareedKhan-dev/all-rl-algorithms</code> - A comprehensive collection of Reinforcement Learning algorithms gaining significant traction.</li>
              <li><code>hylarucoder/ai-flavor-remover</code> - An intriguing project designed to remove the telltale "AI flavor" from generated content.</li>
              <li><code>open-webui/mcpo</code> & <code>boku7/Loki</code> - Mystery projects that have captured the community's attention.</li>
            </ul>
            
            <div class="chart-container">
              <img src="${chartGitHub}" alt="GitHub Activity Chart">
              <div class="chart-caption">Repository stars and forks over the past week</div>
            </div>
          </div>
          
          <!-- Hacker News Section -->
          <div class="section">
            <div class="section-header">
              <span class="section-icon">🧠</span>
              <h2>Hacker News Highlights</h2>
            </div>
            <p>The Hacker News community gravitated toward these fascinating discussions:</p>
            <ul>
              <li>"The blissful Zen of a good side project" - Exploring the joy and benefits of personal coding endeavors</li>
              <li>"Understanding Machine Learning: From Theory to Algorithms" - Deep dive into ML fundamentals</li>
              <li>"OpenVertebrate Presents a Database of 13,000 3D Scans of Specimens" - An incredible resource for researchers</li>
              <li>An unexpected combination: Daft Punk and OCR pipeline technology</li>
            </ul>
            
            <div class="highlight-box">
              <p><strong>Actionable Insight:</strong> Carve out dedicated time for that side project you've been thinking about. The community agrees it's worth it!</p>
            </div>
          </div>
          
          <!-- Tech News Section -->
          <div class="section">
            <div class="section-header">
              <span class="section-icon">📰</span>
              <h2>Tech News Tidbits</h2>
            </div>
            <p>Here's what made headlines in tech this week:</p>
            <ul>
              <li>🚗 Driving apps are tracking user locations and habits - convenience or privacy concern?</li>
              <li>📲 iOS 18.4 quietly enhanced QR code functionality - an unsung hero of the latest update</li>
              <li>🏎️ Toyota is bidding farewell to the GR Supra MkV with a limited special edition</li>
              <li>🎨 Midjourney V7 has dropped, pushing AI image generation to new heights</li>
            </ul>
            
            <div class="chart-container">
              <img src="${chartTechNews}" alt="Tech News Chart">
              <div class="chart-caption">Most discussed tech news topics this week</div>
            </div>
          </div>
          
          <!-- Social Media Section -->
          <div class="section">
            <div class="section-header">
              <span class="section-icon">📢</span>
              <h2>Social Media Snippets</h2>
            </div>
            <p>The social media sphere this week reflected a fascinating blend of business trends and technological advancements. Discussions about decentralization through DAOs gained traction, alongside growing concerns about AI's influence on society.</p>
            <p>Notable collaborations like Blackwell 3D and Urban Aura Interiors showcased the power of strategic partnerships in the tech-meets-design space.</p>
          </div>
          
          <!-- Product Hunt Section -->
          <div class="section">
            <div class="section-header">
              <span class="section-icon">🚀</span>
              <h2>Product Hunt Power</h2>
            </div>
            <p>AI continues its dominance on Product Hunt, with these standout launches:</p>
            <ul>
              <li><strong>EZsite AI</strong> - Taking the crown this week with its revolutionary approach to AI-powered website building</li>
              <li><strong>Metabase Embedded Analytics</strong> - Making data visualization accessible to non-technical users</li>
            </ul>
          </div>
          
          <!-- Gadget Section -->
          <div class="section">
            <div class="section-header">
              <span class="section-icon">🎮</span>
              <h2>Gadget Gossip</h2>
            </div>
            <p>Two contrasting trends are emerging in the gadget world:</p>
            <p>NAS devices are evolving beyond simple storage solutions to become full-fledged smart home hubs, integrating with IoT devices and offering expanded functionality.</p>
            <p>Meanwhile, in a surprising twist, film cameras are experiencing a renaissance among digital content editors - a perfect blend of vintage aesthetic and modern creativity!</p>
            
            <div class="chart-container">
              <img src="${chartGadgetGossip}" alt="Gadget Gossip Chart">
              <div class="chart-caption">Trending gadgets and consumer tech interests</div>
            </div>
          </div>
          
          <!-- Quote Section -->
          <div class="section">
            <div class="quote">
              <p>"The best way to predict the future is to create it."</p>
              <div class="quote-author">- Peter Drucker</div>
            </div>
          </div>
          
          <!-- Closing -->
          <div class="section">
            <p>That's all for this week's tech roundup! Stay curious, keep exploring, and we'll be back next week with more insights from the ever-evolving world of technology.</p>
            <p>Until next time,<br>The Zynapse Team</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p>You're receiving this newsletter because you subscribed to  updates.</p>
          <div class="social-links">Zynapse
            <a href="https://twitter.com/techpulse">Twitter</a> • 
            <a href="https://linkedin.com/company/techpulse">LinkedIn</a> • 
            <a href="https://instagram.com/techpulse">Instagram</a>
          </div>
          <p><a href="https://example.com/unsubscribe">Unsubscribe</a> | <a href="https://example.com/preferences">Manage Preferences</a></p>
        </div>
      </div>
    </body>
  </html>
  `;

  // Retrieve newsletter subscribers
  const subscribers = await prisma.newsletterSubscription.findMany();
  if (!subscribers.length) {
    console.log('No subscribers found.');
    return;
  }

  // Set up the Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  // Loop through subscribers and send the email
  for (const sub of subscribers) {
    try {
      const info = await transporter.sendMail({
        from: `"Zynapse" <${process.env.GMAIL_USER}>`,
        subject: 'Your Weekly Tech Trends & Insights',
        to: sub.email,
        html: newsletterContent,
      });
      console.log(`Email sent to ${sub.email}: ${info.messageId}`);
    } catch (error) {
      console.error(`Failed to send email to ${sub.email}:`, error);
    }
    // Small delay to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

sendWeeklyReportEmail().catch(console.error);