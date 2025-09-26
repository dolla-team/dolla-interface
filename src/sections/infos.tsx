import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import clsx from "clsx";
import axiosInstance from "@/libs/axios";
import { formatAddress } from "@/utils/format/address";
import Big from "big.js";
import { getAnchorPrice } from "@/utils/pool";
import useWalletStore from "@/stores/use-wallet";
import { BASE_TOKEN } from "@/config/btc";

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

export default function Infos({
  className = "",
  speed = 120,
  height = 36,
  autoPlay = true
}: ScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(!autoPlay);
  const [data, setData] = useState<any[]>([]);
  const walletStore = useWalletStore();
  const controls = useAnimationControls();

  useEffect(() => {
    if (!data?.length) return;
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
        `/api/v1/pool/scroll/list?list=10&chain=near`
      );

      setData(res.data.data);
      walletStore.set({ showInfos: !!res.data.data?.length });
      window.scrollTimer = setTimeout(() => {
        getData();
      }, 10000);
    };

    getData();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(window.scrollTimer);
    };
  }, []);

  return (
    !!data?.length && (
      <div
        ref={containerRef}
        className={clsx(
          "relative overflow-hidden font-[DelaGothicOne] bg-[#000000]",
          "shadow-[0_0_10px_rgba(168,85,247,0.3)]",
          className
        )}
        style={{ height: `${height}px` }}
      >
        <motion.div
          className="flex items-center gap-8 h-full whitespace-nowrap"
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

  return item.winner_user ? (
    <div className="flex items-center h-full gap-3 text-white transition-transform duration-200 hover:scale-105">
      <span className="text-[12px] text-[#D9D9D9] rounded">
        {formatAddress(item.winner_user)} Won
      </span>
      <span
        className={clsx(
          "text-lg font-bold drop-shadow-lg",
          config[randomIndex].color
        )}
      >
        {Big(getAnchorPrice(item?.anchor_price, BASE_TOKEN.decimals)).toFixed(
          2
        )}
        x
      </span>
      <span className="text-xl drop-shadow-lg">
        {config[randomIndex].emoji}
      </span>
    </div>
  ) : (
    <div className="flex items-center h-full gap-3 text-white transition-transform duration-200 hover:scale-105">
      <span className="text-[#D9D9D9] text-[12px]">
        {item.nft_ids ? "New NFT Listed" : "New Market Listed"}
      </span>
      <span className={clsx("text-lg font-bold drop-shadow-lg")}>
        $
        {Big(getAnchorPrice(item?.anchor_price, BASE_TOKEN.decimals)).toFixed(
          2
        )}
      </span>
      <span className="text-xl drop-shadow-lg">
        {config[randomIndex].emoji}
      </span>
    </div>
  );
};
