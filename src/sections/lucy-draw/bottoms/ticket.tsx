import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";

export default function TicketBottom({
  tickets,
  onBuyTicket
}: {
  tickets: number;
  onBuyTicket: () => void;
}) {
  const isMobile = useIsMobile();
  return (
    <div className="flex items-center justify-end h-full relative z-[4]">
      <div
        className={clsx(
          "bg-[url(/btc/ticket1.png)] bg-no-repeat bg-center absolute",
          isMobile
            ? "w-[200px] h-[90px] top-[16px] left-[-10px]"
            : "w-[122px] h-[100px] bg-contain top-[-20px] left-[-10px]"
        )}
      />
      <div className={clsx(isMobile ? "w-[140px]" : "w-[140px]")}>
        <div
          className={clsx(
            "text-[#FFE9B2]",
            isMobile ? "text-[14px]" : "text-[12px]"
          )}
        >
          Auto Joined
        </div>
        <div
          className={clsx(
            "flex items-center justify-between pr-[12px]",
            isMobile ? "mt-[10px]" : ""
          )}
        >
          {isMobile ? (
            <div className="px-[8px] text-[18px] min-w-[40px] text-center font-[DelaGothicOne] rounded-[16px] border border-black bg-[#FF0A7C] text-white">
              x{tickets}
            </div>
          ) : (
            <span
              className="text-[#FFEF43] font-[AlfaSlabOne] text-[20px]"
              style={{
                WebkitTextStroke: "2px #5E3737"
              }}
            >
              x{tickets}
            </span>
          )}
          <button
            className={clsx(
              "button",
              isMobile
                ? "w-[50px] h-[24px] rounded-[12px] text-[16px] text-black bg-linear-to-r from-[#FFE9B2] to-[#FFC42F]"
                : "rounded-[8px] text-[18px] text-white font-[BlackHanSans]"
            )}
            onClick={() => {
              onBuyTicket();
            }}
          >
            {isMobile ? (
              "Buy"
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <circle cx="9" cy="9" r="9" fill="#FFC42F" />
                <path d="M10 8H13V10H10V13H8V10H5V8H8V5H10V8Z" fill="black" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
