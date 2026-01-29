import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import Timer from "../timer";
import useTaskStore from "@/stores/use-task";
import { useNavigate } from "@/libs/router";
import CloseIcon from "../close-icon";
import clsx from "clsx";
import FlipAvater from "./flip-avater";
import Avatar from "@/components/avatar";
import { useMemo } from "react";

export default function DetailModalPanel({
  onClose,
  currentRound,
  setStatus,
  fetchResult,
  prizeAmount,
  totalTickets,
  tickets,
  onShowBuyTicket,
  winningList,
  winningAmount,
  status,
  onChangePanel,
  from,
  poolStatus
}: any) {
  const taskStore = useTaskStore();
  const navigate = useNavigate();
  const winRate = useMemo(() => {
    if (totalTickets === 0 || tickets === 0) return "0";
    const _rate = Math.min(Math.floor((tickets / totalTickets) * 100), 100);
    return _rate < 1 ? "~ 1" : _rate;
  }, [tickets, totalTickets]);
  return (
    <div className="pb-[18px]">
      <div className="px-[24px] py-[18px] flex items-center justify-between">
        <div className="flex items-center gap-[2px]">
          <span className="text-[20px] font-[800] text-white text-shadow-[0px_0px_10px_#8465FF]">
            Lucky Draw
          </span>
          <LuckyInfo />
        </div>
        <CloseIcon onClick={onClose} />
      </div>
      <div className="flex flex-col items-center">
        <div className="px-[14px] py-[6px] text-[14px] text-[#3B3951] text-center rounded-[12px] shadow-[0_0_10px_0_#8465FF] bg-[url('/lucky-draw/winner-bg.png')] bg-size-[140%_160%] bg-no-repeat bg-center bg-cover">
          Round #{currentRound}
        </div>
        <div className="mt-[12px] text-white text-[42px] font-extrabold leading-[1] [text-shadow:0_4px_0_#361089] [text-stroke-width:1px] [text-stroke-color:#361089] [$--webkit-text-stroke-width:1px] [$--webkit-text-stroke-color:#361089]">
          ${prizeAmount.toLocaleString()}
        </div>
        <div className="mt-[18px] px-[6px]] h-[32px] border border-[#FFFFFF33] bg-[#FFFFFF1A] rounded-[18px]">
          {status === 0 && (
            <Timer
              onTimeUp={() => {
                if (currentRound) {
                  setStatus(1);
                  fetchResult();
                }
              }}
              className="text-[12px] px-[2px] gap-[6px]"
              currentRound={currentRound}
              size={14}
              key={currentRound}
            />
          )}
          {(status === 1 || status === 2) && (
            <div className="w-[112px] text-white text-[12px] px-[2px] gap-[6px] text-center leading-[30px]">
              Drawing...
            </div>
          )}
        </div>
      </div>
      {status === 1 && <FlipAvater />}
      {status === 2 && winningList.length > 0 && (
        <div className="flex flex-col items-center mt-[20px]">
          <span className="text-[12px] text-white">Winner</span>
          <div className="flex items-center gap-[8px]">
            {winningList.map((item: any, index: number) => (
              <div className="w-[36px] h-[36px] p-[1px] bg-linear-to-b from-[#DD9000] via-[#FFBF47] to-[#774E00] rounded-full">
                <Avatar
                  address={item.user}
                  key={index}
                  className="rounded-full"
                  size={34}
                  src={item.user_info?.icon}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {status !== 2 && (
        <div
          className={clsx(
            "grid grid-cols-3 mt-[30px]",
            status === 1 && "opacity-50"
          )}
        >
          <div className="flex flex-col items-center">
            <div className="text-[18px] text-white font-[700]">
              {totalTickets.toLocaleString()}
            </div>
            <div className="text-[12px] text-white">Total tickets</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-[8px]">
              <div className="text-[18px] text-white font-[700]">
                {tickets.toLocaleString()}
              </div>
              <img
                src="/lucky-draw/ticket-1.png"
                alt="ticket"
                className="w-[39px] h-[23px]"
              />
            </div>
            <div className="text-[12px] text-white">Your tickets</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[18px] text-white font-[700]">{winRate}%</div>
            <div className="text-[12px] text-white">Win rate</div>
          </div>
        </div>
      )}
      {status === 0 && (
        <div className="flex items-center gap-[25px] justify-center mt-[30px]">
          <button
            onClick={onShowBuyTicket}
            className="button w-[204px] h-[46px] rounded-[12px] border border-[#FFFFFF80] text-white text-[12px] font-[500]"
          >
            + Buy
          </button>
          <div
            onClick={() => {
              onClose();
              if (from === "home" || poolStatus !== 1) {
                navigate("/");
                setTimeout(() => {
                  taskStore.set({ isBid: true });
                }, 300);
              }
            }}
            className="button w-[196px] h-[46px] leading-[46px] text-[12px] text-black font-[500] text-center rounded-[12px] shadow-[0_0_10px_0_#8465FF] bg-[url('/lucky-draw/winner-bg.png')] bg-size-[140%_160%] bg-no-repeat bg-center bg-cover"
          >
            Bid to win
          </div>
        </div>
      )}
      {status === 2 && winningAmount === 0 && (
        <div className="w-[456px] h-[72px] py-[12px] bg-[#8A87AA] rounded-[12px] mx-auto mt-[20px] text-white text-center">
          <div className="text-[16px] font-[600]">You Missed</div>
          <div className="text-[14px]">Good luck next round</div>
        </div>
      )}
      {status === 2 && winningAmount > 0 && (
        <div className="w-[456px] h-[72px] py-[12px]  rounded-[12px] mx-auto mt-[20px] text-black text-center shadow-[0_0_10px_0_#8465FF] bg-[url('/lucky-draw/winner-bg.png')] bg-size-[140%_160%] bg-no-repeat bg-center bg-cover">
          <div className="text-[16px] font-[600]">Congrats!</div>
          <div className="text-[14px]">
            You win{" "}
            <span className="font-[600]">
              ${winningAmount.toLocaleString()}
            </span>{" "}
            in this round
          </div>
        </div>
      )}
      <div className="flex justify-center mt-[20px]">
        <button
          onClick={() => onChangePanel("history")}
          className="button underline text-[#D9D9D9] text-[12px]"
        >
          History
        </button>
      </div>
    </div>
  );
}

export const LuckyInfo = () => {
  return (
    <Popover
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.Top}
      content={
        <div className="w-[298px] text-[#5E6B7D] text-[12px] font-[300] p-[16px] bg-white rounded-[10px] border border-[#E4E4E4]">
          <div className="font-[500] text-black mb-[4px]">Lucky Draw</div>{' '}
          <div>
            Earn tickets from your bids for a chance to win part of the $X daily pool. 100 winners
            every 24h — tickets reset each round. <br />
            🥇1st winner: 50 USDT <br />
            🥈2st winner: 15 USDT <br />
            🥉3st winner: 10 USDT <br />
            🍀Lucky players: 5 USDT
          </div>
        </div>
      }
    >
      <button className="relative transition-opacity button flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M8 16C3.582 16 0 12.418 0 8C0 3.582 3.582 0 8 0C12.418 0 16 3.582 16 8C16 12.418 12.418 16 8 16ZM8 14.6667C11.682 14.6667 14.6667 11.682 14.6667 8C14.6667 4.318 11.682 1.33333 8 1.33333C4.318 1.33333 1.33333 4.318 1.33333 8C1.33333 11.682 4.318 14.6667 8 14.6667ZM7.33333 7.33333C7.33333 7.15652 7.40357 6.98695 7.5286 6.86193C7.65362 6.7369 7.82319 6.66667 8 6.66667C8.17681 6.66667 8.34638 6.7369 8.4714 6.86193C8.59643 6.98695 8.66667 7.15652 8.66667 7.33333V12C8.66667 12.1768 8.59643 12.3464 8.4714 12.4714C8.34638 12.5964 8.17681 12.6667 8 12.6667C7.82319 12.6667 7.65362 12.5964 7.5286 12.4714C7.40357 12.3464 7.33333 12.1768 7.33333 12V7.33333ZM7.93333 5.2C7.6858 5.2 7.4484 5.10167 7.27337 4.92663C7.09833 4.7516 7 4.5142 7 4.26667C7 4.01913 7.09833 3.78173 7.27337 3.6067C7.4484 3.43167 7.6858 3.33333 7.93333 3.33333C8.18087 3.33333 8.41827 3.43167 8.5933 3.6067C8.76833 3.78173 8.86667 4.01913 8.86667 4.26667C8.86667 4.5142 8.76833 4.7516 8.5933 4.92663C8.41827 5.10167 8.18087 5.2 7.93333 5.2Z"
            fill="#8A87AA"
          />
        </svg>
      </button>
    </Popover>
  )
};
