import Avatar from "@/components/avatar";
import { useAuth } from "@/contexts/auth";
import { useUser } from "@privy-io/react-auth";
import AvatarCashier from "./avatar-cashier";
import useWalletStore from "@/stores/use-wallet";

export default function AvatarAction() {
  const { userInfo, nearAccount, address } = useAuth();
  const { user } = useUser();

  // const { claiming, claimTestCoin } = useClaimTestCoin();
  const { set, showUserInfo } = useWalletStore();

  return (
    <div className="relative group flex items-center gap-[10px]">
      {user?.wallet?.address && (
        <AvatarCashier
          onClick={(e: any) => {
            e.stopPropagation();
            set({
              showWallet: true,
              defaultDepositToken: null,
              defaultDepositAmount: null,
              panelType: "info"
            });
          }}
          tokenBalance={nearAccount?.balance}
        />
      )}
      {userInfo?.icon && (
        <Avatar
          size={32}
          address={address}
          email={userInfo?.show_email}
          className="shrink-0 button border-[2px] border-[#1B1A23]"
          onClick={(e: any) => {
            e.stopPropagation();
            set({ showUserInfo: !showUserInfo });
          }}
        />
      )}
    </div>
  );
}
