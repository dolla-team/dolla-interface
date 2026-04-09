import Avatar from "@/components/avatar";
import { useAuth } from '@/contexts/wallet'
import AvatarCashier from "./avatar-cashier";
import { useGlobalStore } from "@/stores/use-global";
import useWalletStore from "@/stores/use-wallet";
import useBalance from "@/hooks/near/use-balance";
import useLoginStore from "@/stores/use-login";
import NearWalletPanel from "@/libs/near/wallet-panel";

export default function AvatarAction() {
  const { userInfo } = useAuth();

  // const { claiming, claimTestCoin } = useClaimTestCoin();
  const { set, showUserInfo } = useGlobalStore();
  const walletStore = useWalletStore();
  const loginStore = useLoginStore();

  const { balance } = useBalance();

  return (
    <div className="flex items-center gap-[10px]">
      <div className="group relative">
        {loginStore.wallet === "near" && (
          <div
            className={[
              "invisible absolute right-0 top-full z-[120] pt-2 opacity-0 transition-opacity duration-150",
              "pointer-events-none group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto",
            ].join(" ")}
          >
            <NearWalletPanel />
          </div>
        )}
        <AvatarCashier
          onClick={(e: any) => {
            e.stopPropagation();
            if (loginStore.wallet === "near") {
              return;
            }
            walletStore.set({
              showWallet: true,
              defaultDepositToken: null,
              defaultDepositAmount: null,
              panelType: "info"
            });
          }}
          tokenBalance={Number(balance).toFixed(2)}
        />
      </div>
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
