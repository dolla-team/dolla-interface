import clsx from "clsx";
import Market from "@/views/btc/components/more-markets/market";
import ButtonV2 from "@/components/button/v2";
import Empty from "@/components/empty";
import MarketStatus, { EMarketStatus } from "../../ components/market-status";
import dayjs from "@/libs/dayjs";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import PopoverCard from "../../ components/popover-card";
import CancelModal from "../cancel-modal";
import { useMemo, useState } from "react";
import Loading from "@/components/icons/loading";
import DepositModal from "../deposit-modal";
import { formatNumber } from "@/utils/format/number";
import useClaimFunds from "@/hooks/near/use-claim-funds";
import { useNavigate } from "react-router-dom";
import { penaltyPercent } from "@/utils/pool";

const SellerMarkets = (props: any) => {
  const { className, poolsData, orders, loading, updatePoolsData } = props;

  const [cancelMarketVisible, setCancelMarketVisible] = useState(false);
  const [depositMarketVisible, setDepositMarketVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>();

  return (
    <div
      className={clsx(
        "w-full grid gap-x-[15px] gap-y-[20px] mt-[25px]",
        orders?.length > 0 ? "grid-cols-3" : "grid-cols-1",
        "max-md:grid-cols-1 max-md:gap-y-[14px] max-md:mt-[14px]",
        className
      )}
    >
      {loading && !orders?.length ? (
        <div className="py-[100px] flex items-center justify-center">
          <Loading size={20} />
        </div>
      ) : orders?.length > 0 ? (
        orders.map((item: any, index: number) => {
          const order = poolsData[item];
          return (
            <div key={index} className="relative pt-[12px]">
              <MarketItem
                order={order}
                onDeposit={() => {
                  setCurrentOrder(order);
                  setDepositMarketVisible(true);
                }}
                onCancel={() => {
                  setCurrentOrder(order);
                  setCancelMarketVisible(true);
                }}
                onClaimSuccess={() => {
                  updatePoolsData(order.pool_id, {
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
      {currentOrder && (
        <>
          <CancelModal
            open={cancelMarketVisible}
            order={currentOrder}
            onClose={() => {
              setCancelMarketVisible(false);
              setCurrentOrder(void 0);
            }}
            onSuccess={(params: any) => {
              console.log("params", params);
              updatePoolsData(currentOrder.pool_id, params);
              setCancelMarketVisible(false);
              setCurrentOrder(void 0);
            }}
          />
          <DepositModal
            open={depositMarketVisible}
            onClose={() => setDepositMarketVisible(false)}
            order={currentOrder}
            onSuccess={() => {
              updatePoolsData(currentOrder?.pool_id, {
                status: EMarketStatus.Live
              });
              setCurrentOrder(void 0);
              setDepositMarketVisible(false);
            }}
          />
        </>
      )}
    </div>
  );
};

export default SellerMarkets;

const MarketItem = (props: any) => {
  const { order, onDeposit, onCancel, onClaimSuccess } = props;
  const [claimed, setClaimed] = useState(order.is_claim);

  const { onClaim, claiming } = useClaimFunds({
    onClaimSuccess: () => {
      setClaimed(true);
      onClaimSuccess();
    }
  });
  const navigate = useNavigate();

  const time = useMemo(() => {
    if (!order.created_at) return "-";
    const diff = dayjs().diff(dayjs(order.created_at), "hours");
    if (diff < 24) {
      return dayjs(order.created_at).toNow(true) + " ago";
    }
    return dayjs(order.created_at).format("hh:mm D MMM, YYYY");
  }, [order]);

  return (
    <Market
      isAcitveBg={false}
      className="!w-full !h-[unset] !bg-[#22201D] !rounded-[16px] !border !border-[#6A5D3A]"
      data={order}
      header={
        <MarketStatus
          value={order.status}
          market={order}
          className="absolute z-[2] left-1/2 -translate-x-1/2 top-[-12px]"
        />
      }
      footer={
        <div className="w-full px-[13px] bg-black/20 py-[12px] mt-[20px] relative z-[2] text-white text-center font-[SpaceGrotesk] text-[14px] font-normal leading-[100%]">
          <div className="flex justify-between items-center gap-[10px]">
            <div className="text-[#BBACA6] whitespace-nowrap">{time}</div>
            <div className="flex items-center justify-end gap-[7px]">
              {order.status === EMarketStatus.Created && (
                <ButtonV2
                  type="primary"
                  className="!h-[28px] !rounded-[8px] !text-[14px] !px-[5px] !font-[400]"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    onDeposit(e);
                  }}
                >
                  Deposit
                </ButtonV2>
              )}

              {![EMarketStatus.Cancelled, EMarketStatus.Winner].includes(
                order.status
              ) && (
                <Popover
                  content={
                    <PopoverCard className="!w-[300px] text-[#BBACA6] font-[SpaceGrotesk] text-[12px] leading-[120%] font-[400]">
                      <div className="flex items-center gap-[3px]">
                        <img
                          src="/profile/icon-warning.svg"
                          alt="warning"
                          className="w-[13px] h-[11px] shrink-0"
                        />
                        <div className="text-[#FFC42F] leading-[100%]">
                          Early Closure Penalty
                        </div>
                      </div>
                      <div className="mt-[7px]">
                        If a seller decides to close the market{" "}
                        <span className="text-[#FFC42F] font-[600]">
                          after the 72-hour
                        </span>{" "}
                        lock period without a winner:
                        <br />
                        <ul className="list-disc pl-[20px]">
                          <li>
                            The seller must pay an additional{" "}
                            <span className="text-[#FFC42F] font-[600]">
                              {formatNumber(penaltyPercent * 100, 2, true)}%
                              penalty
                            </span>{" "}
                            based on the total funds collected from bids.
                          </li>
                          <li>Upon payment, the market will be closed.</li>
                          <li>
                            All collected funds will be fully refunded to
                            participating bidders’ platform balances.
                          </li>
                        </ul>
                        This mechanism ensures fairness to bidders while giving
                        sellers the flexibility to manage inactive markets.
                      </div>
                    </PopoverCard>
                  }
                  placement={PopoverPlacement.BottomLeft}
                  trigger={PopoverTrigger.Hover}
                  closeDelayDuration={0}
                  offset={30}
                >
                  <ButtonV2
                    type="default"
                    className="!h-[28px] !px-[7px] !rounded-[8px] !text-[14px] flex items-center gap-[3px]"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      onCancel(e);
                    }}
                  >
                    <div className="">Cancel</div>
                    <img
                      src="/profile/icon-warning.svg"
                      alt="warning"
                      className="w-[13px] h-[11px] shrink-0"
                    />
                  </ButtonV2>
                </Popover>
              )}

              {order.status === EMarketStatus.Winner && !claimed && (
                <ButtonV2
                  type="primary"
                  className="!h-[28px] !rounded-[8px] !text-[14px]"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    onClaim(order.pool_id);
                  }}
                  loading={claiming}
                  disabled={claiming}
                >
                  Claim
                </ButtonV2>
              )}

              {claimed && (
                <ButtonV2
                  type="default"
                  disabled={true}
                  className="!h-[28px] !rounded-[8px] !text-[14px]"
                >
                  Claimed
                </ButtonV2>
              )}

              {order.status === EMarketStatus.Cancelled && (
                <div className="h-[28px] flex items-center justify-end text-[#BBACA6]">
                  Cancelled
                </div>
              )}
            </div>
          </div>
        </div>
      }
      onClick={() => {
        navigate(`/btc/${order.pool_id}`);
      }}
    />
  );
};
