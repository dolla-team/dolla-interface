import Avatar from "@/components/avatar";
import { useMemo, useEffect, useRef, useState, useCallback } from "react";

export default function TopTraders({ data: tradersData }: { data: any[] }) {
  // Mock data - replace with actual data source when available

  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const speed = 60; // pixels per second
  const initialOffset = 20; // First item offset 20px to the right

  const shouldScroll = tradersData.length > 4;

  // Seamless scroll animation from right to left
  const animateScroll = useCallback(() => {
    if (!shouldScroll || !contentWidth) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    setOffset((prev) => {
      let newOffset = prev + speed / 60; // 60fps, move right to left (positive value)

      // When we've scrolled one full set width, reset to 0 seamlessly for loop effect
      if (newOffset >= contentWidth) {
        newOffset = newOffset - contentWidth;
      }

      return newOffset;
    });

    animationRef.current = requestAnimationFrame(animateScroll);
  }, [speed, contentWidth, shouldScroll]);

  // Start animation when conditions are met
  useEffect(() => {
    if (shouldScroll && contentWidth && !animationRef.current) {
      animationRef.current = requestAnimationFrame(animateScroll);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [shouldScroll, contentWidth, animateScroll]);

  // Measure content width after render
  useEffect(() => {
    if (!wrapperRef.current || !shouldScroll || !tradersData.length) return;

    const measureWidth = () => {
      if (!wrapperRef.current) return;

      const children = wrapperRef.current.children;
      if (children.length >= tradersData.length) {
        const firstItem = children[0] as HTMLElement;
        const secondSetFirstItem = children[tradersData.length] as HTMLElement;

        if (firstItem && secondSetFirstItem) {
          const width = secondSetFirstItem.offsetLeft - firstItem.offsetLeft;
          if (width > 0) {
            setContentWidth(width);
            return;
          }
        }
      }

      const totalWidth = wrapperRef.current.scrollWidth;
      if (totalWidth > 0) {
        setContentWidth(totalWidth / 2);
      }
    };

    const rafId1 = requestAnimationFrame(() => {
      const rafId2 = requestAnimationFrame(measureWidth);
      return () => cancelAnimationFrame(rafId2);
    });

    window.addEventListener("resize", measureWidth);

    return () => {
      cancelAnimationFrame(rafId1);
      window.removeEventListener("resize", measureWidth);
    };
  }, [tradersData.length, shouldScroll]);

  // Reset offset when data changes
  useEffect(() => {
    setOffset(0);
  }, [tradersData.length]);

  return (
    <div className="pt-[20px]">
      <div className="text-[16px] text-black font-[600] pl-[30px]">
        Top Bidders
      </div>
      <div
        ref={containerRef}
        className="flex gap-[10px] mt-[10px] w-full overflow-hidden"
      >
        <div
          ref={wrapperRef}
          className="flex gap-[10px]"
          style={{
            transform: shouldScroll
              ? `translateX(${initialOffset - offset}px)`
              : `translateX(${initialOffset}px)`,
            willChange: shouldScroll ? "transform" : undefined
          }}
        >
          {/* First set */}
          {tradersData.map((trader, index) => (
            <TraderItem key={`first-${index}`} trader={trader} />
          ))}
          {/* Second set (duplicate for seamless loop) */}
          {shouldScroll &&
            tradersData.map((trader, index) => (
              <TraderItem key={`second-${index}`} trader={trader} />
            ))}
        </div>
      </div>
    </div>
  );
}

function TraderItem({
  trader
}: {
  trader: {
    rank: number;
    name: string;
    amount: string;
    avatar: string;
    address: string;
  };
}) {
  return (
    <div className="h-[50px] shrink-0 border-[12px] border border-[#F2F2F233] bg-[#0000000D] p-[10px] rounded-[12px] flex items-center gap-[10px]">
      <RankLabel rank={trader.rank} />
      <Avatar
        src={trader.avatar}
        address={trader.address}
        size={32}
        className="rounded-full"
      />
      <div className="text-[12px] text-[#2B3337] font-[500]">{trader.name}</div>
      <div className="text-[12px] text-[#2B3337] ml-[10px]">
        ${trader.amount}
      </div>
    </div>
  );
}

function RankLabel({ rank }: { rank: number }) {
  const color = useMemo(() => {
    switch (rank) {
      case 1:
        return "#FFD364";
      case 2:
        return "#F0A5D9";
      case 3:
        return "#6FF0A3";
      default:
        return "#CFCDE7";
    }
  }, [rank]);
  return (
    <div className="relative w-[22px] h-[26px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="26"
        viewBox="0 0 22 26"
        fill="none"
        className="absolute top-0 left-0"
      >
        <path
          d="M0 2C0 0.895431 0.895431 0 2 0H20C21.1046 0 22 0.895431 22 2V23.6309C22 25.149 20.375 26.1137 19.0423 25.3867L11.9577 21.5224C11.3607 21.1968 10.6393 21.1968 10.0423 21.5224L2.9577 25.3867C1.62495 26.1137 0 25.149 0 23.6309V2Z"
          fill={color}
        />
      </svg>
      <div className="text-[12px] text-[#2B3337] relative z-[2] text-center leading-[24px]">
        {rank}
      </div>
    </div>
  );
}
