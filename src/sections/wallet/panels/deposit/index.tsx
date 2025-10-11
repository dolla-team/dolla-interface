import FundList from "./fund-list";
import TokenSelector from "./token-selector";
import RechargeFrom1click from "./recharge-from-1click";
import FundFromCoinbase from "./fund-from-coinbase";
import useWalletStore from "@/stores/use-wallet";

export default function Deposit({ onBack }: { onBack: () => void }) {
  const walletStore = useWalletStore();

  return (
    <div className="px-[20px] pt-[30px]">
      {walletStore.depositPanelType === "fund-list" && (
        <FundList onBack={onBack} />
      )}
      {walletStore.depositPanelType === "token-selector" && (
        <TokenSelector
          onBack={() => {
            walletStore.set({ depositPanelType: "fund-list" });
          }}
          onSelect={(token) => {
            walletStore.set({
              selectedToken: token,
              depositPanelType: "input"
            });
          }}
          title="Deposit"
        />
      )}
      {walletStore.depositPanelType === "input" &&
        walletStore.depositMethod === "centralized-exchange" && (
          <RechargeFrom1click />
        )}
      {walletStore.depositPanelType === "input" &&
        walletStore.depositMethod === "coinbase" && (
          <FundFromCoinbase
            onBack={() => {
              walletStore.set({ depositPanelType: "fund-list" });
            }}
          />
        )}
    </div>
  );
}
