// app/for-you/page.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

// A simple fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ForYouPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Always call useSWR unconditionally
  const { data, error } = useSWR("/api/for-you", fetcher);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Conditional rendering based on session and data
  if (status === "loading" || !session) {
    return <div className="p-4">Loading your session...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error loading recommendations.</div>;
  }
  if (!data) {
    return <div className="p-4">Loading recommendations...</div>;
  }

  // Assume your API returns an object with a "recommendations" array
  const recommendations = data.recommendations || [];

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

      {recommendations.length === 0 ? (
        <p>No recommendations available at the moment. Please check back later.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recommendations.map((item: any) => (
            <div
              key={item.id}
              className="border rounded-lg shadow p-4 hover:shadow-lg transition duration-200"
            >
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
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
                className="text-blue-600 hover:underline"
              >
                Read more
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
