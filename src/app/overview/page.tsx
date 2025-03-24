'use client';

import { useEffect, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

type Article = {
  title: string;
  description: string;
  urlToImage: string;
};

export default function HomePage() {
  const [gadgets, setGadgets] = useState<Article[]>([]);
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
  });

  // Auto scroll every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (slider.current) {
        slider.current.next();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [slider]);

  useEffect(() => {
    const fetchGadgets = async () => {
      const res = await fetch('/api/gadgets');
      const data = await res.json();
      setGadgets(data);
    };
    fetchGadgets();
  }, []);

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white p-6">
      <div className="flex gap-6">
        {/* Left - Gadget Carousel (restored style) */}
        <div className="w-[700px] h-[420px] rounded-3xl bg-gradient-to-tr from-[#1f1f1f] to-[#2e2e2e] shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Latest Gadgets</h2>
          <div ref={sliderRef} className="keen-slider rounded-xl overflow-hidden h-full">
            {gadgets.map((item, idx) => (
              <div
                key={idx}
                className="keen-slider__slide bg-[#1a1a1a] h-full p-4 rounded-xl border border-gray-800 flex flex-col"
              >
                {item.urlToImage && (
                  <img
                    src={item.urlToImage}
                    alt={item.title}
                    className="w-full h-[180px] object-cover rounded-lg mb-3"
                  />
                )}
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-5">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Subscriptions & Visitors */}
        <div className="flex flex-col gap-4 w-[280px]">
          {/* Subscription card */}
          <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Zynapse Pro</h3>
              <span className="bg-green-500 text-xs text-black px-2 py-0.5 rounded-full">Active</span>
            </div>
            <p className="text-sm text-gray-400">Next billing: <span className="text-white font-medium">$4.99 / month</span></p>
            <button className="mt-3 w-full text-sm font-medium bg-white text-black py-1.5 rounded-xl">Manage</button>
          </div>

          {/* Visitors count card */}
          <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800 shadow-md text-center">
            <h3 className="text-lg font-semibold mb-1">Visitors</h3>
            <p className="text-4xl font-bold text-green-400">8,421</p>
            <p className="text-xs text-gray-400 mt-1">in the last 7 days</p>
          </div>
        </div>
      </div>
    </main>
  );
}
