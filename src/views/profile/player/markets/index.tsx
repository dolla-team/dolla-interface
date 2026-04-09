import clsx from "clsx";
import MarketItem from "./market";
import Empty from "@/sections/wallet/panels/info/empty";
import Loading from "@/components/icons/loading";
import { useMemo, useState } from "react";
import { useAuth } from '@/contexts/wallet'
import RefreshIcon from "../../components/refresh-icon";
import useCancelledPoolsStore from "@/stores/use-cancelled-pools";
import PopoverCard from "../../components/popover-card";

const PlayerMarkets = (props: any) => {
  const {
    className,
    orders,
    loading,
    updatePoolsData,
    status,
    onStatusChange,
    getJoinedPoolList,
    joinedPoolsRefreshing
  } = props;
  const [index, setIndex] = useState(0);
  const { userInfo } = useAuth();
  const cancelledPoolsStore = useCancelledPoolsStore();

  const cancelledAmount = useMemo(() => {
    return cancelledPoolsStore.cancelledPools.reduce(
      (acc: number, item: any) => acc + Number(item.purchase_usd),
      0
    );
  }, [cancelledPoolsStore.cancelledPools]);

  return (
    <div className="w-full bg-white border border-[#E4E4E4] rounded-[20px] relative">
      <div className="flex items-center justify-between px-[20px] pt-[20px]">
        <div className="flex items-center gap-[24px]">
          <div className="text-[14px] font-[600]">Participated Markets</div>
          <div className="flex items-center gap-[10px]">
            {[
              {
                key: "0,1",
                label: "Live"
              },
              {
                key: "2",
                label: "Ended"
              },
              {
                key: "3",
                label: "Cancelled"
              }
            ].map((item) => {
              return (
                <button
                  key={item.key}
                  className={clsx(
                    "button relative px-[10px] py-[6px] rounded-[16px] text-[10px] flex items-center gap-[4px] border",
                    status === item.key
                      ? "border-black bg-black text-white"
                      : "border-[#E4E4E4]"
                  )}
                  onClick={() => {
                    if (status === item.key) return;
                    setIndex(0);
                    onStatusChange(item.key);
                  }}
                >
                  <div
                    className={clsx(
                      "w-[7px] h-[7px] rounded-full",
                      item.label === "Live" && "bg-[#54FF59]",
                      item.key === "2" && "bg-[#C9C9C9]",
                      item.label === "Cancelled" && "bg-[#FF399F]"
                    )}
                  />
                  {item.label === "Cancelled" && cancelledAmount > 0 && (
                    <CancelledPoolsInfo
                      list={cancelledPoolsStore.cancelledPools}
                      amount={cancelledAmount}
                    />
                  )}

                  <span>
                    {item.label === "Live" && userInfo?.join_live_count}
                    {item.key === "2" && userInfo?.join_ended_count}
                    {item.label === "Cancelled" &&
                      userInfo?.join_cancelled_count}{" "}
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <RefreshIcon
          refreshing={joinedPoolsRefreshing}
          onClick={() => {
            if (joinedPoolsRefreshing) return;
            getJoinedPoolList();
          }}
        />
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
                  key={order.id}
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
            <Empty className="!py-[50px]" text="No Data" />
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

const CancelledPoolsInfo = ({
  amount,
  list
}: {
  amount: number;
  list: any[];
}) => {
  const poolIds = list?.map((item: any) => item.pool_id).join("/");
  return (
    <PopoverCard className="absolute bottom-[40px] left-1/2 -translate-x-1/2 w-[248px] p-[12px] text-black">
      <div className="text-[14px] font-[600]">⚠️ ${amount} Refund!</div>
      <div className="text-[10px] mt-[10px] leading-[120%]">
        Your participated Markets #{poolIds} has been cancelled, claim your bid
        fund.{" "}
      </div>
      <div className="w-[12px] h-[12px] bg-white border border-[#E4E4E4] border-t-0 border-l-0 absolute bottom-[-6px] left-1/2 -translate-x-1/2 rotate-45"></div>
    </PopoverCard>
  );
};
