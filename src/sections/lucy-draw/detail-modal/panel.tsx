import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import Timer from "../timer";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import useTaskStore from "@/stores/use-task";
import { useNavigate } from "react-router-dom";
import CloseIcon from "../close-icon";
import clsx from "clsx";
import FlipAvater from "./flip-avater";
import Avatar from "@/components/avatar";

export default function DetailModalPanel({
  onClose,
  currentRound,
  setStatus,
  fetchResult,
  prizeAmount,
  participation,
  tickets,
  onShowBuyTicket,
  winningList,
  winningAmount,
  status,
  onChangePanel
}: any) {
  const taskStore = useTaskStore();
  const navigate = useNavigate();
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
                  email={item.user_info?.show_email}
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
              {participation.toLocaleString()}
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
            <div className="text-[18px] text-white font-[700]">
              {formatNumber(
                Big(tickets || 0)
                  .div(participation || 1)
                  .toNumber(),
                1,
                true
              )}
              %
            </div>
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
              navigate("/");
              setTimeout(() => {
                taskStore.set({ isBid: true });
              }, 300);
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

const LuckyInfo = () => {
  return (
    <Popover
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.Top}
      content={
        <div className="w-[440px] text-[#5E6B7D] text-[12px] font-[300] p-[10px] bg-white rounded-[10px] border border-[#E4E4E4]">
          <div>
            {" "}
            A continuous platform event that runs in 24-hour cycles, drawing 10
            lucky winners each round.
          </div>{" "}
          <div>Prize Distribution:</div>{" "}
          <div>1st tier – 1 winner shares 50 % of the prize pool</div>{" "}
          <div>2nd tier – 3 winners share 30 % of the prize pool</div>{" "}
          <div>3rd tier – 6 winners share 20 % of the prize pool</div>
          <div>
            Tickets: Tickets earned by players in the bid market are
            automatically entered into the current round. Tickets can also be
            purchased directly at 1 USDT per ticket.
          </div>
        </div>
      }
    >
      <button className="relative transition-opacity button flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
        >
          <path
            d="M6.5 13C2.91037 13 0 10.0896 0 6.5C0 2.91037 2.91037 0 6.5 0C10.0896 0 13 2.91037 13 6.5C13 10.0896 10.0896 13 6.5 13ZM6.5 11.9167C9.49162 11.9167 11.9167 9.49162 11.9167 6.5C11.9167 3.50838 9.49162 1.08333 6.5 1.08333C3.50838 1.08333 1.08333 3.50838 1.08333 6.5C1.08333 9.49162 3.50838 11.9167 6.5 11.9167ZM5.95833 5.95833C5.95833 5.81467 6.0154 5.6769 6.11698 5.57532C6.21857 5.47374 6.35634 5.41667 6.5 5.41667C6.64366 5.41667 6.78143 5.47374 6.88302 5.57532C6.9846 5.6769 7.04167 5.81467 7.04167 5.95833V9.75C7.04167 9.89366 6.9846 10.0314 6.88302 10.133C6.78143 10.2346 6.64366 10.2917 6.5 10.2917C6.35634 10.2917 6.21857 10.2346 6.11698 10.133C6.0154 10.0314 5.95833 9.89366 5.95833 9.75V5.95833ZM6.44583 4.225C6.24471 4.225 6.05183 4.1451 5.90961 4.00289C5.7674 3.86067 5.6875 3.66779 5.6875 3.46667C5.6875 3.26554 5.7674 3.07266 5.90961 2.93044C6.05183 2.78823 6.24471 2.70833 6.44583 2.70833C6.64696 2.70833 6.83984 2.78823 6.98206 2.93044C7.12427 3.07266 7.20417 3.26554 7.20417 3.46667C7.20417 3.66779 7.12427 3.86067 6.98206 4.00289C6.83984 4.1451 6.64696 4.225 6.44583 4.225Z"
            fill="white"
          />
        </svg>
      </button>
    </Popover>
  );
};
