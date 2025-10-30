import { addThousandSeparator } from "@/utils/format/number";
import ResultBg from "./bg";
import Modal from "@/components/modal";
import { useMemo } from "react";
import PointIcon from "@/components/icons/point-icon";
import Winner from "./winner";
import DollaEye from "@/components/dolla-eye";
import clsx from "clsx";
import useIsMobile from "@/hooks/use-is-mobile";
import Tabs from "@/components/tabs";
import { BID_UNITS } from "@/config";
import { useBtcContext } from "../../context";
import Button from "@/components/button";

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

export default function Result({
  points,
  tickets,
  isWinner,
  onClose,
  disabled,
  balanceNotEnough,
  onBidClick
}: any) {
  const isMobile = useIsMobile();
  const { bids, setBids } = useBtcContext();
  const config = useMemo(() => {
    if (!points && !tickets) {
      return Config[0];
    }
    if (!points && tickets === 1) {
      return Config[1];
    }

    return points > 10000 ? Config[3] : Config[2];
  }, [points, tickets]);

  return isWinner ? (
    <Winner onClose={onClose} />
  ) : (
    <Modal open={true} onClose={() => {}} className="backdrop-blur-[10px]">
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
  );
}
