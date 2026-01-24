import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate
} from "framer-motion";

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
   * Animation duration in seconds (default: undefined, uses spring physics)
   * If provided, animation will use fixed duration instead of spring physics
   */
  duration?: number;
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
 * Displays a number that animates smoothly from the previous value to the target value.
 * Animation only triggers when the value changes.
 * Supports formatting with thousand separators, decimal places, prefixes, and suffixes.
 *
 * Animation modes:
 * - Spring physics (default): Uses damping and stiffness for natural spring animation
 * - Fixed duration: If duration is provided, uses fixed time-based animation
 *
 * @example
 * ```tsx
 * <AnimatedCounter value={1234} prefix="$" />
 * <AnimatedCounter value={3.14} decimals={2} suffix="%" />
 * <AnimatedCounter value={1000} duration={8} /> // 8 second animation
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
  duration,
  className = "",
  enableScaleAnimation = true
}: AnimatedCounterProps) {
  const prevValueRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);
  const motionValue = useMotionValue(0);

  // Use spring physics if duration is not provided, otherwise use duration-based animation
  const spring = useSpring(
    motionValue,
    duration === undefined
      ? {
          damping,
          stiffness
        }
      : undefined
  );

  // Transform the spring value or motion value to formatted number string
  const formattedValue = useTransform(
    duration === undefined ? spring : motionValue,
    (latest) => {
      if (decimals > 0) {
        return formatNumber(Number(latest.toFixed(decimals)), decimals);
      }
      return formatNumber(Math.round(latest), 0);
    }
  );

  const [shouldAnimateScale, setShouldAnimateScale] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let animationControls: any = null;

    // On initial mount, animate from 0 to the initial value
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (duration !== undefined) {
        // Use duration-based animation
        animationControls = animate(motionValue, value, {
          duration: duration,
          delay: delay,
          ease: "easeOut"
        });
      } else {
        // Use spring physics
        motionValue.set(value);
      }
      prevValueRef.current = value;
      return;
    }

    // Only animate if the value has actually changed
    if (prevValueRef.current !== null && prevValueRef.current !== value) {
      if (duration !== undefined) {
        // Use duration-based animation
        const currentValue = motionValue.get();
        animationControls = animate(currentValue, value, {
          duration: duration,
          delay: delay,
          ease: "easeOut"
        });
      } else {
        // Spring will automatically animate from current value to the new value
        motionValue.set(value);
      }

      // Trigger scale animation on value change
      if (enableScaleAnimation) {
        setShouldAnimateScale(true);
        // Reset after animation completes
        const scaleTimeout =
          duration !== undefined ? duration * 1000 + delay * 1000 : 300;
        timer = setTimeout(() => setShouldAnimateScale(false), scaleTimeout);
      }
    }

    prevValueRef.current = value;

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      if (animationControls) {
        animationControls.stop();
      }
    };
  }, [motionValue, value, enableScaleAnimation, duration, delay]);

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
