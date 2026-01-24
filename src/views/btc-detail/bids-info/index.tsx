import Item from "./item";
import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import useBidList from "@/views/btc/components/bids-info/use-bid-list";

// Constant scroll speed: pixels per second
const SCROLL_SPEED = 100; // Adjust this value to control scroll speed (doubled from 50)

export default function BidsInfo() {
  const { list } = useBidList();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const containerWidth = 600;

  // Calculate items1 (odd indices) and items2 (even indices)
  // Always update items when list changes, but keep animation continuous
  const { items1, items2 } = useMemo(() => {
    if (list.length === 0) {
      return { items1: [], items2: [] };
    }

    // Duplicate items for seamless loop (render twice)
    const duplicateItems = (items: typeof list) => {
      return [...items, ...items];
    };

    // If we have less than 4 items, only items1 has data (all items), items2 is empty
    if (list.length < 4) {
      return {
        items1: duplicateItems(list),
        items2: []
      };
    }

    // When we have 4 or more items, split into odd and even indexed items
    const oddItems = list.filter((_, index) => index % 2 === 1); // indices 1, 3, 5, ...
    const evenItems = list.filter((_, index) => index % 2 === 0); // indices 0, 2, 4, ...

    return {
      items1: duplicateItems(oddItems),
      items2: duplicateItems(evenItems)
    };
  }, [list]);

  // Seamless scroll animation for the whole module
  const animateScroll = useCallback(() => {
    if (!items1.length || !contentWidth) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    setOffset((prev) => {
      let newOffset = prev + SCROLL_SPEED / 60; // 60fps, move right to left

      // When we've scrolled one full set width, reset to 0 seamlessly
      // Handle case where contentWidth might have changed (data updated)
      if (newOffset >= contentWidth) {
        newOffset = newOffset - contentWidth;
      }

      return newOffset;
    });

    animationRef.current = requestAnimationFrame(animateScroll);
  }, [contentWidth, items1.length]);

  // Adjust offset if contentWidth changes and offset exceeds new width
  useEffect(() => {
    if (contentWidth > 0 && offset >= contentWidth) {
      setOffset((prev) => prev % contentWidth);
    }
  }, [contentWidth]);

  // Start/stop animation
  useEffect(() => {
    if (items1.length && contentWidth && !animationRef.current) {
      animationRef.current = requestAnimationFrame(animateScroll);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [items1.length, contentWidth, animateScroll]);

  // Measure content width for the whole module
  useEffect(() => {
    if (!wrapperRef.current || !items1.length) return;

    const measureWidth = () => {
      if (!wrapperRef.current) return;

      // We render two sets (each set contains both rows), so children.length should be 2
      const children = wrapperRef.current.children;

      if (children.length >= 2) {
        const firstSet = children[0] as HTMLElement;
        const secondSet = children[1] as HTMLElement;

        if (firstSet && secondSet) {
          // Measure distance from start of first set to start of second set
          const width = secondSet.offsetLeft - firstSet.offsetLeft;
          if (width > 0) {
            setContentWidth(width);
            return;
          }
        }
      }

      // Fallback: measure scrollWidth / 2
      const totalWidth = wrapperRef.current.scrollWidth;
      if (totalWidth > 0) {
        setContentWidth(totalWidth / 2);
      }
    };

    // Wait for layout to be calculated
    const rafId1 = requestAnimationFrame(() => {
      const rafId2 = requestAnimationFrame(measureWidth);
      return () => cancelAnimationFrame(rafId2);
    });

    window.addEventListener("resize", measureWidth);

    return () => {
      cancelAnimationFrame(rafId1);
      window.removeEventListener("resize", measureWidth);
    };
  }, [items1.length]);

  // Keep animation continuous - don't reset offset when data updates
  // Animation will continue smoothly even when new data arrives

  if (items1.length === 0) {
    return null;
  }

  return (
    <div className="w-[600px] absolute right-0 top-0 pt-[28px] overflow-hidden">
      <div
        ref={wrapperRef}
        className="whitespace-nowrap"
        style={{
          transform: `translateX(${containerWidth - offset}px)`,
          willChange: "transform"
        }}
      >
        {/* First set */}
        <div className="inline-block">
          {/* First row */}
          <div className="flex gap-[30px] mb-[20px]">
            {items1.map((item, index) => (
              <Item
                key={`row1-first-${item.user}-${item.time}-${index}`}
                data={item}
              />
            ))}
          </div>
          {/* Second row - only show when we have 4 or more items */}
          {items2.length > 0 && (
            <div className="flex gap-[30px] ml-[40px]">
              {items2.map((item, index) => (
                <Item
                  key={`row2-first-${item.user}-${item.time}-${index}`}
                  data={item}
                />
              ))}
            </div>
          )}
        </div>
        {/* Second set (duplicate for seamless loop) */}
        <div className="inline-block">
          {/* First row */}
          <div className="flex gap-[30px] mb-[20px]">
            {items1.map((item, index) => (
              <Item
                key={`row1-second-${item.user}-${item.time}-${index}`}
                data={item}
              />
            ))}
          </div>
          {/* Second row - only show when we have 4 or more items */}
          {items2.length > 0 && (
            <div className="flex gap-[30px] ml-[40px]">
              {items2.map((item, index) => (
                <Item
                  key={`row2-second-${item.user}-${item.time}-${index}`}
                  data={item}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
