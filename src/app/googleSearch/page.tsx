"use client";

import React, { useEffect } from "react";

export default function GoogleSearchPage() {
  useEffect(() => {
    // 1. Create the script element
    const cseScript = document.createElement("script");
    cseScript.async = true;
    cseScript.src = "https://cse.google.com/cse.js?cx=12a80722d0109406b"; 
    // The 'cx' parameter should match your Google CSE ID.

    // 2. Append to <body> or <head>
    document.body.appendChild(cseScript);

    // Optional cleanup if desired
    return () => {
      // Remove the script if the component unmounts
      document.body.removeChild(cseScript);
    };
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl mb-4">My Google Custom Search</h1>
      {/* This div is where Google injects the search box and results. */}
      <div className="gcse-search"></div>
    </main>
  );
}
