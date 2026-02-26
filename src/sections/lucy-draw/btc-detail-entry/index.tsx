import Round from "../round";
import Timer from "../timer";
import useLuckyDrawStore from "@/stores/use-lucky-draw";
import clsx from "clsx";
import LucyDrawHistory from "../history";

export default function BtcDetailEntry({
  prizeAmount,
  currentRound,
  nextRoundTime,
  setStatus,
  fetchResult,
  participation,
  tickets,
  setShowBuyTicket,
  onShowDetail,
  winningAmount,
  status,
}: any) {
  const lucyDrawStore = useLuckyDrawStore()
  return (
    <>
      <div
        onClick={onShowDetail}
        className="absolute z-[10] top-[140px] right-[20px] w-[250px] h-[156px] cursor-pointer"
      >
        <div className="absolute w-[155px] h-[155px] rounded-full right-0 top-0 shadow-[0_0_20px_10px_#7201F3]">
          <Round size={155} status={status} />
        </div>
        <div className="flex absolute right-0 top-[54px] z-[2] gap-[3px]">
          <div className="text-white text-[30px] font-extrabold leading-[1] [text-shadow:0_4px_0_#361089] [text-stroke-width:1px] [text-stroke-color:#361089] [$--webkit-text-stroke-width:1px] [$--webkit-text-stroke-color:#361089]">
            ${prizeAmount.toLocaleString()}
          </div>
          <div className="w-[118px] h-[50px] border border-[#FFFFFF33] bg-[#FFFFFF1A] rounded-t-[12px] backdrop-blur-[25px]">
            {status === 0 && (
              <Timer
                onTimeUp={() => {
                  if (currentRound) {
                    setStatus(1)
                    fetchResult()
                  }
                }}
                className="text-[12px] !px-[3px] justify-center gap-[4px] !h-[32px]"
                nextRoundTime={nextRoundTime}
                size={14}
                key={currentRound}
              />
            )}
            {(status === 1 || status === 2) && (
              <div className="text-[12px] text-white text-center leading-[30px]">Drawing...</div>
            )}
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 z-[2] px-[8px] py-[6px] w-[250px] h-[70px] rounded-[10px] border border-[#F2F2F233]"
          style={{
            background: 'linear-gradient(0deg, #7201F4 0%, #7201F4 100%), rgba(0, 0, 0, 0.10)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[4px]">
              <span className="text-white text-[16px] font-[800] text-shadow-[0px_0px_10px_#8465FF]">
                Lucky Draw
              </span>
              <div className="px-[6px] py-[1px] text-[10px] text-[#3B3951] rounded-[12px] shadow-[0_0_10px_0_#8465FF] bg-[url('/lucky-draw/winner-bg.png')] bg-size-[140%_160%] bg-no-repeat bg-center bg-cover">
                #{currentRound}
              </div>
            </div>
            <button
              onClick={e => {
                e.stopPropagation()
                lucyDrawStore.set({ showHistory: true })
              }}
              className="button underline text-white text-[10px]"
            >
              History
            </button>
          </div>
          {(status === 0 || status === 1) && (
            <div className="flex items-center justify-between mt-[6px] gap-[16px]">
              <div className="flex items-center justify-between flex-1">
                <div className="flex items-center gap-[4px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="13"
                    viewBox="0 0 11 13"
                    fill="none"
                  >
                    <path
                      d="M5.54199 0.00244141C7.15791 0.0417354 8.44639 0.532936 9.40625 1.4751C10.3658 2.41713 10.827 3.64794 10.79 5.16748C10.7538 6.65572 10.2331 7.84731 9.22852 8.7417C8.82075 9.10471 8.362 9.38896 7.85352 9.59814C9.14818 10.2448 9.67065 11.3859 9.71582 12.062C9.70388 12.0696 8.23666 12.9995 5.50879 12.9995C2.76981 12.9995 1.45312 12.062 1.45312 12.062C1.58396 11.4084 2.04545 10.3204 3.21875 9.66455C2.52143 9.4186 1.91009 9.04898 1.38672 8.55127C0.426953 7.60917 -0.0342308 6.39386 0.00195312 4.90576C0.0389609 3.38589 0.55894 2.17808 1.56348 1.28369C2.5997 0.39011 3.92618 -0.0368087 5.54199 0.00244141Z"
                      fill="white"
                    />
                    <path
                      d="M3.44727 3.19507L3.44727 4.52577"
                      stroke="black"
                      strokeLinecap="round"
                    />
                    <path
                      d="M7.92773 3.46069L6.64157 3.8051"
                      stroke="black"
                      strokeLinecap="round"
                    />
                    <path
                      d="M3.58203 6.52109C4.64726 7.18644 6.91086 7.05337 7.97609 5.5896"
                      stroke="black"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-[12px] text-white font-[700]">
                    {participation.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-[2px]">
                  <img
                    src="/lucky-draw/ticket-1.png"
                    alt="ticket"
                    className="w-[40px] h-[24px]"
                    id="animation-lucky-draw-ticket"
                  />
                  <span className="text-[12px] text-white font-[700]">
                    x{tickets.toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                className={clsx(
                  'w-[54px] h-[26px] !bg-[#FFC42F] text-black !rounded-[8px] text-[12px] font-[500]',
                  status === 1 ? 'opacity-30 cursor-not-allowed' : 'button'
                )}
                onClick={e => {
                  if (status === 1) return
                  e.stopPropagation()
                  setShowBuyTicket(true)
                }}
              >
                + Buy
              </button>
            </div>
          )}
          {status === 2 &&
            (winningAmount === 0 ? (
              <div className="flex items-center justify-center text-white text-[12px] font-[500] mt-[4px] h-[28px] w-[230px] rounded-[20px] bg-[#8A87AA]">
                You Missed
              </div>
            ) : (
              <div className="flex items-center justify-center text-black text-[12px] font-[500] mt-[4px] h-[28px] w-[230px] rounded-[20px] shadow-[0_0_10px_0_#8465FF] bg-[url('/lucky-draw/winner-bg.png')] bg-size-[140%_160%] bg-no-repeat bg-center bg-cover">
                You Win ${winningAmount.toLocaleString()}
              </div>
            ))}
        </div>
      </div>
      <LucyDrawHistory />
    </>
  )
}
