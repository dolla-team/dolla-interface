import { motion } from "framer-motion";
import clsx from "clsx";
import { useState } from "react";

export default function BidBtn({
  disabled,
  onClick
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={clsx(
        "flex items-center justify-center w-[144px] h-[144px] relative rounded-full mt-[-10px]"
        // disabled && "grayscale"
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
          if (disabled) return;
          onClick();
        }}
        className="cursor-pointer w-full h-full rounded-full relative flex items-center justify-center absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]"
        style={{
          background:
            "radial-gradient(126.53% 77.78% at 50% 22.22%, #CAB5FF 0%, #6F37FF 100%)"
        }}
      >
        <span className="relative z-[1] text-[32px] text-white font-bold uppercase">
          Bid!
        </span>
        {disabled && (
          <div className="absolute z-[2] top-0 left-0 w-full h-full rounded-full bg-[#00000080]" />
        )}
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
      width="178"
      height="178"
      viewBox="0 0 178 178"
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
      <foreignObject x="-10" y="-10" width="198" height="198">
        <div
          style={{
            backdropFilter: "blur(5px)",
            clipPath: "url(#bgblur_0_2963_6435_clip_path)",
            height: "100%",
            width: "100%"
          }}
        ></div>
      </foreignObject>
      <circle
        data-figma-bg-blur-radius="10"
        cx="89"
        cy="89"
        r="89"
        fill="url(#paint0_radial_2963_6435)"
        fill-opacity="0.3"
      />
      <defs>
        <clipPath
          id="bgblur_0_2963_6435_clip_path"
          transform="translate(10 10)"
        >
          <circle cx="89" cy="89" r="89" />
        </clipPath>
        <radialGradient
          id="paint0_radial_2963_6435"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(89 89) rotate(90) scale(89)"
        >
          <stop stopColor="#6F37FF" stopOpacity="0" />
          <stop offset="1" stopColor="#6F37FF" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
};
