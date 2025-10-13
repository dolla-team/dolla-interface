import BackIcon from "../../back-icon";
import DepositChainSelector from "../deposit/chain-selector";
import useWalletStore from "@/stores/use-wallet";
import WarningIcon from "../deposit/warning-icon";
import Button from "@/components/button";

export default function ChainSelector({
  selectedChain,
  onSelect,
  receiveAddress,
  setReceiveAddress
}: any) {
  const walletStore = useWalletStore();
  return (
    <div className="h-full relative">
      <div
        className="flex items-center gap-[8px] text-[16px] cursor-pointer button"
        onClick={() => {
          if (selectedChain) {
            onSelect(null);
            return;
          }
          walletStore.set({ withdrawPanelType: "token-selector" });
        }}
      >
        <BackIcon />
        <div className="text-black text-[14px]">Withdraw</div>
      </div>

      {!selectedChain ? (
        <>
          <div className="text-[16px] text-black font-[500] text-center mt-[20px] mb-[20px]">
            Select Network
          </div>
          <DepositChainSelector
            selectedChain={selectedChain}
            onSelect={(chain: any) => {
              onSelect(chain);
            }}
            className="h-[calc(100vh-140px)]"
          />
        </>
      ) : (
        <>
          <div className="text-[16px] text-black font-[500] text-center mt-[20px] mb-[20px]">
            Receive Address
          </div>
          <input
            className="w-full h-[47px] rounded-[10px] border border-[#8A87AA4D] leading-[47px] px-[12px] text-[12px] mt-[10px]"
            value={receiveAddress}
            onChange={(e) => {
              setReceiveAddress(e.target.value);
            }}
            placeholder="Address"
          />
          <div className="mt-[10px] py-[10px] px-[8px] text-[12px] flex items-center gap-[4px] leading-[18px] text-black bg-[#FFC42F]/10 rounded-[12px]">
            <WarningIcon />
            <div>
              Make sure to send it to{" "}
              <span className="font-bold">{selectedChain?.name}</span>
            </div>
          </div>
          <Button
            disabled={!receiveAddress}
            className="w-full h-[50px] !bg-[black] !text-white !absolute bottom-[20px] left-0"
            onClick={() => {
              walletStore.set({ withdrawPanelType: "input" });
            }}
          >
            Next
          </Button>
        </>
      )}
    </div>
  );
}
