import { formatAddress } from "@/utils/format/address";
import clsx from "clsx";

const MarketStatus = (props: Props) => {
  const { className, value, market } = props;

  const currentMarketStatus = MarketStatusMap[value];

  return (
    <div
      className={clsx(
        "rounded-[10px] h-[26px] shrink-0 border border-[#6A5D3A] font-[SpaceGrotesk] text-[14px] bg-black/20 backdrop-blur-[5px] text-white font-[500] flex justify-center items-center gap-[7px]",
        ![EMarketStatus.Cancelled, EMarketStatus.Winner].includes(value) &&
          "pl-[20px] pr-[23px]",
        value === EMarketStatus.Cancelled && "pl-[9px] pr-[10px]",
        value === EMarketStatus.Winner && "pl-[8px] pr-[11px]",
        className
      )}
    >
      {![
        EMarketStatus.Cancelled,
        EMarketStatus.Winner,
        EMarketStatus.PreCancel
      ].includes(value) && (
        <div className="w-[9px] h-[9px] flex-shrink-0 bg-[#54FF59] rounded-full" />
      )}
      <div className="">{currentMarketStatus?.label}</div>
      {value === EMarketStatus.Winner && (
        <>
          {market?.winner_user_info?.avatar && (
            <img
              src={market?.winner_user_info.avatar}
              className="w-[20px] h-[20px] rounded-full shrink-0 border-[2px] border-[#131417] object-center object-cover"
            />
          )}
          {market?.winner_user && (
            <div className="text-[#BBACA6]">
              {formatAddress(market?.winner_user)}
            </div>
          )}
        </>
      )}
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
    label: "Winner",
    name: "Ended"
  },
  [EMarketStatus.PreCancel]: {
    label: "Paused",
    name: "Paused"
  }
};
