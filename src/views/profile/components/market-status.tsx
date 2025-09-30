import clsx from "clsx";

const MarketStatus = (props: Props) => {
  const { className, value } = props;

  const currentMarketStatus = MarketStatusMap[value];

  return (
    <div
      className={clsx(
        "rounded-[20px] h-[24px] shrink-0 p-[6px] text-[#2B3337] text-[12px] inline-flex justify-center items-center gap-[7px]",
        ![EMarketStatus.Cancelled, EMarketStatus.Winner].includes(value) &&
          "bg-[#D7FFD3]",
        value === EMarketStatus.Cancelled && "bg-[#FF60A833]",
        value === EMarketStatus.Winner && "bg-[#C9C9C9]/20",
        className
      )}
    >
      {[EMarketStatus.Live].includes(value) && (
        <div className="w-[9px] h-[9px] flex-shrink-0 bg-[#54FF59] rounded-full" />
      )}
      {[EMarketStatus.Cancelled].includes(value) && (
        <div className="w-[9px] h-[9px] flex-shrink-0 bg-[#6F37FF] rounded-full" />
      )}
      {[EMarketStatus.Winner].includes(value) && (
        <div className="w-[9px] h-[9px] flex-shrink-0 bg-[#ADBCCF] rounded-full" />
      )}
      <div
        className={clsx(
          "h-[12px] leading-[12px]"
          // value === EMarketStatus.Winner && "border-r border-[#ADBCCF]"
        )}
      >
        {currentMarketStatus?.label}
      </div>
      {/* {value === EMarketStatus.Winner && (
        <>
          {market?.winner_user_info?.avatar && (
            <img
              src={market?.winner_user_info.avatar}
              className="w-[20px] h-[20px] rounded-full shrink-0 border-[2px] border-[#131417] object-center object-cover"
            />
          )}
          {market?.winner_user && (
            <div className="text-[#ADBCCF]">
              {formatAddress(market?.winner_user)}
            </div>
          )}
        </>
      )} */}
    </div>
  );
};

interface Props {
  className?: string;
  value: EMarketStatus;
  market?: any;
}

export default MarketStatus;

export enum EMarketStatus {
  // Created
  Created = 0,
  // sold
  Live = 1,
  // Closed
  Cancelled = 3,
  // Ended
  Winner = 2,
  PreCancel = 5
}

export const MarketStatusMap = {
  [EMarketStatus.Created]: {
    label: "Live",
    name: "Created"
  },
  [EMarketStatus.Live]: {
    label: "Live",
    name: "Sold"
  },
  [EMarketStatus.Cancelled]: {
    label: "Cancelled",
    name: "Cancelled"
  },
  [EMarketStatus.Winner]: {
    label: "Ended",
    name: "Ended"
  },
  [EMarketStatus.PreCancel]: {
    label: "Paused",
    name: "Paused"
  }
};
