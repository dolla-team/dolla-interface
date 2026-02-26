import Button from "@/components/button";
import Timer from "./timer";
import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";
import { formatNumber } from "@/utils/format/number";
import useLuckyDrawStore from "@/stores/use-lucky-draw";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import { useAuth } from "@/contexts/auth";
import Avatar from "@/components/avatar";
import Round from "./round";

export default function LucyDrawCard({
  currentRound,
  nextRoundTime,
  prizeAmount,
  status,
  tickets,
  winningList,
  setStatus,
  fetchResult,
  setShowBuyTicket,
  participation,
}: any) {
  const isMobile = useIsMobile()
  const lucyDrawStore = useLuckyDrawStore()
  const { address, login } = useAuth()
  return (
    <div
      className={clsx(
        'border border-[#F2F2F233] overflow-hidden w-full h-[126px] my-[20px] px-[20px] pt-[10px] relative',
        isMobile
          ? 'rounded-t-[16px] pt-[12px]'
          : "rounded-[12px] bg-[url('/lucky-draw.png')] bg-[#1C1C23] bg-no-repeat bg-cover bg-center"
      )}
    >
      <Round status={status} />
      <div className="flex items-center justify-between relative z-[2]">
        <div className="flex items-center">
          <span
            className="text-white text-[24px] font-[800] mr-[10px]"
            style={{
              textShadow: '0px 0px 10px #8465FF',
            }}
          >
            Lucky Draw
          </span>
          <LuckyInfo />
          <div className="text-black text-[10px] px-[16px] py-[3px] rounded-[12px] bg-[url('/lucky-draw/round-bg.png')] bg-no-repeat bg-center bg-cover">
            #{currentRound}
          </div>
          <Timer
            nextRoundTime={nextRoundTime}
            onTimeUp={() => {
              if (currentRound) {
                setStatus(1)
                fetchResult()
              }
            }}
            className={isMobile ? 'w-[180px] h-[46px] px-[26px] text-[16px]' : ''}
            size={isMobile ? 22 : 14}
            key={currentRound}
          />
        </div>
        <button
          className="button underline text-white text-[12px]"
          onClick={() => lucyDrawStore.set({ showHistory: true })}
        >
          History
        </button>
      </div>
      <div
        className={clsx(
          'flex items-center justify-between mt-[20px] relative z-[2]',
          status === 2 && 'opacity-50'
        )}
      >
        <div className="flex items-center">
          <span
            className="text-white text-[24px] font-[800]"
            style={{
              textShadow: '0px 0px 10px #8465FF',
            }}
          >
            ${prizeAmount.toLocaleString()}
          </span>
          {status === 1 && <div className="text-[12px] text-white ml-[20px]">Drawing...</div>}
          {status === 2 && (
            <>
              <div className="ml-[20px]">
                <div className="text-[12px] text-white">Winner</div>
                <div className="text-[14px] text-white font-[500]">{winningList.length}</div>
              </div>
              <div className="relative z-[2] flex items-center gap-[8px] ml-[40px]">
                {winningList.map((item: any, index: number) => (
                  <Avatar
                    address={item.user}
                    key={index}
                    className="border border-[#DD9000] rounded-full"
                    size={30}
                    src={item.user_info?.icon}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex items-center text-white">
          <div>
            <div className="text-[10px]">Participation</div>
            <div className="text-[14px]">{formatNumber(participation, 0, true)}</div>
          </div>
          <div className="mx-[60px]">
            <div className="text-[10px]">You Auto Joined</div>
            <div className="text-[14px]">{tickets}</div>
          </div>
          <Button
            className={clsx('w-[112px] h-[42px]')}
            onClick={() => {
              if (!address) {
                login()
                return
              }
              setShowBuyTicket(true)
            }}
          >
            Buy Ticket
          </Button>
        </div>
      </div>
    </div>
  )
}

export const LuckyInfo = () => {
  return (
    <Popover
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.Top}
      content={
        <div className="w-[360px] text-[#5E6B7D] text-[12px] font-[300] p-[10px] bg-white rounded-[10px] border border-[#E4E4E4]">
          This is the address where your withdrawal will be sent. Double-check
          that your destination wallet supports the selected network.
        </div>
      }
    >
      <button className="relative transition-opacity button">
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
