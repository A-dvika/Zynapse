"use client";

import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import { Card } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { ThumbsUp, ThumbsDown, ArrowRight } from "lucide-react";

interface SwipeCardProps {
  item: {
    id: string;
    title: string;
    description?: string;
    category: string;
  };
  onSwipe: (direction: "left" | "right") => void;
  isLast: boolean;
}

export function SwipeCard({ item, onSwipe, isLast }: SwipeCardProps) {
  const [exitX, setExitX] = useState<number>(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  const controls = useAnimation();

  const handleDragEnd = async (event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 500) {
      setExitX(200);
      onSwipe("right");
    } else if (offset < -100 || velocity < -500) {
      setExitX(-200);
      onSwipe("left");
    } else {
      await controls.start({ x: 0, rotate: 0, opacity: 1 });
    }
  };

  return (
    <motion.div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        x,
        rotate,
        opacity,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="touch-none"
    >
      <Card className="w-full h-full bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
        <div className="p-6 h-full flex flex-col">
          <Badge className="w-fit mb-4 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
            {item.category}
          </Badge>
          <h3 className="text-2xl font-bold mb-2 text-neondark-text">{item.title}</h3>
          {item.description && (
            <p className="text-neondark-muted mb-6">{item.description}</p>
          )}
          <div className="mt-auto flex justify-between items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-red-500/50 text-red-500 hover:bg-red-500/10"
              onClick={() => {
                setExitX(-200);
                onSwipe("left");
              }}
            >
              <ThumbsDown className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-green-500/50 text-green-500 hover:bg-green-500/10"
              onClick={() => {
                setExitX(200);
                onSwipe("right");
              }}
            >
              <ThumbsUp className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
} 