# Tech Trends Dashboard 🚀

An interactive, AI-powered dashboard providing real-time insights into tech trends, community discussions, and social media buzz, complemented by automated personalized weekly newsletters.
<video controls src="WhatsApp Video 2025-03-26 at 15.10.05_cdf1d18b.mp4" title="Title"></video>
---

## Overview 📌

This project aggregates trending data from various platforms, including **HackerNews, GitHub, Twitter, Mastodon, Reddit, Stack Overflow, ProductHunt,** and **NewsAPI**, to deliver a unified, real-time visualization of what's trending in tech. The dashboard is powered by advanced AI capabilities using Cohere, Gemini, and semantic vector search (via Pinecone).

---

## Features ✨

### Interactive Dashboard
- **Summary Metrics:** Instantly view total trending posts, active discussions, GitHub repositories, and popular queries.
- **Reddit & GitHub Insights:** Track engaging topics, trending repositories, language popularity, and active contributions.
- **Stack Overflow Trends:** See popular questions, best answers, and unanswered queries, organized by technology and topic.
- **Social Media Buzz:** Aggregated trending hashtags and posts from Twitter and Mastodon.
- **Meme Trends:** User-driven meme curation from popular social media.

### AI Chatbot Integration
- Queries resolved using vector embeddings (Cohere + Pinecone) and Gemini LLM.
- Fallback to Google and YouTube searches when needed.
- Enhanced with Chain-of-Thought prompting for superior response accuracy.

### Customization & Accessibility
- Comprehensive filtering (time, source, popularity, geography).
- Multi-language support, text-to-speech, and accessibility-first design.

### Automated Newsletters
- Weekly insights and tech highlights delivered automatically every Monday.
- AI-generated detailed summaries with Gemini API.
- Reliable newsletter dispatch via Nodemailer.

### Real-time Analytics & Visualizations
- Interactive visual graphs and heatmaps.
- Visual sentiment analysis and mood-based content filters.

---

## Tech Stack ⚙️

### Frontend
- **Next.js (TypeScript)**: Seamless UX/UI and server-side rendering.
- **Tailwind CSS & Framer Motion**: Visually appealing, animated interfaces.
- **Recharts/Chart.js**: Interactive visualizations.

### Backend & Database
- **Prisma**: Efficient ORM and structured database management.
- **Redis**: Fast caching for enhanced performance.
- **Pinecone Vector DB**: Efficient semantic vector search.

### AI & Automation
- **Gemini API**: LLM for chatbot interactions and newsletter content.
- **Cohere API**: Embedding generation for vector database.

### Scheduling & Mailing
- **Cron Jobs (Vercel)**: Automated daily data fetching (2:00 AM) and newsletter dispatch (Monday 6:00 AM).
- **Nodemailer**: Automated email newsletter delivery.

### External APIs
- HackerNews, GitHub, Twitter, Mastodon, Reddit, Stack Overflow, ProductHunt, NewsAPI, Google API, YouTube API.

---

## Workflow 🔄

### Data Collection
- **Cron Jobs** trigger daily API fetches and weekly newsletters.
- Data stored in Prisma, cached in Redis.

### Vector Embeddings
- Important data processed into embeddings using Cohere.
- Embeddings stored in Pinecone Vector DB for quick semantic retrieval.

### AI Chatbot
- Users interact directly from the dashboard.
- Answers generated via semantic retrieval or fallback web search.

### Weekly Newsletter
- Gemini-powered, AI-generated personalized summaries.
- Nodemailer automation for reliable delivery.

---

## How to Run Locally 🚧

Clone the repository:

```bash
git clone <repo-url>
cd tech-dashboard
```

Install dependencies:

```bash
npm install
```

Set environment variables:

Create `.env` from `.env.example` and set:

- Prisma, Redis, Pinecone credentials.
- Gemini, Cohere, Google, YouTube, NewsAPI keys.

Start the development server:

```bash
npm run dev
```

---

## Deployment 🚀

Easily deployable via platforms like **Vercel**, leveraging built-in serverless and cron job scheduling features.

---

## Documentation 📚

- Comprehensive guides and documentation included in `/docs`.
- API specifications and database schemas provided.


---

## License 📄

This project is licensed under MIT. See the `LICENSE` file for details.

---

## What's Unique 🌟

- Multi-source aggregation for holistic trend analysis.
- Automated AI-driven newsletters tailored to personal interests.
- Enhanced accessibility and multi-language support.
- Active community engagement through interactive meme trends.

---

Happy Exploring! 🎉

