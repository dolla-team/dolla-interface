import { motion } from "framer-motion";
import DollaEye from "../dolla-eye";
import { useRef, useEffect, useState, useMemo } from "react";
import useIsMobile from "@/hooks/use-is-mobile";
import useIsBtc from "@/hooks/use-is-btc";
import clsx from "clsx";

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
    // Hardcode font sizes based on character positions
    let fontSize = isMobile ? "text-[16px]" : "text-[20px] font-[600]";
    let marginClass = "-mr-[8px]";

    // "Can one dollar win something big? Something, really big..."
    // Positions for "win"
    if (
      (charIndex >= 45 && charIndex < 50) ||
      (charIndex >= 56 && charIndex < 58) ||
      (charIndex >= 88 && charIndex < 95) ||
      (charIndex >= 102 && charIndex < 108)
    ) {
      fontSize = "font-[400] text-[20px]";
      marginClass = "-mr-[10px]";
    } else if (charIndex >= 50 && charIndex < 120) {
      fontSize = "font-[400] text-[16px]";
      marginClass = "-mr-[8px]";
    }

    return (
      <span
        key={charIndex}
        className={`${fontSize} leading-[100%] ${marginClass}`}
      >
        {char}
        {charIndex === 46 && (
          <div className="mt-[10px]">
            <br />
          </div>
        )}{" "}
        {charIndex === 81 && (
          <div className="mt-[-30px]">
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
  const isBtc = useIsBtc();
  const progressInnerRef = useRef<any>(null);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Typewriter text content
  const typewriterText =
    "The first Trustless Probabilistic Marketplace. Bid from $1, win high-value assets. Sell smarter, sell higher.";
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
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white z-50">
      <div className="w-full h-full flex flex-col justify-center items-center bg-linear-to-b from-[#FFFFFF] to-[#FEFAF0]">
        <DollaEye className="" height={128} />
        <div className="w-[544px] h-[20px] mt-[30px] mb-[8px] flex-shrink-0 rounded-[12px] p-[3px] border border-[#E4E4E4] bg-[#FDFDFD] shadow-[0_-4px_6px_0_#FFF_inset,0_2px_6px_0_rgba(0,0,0,0.25)_inset] relative">
          <motion.div
            ref={progressInnerRef}
            className={clsx(
              "h-[12px] rounded-[8px] relative",
              isBtc
                ? "bg-[linear-gradient(90deg,_#FFC42F_0%,_#FFE9B2_100%)]"
                : "bg-[linear-gradient(90deg,_#6F37FF_0%,_#00FFBB_100%)]"
            )}
            initial={{ width: 0 }}
            animate={{
              width: `${progressWidth}%`
            }}
          >
            <div className="absolute top-0 right-[-35px] w-[50px] h-[50px] flex items-center justify-center pointer-events-none">
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className={clsx(
                    "absolute rounded-full",
                    isBtc ? "bg-[#FFC42F]" : "bg-[#10FFBF]"
                  )}
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="541"
          height="8"
          viewBox="0 0 541 8"
          fill="none"
        >
          <line
            x1="0.5"
            y1="0.5"
            x2="0.5"
            y2="7.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="50.5"
            y1="0.5"
            x2="50.5"
            y2="7.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="100.5"
            y1="0.5"
            x2="100.5"
            y2="7.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="150.5"
            y1="0.5"
            x2="150.5"
            y2="7.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="200.5"
            y1="0.5"
            x2="200.5"
            y2="7.5"
            stroke="#D7D7D7"
            stroke-linecap="round"
          />
          <line
            x1="250.5"
            y1="0.5"
            x2="250.5"
            y2="7.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="300.5"
            y1="0.5"
            x2="300.5"
            y2="7.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="350.5"
            y1="0.5"
            x2="350.5"
            y2="7.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="400.5"
            y1="0.5"
            x2="400.5"
            y2="7.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="450.5"
            y1="0.5"
            x2="450.5"
            y2="7.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="500.5"
            y1="0.5"
            x2="500.5"
            y2="7.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="10.5"
            y1="0.5"
            x2="10.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="60.5"
            y1="0.5"
            x2="60.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="110.5"
            y1="0.5"
            x2="110.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="160.5"
            y1="0.5"
            x2="160.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="210.5"
            y1="0.5"
            x2="210.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="260.5"
            y1="0.5"
            x2="260.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="310.5"
            y1="0.5"
            x2="310.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="360.5"
            y1="0.5"
            x2="360.5"
            y2="5.5"
            stroke="#D7D7D7"
            stroke-linecap="round"
          />
          <line
            x1="410.5"
            y1="0.5"
            x2="410.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="460.5"
            y1="0.5"
            x2="460.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="510.5"
            y1="0.5"
            x2="510.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="20.5"
            y1="0.5"
            x2="20.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="70.5"
            y1="0.5"
            x2="70.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="120.5"
            y1="0.5"
            x2="120.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="170.5"
            y1="0.5"
            x2="170.5"
            y2="5.5"
            stroke="#D7D7D7"
            stroke-linecap="round"
          />
          <line
            x1="220.5"
            y1="0.5"
            x2="220.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="270.5"
            y1="0.5"
            x2="270.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="320.5"
            y1="0.5"
            x2="320.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="370.5"
            y1="0.5"
            x2="370.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="420.5"
            y1="0.5"
            x2="420.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="470.5"
            y1="0.5"
            x2="470.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="520.5"
            y1="0.5"
            x2="520.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="30.5"
            y1="0.5"
            x2="30.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="80.5"
            y1="0.5"
            x2="80.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="130.5"
            y1="0.5"
            x2="130.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="180.5"
            y1="0.5"
            x2="180.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="230.5"
            y1="0.5"
            x2="230.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="280.5"
            y1="0.5"
            x2="280.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="330.5"
            y1="0.5"
            x2="330.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="380.5"
            y1="0.5"
            x2="380.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="430.5"
            y1="0.5"
            x2="430.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="480.5"
            y1="0.5"
            x2="480.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="530.5"
            y1="0.5"
            x2="530.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="40.5"
            y1="0.5"
            x2="40.5"
            y2="5.5"
            stroke="#D7D7D7"
            stroke-linecap="round"
          />
          <line
            x1="90.5"
            y1="0.5"
            x2="90.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="140.5"
            y1="0.5"
            x2="140.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="190.5"
            y1="0.5"
            x2="190.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="240.5"
            y1="0.5"
            x2="240.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="290.5"
            y1="0.5"
            x2="290.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="340.5"
            y1="0.5"
            x2="340.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="390.5"
            y1="0.5"
            x2="390.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="440.5"
            y1="0.5"
            x2="440.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="490.5"
            y1="0.5"
            x2="490.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
          <line
            x1="540.5"
            y1="0.5"
            x2="540.5"
            y2="5.5"
            stroke="#D7D7D7"
            strokeLinecap="round"
          />
        </svg>
        <div
          className={clsx(
            "text-center leading-[40px] mt-[40px] min-h-[120px] flex flex-col items-center justify-center",
            isBtc ? "text-[#535353]" : "text-[#AB96FF]"
          )}
        >
          <div className="whitespace-pre-wrap">
            {renderStyledText(displayText, isMobile)}
          </div>
        </div>
      </div>
      {/* <div className="w-full h-full pointer-events-none overflow-hidden absolute top-0 left-0 opacity-[0.07]">
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
      </div> */}
    </div>
  );
};

export default Loading;

interface Props {
  // Loading speed, default is 1000ms
  speed?: number;
}
