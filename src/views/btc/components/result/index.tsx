import { addThousandSeparator } from "@/utils/format/number";
import ResultBg from "./bg";
import Modal from "@/components/modal";
import { useMemo } from "react";
import PointIcon from "@/components/icons/point-icon";
import Winner from "./winner";

const Config = {
  0: {
    gifHeight: 210,
    gifSrc: "/btc/level0.gif",
    title: "OPPPS",
    key: 0
  },
  1: {
    gifHeight: 183,
    gifSrc: "/btc/level1.gif",
    title: "OPPPS",
    desc: "But you got 1 Lucky Ticket",
    key: 1
  },
  2: {
    gifHeight: 222,
    gifSrc: "/btc/level2.gif",
    title: "Nice!",
    desc: "You’ve got",
    key: 2
  },
  3: {
    gifHeight: 222,
    gifSrc: "/btc/level3.gif",
    title: "Good Job!",
    desc: "You’ve got",
    key: 3
  }
};

export default function Result({ points, tickets, isWinner, onClose }: any) {
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
    <Winner points={points} onClose={onClose} />
  ) : (
    <Modal open={true} onClose={() => {}} className="backdrop-blur-[10px]">
      <div className="relative w-[464px] h-[584px]">
        <img
          src="/logo.svg"
          alt="dolla"
          className="w-[78px] h-[39px] absolute left-[50%] translate-x-[-50%] top-[20px] z-[20]"
        />
        <ResultBg />
        <div className="relative z-[2] flex flex-col items-center justify-center pt-[60px]">
          <img
            src={config.gifSrc}
            style={{
              height: config.gifHeight,
              marginTop: config.key === 0 ? 30 : 0
            }}
          />
          <div className="text-[32px] text-white font-[BlackHanSans] mt-[20px]">
            OPPPS
          </div>
          <div className="text-[16px] text-white font-[DelaGothicOne]">
            You didn't win this time
          </div>
          {config.key === 1 && (
            <img src="/btc/ticket2.png" className="w-[218px]" />
          )}
          {config.key !== 0 && config.key !== 1 && (
            <div className="flex items-center gap-[50px] pt-[18px] pb-[30px]">
              {points > 0 && (
                <div className="flex items-center gap-[8px]">
                  <PointIcon />
                  <span
                    className="text-[#FFEF43] text-[20px] font-bold font-[AlfaSlabOne]"
                    style={{
                      WebkitTextStrokeWidth: "1px",
                      WebkitTextStrokeColor: "#5E3737"
                    }}
                  >
                    x{addThousandSeparator(points.toString())}
                  </span>
                </div>
              )}
              {tickets > 0 && (
                <div className="relative w-[122px] h-[30px]">
                  <div className="bg-[url(/btc/ticket1.png)] w-[122px] h-[100px] bg-no-repeat bg-center bg-contain absolute top-[-36px] left-[-20px]" />
                  <span
                    className="absolute left-[80px] text-[#FFEF43] font-[AlfaSlabOne] text-[20px]"
                    style={{
                      WebkitTextStroke: "2px #5E3737"
                    }}
                  >
                    x{tickets}
                  </span>
                </div>
              )}
            </div>
          )}
          <button
            style={{
              marginTop: config.key === 0 ? 40 : 0
            }}
            onClick={onClose}
            className="h-[44px] w-[228px] button rounded-[8px] bg-linear-to-b from-[#FFF698] to-[#FFC42F] text-[#111111] font-[BlackHanSans] text-[16px]"
          >
            Try Your Luck Again
          </button>
        </div>
      </div>
    </Modal>
  );
}
