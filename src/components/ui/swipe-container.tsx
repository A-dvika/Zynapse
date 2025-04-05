"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SwipeCard } from "./swipe-card";
import { Button } from "./button";
import { ArrowRight } from "lucide-react";

interface SwipeContainerProps {
  items: {
    id: string;
    title: string;
    description?: string;
    category: string;
  }[];
  onComplete: (selectedItems: string[]) => void;
}

export function SwipeContainer({ items, onComplete }: SwipeContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const handleSwipe = (direction: "left" | "right") => {
    setDirection(direction);
    if (direction === "right") {
      setSelectedItems((prev) => [...prev, items[currentIndex].id]);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (currentIndex >= items.length) {
      onComplete(selectedItems);
    }
  }, [currentIndex, items.length, onComplete, selectedItems]);

  return (
    <div className="relative w-full max-w-md mx-auto h-[500px]">
      <AnimatePresence>
        {currentIndex < items.length && (
          <SwipeCard
            key={items[currentIndex].id}
            item={items[currentIndex]}
            onSwipe={handleSwipe}
            isLast={currentIndex === items.length - 1}
          />
        )}
      </AnimatePresence>
      {currentIndex >= items.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-4 text-neondark-text">All Done! 🎉</h3>
          <p className="text-neondark-muted mb-6">
            We've saved your preferences. Let's get started!
          </p>
          <Button
            className="bg-cyan-500 text-black hover:bg-cyan-400"
            onClick={() => onComplete(selectedItems)}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
} 