import Modal from "@/components/modal";
import { formatNumber } from "@/utils/format/number";
import { useMemo } from "react";
import Big from "big.js";
import Button from "@/components/button";
import useGameAction from "@/hooks/near/use-game-action";
import { useContractConfigStore } from "@/stores/use-contract-config";
import { useAuth } from "@/contexts/auth";

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
  const contractConfig = useContractConfigStore((store) => store.config);
  const { nearAccount } = useAuth();
  const rewardTokenInfo = useMemo(() => {
    return order?.reward_token_info?.[0] || {};
  }, [order]);

  const { canceling, cancelGame } = useGameAction({
    gameId: order?.pool_id,
    onPauseSuccess: () => {
      onSuccess({
        status: 5,
        skipClose: true
      });
      onClose();
    },
    onResumeSuccess: () => {
      onSuccess({
        status: 1
      });
      onClose();
    },
    onCancelSuccess: () => {
      onSuccess({
        status: 3
      });
      onClose();
    }
  });

  const [penalty, remainingBalance, completable] = useMemo(() => {
    const _penalty = Big(order?.accumulative_bids || 0)
      .times(contractConfig?.cancel_penalty_rate || 0)
      .toString();
    let _completable = true;
    _completable = Big(_penalty).lt(Big(nearAccount?.balance || 0).add(0.1));
    const _remainingBalance = Big(nearAccount?.balance || 0)
      .minus(_penalty)
      .toString();
    return [_penalty, _remainingBalance, _completable];
  }, [order, nearAccount]);

  return (
    <Modal onClose={onClose} open={open}>
      <div className="w-[396px] pb-[20px] rounded-[16px] bg-[#FFFFFF] border border-[#E4E4E4] text-[14px] font-[500] leading-[100%] text-white">
        <div className="w-full pt-[20px] rounded-t-[16px] pb-[13px] px-[20px] bg-black flex justify-between items-center">
          <div className="text-[16px] font-medium text-white">
            End Market Early
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
        <div className="w-full px-[24px] pt-[20px] text-black">
          <div className="flex items-center text-[14px] mb-[20px] gap-[10px]">
            <span className="font-[400]">Market Size</span>
            <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50" />
            <span className="font-medium">
              {formatNumber(
                (order?.reward_amount || 0) / 10 ** rewardTokenInfo.decimals,
                6,
                true
              )}{" "}
              {rewardTokenInfo.symbol}
            </span>
          </div>
          <div className="flex items-center text-[14px] mb-[20px] gap-[10px]">
            <span className="font-[400]">Assets Value</span>
            <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50" />
            <span className="font-medium">
              ${formatNumber(order?.reward_usd, 2, true)}
            </span>
          </div>
          <div className="flex items-center text-[14px] mb-[20px] gap-[10px]">
            <span className="font-[400]">Total Bidders</span>
            <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50" />
            <span className="font-medium">
              {formatNumber(order?.participants, 0, true)}
            </span>
          </div>
          <div className="flex items-center text-[14px] gap-[10px]">
            <span className="font-[400]">Total Bid Collected</span>
            <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50" />
            <span className="font-medium">
              ${formatNumber(order?.accumulative_bids, 0, true)}
            </span>
          </div>
          <div className="w-full h-[72px] px-[8px] py-[10px] mt-[20px] mx-auto bg-[#FFC42F1A] rounded-[4px] border border-[#FFC42F]">
            <div className="flex items-center gap-[2px]">
              <span>⚠️ Early Termination Penalty</span>
            </div>
            <div className="text-[10px] font-[400] leading-[120%] mt-[8px]">
              An additional{" "}
              <span className="font-[600]">
                {formatNumber(
                  contractConfig?.cancel_penalty_rate * 100,
                  2,
                  true
                )}
                %
              </span>{" "}
              fee applies to the total bids collected — this helps keep the
              market fair for all participants.
            </div>
          </div>
          <div className="flex items-center text-[14px] mt-[20px] gap-[10px]">
            <span className="font-[400]">Balance</span>
            <div className="grow border-b border-dashed border-[#5E6B7D]" />
            <span className="font-medium">
              ${formatNumber(nearAccount?.balance, 2, true)}
            </span>
          </div>
          <div className="flex items-center text-[14px] gap-[10px] mt-[20px] text-[#FF399F]">
            <span className="font-[400]">Penalty</span>
            <div className="grow border-b border-dashed border-[#5E6B7D]" />
            <span className="font-medium">
              ${formatNumber(penalty, 2, true)}
            </span>
          </div>
          <div className="flex items-center text-[14px] mb-[20px] gap-[10px] mt-[20px]">
            <span className="font-[400]">Balance Remaining</span>
            <div className="grow border-b border-dashed border-[#5E6B7D]" />
            <span className="font-medium">
              ${formatNumber(remainingBalance, 2, true)}
            </span>
          </div>
        </div>
        <Button
          className="!h-[50px] w-[354px] !bg-[#1A1E24] ml-[24px] !text-[14px] !text-white px-[30px]"
          loading={canceling}
          disabled={canceling || !completable}
          onClick={() => {
            if (canceling) {
              return;
            }
            cancelGame(penalty);
          }}
        >
          {completable ? "Confirm End Market" : "Insufficient Balance"}
        </Button>
        <div className="flex items-center justify-between text-[12px] text-[#8A87AA] px-[24px] mt-[10px]">
          <span className="font-[400]">Slippage Tolerance</span>
          <div className="w-[43px] h-[26px] rounded-[14px] border border-[#E9E9E9] text-center leading-[26px]">
            1%
          </div>
        </div>
      </div>
    </Modal>
  );
}
