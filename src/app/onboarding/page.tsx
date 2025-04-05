"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const OnboardingPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [interests, setInterests] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [contentTypes, setContentTypes] = useState<string[]>([]);

  const handleSubmit = async () => {
    await fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interests, sources, contentTypes }),
    });

    router.push("/dashboard"); // send them to their home 🏠
  };

  if (!session) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧠 Personalize Your Feed</h1>

      <Section
        label="Topics You’re Into"
        options={["AI", "Startups", "Productivity", "Crypto", "Web Dev"]}
        selected={interests}
        setSelected={setInterests}
      />

      <Section
        label="Preferred Platforms"
        options={["Reddit", "GitHub", "HackerNews", "StackOverflow"]}
        selected={sources}
        setSelected={setSources}
      />

      <Section
        label="Content Type"
        options={["Articles", "Videos", "Memes", "Tech News", "Products"]}
        selected={contentTypes}
        setSelected={setContentTypes}
      />

      <button
        className="mt-6 bg-black text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Continue →
      </button>
    </div>
  );
};

const Section = ({
  label,
  options,
  selected,
  setSelected,
}: {
  label: string;
  options: string[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}) => (
  <div className="mb-6">
    <h2 className="text-lg font-semibold mb-2">{label}</h2>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          className={`px-3 py-1 rounded-full border ${
            selected.includes(opt)
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() =>
            setSelected((prev) =>
              prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
            )
          }
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export default OnboardingPage;
