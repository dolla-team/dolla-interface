import Modal from "@/components/modal";
import ButtonV2 from "@/components/button/v2";
import useApprove from "@/hooks/evm/use-approve";
import config from "@/config/bera";

export default function ApproveModal() {
  const { approve, approved, approving, checking } = useApprove({
    token: config.purchaseToken,
    spender: config.bettingContractAddress,
    isMax: true,
    amount: "1"
  });
  return (
    !approved &&
    !checking && (
      <Modal onClose={() => {}} open={true}>
        <div className="w-[396px] p-[20px] rounded-[16px] bg-[#2D2B35] border border-[#514A5D] text-white">
          <div className="text-[16px] font-bold">
            💡 Please authorize this application to use your **USDC**.
          </div>
          <div className="text-[12px] mt-[10px]">
            This step only needs to be done once — after that, it can be used
            without limits and without repeated confirmations. Your assets will
            always remain in your wallet, and will only be transferred when you
            take action.
          </div>
          <ButtonV2
            className="w-full h-[48px] mt-[20px]"
            disabled={approving}
            loading={approving}
            onClick={() => {
              if (approving) return;
              approve();
            }}
          >
            Approve
          </ButtonV2>
        </div>
      </Modal>
    )
  );
}
