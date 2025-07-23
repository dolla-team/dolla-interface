import Modal from "@/components/modal";
import { formatNumber } from "@/utils/format/number";
import { useMemo } from "react";
import Big from "big.js";
import useCancel from "@/hooks/solana/use-cancel";
import ButtonV2 from "@/components/button/v2";

export default function CancelModal({
  open,
  onClose,
  onSuccess,
  order
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  order: any;
}) {
  const rewardTokenInfo = useMemo(() => {
    return order?.reward_token_info?.[0] || {};
  }, [order]);
  const { canceling, onCancel } = useCancel({
    onCancelSuccess: () => {
      onClose();
      onSuccess();
    }
  });
  const [penalty, finalRefund] = useMemo(() => {
    const _penalty = Big(0)
      .div(10 ** order?.purchase_token_info?.decimals || 18)
      .toString();
    return [
      _penalty,
      Big(order?.value || 0)
        .minus(_penalty)
        .toString()
    ];
  }, [order]);

  return (
    <Modal onClose={onClose} open={open}>
      <div className="w-[396px] h-[460px] rounded-[16px] bg-[#35302B] border border-[#6A5D3A] text-[14px] font-[500] leading-[100%] text-white font-[SpaceGrotesk]">
        <div className="w-full pt-[20px] pb-[13px] px-[24px] bg-black/20 flex justify-between items-center">
          <div className="text-[18px] font-medium text-white">
            Cancel Market
          </div>
          <button className="button" onClick={onClose}>
            <svg
              width="10"
              height="12"
              viewBox="0 0 10 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 4.57422L8 0.592773H10L6 5.90137L10 11.21H8L5 7.22852L2 11.21H0L4 5.90137L0 0.592773H2L5 4.57422Z"
                fill="#BBACA6"
              />
            </svg>
          </button>
        </div>
        <div className="w-full px-[24px] py-[20px]">
          <div className="flex items-center text-[14px] mb-[20px] gap-[10px]">
            <span className="text-[#BBACA6] font-[400]">Market Amount</span>
            <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50" />
            <span className="text-white font-medium">
              {formatNumber(
                Big(order?.reward_amount || 0).div(
                  10 ** (rewardTokenInfo.decimals || 18)
                ),
                2,
                true
              )}{" "}
              {rewardTokenInfo.symbol}
            </span>
          </div>
          <div className="flex items-center text-[14px] mb-[20px] gap-[10px]">
            <span className="text-[#BBACA6] font-[400]">Valued</span>
            <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50" />
            <span className="text-white font-medium">
              ${formatNumber(order?.value, 0, true)}
            </span>
          </div>
          <div className="flex items-center text-[14px] mb-[20px] gap-[10px]">
            <span className="text-[#BBACA6] font-[400]">Bid player</span>
            <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50" />
            <span className="text-white font-medium">
              {formatNumber(order?.accumulative_bids, 0, true)}
            </span>
          </div>
          <div className="flex items-center text-[14px] mb-[20px] gap-[10px]">
            <span className="text-[#BBACA6] font-[400]">Total bid value</span>
            <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50" />
            <span className="text-white font-medium">
              ${formatNumber(order?.accumulative_bids, 0, true)}
            </span>
          </div>
          <div className="w-full h-[86px] p-[10px] mt-[20px] mx-auto bg-[#FFC42F1A] rounded-[4px] border border-[#FFC42F]">
            <div className="flex items-center gap-[2px]">
              <img
                src="/profile/icon-warning.svg"
                alt="warning"
                className="w-[13px] h-[11px] shrink-0"
              />
              <span className="text-[#FFC42F]">Be careful!</span>
            </div>
            <div className="text-[12px] font-[400] leading-[120%] mt-[7px]">
              If you cancel, platform will refund the bid amount of the player
              who has already participated, and you need to pay 20% in demages.
            </div>
          </div>
          <div className="mt-[10px]">
            <div className="flex items-center text-[14px] mb-[20px] gap-[10px]">
              <span className="text-[#BBACA6] font-[400]">Demage</span>
              <div className="grow border-b border-dashed border-[#5E6B7D]" />
              <span className="text-white font-medium">
                ${formatNumber(penalty, 2, true)}
              </span>
            </div>
            <div className="flex items-center text-[14px] mb-[20px] gap-[10px]">
              <span className="text-[#BBACA6] font-[400]">Final refund</span>
              <div className="grow border-b border-dashed border-[#5E6B7D]" />
              <span className="text-[#FFC42F] font-medium">
                ${formatNumber(finalRefund, 2, true)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-[0px]">
          <ButtonV2
            className="w-[220px] !h-[40px] !text-[16px]"
            loading={canceling}
            onClick={() => {
              onCancel(order?.pool_id);
            }}
          >
            Confirm
          </ButtonV2>
        </div>
      </div>
    </Modal>
  );
}
