import Coin from "@/components/icons/coin";
import ButtonWithAuth from "@/components/button/button-with-auth";
import { formatNumber } from "@/utils/format/number";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { useAuth } from "@/contexts/auth";
import useTokenBalance from "@/hooks/evm/use-token-balance";
import useTransfer from "@/hooks/evm/use-withdraw";
import config from "@/config/bera";
import Big from "big.js";

export default function WithdrawSolana() {
  const { tokenBalance: usdcBalance, update: updateUsdcBalance } =
    useTokenBalance(config.purchaseToken);
  // const { tokenBalance: btcBalance, update: updateBtcBalance } =
  //   useTokenBalance(TOKNES[1]);
  const [receiveAddress, setReceiveAddress] = useState("");
  const { address } = useAuth();
  const [amount, setAmount] = useState("");

  const isAddressValid = useMemo(() => {
    return (
      // receiveAddress.length === 42 &&
      // receiveAddress.startsWith("0x") &&
      receiveAddress && receiveAddress !== address
    );
  }, [receiveAddress]);

  const [selectedItem, setSelectedItem] = useState<any>(config.purchaseToken);
  // const { withdrawing, onWithdraw } = useWithdraw(() => {
  //   setSelectedItem(null);
  //   setReceiveAddress("");
  //   setAmount("");
  // });

  // const { withdraw } = useSplWithdraw({
  //   token: selectedItem,
  //   amount: Number(amount),
  //   targetAddress: receiveAddress
  // });

  const { onWithdraw, withdrawing } = useTransfer(() => {
    updateUsdcBalance();
    setTimeout(() => {
      updateUsdcBalance();
    }, 15000);
  });

  return (
    <div className="pt-[20px] flex flex-col justify-between h-[calc(100vh-140px)]">
      <div>
        <div className="flex gap-[15px] min-h-[110px]">
          <Item
            data={config.purchaseToken}
            key={config.purchaseToken.address}
            active={selectedItem?.address === config.purchaseToken.address}
            onClick={() => {
              setSelectedItem(config.purchaseToken);
            }}
            balance={usdcBalance}
          />
        </div>
        <div className="flex items-center justify-center mt-[30px] relative">
          <div className="text-[14px] text-black">Withdraw Amount</div>
          <button
            onClick={() => {
              setAmount(usdcBalance);
            }}
            className="w-[50px] h-[28px] absolute right-[0] top-[0] button border border-[#373737] rounded-[14px] text-[#8A87AA] text-[12px] bg-transparent"
          >
            Max
          </button>
        </div>
        <input
          className="w-full text-[32px] font-bold text-black text-center mt-[6px]"
          value={amount}
          onChange={(e) => {
            if (isNaN(Number(e.target.value))) {
              return;
            }
            setAmount(e.target.value);
          }}
          placeholder="0"
        />
        <div className="flex items-center justify-center gap-[10px] mt-[10px]">
          <img
            src={selectedItem.icon}
            alt="bid-coins"
            className="w-[32px] h-[32px] rounded-full"
          />
          <div className="text-[14px] text-black">{selectedItem.symbol}</div>
        </div>
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
            !isAddressValid || !amount || !receiveAddress || withdrawing
          }
          loading={withdrawing}
          onClick={() => {
            // onTransfer(Number(amount), receiveAddress);
            onWithdraw({
              type: "coin",
              amount: Big(amount)
                .times(10 ** config.purchaseToken.decimals)
                .toFixed(0),
              address: config.purchaseToken.address,
              receiveAddress,
              tokenId: ""
            });
          }}
        >
          {!amount
            ? "Input Amount"
            : !receiveAddress
            ? "Input Address"
            : isAddressValid
            ? "Withdraw"
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

const Item = ({
  data,
  onClick,
  balance,
  active
}: {
  data: any;
  onClick: () => void;
  balance?: string;
  active: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "button flex-1 border border-[#383F47] w-full h-[118px] shrink-0 bg-[#1A1E24] rounded-[6px] flex flex-col justify-center items-center text-[14px]",
        active && "!border-[#6F37FF]"
      )}
    >
      <div className="text-[#ADBCCF]">{data.label}</div>
      <div className="w-[40px] h-[40px] my-[10px] flex justify-center items-center">
        {data.label === "Bid Coins" ? (
          <Coin size={50} />
        ) : data.icon ? (
          <img src={data.icon} alt={data.label} className="w-full h-full" />
        ) : (
          <div className="w-full h-full bg-[#191E27] rounded-[6px]" />
        )}
      </div>
      <div className="text-white text-[14px]">{data.symbol}</div>
      {balance && (
        <div className="text-white text-[14px] font-[DelaGothicOne]">
          {formatNumber(balance, 0, true, { isShort: false })}
        </div>
      )}
    </div>
  );
};
