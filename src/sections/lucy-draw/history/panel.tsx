import { useEffect, useState } from "react";
import { formatAddress } from "@/utils/format/address";
import clsx from "clsx";
import Avatar from "@/components/avatar";
import { useDebounceFn } from "ahooks";
import Empty from "@/sections/wallet/panels/info/empty";
import CloseIcon from "../close-icon";
import Loading from "@/components/icons/loading";

export default function LucyDrawHistoryPanel({
  historyRound,
  currentRound,
  prizeAmount,
  fetchCurrentRound,
  onChangePanel,
  isLoading,
  onClose
}: any) {
  const [round, setRound] = useState(1);
  const [winningList, setWinningList] = useState<any[]>([]);

  useEffect(() => {
    if (!historyRound && !currentRound) return;
    setRound(historyRound || currentRound - 1);
  }, [historyRound, currentRound]);

  const { run: fetchCurrentRoundDebounce } = useDebounceFn(
    () => {
      setWinningList([]);
      fetchCurrentRound(round).then((res: any) => {
        setWinningList(res.winningList);
      });
    },
    {
      wait: 500
    }
  );

  useEffect(() => {
    if (!open) return;
    fetchCurrentRoundDebounce();
  }, [round, open]);
  return (
    <div className="relative">
      {onChangePanel && (
        <button
          className="p-[4px] button absolute top-[16px] left-[16px]"
          onClick={() => onChangePanel("detail")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="7"
            height="13"
            viewBox="0 0 7 13"
            fill="none"
          >
            <path
              d="M5.97656 0.480225L0.976562 6.48022L5.97656 12.4802"
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      )}
      <CloseIcon
        onClick={onClose}
        className="absolute top-[16px] right-[16px]"
      />
      <div className="h-[160px]">
        <div className="h-full flex flex-col justify-center items-center">
          <div className="text-[20px] font-[800] text-white text-shadow-[0px_0px_10px_#8465FF]">
            Rewards History
          </div>
          <div className="flex items-center gap-[16px] mt-[12px]">
            <button
              onClick={() => {
                if (round > 1) {
                  setRound(round - 1);
                }
              }}
              className={clsx(
                "w-[32px] h-[32px] flex items-center justify-center rounded-[8px] button border border-[#FFFFFF4D] bg-[#FFFFFF1A] backdrop-blur-[25px]",
                round > 1 ? "button" : "opacity-30"
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="13"
                viewBox="0 0 7 13"
                fill="none"
              >
                <path
                  d="M5.97656 0.480225L0.976562 6.48022L5.97656 12.4802"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
            <div className="px-[10px] h-[32px] rounded-[12px] text-[14px]  leading-[32px] text-center pointer-events-none select-none shadow-[0_0_10px_0_#8465FF] bg-[url('/lucky-draw/winner-bg.png')] bg-size-[140%_160%] bg-no-repeat bg-center bg-cover">
              Round #{round}
            </div>
            <button
              onClick={() => {
                if (round < currentRound - 1) {
                  setRound(round + 1);
                }
              }}
              className={clsx(
                "w-[32px] h-[32px] flex items-center justify-center rounded-[8px] button border border-[#FFFFFF4D] bg-[#FFFFFF1A] backdrop-blur-[25px]",
                round < currentRound - 1 ? "button" : "opacity-30"
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="13"
                viewBox="0 0 7 13"
                fill="none"
              >
                <path
                  d="M0.576172 0.480225L5.57617 6.48022L0.576172 12.4802"
                  stroke="white"
                  stroke-width="1.5"
                />
              </svg>
            </button>
          </div>
          <div className="text-[18px] mt-[12px] font-[800] text-white text-shadow-[0px_4px_0px_#361089]">
            ${prizeAmount.toLocaleString()}
          </div>
        </div>
      </div>
      <div className="py-[8px] h-[476px] border-t border-white/16">
        {winningList.map((item, index) => (
          <div
            key={item.tx_hash + index}
            className="px-[20px] py-[8px] flex items-center justify-between"
          >
            <div className="flex items-center gap-[6px]">
              <Rank rank={index + 1} />
              <Avatar
                size={30}
                email={item.user_info?.email_desensitization}
                src={item.user_info?.icon}
                address={item.user}
                className="text-[16px]"
              />
              <div className="text-[14px] text-white">
                {item.user_info?.name || formatAddress(item.user)}
              </div>
            </div>
            <div className="text-[14px] text-[#FFC42F] font-[DelaGothicOne]">
              ${item.volume}
            </div>
          </div>
        ))}
        {winningList.length === 0 && !isLoading && (
          <Empty className="!pt-[100px]" text="No Data" />
        )}
        {isLoading && (
          <div className="!pt-[100px] flex items-center justify-center">
            <Loading size={30} />
          </div>
        )}
      </div>
    </div>
  );
}

const Rank = ({ rank }: { rank: number }) => {
  return (
    <div className="relative w-[24px] h-[26px]">
      {rank < 4 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="26"
          viewBox="0 0 24 26"
          fill="none"
          className="absolute top-0 left-0"
        >
          <path
            d="M11.2005 1.06427C11.6005 0.531782 12.3995 0.531781 12.7995 1.06427L14.5267 3.36343C14.7799 3.70041 15.2172 3.84249 15.6201 3.71866L18.3688 2.87384C19.0054 2.67818 19.6518 3.14782 19.6625 3.81374L19.7084 6.68903C19.7152 7.11046 19.9854 7.48242 20.3841 7.61905L23.1045 8.55126C23.7345 8.76716 23.9814 9.52705 23.5986 10.072L21.9457 12.4252C21.7035 12.7701 21.7035 13.2299 21.9457 13.5748L23.5986 15.928C23.9814 16.4729 23.7345 17.2328 23.1045 17.4487L20.3841 18.3809C19.9854 18.5176 19.7152 18.8895 19.7084 19.311L19.6625 22.1863C19.6518 22.8522 19.0054 23.3218 18.3688 23.1262L15.6201 22.2813C15.2172 22.1575 14.7799 22.2996 14.5267 22.6366L12.7995 24.9357C12.3995 25.4682 11.6005 25.4682 11.2005 24.9357L9.47325 22.6366C9.2201 22.2996 8.78283 22.1575 8.37995 22.2813L5.63118 23.1262C4.99457 23.3218 4.34817 22.8522 4.33752 22.1863L4.29158 19.311C4.28485 18.8895 4.0146 18.5176 3.61588 18.3809L0.895511 17.4487C0.265472 17.2328 0.0185688 16.4729 0.401378 15.928L2.05426 13.5748C2.29653 13.2299 2.29653 12.7701 2.05427 12.4252L0.401378 10.072C0.018569 9.52705 0.265471 8.76716 0.895511 8.55126L3.61588 7.61905C4.0146 7.48242 4.28485 7.11046 4.29158 6.68903L4.33752 3.81374C4.34817 3.14782 4.99457 2.67818 5.63118 2.87384L8.37994 3.71866C8.78283 3.84249 9.22009 3.70041 9.47325 3.36343L11.2005 1.06427Z"
            fill="#6F39F9"
          />
        </svg>
      )}
      <div className="relative z-[2] text-[14px] text-white leading-[26px] text-center">
        {rank}
      </div>
    </div>
  );
};
