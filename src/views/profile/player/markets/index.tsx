import clsx from "clsx";
import Market from "../../components/market";
import Empty from "@/components/empty";
import MarketStatus, { EMarketStatus } from "../../components/market-status";
import Loading from "@/components/icons/loading";
import useClaimPenalty from "@/hooks/evm/use-claim-penalty";
import { formatNumber } from "@/utils/format/number";
import { useNavigate } from "react-router-dom";
import Button from "@/components/button";

const PlayerMarkets = (props: any) => {
  const { className, orders, loading, updatePoolsData } = props;

  return (
    <div
      className={clsx(
        "w-full grid gap-x-[15px] gap-y-[20px] mt-[25px]",
        "max-md:grid-cols-1 max-md:gap-y-[14px] max-md:mt-[14px]",
        orders?.length > 0 ? "grid-cols-3" : "grid-cols-1",
        className
      )}
    >
      {loading && !orders?.length ? (
        <div className="w-full py-[100px] flex justify-center items-center">
          <Loading size={16} />
        </div>
      ) : orders?.length > 0 ? (
        orders.map((order: any, index: number) => {
          return (
            <div key={index} className="relative pt-[12px]">
              <MarketItem
                order={order}
                onClaimSuccess={() => {
                  updatePoolsData(order.id, {
                    is_claim: true
                  });
                }}
              />
            </div>
          );
        })
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default PlayerMarkets;

const MarketItem = (props: any) => {
  const { order, onClaimSuccess } = props;

  const { claiming, claim: onClaim } = useClaimPenalty(onClaimSuccess);
  const navigate = useNavigate();

  return (
    <Market
      isAcitveBg={false}
      className="!w-full !h-[unset]"
      data={order}
      header={
        <MarketStatus
          value={order.pool_status}
          market={order.pool_info}
          className="absolute z-[2] left-[12px] top-[-12px]"
        />
      }
      footer={
        <div className="w-full px-[13px] bg-black rounded-b-[20px] py-[17px] mt-[20px] relative z-[2] text-white text-center text-[12px] font-normal leading-[100%]">
          <div className="flex justify-between items-center gap-[10px]">
            <div>
              You bid
              {order.pool_status === EMarketStatus.Cancelled ? " / Refund" : ""}
            </div>
            <div className="flex items-center justify-end gap-[7px]">
              {order.pool_status === EMarketStatus.Cancelled &&
                (order.is_claim ? (
                  <div className="flex items-center gap-[4px] text-[#75FF4A] text-[14px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 22 22"
                      fill="none"
                    >
                      <circle cx="11" cy="11" r="11" fill="#75FF4A" />
                      <path
                        d="M6 11L10 15L17 8"
                        stroke="#2B3337"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>Claimed</span>
                  </div>
                ) : (
                  <Button
                    className="w-[55px] h-[22px] !rounded-[6px] bg-linear-to-b from-[#FFF698] to-[#FFC42F]"
                    loading={claiming}
                    disabled={claiming}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      onClaim(order.pool_id);
                    }}
                  >
                    Claim
                  </Button>
                ))}
              <div>
                {formatNumber(order.purchase_usd, 2, true, {
                  isShort: true,
                  isShortUppercase: true,
                  prefix: "$"
                })}
              </div>
            </div>
          </div>
        </div>
      }
      onClick={() => {
        navigate(`/btc/detail/${order.pool_id}`);
      }}
    />
  );
};
