import { useBtcContext } from "../../../context";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useState } from "react";

export default function AutoBtn() {
  const { setFlipStatus } = useBtcContext();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.1, ease: "easeInOut" }}
        className="flex items-center justify-center w-[128px] h-[128px] relative"
      >
        <Circle
          className="w-full h-full pointer-events-none"
          hoverScale={0.85}
          duration={2}
          delay={0}
          isHovered={isHovered}
        />
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            setFlipStatus(5);
          }}
          className="cursor-pointer w-full h-full flex items-center justify-center absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]"
        >
          <span
            className="relative z-[2] text-[26px] text-[#3E2B2B] font-[DelaGothicOne] uppercase"
            style={{
              WebkitTextStroke: "1px #00DD2C"
            }}
          >
            AUTO
          </span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="128"
            height="128"
            viewBox="0 0 128 128"
            fill="none"
            className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]"
          >
            <circle
              cx="64"
              cy="64"
              r="64"
              fill="url(#paint0_radial_1746_869)"
            />
            <defs>
              <radialGradient
                id="paint0_radial_1746_869"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(64 64) rotate(90) scale(64)"
              >
                <stop stopColor="#74FF49" />
                <stop offset="1" stopColor="#009342" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
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
        fill="url(#paint0_linear_1694_9652)"
        fillOpacity="0.2"
      />
      <circle
        cx="129"
        cy="129"
        r="128"
        stroke="url(#paint1_linear_1694_9652)"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1694_9652"
          x1="92"
          y1="2"
          x2="92"
          y2="182"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2FFF89" />
          <stop offset="1" stopColor="#43FF5600" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1694_9652"
          x1="92"
          y1="2"
          x2="92"
          y2="182"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#43FF59" />
          <stop offset="1" stopColor="#43FF4900" stopOpacity="0" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};
