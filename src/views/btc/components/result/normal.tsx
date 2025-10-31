import { addThousandSeparator, formatNumber } from "@/utils/format/number";
import ResultBg from "./bg";
import Modal from "@/components/modal";
import PointIcon from "@/components/icons/point-icon";
import DollaEye from "@/components/dolla-eye";
import clsx from "clsx";
import Tabs from "@/components/tabs";
import { BID_UNITS } from "@/config";
import Button from "@/components/button";
import useIsMobile from "@/hooks/use-is-mobile";
import { useBtcContext } from "../../context";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const Config = {
  0: {
    gifHeight: 120,
    gifSrc: "/btc/level0.gif",
    title: "OPPPS",
    desc: "Good luck next round",
    key: 0
  },
  1: {
    gifHeight: 120,
    gifSrc: "/btc/level1.gif",
    title: "OPPPS",
    desc: "But you got 1 Lucky Ticket",
    key: 1
  },
  2: {
    gifHeight: 120,
    gifSrc: "/btc/level2.gif",
    title: "Nice!",
    desc: "You’ve got",
    key: 2
  },
  3: {
    gifHeight: 120,
    gifSrc: "/btc/level3.gif",
    title: "Good Job!",
    desc: "You’ve got",
    key: 3
  }
};

export default function Normal({
  onClose,
  points,
  tickets,
  disabled,
  balanceNotEnough,
  onBidClick
}: any) {
  const isMobile = useIsMobile();
  const { bids, setBids } = useBtcContext();
  const [showPointsAnim, setShowPointsAnim] = useState(false);
  const [showTicketAnim, setShowTicketAnim] = useState(false);
  const [ticketRect, setTicketRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [pointRect, setPointRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const config = useMemo(() => {
    if (!points && !tickets) {
      return Config[0];
    }
    if (!points && tickets === 1) {
      return Config[1];
    }

    return points > 10000 ? Config[3] : Config[2];
  }, [points, tickets]);

  useEffect(() => {
    if (!points) return;
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById("animation-points-point-icon");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setPointRect({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      });
      setShowPointsAnim(true);
    });

    return () => cancelAnimationFrame(raf);
  }, [points]);

  useEffect(() => {
    if (!tickets || tickets <= 0) return;
    const el = document.getElementById("animation-lucky-draw-ticket");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setTicketRect({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    });
    setShowTicketAnim(true);
  }, [tickets]);

  useEffect(() => {
    if (!showTicketAnim) return;

    const timer = setTimeout(() => setShowTicketAnim(false), 3000);
    return () => clearTimeout(timer);
  }, [showTicketAnim]);

  useEffect(() => {
    if (!showPointsAnim) return;
    const timer = setTimeout(() => setShowPointsAnim(false), 3000);
    return () => clearTimeout(timer);
  }, [showPointsAnim]);

  return (
    <>
      {showPointsAnim && pointRect && (
        <AnimationPoints pointRect={pointRect} points={points} />
      )}
      {showTicketAnim && ticketRect && (
        <AnimationTicket ticketRect={ticketRect} tickets={tickets} />
      )}
      <Modal open={true} onClose={onClose} className="backdrop-blur-[10px]">
        <div
          className={clsx(
            "relative h-[584px]",
            isMobile ? "w-full" : "w-[464px]"
          )}
        >
          <DollaEye
            className="absolute left-[50%] translate-x-[-50%] top-[10px] z-[20]"
            height={40}
          />
          <ResultBg />
          <div className="relative z-[2] flex flex-col items-center justify-center pt-[60px]">
            <img
              src={config.gifSrc}
              style={{
                height: config.gifHeight,
                marginTop: 30
              }}
              className="rounded-[12px]"
            />
            <div className="text-[26px] text-white font-[600] mt-[20px]">
              {config.title}
            </div>
            <div className="text-[16px] text-white font-[600] mt-[10px]">
              {config.desc}
            </div>
            <div className="mt-[30px] h-[36px] flex items-center gap-[50px]">
              {points > 0 && (
                <div className="flex items-center gap-[8px]">
                  <PointIcon size={36} />
                  <span className="text-[20px] font-[900] bg-[radial-gradient(50%_50%_at_50%_50%,#FFEF43_0%,#FFC42F_100%)] bg-clip-text text-transparent">
                    +{addThousandSeparator(points.toString())}
                  </span>
                </div>
              )}
              {tickets > 0 && (
                <div className="flex items-center gap-[2px]">
                  <img
                    src="/lucky-draw/ticket-1.png"
                    alt="ticket"
                    className="w-[53px] h-[32px]"
                  />
                  <span className="text-[20px] font-[900] bg-[radial-gradient(50%_50%_at_50%_50%,#FFEF43_0%,#FFC42F_100%)] bg-clip-text text-transparent">
                    +{tickets.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            <Tabs
              tabs={BID_UNITS.map((item) => ({ label: `$${item}`, key: item }))}
              currentTab={bids}
              onChangeTab={(tab: any) => {
                setBids(tab);
              }}
              className="w-[346px] h-[38px] mt-[50px] p-[2px] !gap-0 rounded-[10px] backdrop-blur-[25px] border border-[#F2F2F233] bg-[#FFFFFF1F]"
              tabClassName={clsx(
                "text-[12px] w-[85px] text-center h-[18px] leading-[18px] text-white not-first:border-l border-[#8A87AA]/30"
              )}
              activeClassName="!text-black"
              cursorClassName={clsx(
                "!h-[32px] !w-[85px] rounded-[8px] !left-[50%] translate-x-[-50%] !bottom-[-7px] !bg-[#FFC42F]"
              )}
            />
            <Button
              onClick={() => {
                if (disabled) return;
                onClose();
                onBidClick();
              }}
              disabled={disabled || balanceNotEnough}
              className="h-[44px] w-[346px] mt-[20px] button rounded-[8px] bg-linear-to-b from-[#FFF698] to-[#FFC42F] text-[#111111] font-[600] text-[16px]"
            >
              {balanceNotEnough ? "Insufficient Balance" : "Bid Again"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

const AnimationPoints = ({
  pointRect,
  points
}: {
  pointRect: { left: number; top: number; width: number; height: number };
  points: number;
}) => {
  if (!pointRect) return null;
  const coinSize = Math.max(pointRect.width, 16);
  const coins = Array.from({ length: 6 }).map((_, i) => {
    const duration = 0.6;
    const delay = i * 0.08;
    const startOffsetY = -(pointRect.height + 30); // start above
    return (
      <motion.div
        key={i}
        initial={{ y: startOffsetY, x: 0, rotate: 0, opacity: 0 }}
        animate={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
        transition={{ duration, ease: "easeIn", delay }}
        style={{
          position: "fixed",
          left: pointRect.left,
          top: pointRect.top,
          width: coinSize,
          height: coinSize,
          zIndex: 9999,
          pointerEvents: "none"
        }}
      >
        <PointIcon className="w-full h-full" size={coinSize} />
      </motion.div>
    );
  });

  return (
    <>
      {coins}
      {/* stationary coin at landing position (exactly at pointRect) */}
      <div
        style={{
          position: "fixed",
          left: pointRect.left,
          top: pointRect.top,
          width: coinSize,
          height: coinSize,
          zIndex: 9998,
          pointerEvents: "none"
        }}
      >
        <PointIcon className="w-full h-full" size={coinSize} />
      </div>
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: -8, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          position: "fixed",
          left: pointRect.left + coinSize + 8,
          top: pointRect.top + pointRect.height / 2 - 8,
          zIndex: 10000,
          fontWeight: 800,
          fontSize: 20,
          background:
            "radial-gradient(50% 50% at 50% 50%, #FFEF43 0%, #FFC42F 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        {`+${formatNumber(points, 0, true)}`}
      </motion.div>
    </>
  );
};

const AnimationTicket = ({
  ticketRect,
  tickets
}: {
  ticketRect: { left: number; top: number; width: number; height: number };
  tickets: number;
}) => {
  if (!ticketRect) return null;
  return (
    <>
      <motion.img
        src="/lucky-draw/ticket-1.png"
        alt="ticket"
        initial={{ scale: 1, opacity: 0.9 }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.9, 1, 0.9] }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
          repeat: 5,
          repeatType: "loop"
        }}
        style={{
          position: "fixed",
          left: ticketRect.left,
          top: ticketRect.top,
          width: ticketRect.width,
          height: ticketRect.height,
          zIndex: 1000,
          pointerEvents: "none"
        }}
      />
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: -12, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          position: "fixed",
          left: ticketRect.left + ticketRect.width + 8,
          top: ticketRect.top + ticketRect.height / 2 - 8,
          zIndex: 1001,
          fontWeight: 800,
          fontSize: 20,
          background:
            "radial-gradient(50% 50% at 50% 50%, #FFEF43 0%, #FFC42F 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        {`+${tickets.toLocaleString()}`}
      </motion.div>
    </>
  );
};
