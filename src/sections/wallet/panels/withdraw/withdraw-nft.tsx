import ButtonWithAuth from "@/components/button/button-with-auth";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { useAuth } from "@/contexts/auth";
import useTransfer from "@/hooks/evm/use-withdraw";
import Empty from "../info/empty";
import { Item } from "../info/nfts";
import useNftsStore from "@/stores/use-nfts";

export default function WithdrawSolana() {
  const [receiveAddress, setReceiveAddress] = useState("");
  const { address } = useAuth();
  const nftsStore = useNftsStore();

  const isAddressValid = useMemo(() => {
    return receiveAddress && receiveAddress !== address;
  }, [receiveAddress]);

  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { onWithdraw, withdrawing } = useTransfer(() => {
    nftsStore.set({ refresher: nftsStore.refresher + 1 });
  });

  return (
    <div className="pt-[20px] flex flex-col justify-between h-[calc(100vh-140px)]">
      <div>
        {nftsStore.nfts.length > 0 ? (
          <div className="flex gap-[15px] min-h-[110px]">
            {nftsStore.nfts.map((item: any) => (
              <Item
                data={item.token}
                key={item.token.tokenId}
                onClick={() => setSelectedItem(item)}
                active={selectedItem?.token.tokenId === item.token.tokenId}
              />
            ))}
          </div>
        ) : (
          <Empty text="No NFT found in your dolla account" />
        )}
      </div>
      <div>
        <div className="text-[14px] text-white text-center mt-[20px]">
          Receive Address
        </div>
        <input
          className={clsx(
            "h-[47px] w-full border border-[#8A87AA4D] rounded-[6px] bg-[#00000033] leading-[47px] px-[12px] text-[12px] text-white mt-[10px]",
            !isAddressValid && receiveAddress && "!border-[#FF5A974D]"
          )}
          value={receiveAddress}
          onChange={(e) => {
            setReceiveAddress(e.target.value);
          }}
          placeholder="Address"
        />
        <ButtonWithAuth
          className="mt-[10px] w-full h-[42px]"
          disabled={
            !isAddressValid || !receiveAddress || withdrawing || selectedItem
          }
          loading={withdrawing}
          onClick={() => {
            onWithdraw({
              type: "nft",
              amount: 1,
              address: selectedItem.token.contract,
              receiveAddress,
              tokenId: selectedItem.token.tokenId
            });
          }}
        >
          {!selectedItem
            ? "Select NFT"
            : !receiveAddress
            ? "Input Address"
            : isAddressValid
            ? "Withdraw NFT"
            : "Invalid Address"}
        </ButtonWithAuth>
        <div className="mt-[20px] flex items-center justify-center gap-[8px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="27"
            height="26"
            viewBox="0 0 27 26"
            fill="none"
          >
            <path
              d="M11.7847 2.86099C12.5614 1.56556 14.4386 1.56556 15.2153 2.86099L23.3756 16.4716C24.1749 17.8046 23.2146 19.5 21.6603 19.5H5.33969C3.7854 19.5 2.82513 17.8046 3.62437 16.4716L11.7847 2.86099Z"
              fill="#FF4372"
            />
            <path
              d="M12.1593 7.5H14.8613L14.4273 14.416H12.5793L12.1593 7.5ZM13.5033 18.14C13.0647 18.14 12.71 18.014 12.4393 17.762C12.1687 17.5007 12.0333 17.1647 12.0333 16.754C12.0333 16.3433 12.1687 16.012 12.4393 15.76C12.71 15.508 13.0647 15.382 13.5033 15.382C13.942 15.382 14.2967 15.508 14.5673 15.76C14.838 16.012 14.9733 16.3433 14.9733 16.754C14.9733 17.1647 14.838 17.5007 14.5673 17.762C14.2967 18.014 13.942 18.14 13.5033 18.14Z"
              fill="#252525"
            />
          </svg>
          <div className="text-[14px] text-[#FF4372]">
            Make sure to send it to <span className="font-bold">Berachain</span>
          </div>
        </div>
      </div>
    </div>
  );
}
