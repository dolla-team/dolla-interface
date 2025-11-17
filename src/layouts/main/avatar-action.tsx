import Avatar from "@/components/avatar";
import { useAuth } from "@/contexts/auth";
import AvatarCashier from "./avatar-cashier";
import { useGlobalStore } from "@/stores/use-global";
import useWalletStore from "@/stores/use-wallet";
import useBalance from "@/hooks/near/use-balance";

export default function AvatarAction() {
  const { userInfo, address } = useAuth();

  // const { claiming, claimTestCoin } = useClaimTestCoin();
  const { set, showUserInfo } = useGlobalStore();
  const walletStore = useWalletStore();

  const { balance } = useBalance();

  return (
    <div className="relative group flex items-center gap-[10px]">
      <AvatarCashier
        onClick={(e: any) => {
          e.stopPropagation();
          walletStore.set({
            showWallet: true,
            defaultDepositToken: null,
            defaultDepositAmount: null,
            panelType: "info"
          });
        }}
        tokenBalance={Number(balance).toFixed(2)}
      />
      <Avatar
        size={32}
        src={userInfo?.icon}
        className="shrink-0 button text-[16px]"
        address={userInfo?.user}
        onClick={(e: any) => {
          e.stopPropagation();
          set({ showUserInfo: !showUserInfo });
        }}
      />
    </div>
  );
}
