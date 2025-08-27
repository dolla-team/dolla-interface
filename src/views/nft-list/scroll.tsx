import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import clsx from "clsx";
import axiosInstance from "@/libs/axios";
import { formatAddress } from "@/utils/format/address";
import Big from "big.js";

interface ScrollProps {
  className?: string;
  speed?: number;
  height?: number;
  autoPlay?: boolean;
}

const config: any[] = [
  {
    emoji: "💰",
    color: "text-cyan-400"
  },
  {
    emoji: "🚀",
    color: "text-pink-400"
  },
  {
    emoji: "🎯",
    color: "text-green-400"
  },
  {
    emoji: "⭐",
    color: "text-yellow-400"
  },
  {
    emoji: "🎉",
    color: "text-purple-400"
  }
];

export default function Scroll({
  className = "",
  speed = 120,
  height = 40,
  autoPlay = true
}: ScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(!autoPlay);
  const [data, setData] = useState<any[]>([]);
  const controls = useAnimationControls();

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    const totalWidth = data.length * 300;
    setContentWidth(totalWidth);
  }, [data]);

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

    const getData = async () => {
      const res = await axiosInstance.get(
        "/api/v1/pool/winner/bid/recommend?chain=Berachain"
      );
      setData(res.data.data);
    };

    getData();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    !!data.length && (
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
          {data.map((item, index) => (
            <Item item={item} key={`first-${index}`} index={index} />
          ))}
          {data.map((item, index) => (
            <Item item={item} key={`second-${index}`} index={index} />
          ))}
        </motion.div>
      </div>
    )
  );
}

const Item = ({ item }: { item: any; index: number }) => {
  const randomIndex = Math.floor(Math.random() * config.length);
  return (
    <div className="flex items-center gap-3 text-white transition-transform duration-200 hover:scale-105">
      <span
        className="text-[20px] text-black px-2 py-1 rounded"
        style={{ WebkitTextStroke: "1px white", color: "black" }}
      >
        {item.pool_info?.winner_user_email ||
          formatAddress(item.pool_info.winner_user)}{" "}
        Won
      </span>
      <span
        className={clsx(
          "text-lg font-bold drop-shadow-lg",
          config[randomIndex].color
        )}
      >
        {Big(item.reward_token_price?.[0]?.last_price).toFixed(0)}x
      </span>
      <span className="text-xl drop-shadow-lg">
        {config[randomIndex].emoji}
      </span>
    </div>
  );
};
