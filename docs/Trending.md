# 📊 Trending System Documentation

## Overview
This document outlines the architecture and mathematical formulation behind our **growth-based trending system**, which is designed to surface rapidly emerging and engaging content to users in real time. Our approach uniquely balances **momentum**, **recency**, and **total engagement**, ensuring that both new and high-performing content can trend fairly.

---

## ✅ Why Trending Matters
Trending systems help:
- Highlight **fresh** and **relevant** content.
- Encourage creators by giving **early boosts** to fast-growing posts.
- Keep the user experience **dynamic and engaging**.

Unlike static engagement sorting (e.g., just by likes), our model is built to **detect surges** and **accelerating interest**, much like how real conversations evolve.

---

## 🔬 Mathematical Model

Let:
- \( E_t \): Engagement in current time window (e.g., 6 hrs)
- \( E_{t-1} \): Engagement in previous window
- \( E_{\text{total}} \): Total cumulative engagement
- \( T \): Time since published (in hours)
- \( \alpha, \beta, \gamma \): Tunable weights

### Trending Score:
\[
\text{TrendingScore} = \alpha (E_t - E_{t-1}) + \beta \cdot E_{\text{total}} \cdot \frac{1}{(T + 2)^\gamma}
\]

### Interpretation:
- \( E_t - E_{t-1} \): Captures momentum
- \( E_{\text{total}} \): Rewards high overall engagement
- \( \frac{1}{(T + 2)^\gamma} \): Penalizes older content

> **Note**: This formulation allows content that is growing quickly to rise rapidly, while older content with sustained engagement still holds value.

---

## 🧠 Why This Approach Works
- **Balances growth & legacy**: Captures real-time surges without ignoring evergreen content.
- **Simple yet effective**: Tunable via three intuitive parameters.
- **Fair exposure**: New posts aren't buried by older viral ones.

This approach is particularly well-suited for platforms with rapidly evolving user interest, such as:
- Developer dashboards
- Tech news feeds
- Aggregated trend analytics

---

## 📚 References: How Other Platforms Rank Trends

### 1. **Twitter (now X)** — Real-time trends
- Mix of tweet volume and acceleration
- Geo-targeted and personalized

### 2. **Reddit Hot Algorithm**
\[
\text{Score} = \log_{10} (upvotes - downvotes) + \frac{t - t_0}{45000}
\]
- Combines score and age
- Promotes recency and engagement balance

### 3. **Hacker News**
\[
\text{RankingScore} = \frac{(points - 1)}{(time + 2)^{1.8}}
\]
- Classic decay-based model
- Newer content has advantage with early traction

### 4. **YouTube / TikTok**
- Proprietary models, but involve:
  - Watch time
  - CTR
  - Engagement rate per unit time
  - Viewer retention curves

---

## 🧪 Future Extensions
- Incorporate **user personalization vectors** (via embeddings)
- Adjust weights dynamically based on category or source
- A/B test impact on CTR and retention

---

## 🔁 Conclusion
Our trending score system is a forward-thinking method rooted in both academic precedent and real-world platform strategies. It ensures fairness, dynamism, and scalability as our user base grows.

For implementation references or integration help, reach out to the data team or visit our [trending service docs].

