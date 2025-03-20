"use client";

import React, { useState, useEffect } from "react";

export default function MemeCarouselPage() {
  const [memes, setMemes] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMemes() {
      try {
        const response = await fetch("/api/memes");
        if (!response.ok) {
          throw new Error("Failed to fetch memes");
        }
        const data = await response.json();
        setMemes(data.memes);
      } catch (error) {
        console.error("Error fetching memes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMemes();
  }, []);

  const nextMeme = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === memes.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevMeme = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? memes.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Loading memes...</div>;
  }

  if (!memes || memes.length === 0) {
    return <div style={{ textAlign: "center", padding: "20px" }}>No memes found.</div>;
  }

  const currentMeme = memes[currentIndex];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <h1>Meme Carousel</h1>
      <div style={{ margin: "auto", width: "80%", maxWidth: "600px", position: "relative" }}>
        <img
          src={currentMeme.imageUrl}
          alt={currentMeme.title || "Meme"}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "8px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          }}
        />
        {currentMeme.title && <h2>{currentMeme.title}</h2>}
        {currentMeme.caption && <p>{currentMeme.caption}</p>}
        <p>
          <strong>Platform:</strong> {currentMeme.platform}
        </p>
        <p>
          <strong>Upvotes/Likes:</strong> {currentMeme.upvotes}
        </p>
        <p>
          <a
            href={currentMeme.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0070f3", textDecoration: "none" }}
          >
            View on Source
          </a>
        </p>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={prevMeme} style={{ marginRight: "10px", padding: "8px 16px" }}>
          Previous
        </button>
        <button onClick={nextMeme} style={{ padding: "8px 16px" }}>
          Next
        </button>
      </div>
    </div>
  );
}
