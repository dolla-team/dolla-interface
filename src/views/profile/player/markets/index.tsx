import clsx from "clsx";
import MarketItem from "./market";
import Empty from "@/components/empty";
import Loading from "@/components/icons/loading";
import { useState } from "react";

const PlayerMarkets = (props: any) => {
  const {
    className,
    orders,
    loading,
    updatePoolsData,
    status,
    onStatusChange
  } = props;
  const [index, setIndex] = useState(0);

  return (
    <div className="w-full bg-white border border-[#E4E4E4] rounded-[20px] relative">
      <div className="flex items-center gap-[24px] px-[20px] pt-[20px]">
        <div className="text-[14px] font-[600]">Joined Markets</div>
        <div className="flex items-center gap-[10px]">
          {[
            {
              key: "0,1",
              label: "Live"
            },
            {
              key: "3",
              label: "Ended"
            },
            {
              key: "5",
              label: "Cancelled"
            }
          ].map((item) => {
            return (
              <button
                key={item.key}
                className={clsx(
                  "button px-[10px] py-[6px] rounded-[16px] text-[10px] flex items-center gap-[4px] border",
                  status === item.key
                    ? "border-black bg-black text-white"
                    : "border-[#E4E4E4]"
                )}
                onClick={() => {
                  onStatusChange(item.key);
                }}
              >
                <div
                  className={clsx(
                    "w-[7px] h-[7px] rounded-full",
                    item.label === "Live" && "bg-[#54FF59]",
                    item.label === "Ended" && "bg-[#C9C9C9]",
                    item.label === "Cancelled" && "bg-[#FF399F]"
                  )}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="p-[20px] overflow-hidden">
        {orders.length > 2 && (
          <>
            <ArrowButton
              className="left-[-20px]"
              isLeft
              disabled={index === 0}
              onClick={() => {
                if (index > 0) setIndex(index - 1);
              }}
            />
            <ArrowButton
              className="right-[-20px]"
              disabled={index === orders.length - 2}
              onClick={() => {
                if (index < orders.length - 2) setIndex(index + 1);
              }}
            />
          </>
        )}
        <div
          className={clsx(
            "w-full flex flex-nowrap gap-[15px] duration-300",
            "max-md:gap-y-[14px] max-md:mt-[14px]",
            className
          )}
          style={{ transform: `translateX(-${index * 300}px)` }}
        >
          {loading && !orders?.length ? (
            <div className="w-full py-[100px] flex justify-center items-center">
              <Loading size={16} />
            </div>
          ) : orders?.length > 0 ? (
            orders.map((order: any) => {
              return (
                <MarketItem
                  order={order}
                  onClaimSuccess={() => {
                    updatePoolsData(order.id, {
                      is_claim: true
                    });
                  }}
                />
              );
            })
          ) : (
            <Empty />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerMarkets;

const ArrowButton = ({
  className,
  isLeft,
  disabled,
  onClick
}: {
  className?: string;
  isLeft?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      className={clsx(
        "w-[38px] h-[38px] bg-white rounded-[10px] border border-[#D9D9D9] button flex items-center justify-center absolute top-[50%] translate-y-[-50%] z-[10]",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="12"
        viewBox="0 0 8 12"
        fill="none"
        className={clsx(isLeft && "rotate-180")}
      >
        <path
          d="M1 1L6 6L1 11"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
};
