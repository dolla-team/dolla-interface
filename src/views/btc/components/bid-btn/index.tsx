import { useBtcContext } from "../../context";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useMemo, useState } from "react";
import useBid from "@/hooks/solana/use-bid";
import { useAuth } from "@/contexts/auth";

export default function BidBtn({
  tokenBalance,
  onBidSuccess
}: {
  tokenBalance: string;
  onBidSuccess: () => void;
}) {
  const { setFlipStatus, flipStatus, setBidResult, bids, onReset, pool } =
    useBtcContext();
  const [isHovered, setIsHovered] = useState(false);
  const { userInfo } = useAuth();

  const { onBid } = useBid(
    pool?.pool_id,
    (result) => {
      console.log("complete success");
      setFlipStatus(4);
      setBidResult(result);
    },
    () => {
      console.log("bid success");
      setFlipStatus(2);
      onBidSuccess();
    },
    () => {
      console.log("bid fail");
      setTimeout(() => {
        setFlipStatus(0);
      }, 30);
    }
  );

  const disabled = useMemo(() => {
    if (pool?.status !== 1) {
      return true;
    }
    if (!userInfo?.user) {
      return true;
    }
    if (Number(tokenBalance) < bids) {
      return true;
    }
    if (flipStatus === 0 || flipStatus === 6) {
      return false;
    }
    return true;
  }, [flipStatus, userInfo, tokenBalance, bids, pool]);

  return (
    <div
      className={clsx(
        "flex items-center justify-center w-[128px] h-[128px] relative",
        disabled && "opacity-50"
      )}
    >
      {!disabled && (
        <Circle
          className="w-full h-full pointer-events-none"
          hoverScale={1.1}
          duration={2}
          delay={0}
          isHovered={isHovered}
        />
      )}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (flipStatus === 6) {
            onReset();
          }
          setBidResult(null);
          setFlipStatus(1);
          onBid(bids);
        }}
        className="cursor-pointer w-full h-full flex items-center justify-center absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]"
      >
        <span
          className="relative z-[2] text-[32px] text-[#3E2B2B] font-[DelaGothicOne] uppercase"
          style={{
            WebkitTextStroke: "1px #DD9000"
          }}
        >
          Bid!
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 200 200"
          fill="none"
          className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]"
        >
          <circle
            cx="100"
            cy="100"
            r="100"
            fill="url(#paint0_radial_1634_6263)"
          />
          <defs>
            <radialGradient
              id="paint0_radial_1634_6263"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(100 138.528) rotate(90) scale(61.4719 100)"
            >
              <stop stopColor="#FFEF43" />
              <stop offset="1" stopColor="#FFC42F" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

const Circle = ({
  className,
  delay = 0,
  hoverScale = 0.8,
  duration = 2,
  isHovered = false
}: {
  className?: string;
  delay?: number;
  hoverScale?: number;
  duration?: number;
  isHovered?: boolean;
}) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="258"
      height="258"
      viewBox="0 0 258 258"
      fill="none"
      className={clsx(
        "absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]",
        className
      )}
      animate={{
        scale: isHovered ? hoverScale : [1, 1.5, 2],
        opacity: isHovered ? 1 : [1, 0.5, 0]
      }}
      transition={{
        duration: isHovered ? 0.3 : duration,
        delay: delay,
        repeat: isHovered ? 0 : Infinity,
        ease: "linear"
      }}
    >
      <circle
        cx="129"
        cy="129"
        r="127"
        fill="url(#paint0_linear_1634_6262)"
        fillOpacity="0.2"
      />
      <circle
        cx="129"
        cy="129"
        r="128"
        stroke="url(#paint1_linear_1634_6262)"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1634_6262"
          x1="129"
          y1="2"
          x2="129"
          y2="256"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC42F" />
          <stop offset="1" stopColor="#FFEF43" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1634_6262"
          x1="129"
          y1="2"
          x2="129"
          y2="256"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFEF43" />
          <stop offset="1" stopColor="#FFEF43" stopOpacity="0" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};
