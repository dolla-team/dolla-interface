import clsx from "clsx";
import Market from "../../components/market";
import Button from "@/components/button";
import { EMarketStatus } from "../../components/market-status";
import dayjs from "@/libs/dayjs";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import PopoverCard from "../../components/popover-card";
import CancelModal from "../cancel-modal";
import { useMemo, useState } from "react";
import Loading from "@/components/icons/loading";
import DepositModal from "../deposit-modal";
import { formatNumber } from "@/utils/format/number";
import { useNavigate } from "react-router-dom";
import { useContractConfigStore } from "@/stores/use-contract-config";
import Empty from "@/sections/wallet/panels/info/empty";

const SellerMarkets = (props: any) => {
  const { className, poolsData, orders, loading, updatePoolsData } = props;

  const [cancelMarketVisible, setCancelMarketVisible] = useState(false);
  const [depositMarketVisible, setDepositMarketVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>();

  return (
    <div
      className={clsx("w-full flex flex-wrap gap-[15px] mt-[20px]", className)}
    >
      {loading && !orders?.length ? (
        <div className="py-[100px] flex items-center justify-center">
          <Loading size={20} />
        </div>
      ) : orders?.length > 0 ? (
        orders.map((item: any) => {
          const order = poolsData[item];
          return (
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
          );
        })
      ) : (
        <Empty className="!py-[50px]" text="No Data" />
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
              updatePoolsData(currentOrder.pool_id, params);
              if (params.skipClose) {
                setCurrentOrder({
                  ...currentOrder,
                  status: params.status
                });
                return;
              }
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
  const { order, onCancel } = props;

  const contractConfig = useContractConfigStore((store) => store.config);

  const navigate = useNavigate();

  const [time, cancelValid] = useMemo(() => {
    let _time = "-";
    let _cancelValid = false;

    if (!order.time) {
      _time = "-";
    } else {
      const diff = dayjs().diff(dayjs(order.time), "hours");
      if (diff < 24) {
        _time = dayjs(order.time).toNow(true) + " ago";
      } else {
        _time = dayjs(order.time).format("hh:mm D MMM, YYYY");
      }
      _cancelValid = dayjs().isAfter(dayjs(order.time).add(72, "hours"));
      // _cancelValid = true;
    }

    return [_time, _cancelValid];
  }, [order]);

  return (
    <Market
      isAcitveBg={false}
      className="!w-[288px] !h-[unset]"
      data={order}
      footer={
        <div className="w-full px-[13px] bg-black rounded-b-[20px] py-[10px] mt-[10px] relative z-[2] text-white text-center text-[12px] font-normal leading-[100%]">
          <div className="flex justify-between items-center gap-[10px]">
            <div className="text-[10px] whitespace-nowrap">{time}</div>
            <div className="flex items-center justify-end gap-[7px]">
              {/* {order.status === EMarketStatus.Created && (
                <Button
                  className="!h-[28px] !rounded-[8px] !text-[12px] !px-[5px] !font-[400]"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    onDeposit(e);
                  }}
                >
                  Deposit
                </Button>
              )} */}

              {![EMarketStatus.Cancelled, EMarketStatus.Winner].includes(
                order.status
              ) && (
                <Popover
                  content={
                    <PopoverCard className="!w-[300px] text-[#5E6B7D] text-[12px] leading-[120%] font-[400]">
                      <div className="flex items-center gap-[3px]">
                        <img
                          src="/profile/icon-warning.svg"
                          alt="warning"
                          className="w-[13px] h-[11px] shrink-0"
                        />
                        <div className="text-[#000] leading-[100%]">
                          Early Closure Penalty
                        </div>
                      </div>
                      <div className="mt-[7px]">
                        If a seller decides to close the market{" "}
                        <span className="text-[#000] font-[600]">
                          after the 72-hour
                        </span>{" "}
                        lock period without a winner:
                        <br />
                        <ul className="list-disc pl-[20px]">
                          <li>
                            The seller must pay an additional{" "}
                            <span className="text-[#000] font-[600]">
                              {formatNumber(
                                contractConfig.cancel_penalty_rate * 100,
                                2,
                                true
                              )}
                              % penalty
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
                  placement={PopoverPlacement.Top}
                  trigger={PopoverTrigger.Hover}
                  closeDelayDuration={0}
                  offset={30}
                >
                  <Button
                    className="!h-[28px] !px-[7px] !rounded-[8px] !bg-transparent border border-[#383F47] text-white"
                    disabled={!cancelValid}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      onCancel(e);
                    }}
                  >
                    <div className="mr-[4px]">Cancel</div>
                    <img
                      src="/profile/icon-warning.svg"
                      alt="warning"
                      className="w-[13px] h-[11px] shrink-0"
                    />
                  </Button>
                </Popover>
              )}

              {/* {order.status === EMarketStatus.Winner && !claimed && (
                <Button
                  className="!h-[28px] !rounded-[8px] !text-[12px]"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    onClaim();
                  }}
                  loading={claiming}
                  disabled={claiming}
                >
                  Claim
                </Button>
              )}

              {claimed && (
                <Button
                  disabled={true}
                  className="!h-[28px] !rounded-[8px] !text-[12px]"
                >
                  Claimed
                </Button>
              )} */}

              {order.status === EMarketStatus.Cancelled && (
                <div className="h-[28px] flex items-center justify-end text-[#8795A7]">
                  Cancelled
                </div>
              )}
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
