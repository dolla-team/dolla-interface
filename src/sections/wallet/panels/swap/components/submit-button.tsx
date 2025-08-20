import Loading from "@/components/icons/loading";
import useApprove from "@/hooks/evm/use-approve";
import { useEffect } from "react";
import { useAccount } from "@/hooks/evm/use-account";
import { signFn } from "@/libs/axios";

export const BaseButton = ({
  loading,
  loadingText,
  onClick,
  children,
  disabled = false
}: any) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="h-[60px] md:h-[46px] w-full duration-500 hover:opacity-70 active:opacity-90 disabled:opacity-30 flex items-center justify-center gap-[10px] border border-[#000000] rounded-[10px] bg-[#743EFF] text-[14px] text-white md:text-[14px] font-[600] mt-[16px] cursor-pointer"
    >
      {loading ? (
        <>
          <Loading />
          {!!loadingText && <div>{loadingText}</div>}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default function SubmitBtn({
  chain,
  spender,
  isApproveMax,
  token,
  amount,
  loading,
  loadingText,
  errorTips,
  disabled,
  onClick,
  onRefresh,
  updater,
  children
}: any) {
  const { approve, approved, approving, checking, checkApproved } = useApprove({
    amount,
    token,
    spender,
    isMax: isApproveMax,
    onSuccess: onRefresh
  });
  const { account, chainId, switchToBerachain } = useAccount();

  console.log("chainId: %o", chainId);
  console.log("account: %o", account);

  useEffect(() => {
    checkApproved();
  }, [updater]);

  if (!account || !chainId) {
    return (
      <BaseButton
        onClick={() => {
          signFn();
        }}
      >
        Connect wallet
      </BaseButton>
    );
  }

  console.log("chain.chainId: %o", chain.chainId);
  if (chainId !== chain.chainId) {
    return (
      <BaseButton
        onClick={() => {
          switchToBerachain(chain.chainId);
        }}
        loading={false}
      >
        Switch Network
      </BaseButton>
    );
  }

  if (checking || approving || loading) {
    return <BaseButton loading={true} disabled loadingText={loadingText} />;
  }

  if (errorTips) {
    return <BaseButton disabled>{errorTips}</BaseButton>;
  }

  if (!spender) return <BaseButton disabled>Insufficient Liquidity</BaseButton>;

  if (!approved) {
    return <BaseButton onClick={approve}>Approve {token?.symbol}</BaseButton>;
  }

  return (
    <BaseButton onClick={onClick} disabled={disabled}>
      {children ? children : "Swap"}
    </BaseButton>
  );
}
