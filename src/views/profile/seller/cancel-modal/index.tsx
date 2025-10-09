import Modal from "@/components/modal";
import { formatNumber } from "@/utils/format/number";
import { useMemo, useState } from "react";
import Big from "big.js";
import Button from "@/components/button";
import { getAnchorPrice } from "@/utils/pool";
import useGameAction from "@/hooks/near/use-game-action";
import { useContractConfigStore } from "@/stores/use-contract-config";

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
  const rewardTokenInfo = useMemo(() => {
    return order?.reward_token_info?.[0] || {};
  }, [order]);

  const { pausing, resuming, canceling, pauseGame, cancelGame, resumeGame } =
    useGameAction({
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

  const [status, setStatus] = useState(0);

  const [penalty, markable, completable] = useMemo(() => {
    const _penalty = Big(order?.accumulative_bids || 0)
      .times(contractConfig?.cancel_penalty_rate || 0)
      .toString();
    let _completable = true;
    if (order.status === 5) {
      setStatus(1);
      // _completable = Date.now() - order?.result_time * 1000 > 1000 * 60 * 10;
    }

    const _markable = true;
    return [_penalty, _markable, _completable];
  }, [order]);
  console.log(66, order);
  return (
    <Modal onClose={onClose} open={open}>
      <div className="w-[396px] pb-[20px] rounded-[16px] bg-[#FFFFFF] border border-[#E4E4E4] text-[14px] font-[500] leading-[100%] text-white">
        <div className="w-full pt-[20px] rounded-t-[16px] pb-[13px] px-[20px] bg-black flex justify-between items-center">
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
        <div className="w-full px-[24px] py-[20px] text-black">
          <div className="flex items-center text-[14px] mb-[20px] gap-[10px]">
            <span className="font-[400]">Market Size</span>
            <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50" />
            <span className="font-medium">
              {formatNumber(
                (order?.reward_amount || 0) / 10 ** rewardTokenInfo.decimals,
                0,
                true
              )}{" "}
              {rewardTokenInfo.symbol}
            </span>
          </div>
          <div className="flex items-center text-[14px] mb-[20px] gap-[10px]">
            <span className="font-[400]">Market Value</span>
            <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50" />
            <span className="font-medium">
              ${formatNumber(getAnchorPrice(order?.anchor_price), 0, true)}
            </span>
          </div>
          <div className="flex items-center text-[14px] mb-[20px] gap-[10px]">
            <span className="font-[400]">Total Players</span>
            <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50" />
            <span className="font-medium">
              {formatNumber(order?.participants, 0, true)}
            </span>
          </div>
          <div className="flex items-center text-[14px] mb-[20px] gap-[10px]">
            <span className="font-[400]">Total bids</span>
            <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50" />
            <span className="font-medium">
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
                {formatNumber(
                  contractConfig?.cancel_penalty_rate * 100,
                  2,
                  true
                )}
                % penalty
              </span>{" "}
              based on the total funds collected from bids.
            </div>
          </div>
          <div className="mt-[20px]">
            <div className="flex items-center text-[14px] gap-[10px]">
              <span className="font-[400]">Penalty</span>
              <div className="grow border-b border-dashed border-[#5E6B7D]" />
              <span className="font-medium">
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
        <div className="flex justify-end mt-[0px] px-[20px] gap-[10px]">
          {status === 1 && (
            <>
              <Button
                className="!h-[40px] !bg-text border border-[#1A1E24] !text-[14px] !text-black px-[30px]"
                loading={resuming}
                disabled={resuming || !completable}
                onClick={() => {
                  if (resuming) {
                    return;
                  }
                  resumeGame();
                }}
              >
                Resume
              </Button>
              <Button
                className="!h-[40px] !bg-[#1A1E24] !text-[14px] !text-white px-[30px]"
                loading={canceling}
                disabled={canceling || !completable}
                onClick={() => {
                  if (canceling) {
                    return;
                  }
                  cancelGame();
                }}
              >
                Cancel
              </Button>
            </>
          )}
          {status === 0 && (
            <Button
              className="!h-[40px] !bg-[#1A1E24] !text-[14px] !text-white px-[30px]"
              loading={pausing}
              disabled={pausing || !markable}
              onClick={() => {
                if (pausing || !markable) {
                  return;
                }
                pauseGame();
              }}
            >
              Pause
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
