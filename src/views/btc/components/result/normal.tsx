import { addThousandSeparator } from "@/utils/format/number";
import PointIcon from "@/components/icons/point-icon";
import clsx from "clsx";
import Tabs from "@/components/tabs";
import { BID_UNITS } from "@/config";
import Button from "@/components/button";
import useIsMobile from "@/hooks/use-is-mobile";
import { useBtcContext } from "../../context";
import { useEffect, useMemo } from "react";
import Bg, { PointsCardBg, TicketsCardBg } from "./bg";
import { CloseBtn } from "../../share-btn";

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
  points,
  tickets,
  disabled,
  balanceNotEnough,
  onBidClick
}: any) {
  const isMobile = useIsMobile();
  const { bids, setBids, flipStatus, onReset } = useBtcContext();

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
    if (flipStatus === 2) {
      onReset();
    }
  }, [flipStatus]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full z-[9999] bg-[#1C1C23] flex items-center justify-center gap-[60px]">
        <div className="absolute top-[20px] right-[20px] z-[110]">
          <CloseBtn />
        </div>
        {(points > 0 || tickets > 0) && (
          <div className="relative w-[500px]">
            <Bg />
            {points > 0 && (
              <PointsCardBg
                className={clsx(
                  'z-[2]',
                  points && tickets
                    ? 'top-[-260px] right-[-60px]'
                    : 'top-[-260px] left-[40px] rotate-[-18deg]'
                )}
                points={points}
              />
            )}
            {tickets > 0 && (
              <TicketsCardBg
                className={clsx(
                  'z-[1]',
                  points && tickets ? 'top-[-322px] left-[-100px]' : 'top-[-260px] left-[40px]'
                )}
                tickets={tickets}
              />
            )}
          </div>
        )}
        <div className={clsx('relative h-[584px]', isMobile ? 'w-full' : 'w-[464px]')}>
          <div className="relative z-[2] flex flex-col items-center justify-center pt-[60px]">
            <div className="flex items-center gap-[24px]">
              <img
                src={config.gifSrc}
                style={{
                  height: config.gifHeight,
                  marginTop: 30,
                }}
                className="rounded-[12px]"
              />
              <div>
                <div className="text-[26px] text-white font-[600] mt-[20px]">{config.title}</div>
                <div className="text-[16px] text-white font-[600] mt-[10px]">{config.desc}</div>
              </div>
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
                  <img src="/lucky-draw/ticket-1.png" alt="ticket" className="w-[53px] h-[32px]" />
                  <span className="text-[20px] font-[900] bg-[radial-gradient(50%_50%_at_50%_50%,#FFEF43_0%,#FFC42F_100%)] bg-clip-text text-transparent">
                    +{tickets.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            <Tabs
              tabs={BID_UNITS.map(item => ({ label: `$${item}`, key: item }))}
              currentTab={bids}
              onChangeTab={(tab: any) => {
                if (flipStatus === 1) return
                setBids(tab)
              }}
              className={clsx(
                'w-[346px] h-[38px] mt-[50px] p-[2px] !gap-0 rounded-[10px] backdrop-blur-[25px] border border-[#F2F2F233] bg-[#FFFFFF1F]',
                flipStatus === 1 && 'pointer-events-none'
              )}
              tabClassName={clsx(
                'text-[12px] w-[85px] text-center h-[18px] leading-[18px] text-white not-first:border-l border-[#8A87AA]/30'
              )}
              activeClassName="!text-black"
              cursorClassName={clsx(
                '!h-[32px] !w-[85px] rounded-[8px] !left-[50%] translate-x-[-50%] !bottom-[-7px] !bg-[#FFC42F]'
              )}
            />
            <Button
              onClick={() => {
                if (disabled) return
                onBidClick()
              }}
              disabled={disabled || balanceNotEnough}
              loading={flipStatus === 1}
              className={clsx(
                'h-[44px] w-[346px] mt-[20px] button rounded-[8px] font-[600] text-[16px]',
                flipStatus === 2 ? '!bg-[#4CB100] text-white' : '!bg-[#FFC42F] text-black'
              )}
            >
              {balanceNotEnough
                ? 'Insufficient Balance'
                : flipStatus === 1
                  ? 'Bidding'
                  : flipStatus === 2
                    ? 'Success'
                    : 'Bid Again'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
