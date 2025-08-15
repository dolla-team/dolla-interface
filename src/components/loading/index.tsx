import { motion } from "framer-motion";
import DollaEye from "../dolla-eye";
import { useRef, useEffect, useState, useMemo } from "react";
import useIsMobile from "@/hooks/use-is-mobile";

// Custom hook for typewriter effect
const useTypewriter = (text: string, speed: number = 100) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      // Calculate dynamic speed - start fast, gradually slow down
      const progress = currentIndex / text.length;
      const dynamicSpeed = speed + progress * 100; // Start at speed, end at speed + 100ms

      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, dynamicSpeed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return displayText;
};

// Function to render text with special styling
const renderStyledText = (text: string, isMobile?: boolean) => {
  return text.split("").map((char, charIndex) => {
    const isQuestionMark = char === "?";
    const isSpace = char === " ";

    // Hardcode font sizes based on character positions
    let fontSize = isMobile ? "text-[16px]" : "text-[20px]";
    let marginClass = "-mr-[2px]";

    // "Can one dollar win something big? Something, really big..."
    // Positions for "win"
    if (charIndex >= 15 && charIndex <= 17) {
      fontSize = "text-[30px]";
      marginClass = "-mr-[6px]";
    }
    // Positions for "big..."
    else if (charIndex >= 51 && charIndex <= 57) {
      fontSize = "text-[60px]";
      marginClass = "-mr-[12px]";
    }

    return (
      <span
        key={charIndex}
        className={`${fontSize} leading-none ${marginClass}`}
      >
        {isSpace ? "\u00A0" : char}
        {isQuestionMark && <br />}
        {charIndex === 50 && (
          <div className="mt-[10px]">
            <br />
          </div>
        )}{" "}
        {/* After "really" */}
      </span>
    );
  });
};

const Loading = (props: Props) => {
  const { speed = 5000 } = props;
  const isMobile = useIsMobile();

  const progressInnerRef = useRef<any>(null);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Typewriter text content
  const typewriterText =
    "Can one dollar win something big? Something, really big...";
  const displayText = useTypewriter(typewriterText, 50);

  useEffect(() => {
    if (!isLoading) return;

    const startTime = Date.now();
    const maxProgress = 95;

    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / speed;

      const easeOutQuart = 1 - Math.pow(1 - Math.min(progress, 0.95), 4);
      const currentWidth = easeOutQuart * maxProgress;

      setProgressWidth(currentWidth);

      if (progress < 0.95) {
        requestAnimationFrame(animateProgress);
      }
    };

    requestAnimationFrame(animateProgress);

    return () => {
      setProgressWidth(100);
      setIsLoading(false);
    };
  }, [isLoading]);

  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const size = Math.random() * 2 + 1;
        const delay = Math.random() * 0.3;
        const duration = Math.random() * 0.6 + 0.4;
        const angle = (Math.random() * 60 - 30) * (Math.PI / 180);
        const distance = 30 + Math.random() * 20;
        const x = -Math.abs(Math.cos(angle) * distance);
        const y = Math.sin(angle) * distance;
        const top = Math.random() * 12 - 6;

        return {
          id: i,
          size,
          delay,
          duration,
          angle,
          distance,
          x,
          y,
          top,
          left: i * 2
        };
      }),
    []
  );

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#1A191D] z-50">
      <div className="w-full h-full flex flex-col justify-center items-center gap-[30px]">
        <DollaEye className="" height={128} />
        <div className="w-[280px] h-[12px] flex-shrink-0 rounded-[12px] p-[2px] border border-[#3B3951] bg-[rgba(255,255,255,0.10)] backdrop-blur-[25px] relative">
          <motion.div
            ref={progressInnerRef}
            className="h-full rounded-[3px] bg-[linear-gradient(90deg,_#6F37FF_0%,_#00FFBB_100%)] relative"
            initial={{ width: 0 }}
            animate={{
              width: `${progressWidth}%`
            }}
          >
            <div className="absolute top-0 right-[-35px] w-[50px] h-[50px] flex items-center justify-center pointer-events-none">
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute bg-[#10FFBF] rounded-full"
                  style={{
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    left: `${particle.left}px`,
                    top: `${particle.top}px`
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.3],
                    x: [0, particle.x],
                    y: [0, particle.y]
                  }}
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    repeat: Infinity,
                    repeatDelay: 0.1,
                    ease: "linear"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
        <div className="text-[#AB96FF] text-center font-normal leading-[40px] mt-[20px] min-h-[120px] flex flex-col items-center justify-center">
          <div className="whitespace-pre-wrap">
            {renderStyledText(displayText, isMobile)}
          </div>
        </div>
      </div>
      <div className="w-full h-full pointer-events-none overflow-hidden absolute top-0 left-0 opacity-[0.07]">
        <motion.div
          className="w-[500%] h-[500%] bg-[url('/bg-noise.png')] [inset:-200%] absolute will-change-transform"
          animate={{
            translateX: [0, "-5%", "5%", "-10%", "10%", "-15%", "15%", 0],
            translateY: [0, "15%", "-15%", "10%", "-10%", "5%", "-5%", 0]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </div>
  );
};

export default Loading;

interface Props {
  // Loading speed, default is 1000ms
  speed?: number;
}
