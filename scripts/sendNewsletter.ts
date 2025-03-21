import nodemailer from 'nodemailer';
import prisma from '../lib/db';

async function sendNewsletter() {
  // Fetch all subscribers from your database
  const subscribers = await prisma.newsletterSubscription.findMany();
  if (!subscribers.length) {
    console.log('No subscribers found.');
    return;
  }

  // Set up the Nodemailer transporter using Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER as string,
      pass: process.env.GMAIL_PASS as string,
    },
  });

  // Loop through subscribers and send an email
  for (const sub of subscribers) {
    try {
      const info = await transporter.sendMail({
        from: `"Tech Newsletter" <${process.env.GMAIL_USER}>`,
        to: sub.email,
        subject: 'Your Tech Newsletter Update',
        text: `Hello ${sub.name || 'Subscriber'}, here is your latest tech trends update...`,
        html: `<h3>Hello ${sub.name || 'Subscriber'}</h3><p>Here is your latest tech trends update...</p>`,
      });
      console.log(`Email sent to ${sub.email}: ${info.messageId}`);
    } catch (error) {
      console.error(`Failed to send email to ${sub.email}:`, error);
    }
    // Optional: add a delay if needed
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

sendNewsletter().catch(console.error);
