import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import clsx from "clsx";

interface ScrollItem {
  address: string;
  multiplier: string;
  emoji: string;
  color: string;
}

interface ScrollProps {
  items?: ScrollItem[];
  className?: string;
  speed?: number;
  height?: number;
  autoPlay?: boolean;
}

const defaultItems: ScrollItem[] = [
  {
    address: "0x88...674e",
    multiplier: "110x",
    emoji: "💰",
    color: "text-cyan-400"
  },
  {
    address: "0x50...235b",
    multiplier: "800x",
    emoji: "🚀",
    color: "text-pink-400"
  },
  {
    address: "0x12...abcd",
    multiplier: "250x",
    emoji: "🎯",
    color: "text-green-400"
  },
  {
    address: "0x34...efgh",
    multiplier: "500x",
    emoji: "⭐",
    color: "text-yellow-400"
  },
  {
    address: "0x56...ijkl",
    multiplier: "150x",
    emoji: "🎉",
    color: "text-purple-400"
  }
];

export default function Scroll({
  items = defaultItems,
  className = "",
  speed = 120,
  height = 40,
  autoPlay = true
}: ScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(!autoPlay);
  const controls = useAnimationControls();

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    const totalWidth = items.length * 300;
    setContentWidth(totalWidth);
  }, [items]);

  const duration = contentWidth / speed;

  const startAnimation = useCallback(() => {
    if (!isPaused) {
      controls.start({
        x: [0, -contentWidth],
        transition: {
          duration,
          ease: "linear",
          repeat: Infinity
        }
      });
    }
  }, [controls, contentWidth, duration, isPaused]);

  useEffect(() => {
    if (autoPlay && !isPaused) {
      startAnimation();
    }
  }, [autoPlay, isPaused, startAnimation]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative overflow-hidden font-[DelaGothicOne] -rotate-3",
        "shadow-[0_0_10px_rgba(168,85,247,0.3)]",
        className
      )}
      style={{ height: `${height}px` }}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#5537FF] " />

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#5537FF] " />

      <motion.div
        className="flex items-center gap-8 px-4 whitespace-nowrap"
        animate={controls}
        style={{
          width: contentWidth * 2
        }}
      >
        {items.map((item, index) => (
          <div
            key={`first-${index}`}
            className="flex items-center gap-3 text-white transition-transform duration-200"
          >
            <span
              className="text-[20px] text-black px-2 py-1 rounded"
              style={{ WebkitTextStroke: "1px white", color: "black" }}
            >
              {item.address} Won
            </span>
            <span
              className={clsx("text-lg font-bold drop-shadow-lg", item.color)}
            >
              {item.multiplier}
            </span>
            <span className="text-xl drop-shadow-lg">{item.emoji}</span>
          </div>
        ))}

        {items.map((item, index) => (
          <div
            key={`second-${index}`}
            className="flex items-center gap-3 text-white transition-transform duration-200 hover:scale-105"
          >
            <span
              className="text-[20px] text-black px-2 py-1 rounded"
              style={{ WebkitTextStroke: "1px white", color: "black" }}
            >
              {item.address} Won
            </span>
            <span
              className={clsx("text-lg font-bold drop-shadow-lg", item.color)}
            >
              {item.multiplier}
            </span>
            <span className="text-xl drop-shadow-lg">{item.emoji}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
