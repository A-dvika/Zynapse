# Personalized Recommendation Engine Architecture

This document provides a comprehensive overview of the personalized recommendation engine built to serve tailored content to users based on their preferences, behavior, and interaction history. It outlines the flow, components, and design rationale behind the architecture.

---

## 1. Overview

The engine serves dynamic, real-time personalized content recommendations to users across a variety of platforms (GitHub, Reddit, HackerNews, ProductHunt, etc.). It's designed for:

- Scalability with future machine learning models.
- Immediate personalization using embeddings and vector search.
- Fast response via caching.
- Continuous learning from user behavior.

---

## 2. Core Technologies

- **Next.js + API Routes** – SSR/ISR support and API layer.
- **Prisma ORM** – for database access and manipulation.
- **PostgreSQL** – primary relational data store.
- **Pinecone** – vector database for high-speed semantic search.
- **Cohere** – for generating user and content embeddings.
- **Gemini (Google)** – for generating summaries and inferred tags.
- **Redis** – caching layer for personalized recommendation queries.
- **Vercel Cron Jobs** – for scheduled background jobs.

---

## 3. Data Flow

### A. Real-time Flow (User Visits Dashboard)

1. **User hits `/dashboard`** → Triggers call to `/api/for-you`.
2. **Redis Cache Check**
   - Key format: `for-you:<userId>:<source>:<type>:<topK>:<discover>`
   - If hit → return cached results.
   - If miss → proceed to next steps.
3. **Fetch Preferences** from `UserPreferences` via Prisma.
4. **Smart User Profile Summary** is generated using Gemini with interests, sources, and content types.
5. **Generate User Embedding** using Cohere.
6. **Query Pinecone** for top `K` relevant matches using filters (source, type, etc.).
7. **Re-rank results**:
   - Tag overlap with preferences adds 0.01 to the score per match.
   - Score × 100 → Relevance % (rounded).
8. **Discover Mode**: Filters for relevance < 40% for exploration.
9. **Return final list** (sorted), save to Redis for 1 hour.

### B. Scheduled Jobs

1. **Content Sync Cron (Daily)**
   - Pulls new items from each source table into a unified `Content` table.
   - Enhances with Gemini for summaries & tags.
   - Embeds content via Cohere and upserts to Pinecone.

2. **User Preference Update Cron (e.g. hourly)**
   - Reads recent `UserHistory` actions.
   - Recalculates weighted scores per tag.
   - Updates `UserPreferences` based on action weights.

---

## 4. Preference Calculation Logic

Preferences are updated dynamically using a heuristic approach based on `UserHistory`. This avoids complex ML until enough data is available.

### Action Weights

| Action   | Weight |
|----------|--------|
| like     | +3     |
| save     | +4     |
| view     | +1     |
| share    | +2     |
| dismiss  | -5     |

### Tag Scoring
- Each action contributes to associated content tags.
- Tags are aggregated and sorted by total weighted score.
- Top `N` tags (e.g., 10) become new preferences.

### Preference Types Updated
- `interests` → based on tags.
- `sources` → derived from content source.
- `contentTypes` → derived from content type field.

---

## 5. Caching Architecture

### Redis Caching
- Reduces latency by avoiding repeat Pinecone queries.
- Keyed on: userId + query parameters.
- TTL: 1 hour.
- Invalidation: happens on preference update or daily flush.

### Example Redis Flow:
- `/api/for-you?source=github&type=repo`
- Redis key: `for-you:123:github:repo:30:0`
- If result found → serve immediately.
- If not → generate via pipeline and cache.

---

## 6. Content Representation in Pinecone

Each content is vectorized with:
- Summary (title + Gemini enhancement).
- Tags (original + Gemini-inferred).
- Metadata:
  - `id`, `url`, `title`, `tags`, `type`, `source`, `summary`, `relevanceScore`

Stored in Pinecone using `index2.upsert()`.

---

## 7. Scalability Path to ML

This heuristic system is designed to evolve:

- **Phase 1 (Now)**: Rule-based, light-weight personalization.
- **Phase 2**: Use embeddings of user interactions over time to cluster users or recommend via k-NN.
- **Phase 3**: Train a supervised model on past UserHistory to predict clicks/likes.

---

## 8. Monitoring & Observability

- Console logs on cache hit/miss, Pinecone queries.
- Prisma logs errors and query stats.
- Cron job output monitored via Vercel dashboard.

---

## 9. Future Improvements

- Add A/B testing for ranking strategies.
- Add metrics dashboard (cache hit ratio, CTR, etc.).
- Add fallback if embedding API fails.
- Support multilingual embeddings.

---

