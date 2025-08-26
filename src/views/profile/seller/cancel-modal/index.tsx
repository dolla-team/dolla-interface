import Modal from "@/components/modal";
import { formatNumber } from "@/utils/format/number";
import { useMemo, useState } from "react";
import Big from "big.js";
import ButtonV2 from "@/components/button/v2";
import { penaltyPercent } from "@/utils/pool";
import useRequestCancel from "@/hooks/evm/use-request-cancel";
import useCompleteCancel from "@/hooks/evm/use-complete-cancel";
import useApprove from "@/hooks/evm/use-approve";
import config from "@/config/bera";

export default function CancelModal({
  open,
  onClose,
  onSuccess,
  order
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: (params: any) => void;
  order: any;
}) {
  const rewardTokenInfo = useMemo(() => {
    return order?.reward_token_info?.[0] || {};
  }, [order]);

  const { loading: cancelingMark, onMarkCancel } = useRequestCancel({
    onCancelSuccess: () => {
      onSuccess({
        status: 5,
        skipClose: true
      });
      onClose();
    }
  });
  const { loading: cancelingRevert, onRevertCancel } = useCompleteCancel({
    onCancelSuccess: (isEnded) => {
      onSuccess({
        status: isEnded ? 2 : 3
      });
      onClose();
    }
  });
  const [status, setStatus] = useState(0);
  const { approve, approved, approving, checking } = useApprove({
    token: config.purchaseToken,
    spender: config.bettingContractAddress,
    isMax: true,
    amount: String(1)
  });
  const [penalty, markable, completable] = useMemo(() => {
    const _penalty = Big(order?.accumulative_bids || 0)
      .times(penaltyPercent)
      .toString();
    let _completable = false;
    if (order.status === 5) {
      setStatus(1);
      _completable = Date.now() - order?.result_time * 1000 > 1000 * 60 * 10;
    }

    const _markable = Date.now() - order?.time * 1000 > 1000 * 60 * 60 * 24 * 3;
    return [_penalty, _markable, _completable];
  }, [order]);

  return (
    <Modal onClose={onClose} open={open}>
      <div className="w-[396px] pb-[20px] rounded-[16px] bg-[#2D2B35] border border-[#514A5D] text-[14px] font-[500] leading-[100%] text-white">
        <div className="w-full pt-[20px] pb-[13px] px-[20px] bg-black/20 flex justify-between items-center">
          <div className="text-[16px] font-medium text-white">
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
            <span className="text-[#BBACA6] font-[400]">Token</span>
            <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50" />
            <span className="text-white font-medium">
              {rewardTokenInfo.name} {rewardTokenInfo.token_id}
            </span>
          </div>
          <div className="flex items-center text-[14px] mb-[20px] gap-[10px]">
            <span className="text-[#BBACA6] font-[400]">Market Value</span>
            <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50" />
            <span className="text-white font-medium">
              ${formatNumber(order?.value, 0, true)}
            </span>
          </div>
          <div className="flex items-center text-[14px] mb-[20px] gap-[10px]">
            <span className="text-[#BBACA6] font-[400]">Total Players</span>
            <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50" />
            <span className="text-white font-medium">
              {formatNumber(order?.participants, 0, true)}
            </span>
          </div>
          <div className="flex items-center text-[14px] mb-[20px] gap-[10px]">
            <span className="text-[#BBACA6] font-[400]">Total bids</span>
            <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50" />
            <span className="text-white font-medium">
              ${formatNumber(order?.accumulative_bids, 0, true)}
            </span>
          </div>
          <div className="w-full h-[72px] p-[8px] mt-[20px] mx-auto bg-[#FFC42F1A] rounded-[4px] border border-[#FFC42F]">
            <div className="flex items-center gap-[2px]">
              <img
                src="/profile/icon-warning.svg"
                alt="warning"
                className="w-[13px] h-[11px] shrink-0"
              />
              <span className="text-[#FFC42F]">Be careful!</span>
            </div>
            <div className="text-[12px] font-[400] leading-[120%] mt-[5px]">
              The seller must pay an additional{" "}
              <span className="text-[#FFC42F] font-[600]">
                {formatNumber(penaltyPercent * 100, 2, true)}% penalty
              </span>{" "}
              based on the total funds collected from bids.
            </div>
          </div>
          <div className="mt-[20px]">
            <div className="flex items-center text-[14px] gap-[10px]">
              <span className="text-[#BBACA6] font-[400]">Penalty</span>
              <div className="grow border-b border-dashed border-[#5E6B7D]" />
              <span className="text-white font-medium">
                ${formatNumber(penalty, 2, true)}
              </span>
            </div>
            {/* <div className="flex items-center text-[14px] mb-[20px] gap-[10px]">
              <span className="text-[#BBACA6] font-[400]">Final refund</span>
              <div className="grow border-b border-dashed border-[#5E6B7D]" />
              <span className="text-[#FFC42F] font-medium">
                ${formatNumber(finalRefund, 2, true)}
              </span>
            </div> */}
          </div>
        </div>
        <div className="flex justify-end mt-[0px] px-[20px]">
          {status === 1 && (
            <ButtonV2
              className="!h-[40px] !text-[14px]"
              loading={cancelingRevert}
              disabled={cancelingRevert || !completable}
              type="default"
              onClick={() => {
                if (cancelingRevert) {
                  return;
                }
                onRevertCancel(order?.pool_id);
              }}
            >
              Cancel
            </ButtonV2>
          )}
          {status === 0 && (
            <ButtonV2
              className="!h-[40px] !text-[14px]"
              loading={cancelingMark || checking || approving}
              disabled={cancelingMark || !markable}
              onClick={() => {
                if (approving || checking) return;
                if (!approved) {
                  approve();
                  return;
                }
                if (cancelingMark || !markable) {
                  return;
                }
                onMarkCancel(order?.pool_id);
              }}
            >
              {!approved ? "Approve" : "Pay Penalty"}
            </ButtonV2>
          )}
        </div>
      </div>
    </Modal>
  );
}
