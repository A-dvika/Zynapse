// utils/trackBehavior.ts
export async function trackUserAction(contentId: string, action: string) {
    await fetch("/api/track", {
      method: "POST",
      body: JSON.stringify({ contentId, action }),
      headers: { "Content-Type": "application/json" },
    });
  }
  