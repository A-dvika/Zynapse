"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { trackUserAction } from "@/utils/trackBehavior";

// A simple fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ForYouPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch recommendations from the API
  const { data, error } = useSWR("/api/for-you", fetcher);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || !session) {
    return <div className="p-4">Loading your session...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error loading recommendations.</div>;
  }
  if (!data) {
    return <div className="p-4">Loading recommendations...</div>;
  }

  const preferred = data.preferred || [];
  const recommended = data.recommended || [];

  // This function checks if the clicked item is outside the user's preferences
  async function handleContentClick(item: any) {
    // Fetch user preferences from the API
    const res = await fetch("/api/user-preferences");
    const prefs = await res.json();

    const userInterests = prefs?.interests || [];
    const userSources = prefs?.sources || [];

    // For items from discovery section, check if the item is outside the user's usual interests or sources
    const isOutsidePreference =
      !userInterests.some((tag: string) => item.tags?.includes(tag)) &&
      !userSources.includes(item.source);

    if (isOutsidePreference) {
      await trackUserAction(item.id, "clicked");
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Recommended for You</h1>
        {session?.user && (
          <p className="mt-2 text-lg">
            Hello, {session.user.name || session.user.email}! Here are some content recommendations based on your preferences.
          </p>
        )}
      </header>

      {/* Preferred Content Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Your Preferred Content</h2>
        {preferred.length === 0 ? (
          <p>No preferred content available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {preferred.map((item: any) => (
              <div
                key={item.id}
                className="border rounded-lg shadow p-4 hover:shadow-lg transition duration-200"
              >
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                {item.summary && (
                  <p className="text-sm text-gray-800 mb-4">{item.summary}</p>
                )}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleContentClick(item)}
                  className="text-blue-600 hover:underline"
                >
                  Read more
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Discovery Recommendations Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Discover New Content</h2>
        {recommended.length === 0 ? (
          <p>No new recommendations available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recommended.map((item: any) => (
              <div
                key={item.id}
                className="border rounded-lg shadow p-4 hover:shadow-lg transition duration-200"
              >
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                {item.source && (
                  <p className="text-sm text-gray-600 mb-2">Source: {item.source}</p>
                )}
                {item.summary && (
                  <p className="text-sm text-gray-800 mb-4">{item.summary}</p>
                )}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleContentClick(item)}
                  className="text-blue-600 hover:underline"
                >
                  Read more
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
