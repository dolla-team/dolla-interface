import usePlayerRefund from "@/hooks/near/use-player-refund";
import { formatNumber } from "@/utils/format/number";
import { useNavigate } from "react-router-dom";
import Button from "@/components/button";
import Market from "@/views/profile/components/market";
import { EMarketStatus } from "@/views/profile/components/market-status";
import { useMemo } from "react";

export default function MarketItem(props: any) {
  const { order, onClaimSuccess } = props;

  const { loading: claiming, refund: onClaim } = usePlayerRefund(
    order.pool_id,
    onClaimSuccess
  );
  const navigate = useNavigate();

  const data = useMemo(() => {
    return {
      accumulative_bids: order.accumulative_bids,
      reward_amount: order.reward_amount,
      reward_token_info: order.reward_token_info,
      status: order.status,
      profit_ratio: order.profit_ratio,
      winner_user_info: order.pool_info.winner_user_info,
      anchor_price: order.anchor_price,
      pool_id: order.pool_id,
      pool_user_info: order.pool_info.user_info,
      participants: order.participants
    };
  }, [order]);

  return (
    <Market
      isAcitveBg={false}
      className="!w-[288px] !h-[unset]"
      data={data}
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
                      onClaim();
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
}
