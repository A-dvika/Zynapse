# 🚀 TechTrends Dashboard

TechTrends Dashboard is an interactive platform that aggregates and analyzes real-time data from popular tech platforms like Hackernews, GitHub, Twitter, Mastodon, Reddit, Stack Overflow, and ProductHunt. Stay informed about the latest trends and receive AI-generated weekly newsletters directly in your inbox!

---

## 🌟 Features

- **Real-Time Data Aggregation:** Fetch data daily from multiple tech platforms using automated cron jobs.
- **AI-Powered Insights:** Generate key insights using Cohere API embeddings and Gemini API for summaries.
- **Interactive Dashboard:** Visualize trends, stats, and sentiments with clear, interactive graphs.
- **AI Chatbot:** Get instant answers powered by vector search and fallback web search via Gemini.
- **Weekly Newsletters:** Receive personalized AI-generated newsletters every Monday at 6 AM.
- **Explain Section:** Generate AI-based summaries to get a quick overview of what's trending.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (TypeScript) for a seamless user experience.
- **Backend:** FastAPI for API endpoints and logic.
- **Database:** Prisma (PostgreSQL) for data storage.
- **Caching:** Redis for fast data retrieval.
- **AI & Embeddings:** Cohere API for vector generation.
- **Vector Database:** Pinecone for semantic search.
- **LLM:** Gemini API for chatbot responses and newsletters.
- **Scheduler:** Vercel Cron Jobs for automated tasks.
- **Email Delivery:** Nodemailer for sending newsletters.

---

## ⚙️ Project Architecture

The architecture includes several components working together to provide insights and summaries.

- **Data Collection:** Daily cron jobs at 2 AM fetch data from external APIs.
- **Data Processing:** Processed and stored in the Prisma database.
- **Embedding Generation:** Cohere API creates vector embeddings stored in Pinecone for semantic search.
- **AI Chatbot:** Answers queries using Gemini API and falls back on Google/YouTube if needed.
- **Newsletter Generation:** Weekly newsletters are generated using chain-of-thought prompting and sent via Nodemailer.

---

## 📦 Installation

Follow these steps to set up the project locally:

```bash
# Clone the repository
git clone git@github.com:WiSEdestined/Dash.git
cd TechTrends-Dashboard

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

---

## 🚀 Usage

1. Access the dashboard at `http://localhost:3000`.
2. Explore real-time data visualizations.
3. Chat with the AI-powered chatbot for tech insights.
4. Subscribe to weekly newsletters.

---

## 🧑‍💻 Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repo.
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add a new feature'`
4. Push to the branch: `git push origin feature-name`
5. Create a pull request.


Stay updated with the latest in tech using **TechTrends Dashboard**! 🚀

