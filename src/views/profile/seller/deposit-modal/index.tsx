import Modal from "@/components/modal";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import { useMemo } from "react";
import useDeposit from "@/hooks/evm/use-deposit-reward";
import useApprove from "@/hooks/evm/use-approve";
import { useAuth } from "@/contexts/auth";
import ButtonV2 from "@/components/button/v2";

export default function DepositModal({
  open,
  onClose,
  order,
  onSuccess
}: {
  open: boolean;
  onClose: () => void;
  order: any;
  onSuccess: () => void;
}) {
  const rewardTokenInfo = useMemo(() => {
    return order?.reward_token_info?.[0] || {};
  }, [order]);
  const { address } = useAuth();
  // Mock token balance for NEAR integration
  const tokenBalance = "0";
  const isLoading = false;

  const amount = useMemo(() => {
    return Big(order?.reward_amount || 0)
      .div(10 ** rewardTokenInfo.decimals)
      .toString();
  }, [order, rewardTokenInfo]);

  const approveToken = useMemo(() => {
    const _t = order?.reward_token_info?.[0];

    if (!_t) return null;
    return {
      type: _t.token_id ? "nft" : "token",
      address: _t.address,
      id: _t.token_id,
      decimals: _t.decimals
    };
  }, [order]);

  const { approve, approved, approving, checking } = useApprove();

  const { onDeposit, depositing } = useDeposit();

  const handleDepositSuccess = () => {
    onSuccess();
  };

  return (
    <>
      <Modal onClose={onClose} open={open}>
        <div className="w-[396px] h-[240px] rounded-[16px] bg-[#35302B] border border-[#6A5D3A] text-[14px] font-[500] leading-[100%] text-white font-[SpaceGrotesk]">
          <div className="w-full pt-[20px] pb-[13px] px-[24px] bg-black/20 flex justify-between items-center">
            <div className="text-[18px] font-medium text-white">
              Deposit Market
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
            <div className="flex items-center text-[14px] mb-[14px] gap-[10px]">
              <span className="text-[#BBACA6] font-[400]">Market Amount</span>
              <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50" />
              <span className="text-white font-medium">
                {formatNumber(
                  Big(order?.reward_amount || 0).div(
                    10 ** rewardTokenInfo.decimals
                  ),
                  2,
                  true
                )}{" "}
                {rewardTokenInfo.symbol}{" "}
              </span>
            </div>
            <div className="flex items-center text-[14px] mb-[14px] gap-[10px]">
              <span className="text-[#BBACA6] font-[400]">Valued</span>
              <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50" />
              <span className="text-white font-medium">
                ${formatNumber(order?.value, 0, true)}{" "}
              </span>
            </div>
            <div className="flex items-center text-[14px] mb-[14px] gap-[10px]">
              <span className="text-[#BBACA6] font-[400]">Balance</span>
              <div className="grow border-b border-dashed border-[#5E6B7D] opacity-50 min-w-[50px]" />
              <span className="text-white font-medium text-right">
                {formatNumber(tokenBalance, 0, true)} {rewardTokenInfo.symbol}{" "}
              </span>
            </div>
          </div>

          <div className="flex justify-center mt-[0px]">
            <ButtonV2
              className="w-[220px] !h-[40px] !text-[16px]"
              loading={isLoading || approving || checking || depositing}
              onClick={() => {
                if (!approved) {
                  approve();
                  return;
                }
                onDeposit();
                handleDepositSuccess();
              }}
            >
              {!approved ? "Approve" : "Deposit"}
            </ButtonV2>
          </div>
        </div>
      </Modal>
    </>
  );
}
