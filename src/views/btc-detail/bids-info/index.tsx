import Item from "./item";
import { useMemo, useRef, useEffect, useState } from "react";
import useBidList from "@/views/btc/components/bids-info/use-bid-list";

// Constant scroll speed: pixels per second
const SCROLL_SPEED = 50; // Adjust this value to control scroll speed

export default function BidsInfo() {
  const { list } = useBidList();
  const row1Ref = useRef<HTMLDivElement>(null);
  const [animationDuration, setAnimationDuration] = useState(30);

  // Duplicate items for seamless loop, ensure at least 2 items for smooth animation
  const items = useMemo(() => {
    if (list.length === 0) return [];
    // If we have less than 4 items, duplicate multiple times to ensure smooth scrolling
    if (list.length < 4) {
      return [...list, ...list, ...list, ...list];
    }
    // Otherwise, duplicate once for seamless loop
    return [...list, ...list];
  }, [list]);

  // Measure content width and calculate animation duration
  useEffect(() => {
    if (items.length === 0 || !row1Ref.current) {
      return;
    }

    const measureWidth = () => {
      if (row1Ref.current) {
        // Get the actual scroll width of the content
        const width = row1Ref.current.scrollWidth;
        // Since we duplicate the content, we need to move 50% of the total width
        const halfWidth = width / 2;
        // Calculate duration based on constant speed: duration = distance / speed
        const duration = halfWidth / SCROLL_SPEED;
        setAnimationDuration(duration);
      }
    };

    // Measure after a short delay to ensure DOM is rendered
    const timer = setTimeout(measureWidth, 100);

    // Re-measure on window resize
    window.addEventListener("resize", measureWidth);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measureWidth);
    };
  }, [items.length, items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-[600px] absolute right-0 top-0 pt-[28px] overflow-hidden">
      {/* First row */}
      <div
        ref={row1Ref}
        className="flex gap-[30px] mb-[20px] scroll-row"
        style={{
          animationDuration: `${animationDuration}s`,
          animationDelay: "0s"
        }}
      >
        {items.map((item, index) => (
          <Item key={`row1-${item.user}-${item.time}-${index}`} data={item} />
        ))}
      </div>
      {/* Second row */}
      <div
        className="flex gap-[30px] scroll-row scroll-row-delayed ml-[40px]"
        style={{
          animationDuration: `${animationDuration}s`,
          animationDelay: `-${animationDuration / 2}s`
        }}
      >
        {items.map((item, index) => (
          <Item key={`row2-${item.user}-${item.time}-${index}`} data={item} />
        ))}
      </div>
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .scroll-row {
          display: flex;
          width: fit-content;
          animation: scroll-left linear infinite;
        }
      `}</style>
    </div>
  );
}
