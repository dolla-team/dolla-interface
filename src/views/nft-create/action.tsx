import { useEffect, useState } from "react";
import CreateButton from "./create-button";
import Button from "@/components/button";
import useDeposit from "@/hooks/evm/use-deposit-reward";
import useApprove from "@/hooks/evm/use-approve";
import useCreate from "@/hooks/evm/use-create";
import { useAuth } from "@/contexts/auth";

export default function Action({
  amount,
  setPaymentsModalOpen,
  tokenBalance,
  token,
  anchorPrice,
  loading,
  onSuccess
}: any) {
  const [step, setStep] = useState(0);
  const { address: walletAddress } = useAuth();
  //5,6
  const [poolId, setPoolId] = useState(-1);

  const { onDeposit, depositing } = useDeposit();

  const handleDepositSuccess = () => {
    setStep(0);
    onSuccess();
  };

  const { creating, onCreate } = useCreate();

  const handleCreateSuccess = (poolId: number) => {
    setPoolId(poolId);
    setStep(1); // Skip approval step for NEAR
    if (Number(tokenBalance) < amount) {
      setPaymentsModalOpen(true);
    }
  };

  const { approve, approved, approving, checking } = useApprove();

  useEffect(() => {
    if (poolId === -1) {
      setStep(0);
      return;
    }
    // For NEAR, we skip the approval step
    setStep(2);
  }, [approved]);

  if (loading) {
    return <Button loading={loading} className="mt-[20px] w-full h-[40px]" />;
  }
  if (anchorPrice === 0) {
    return (
      <Button disabled className="mt-[20px] w-full h-[40px]">
        Set Anchor Price
      </Button>
    );
  }
  return step === 0 ? (
    <CreateButton
      onCreate={onCreate}
      loading={creating}
      account={walletAddress}
    />
  ) : step === 1 ? (
    <Button
      className="mt-[20px] w-full h-[40px]"
      onClick={() => {
        approve();
      }}
      loading={approving || checking}
    >
      Approve
    </Button>
  ) : (
    <Button
      className="mt-[20px] w-full h-[40px]"
      onClick={() => {
        onDeposit();
        handleDepositSuccess();
      }}
      loading={depositing}
    >
      Deposit Amount
    </Button>
  );
}
