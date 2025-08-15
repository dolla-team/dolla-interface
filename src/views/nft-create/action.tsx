import { useEffect, useState } from "react";
import CreateButton from "./create-button";
import Button from "@/components/button/v2";
import useDeposit from "@/hooks/evm/use-deposit-reward";
import useApprove from "@/hooks/evm/use-approve";
import useCreate from "@/hooks/evm/use-create";
import config from "@/config/bera";
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

  const { depositing, onDeposit } = useDeposit(
    poolId,
    () => {
      setStep(0);
      onSuccess();
    },
    walletAddress
  );

  const { creating, onCreate } = useCreate({
    token: token,
    amount: token.type === "nft" ? 0 : amount,
    anchorPrice,
    onCreateSuccess: (poolId) => {
      setPoolId(poolId);
      setStep(approved ? 2 : 1);
      if (Number(tokenBalance) < amount) {
        setPaymentsModalOpen(true);
      }
    }
  });

  const { approving, approve, approved, checking } = useApprove({
    token: token,
    amount: amount?.toString(),
    spender: config.bettingContractAddress,
    account: walletAddress
  });

  useEffect(() => {
    if (poolId === -1) {
      setStep(0);
      return;
    }
    if (approved) {
      setStep(2);
    } else {
      setStep(1);
    }
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
      }}
      loading={depositing}
    >
      Deposit Amount
    </Button>
  );
}
