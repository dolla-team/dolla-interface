import WithdrawNft from "./withdraw-nft";
import useWalletStore from "@/stores/use-wallet";
import TokenSelector from "../deposit/token-selector";
import WithdrawInput from "./input";

export default function WithdrawPanel({ onBack }: { onBack: () => void }) {
  const walletStore = useWalletStore();
  return (
    <div className="px-[20px] pt-[30px]">
      {walletStore.withdrawPanelType === "token-selector" && (
        <TokenSelector
          onBack={onBack}
          onSelect={(token: any) => {
            walletStore.set({
              selectedToken: token,
              withdrawPanelType: "input"
            });
          }}
          title="Withdraw"
        />
      )}
      {walletStore.withdrawPanelType === "input" && <WithdrawInput />}
      {/* <Tabs
        tabs={[
          { label: "Token", key: "token" },
          { label: "NFT", key: "nft" }
        ]}
        currentTab={walletStore.withdrawType}
        onChangeTab={(tab: string) => {
          walletStore.set({ withdrawType: tab });
        }}
        className="w-[162px] h-[38px] p-[4px] !gap-0 mt-[20px] border border-[#383F47] rounded-[20px] mx-auto"
        tabClassName="text-[12px] text-center w-[80px] leading-[30px] !pb-0"
        activeClassName="!text-white"
        cursorClassName="!bg-[#743EFF] h-[30px] rounded-[16px]"
      /> */}
      {/* {walletStore.withdrawType === "token" && <Withdraw />} */}
      {walletStore.withdrawType === "nft" && <WithdrawNft />}
    </div>
  );
}
