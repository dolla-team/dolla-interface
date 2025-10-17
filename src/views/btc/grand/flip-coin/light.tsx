import React from "react";
import { motion } from "framer-motion";

interface LightRotationProps {
  size?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Basic Framer Motion rotation with infinite spin
export const LightRotation: React.FC<LightRotationProps> = ({
  size = 100,
  duration = 2,
  className = "",
  style = {}
}) => {
  return (
    <div
      className={`absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ${className}`}
      style={{
        width: size * 2,
        height: size * 2,
        ...style
      }}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/btc/light.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center"
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};
