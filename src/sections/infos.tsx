import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import axiosInstance from "@/libs/axios";
import { formatAddress } from "@/utils/format/address";
import useWalletStore from "@/stores/use-wallet";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "@/utils/format/number";
import useIsWindowVisible from "@/hooks/use-is-window-visible";

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
  speed = 60,
  height = 36,
  autoPlay = true
}: ScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(!autoPlay);
  const [data, setData] = useState<any[]>([]);
  const walletStore = useWalletStore();

  useEffect(() => {
    if (!data?.length) return;
    const totalWidth = data.length * 300;
    setContentWidth(totalWidth);
  }, [data]);

  const duration = contentWidth / speed;

  useEffect(() => {
    const getData = async () => {
      const res = await axiosInstance.get(`/api/v1/pool/top/market`);

      const _list: any = [];

      res?.data?.data?.pool?.forEach((pool: any) => {
        _list.push({
          type: "pool",
          pool_id: pool.pool_id,
          value: pool.pool_info.reward_usd
        });
      });

      res?.data?.data?.winner_bid?.forEach((pool: any) => {
        _list.push({
          type: "winner",
          profit_ratio: pool.profit_ratio,
          winner_user_name: pool.user_info.name,
          pool_id: pool.pool_id,
          winner_user: pool.user_info.user
        });
      });

      setData(_list);

      walletStore.set({
        showInfos: !_list.length
      });
      window.scrollTimer = setTimeout(() => {
        getData();
      }, 10000);
    };

    getData();

    return () => {
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
        <Bids />
        <style>
          {`
            @keyframes scroll-right-to-left {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-${contentWidth}px);
              }
            }
          `}
        </style>
        <div
          ref={scrollRef}
          className="flex items-center gap-8 h-full whitespace-nowrap"
          style={{
            width: contentWidth * 2,
            animation: `scroll-right-to-left ${duration}s linear infinite`,
            animationPlayState: isPaused ? "paused" : "running"
          }}
        >
          {data.map((item, index) => (
            <Item
              item={item}
              key={`first-${index}`}
              index={index}
              setIsPaused={setIsPaused}
            />
          ))}
          {data.map((item, index) => (
            <Item
              item={item}
              key={`second-${index}`}
              index={index}
              setIsPaused={setIsPaused}
            />
          ))}
        </div>
      </div>
    )
  );
}

const Item = ({
  item,
  index,
  setIsPaused
}: {
  item: any;
  index: number;
  setIsPaused: (isPaused: boolean) => void;
}) => {
  const navigate = useNavigate();
  const randomIndex = useMemo(() => {
    return Math.floor(Math.random() * config.length);
  }, [index]);

  return (
    <div
      onClick={() => {
        navigate(`/btc/detail/${item.pool_id}`);
      }}
      className="flex items-center h-full gap-3 px-[50px] text-white transition-transform duration-200 hover:scale-105 button"
      onMouseEnter={() => {
        setIsPaused(true);
      }}
      onMouseLeave={() => {
        setIsPaused(false);
      }}
    >
      {item.type === "winner" ? (
        <>
          <span className="text-[12px] text-[#D9D9D9] rounded">
            {item?.winner_user_name || formatAddress(item.winner_user)} Won
          </span>
          <span
            className={clsx(
              "text-lg font-bold drop-shadow-lg",
              config[randomIndex].color
            )}
          >
            {formatNumber(item.profit_ratio, 0, true)}x
          </span>
          <span className="text-xl drop-shadow-lg">🚀</span>
        </>
      ) : (
        <>
          <span className="text-[#D9D9D9] text-[12px]">New Market Listed</span>
          <span className={clsx("text-lg font-bold drop-shadow-lg")}>
            ${formatNumber(item.value, 2, true)}
          </span>
          <span className="text-xl drop-shadow-lg">🎯</span>
        </>
      )}
    </div>
  );
};

const Bids = () => {
  const isVisible = useIsWindowVisible();
  const [lastBid, setLastBid] = useState<any>(null);
  const [isNewBid, setIsNewBid] = useState(false);

  const fetchLastBid = async () => {
    clearTimeout(window.lastBidTimer);
    try {
      const res = await axiosInstance.get(`/api/v1/bid/list?limit=1&offset=0`);
      const newBid = res?.data?.data?.list?.[0];

      // Check if this is a new bid (different from current one)
      if (
        newBid &&
        (!lastBid ||
          newBid.pool_id !== lastBid.pool_id ||
          newBid.user_id !== lastBid.user_id ||
          newBid.times !== lastBid.times)
      ) {
        setIsNewBid(true);
        setLastBid(newBid);

        // Reset the new bid flag after animation
        setTimeout(() => {
          setIsNewBid(false);
        }, 1000);
      } else if (newBid) {
        setLastBid(newBid);
      }
    } catch {
    } finally {
      window.lastBidTimer = setTimeout(() => {
        fetchLastBid();
      }, 3000);
    }
  };

  useEffect(() => {
    if (!isVisible) {
      clearTimeout(window.lastBidTimer);
      return;
    }
    fetchLastBid();
    return () => {
      clearTimeout(window.lastBidTimer);
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {!!lastBid && (
        <motion.div
          key={lastBid.id}
          className="w-[300px] h-[36px] border-r border-white flex items-center justify-center absolute z-[5] left-0 top-0 bg-black text-center"
          initial={{
            opacity: 0,
            scale: 0.8,
            x: -50
          }}
          animate={{
            opacity: 1,
            scale: isNewBid ? [1, 1.1, 1] : 1,
            x: 0,
            rotate: isNewBid ? [0, -2, 2, -2, 2, 0] : 0
          }}
          exit={{
            opacity: 0,
            scale: 0.8,
            x: 50
          }}
          transition={{
            duration: isNewBid ? 0.6 : 0.3,
            ease: "easeOut",
            scale: {
              duration: 0.3,
              times: [0, 0.5, 1]
            },
            rotate: {
              duration: 0.6,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1]
            }
          }}
        >
          <span className="text-[12px] text-[#D9D9D9] mr-[4px] max-w-[100px] truncate">
            {lastBid.user_name || formatAddress(lastBid.user)}
          </span>
          <span className="text-[12px] text-[#D9D9D9]">just bid</span>
          <motion.span
            className="text-[14px] text-[#66E39C] font-[700] mx-[8px]"
            animate={
              isNewBid
                ? {
                    color: ["#66E39C", "#FFD700", "#66E39C"],
                    textShadow: ["0 0 0px", "0 0 10px #FFD700", "0 0 0px"]
                  }
                : {}
            }
            transition={{
              duration: 0.6,
              times: [0, 0.5, 1]
            }}
          >
            ${formatNumber(lastBid.times, 2, true)}
          </motion.span>
          <span className="text-[12px] text-[#D9D9D9]">
            in #{lastBid.pool_id}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
