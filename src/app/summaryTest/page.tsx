"use client";

import React, { useState } from "react";

export default function SummaryTestPage() {
  const [card, setCard] = useState("reddit");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    setLoading(true);
    setSummary("");
    setError("");

    try {
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch summary.");
      }
      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
      setError("Error fetching summary.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Test Summaries</h1>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="card-select" style={{ marginRight: "0.5rem" }}>
          Choose Card Type:
        </label>
        <select
          id="card-select"
          value={card}
          onChange={(e) => setCard(e.target.value)}
          style={{ marginRight: "1rem" }}
        >
          <option value="reddit">Reddit</option>
          <option value="github">GitHub</option>
          <option value="stackoverflow">StackOverflow</option>
        </select>
        <button onClick={fetchSummary} disabled={loading}>
          {loading ? "Loading..." : "Get Summary"}
        </button>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {summary && (
        <div>
          <h2>Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
