import Hints from "./hints";
import HandIcon from "./hand-icon";
import { QUOTE_TOKEN } from "@/config/btc";
import { useEffect, useState } from "react";
import { useTipsStore } from "@/stores/use-tips";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useAuth } from "@/contexts/auth";

// Define position types
type TipPosition = "top" | "bottom" | "left" | "right";

// Define steps configuration
interface StepConfig {
  targetId: string | string[]; // Support single or multiple target IDs
  hint: string;
  position: TipPosition;
}

const STEPS_CONFIG: StepConfig[] = [
  {
    targetId: "tips-cashier-entry",
    hint: `Deposit bidding assets ${QUOTE_TOKEN.symbol}`,
    position: "top" // Position hint above target
  },
  {
    targetId: [
      "tips-bid-selection-1",
      "tips-bid-selection-10",
      "tips-bid-selection-50",
      "tips-bid-selection-100"
    ], // You can add more steps
    hint: "Different size bidding for bigger probability",
    position: "top"
  },
  {
    targetId: "tips-bid-button",
    hint: "Click to Bid",
    position: "top"
  }
];

function Content() {
  const tipsStore = useTipsStore();
  const [elementRect, setElementRect] = useState<DOMRect | null>(null);
  const [show, setShow] = useState(false);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0); // For cycling through multiple targets
  const { nearAccount } = useAuth() || {};

  const currentConfig = STEPS_CONFIG[tipsStore.step - 1];

  // Get current target ID (handle both string and array)
  const getCurrentTargetId = (): string => {
    if (!currentConfig) return "";
    if (Array.isArray(currentConfig.targetId)) {
      return (
        currentConfig.targetId[currentTargetIndex] || currentConfig.targetId[0]
      );
    }
    return currentConfig.targetId;
  };

  const currentTargetId = getCurrentTargetId();

  // Cycle through multiple target IDs if targetId is an array
  useEffect(() => {
    if (!currentConfig || !Array.isArray(currentConfig.targetId)) {
      setCurrentTargetIndex(0);
      return;
    }

    const targetIds = currentConfig.targetId;
    const interval = setInterval(() => {
      setCurrentTargetIndex((prev) => (prev + 1) % targetIds.length);
    }, 2000); // Switch every 2 seconds

    return () => clearInterval(interval);
  }, [currentConfig]);

  // Update element position when target changes
  useEffect(() => {
    if (!currentConfig || !currentTargetId) {
      setShow(false);
      return;
    }

    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      const targetEle = document.getElementById(currentTargetId);
      if (targetEle) {
        const rect = targetEle.getBoundingClientRect();
        setElementRect(rect);
        setShow(true);
      } else {
        setShow(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [currentConfig, currentTargetId]);

  // Update position on window resize and scroll
  useEffect(() => {
    if (!show || !currentConfig || !currentTargetId) return;

    const updatePosition = () => {
      const targetEle = document.getElementById(currentTargetId);
      if (targetEle) {
        const rect = targetEle.getBoundingClientRect();
        setElementRect(rect);
      }
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [show, currentConfig, currentTargetId]);

  // Auto advance on click outside or on target
  useEffect(() => {
    if (!show || !currentConfig) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if clicked on any of the target elements
      const targetIds = Array.isArray(currentConfig.targetId)
        ? currentConfig.targetId
        : [currentConfig.targetId];

      const clickedOnTarget = targetIds.some((id) => target.closest(`#${id}`));

      if (clickedOnTarget) {
        // Clicked on target element, advance to next step
        tipsStore.set({ step: tipsStore.step + 1 });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [show, currentConfig, tipsStore]);

  useEffect(() => {
    if (nearAccount?.balance !== "0" && tipsStore.step === 1) {
      tipsStore.set({ step: 2 });
    }
  }, [nearAccount]);

  if (!show || !elementRect || !currentConfig) return null;

  // Calculate hint position based on config
  const getHintPosition = () => {
    if (tipsStore.step === 1) {
      return {
        left: elementRect.left + elementRect.width / 2,
        top: elementRect.top - elementRect.height / 2
      };
    }
    if (tipsStore.step === 2) {
      return {
        left: elementRect.left + elementRect.width / 2,
        top: elementRect.top + elementRect.height / 4
      };
    }
    if (tipsStore.step === 3) {
      return {
        left: elementRect.left + elementRect.width / 2,
        top: elementRect.top + elementRect.height / 4
      };
    }
    return {};
  };

  const hintPosition = getHintPosition();

  return (
    <div>
      {/* Highlight ring around target element */}
      {tipsStore.step === 1 && (
        <motion.div
          key={`highlight-${currentTargetId}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed z-[101] pointer-events-none"
          style={{
            left: elementRect.left - 5,
            top: elementRect.top - 5,
            width: elementRect.width + 9,
            height: elementRect.height + 9
          }}
        >
          <motion.div
            className="w-full h-full rounded-full bg-white/30"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}

      {/* Tips content */}
      <div
        key={`tips-${currentTargetId}`}
        className="fixed z-[102] w-[100px] h-[100px] duration-300"
        style={hintPosition}
      >
        <Hints
          text={currentConfig.hint}
          className={clsx(
            "mb-4 absolute top-0 left-0",
            tipsStore.step === 1 &&
              "w-[321px] h-[60px] top-[-90px] left-[-160px]",
            tipsStore.step === 2 &&
              "w-[260px] h-[82px] top-[-120px] left-[-160px]",
            tipsStore.step === 3 &&
              "w-[148px] h-[60px] top-[-60px] left-[-60px]"
          )}
        />
        <HandIcon animate={true} />
      </div>
    </div>
  );
}

export default function Tips() {
  const tipsStore = useTipsStore();
  return (
    tipsStore.step > 0 && (
      <AnimatePresence mode="wait">
        <Content />
      </AnimatePresence>
    )
  );
}
