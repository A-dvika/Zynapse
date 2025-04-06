// utils/logHistory.ts
export const logUserAction = async (contentId: string, action: string) => {
    try {
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId, action }),
      });
    } catch (error) {
      console.warn("Failed to log user action", error);
    }
  };
  