import FundList from "./fund-list";
import TokenSelector from "./token-selector";
import RechargeFrom1click from "./recharge-from-1click";
import FundFromCoinbase from "./fund-from-coinbase";
import useWalletStore from "@/stores/use-wallet";

export default function Deposit({ onBack }: { onBack: () => void }) {
  const walletStore = useWalletStore();

  return (
    <div className="px-[16px] pt-[16px] h-full">
      {walletStore.depositPanelType === "fund-list" && (
        <FundList onBack={onBack} />
      )}
      {walletStore.depositPanelType === "token-selector" && (
        <TokenSelector
          onBack={() => {
            onBack();
            // walletStore.set({ depositPanelType: "fund-list" });
          }}
          onSelect={(token) => {
            walletStore.set({
              selectedToken: token,
              depositPanelType: "input",
              depositMethod: walletStore.depositMethod
            });
          }}
          title="Deposit"
        />
      )}
      {walletStore.depositPanelType === "input" &&
        walletStore.depositMethod === "centralized-exchange" && (
          <RechargeFrom1click />
        )}
      {/* {walletStore.depositPanelType === "input" &&
        walletStore.depositMethod === "coinbase" && (
          <FundFromCoinbase
            onBack={() => {
              walletStore.set({ depositPanelType: "token-selector" });
            }}
          />
        )} */}
    </div>
  );
}
