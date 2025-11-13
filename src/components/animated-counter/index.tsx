import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Format number with thousand separators
 * @param num - Number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string with commas
 */
function formatNumber(num: number, decimals: number = 0): string {
  if (decimals > 0) {
    return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return Math.floor(num).toLocaleString("en-US");
}

/**
 * Component that displays animated motion value
 * Subscribes to motion value changes and updates display
 */
function AnimatedNumberDisplay({ value }: { value: any }) {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const unsubscribe = value.on("change", (latest: string) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [value]);

  return <>{displayValue}</>;
}

export interface AnimatedCounterProps {
  /**
   * Target value to animate to
   */
  value: number;
  /**
   * Number of decimal places (default: 0)
   */
  decimals?: number;
  /**
   * Prefix string (e.g., "$")
   */
  prefix?: string;
  /**
   * Suffix string (e.g., "%", "k")
   */
  suffix?: string;
  /**
   * Spring animation damping (default: 60)
   * Lower values = more oscillation
   */
  damping?: number;
  /**
   * Spring animation stiffness (default: 100)
   * Higher values = faster animation
   */
  stiffness?: number;
  /**
   * Animation delay in seconds (default: 0)
   */
  delay?: number;
  /**
   * Custom className for the number container
   */
  className?: string;
  /**
   * Enable scale animation on value change (default: true)
   */
  enableScaleAnimation?: boolean;
}

/**
 * AnimatedCounter Component
 *
 * Displays a number that animates smoothly from the previous value to the target value
 * using spring physics. Animation only triggers when the value changes.
 * Supports formatting with thousand separators, decimal places, prefixes, and suffixes.
 *
 * @example
 * ```tsx
 * <AnimatedCounter value={1234} prefix="$" />
 * <AnimatedCounter value={3.14} decimals={2} suffix="%" />
 * ```
 */
export default function AnimatedCounter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  damping = 60,
  stiffness = 100,
  delay = 0,
  className = "",
  enableScaleAnimation = true
}: AnimatedCounterProps) {
  const prevValueRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    damping,
    stiffness
  });

  // Transform the spring value to formatted number string
  const formattedValue = useTransform(spring, (latest) => {
    if (decimals > 0) {
      return formatNumber(Number(latest.toFixed(decimals)), decimals);
    }
    return formatNumber(Math.round(latest), 0);
  });

  const [shouldAnimateScale, setShouldAnimateScale] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    // On initial mount, animate from 0 to the initial value
    if (isInitialMount.current) {
      isInitialMount.current = false;
      motionValue.set(value);
      prevValueRef.current = value;
      return;
    }

    // Only animate if the value has actually changed
    // Spring will automatically animate from current value to the new value
    if (prevValueRef.current !== null && prevValueRef.current !== value) {
      motionValue.set(value);
      // Trigger scale animation on value change
      if (enableScaleAnimation) {
        setShouldAnimateScale(true);
        // Reset after animation completes
        timer = setTimeout(() => setShouldAnimateScale(false), 300);
      }
    }

    prevValueRef.current = value;

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [motionValue, value, enableScaleAnimation]);

  return (
    <span className={className}>
      {prefix}
      {enableScaleAnimation ? (
        <motion.span
          animate={shouldAnimateScale ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, delay }}
        >
          <AnimatedNumberDisplay value={formattedValue} />
        </motion.span>
      ) : (
        <AnimatedNumberDisplay value={formattedValue} />
      )}
      {suffix}
    </span>
  );
}
