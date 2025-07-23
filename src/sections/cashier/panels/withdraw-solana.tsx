import Coin from "@/components/icons/coin";
import ButtonWithAuth from "@/components/button/button-with-auth";
// import { PURCHASE_TOKEN } from "@/config";
import { formatNumber } from "@/utils/format/number";
import { useMemo, useState } from "react";
import clsx from "clsx";
import useSplWithdraw from "@/hooks/solana/use-spl-withdraw";
// import useUserWinner from "@/hooks/use-user-winner";
// import Loading from "@/components/icons/loading";
import { useAuth } from "@/contexts/auth";
import useTokenBalance from "@/hooks/solana/use-token-balance";
import useTransfer from "@/hooks/solana/use-transfer";

const TOKNES = [
  // {
  //   address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  //   decimals: 6,
  //   icon: "/currency/usdc.png",
  //   symbol: "USDC"
  // },
  {
    address: "ADo4M7ZEZwDKNP1k8dic26TBrftX6mix9sGMntkq6Tp4",
    decimals: 6,
    icon: "/currency/usdc.png",
    symbol: "USDC"
  },
  {
    address: "zBTCug3er3tLyffELcvDNrKkCymbPWysGcWihESYfLg",
    decimals: 9,
    icon: "/btc.png",
    symbol: "BTC"
  }
];
export default function WithdrawSolana() {
  const { tokenBalance: usdcBalance } = useTokenBalance(TOKNES[0]);
  const { tokenBalance: btcBalance } = useTokenBalance(TOKNES[1]);
  const [receiveAddress, setReceiveAddress] = useState("");
  const { address } = useAuth();
  const [amount, setAmount] = useState("");
  const isAddressValid = useMemo(() => {
    return (
      // receiveAddress.length === 42 &&
      // receiveAddress.startsWith("0x") &&
      receiveAddress !== address
    );
  }, [receiveAddress]);

  const [selectedItem, setSelectedItem] = useState<any>(TOKNES[0]);
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

  const { onTransfer } = useTransfer({
    token: selectedItem,
    isTicket: false,
    onTransferSuccess: () => {
      setSelectedItem(null);
      setReceiveAddress("");
      setAmount("");
    }
  });

  return (
    <div className="pt-[20px]">
      <div className="flex gap-[15px] min-h-[160px]">
        {TOKNES.map((item) => {
          return (
            <Item
              data={item}
              key={item.address}
              active={selectedItem?.address === item.address}
              onClick={() => {
                setSelectedItem(item);
              }}
              balance={
                item.symbol === "USDC" ? usdcBalance : btcBalance
              }
            />
          );
        })}
      </div>

      <>
        <div className="text-[14px] text-[#BBACA6] mt-[20px]">
          Withdraw Amount
        </div>
        <div className="flex items-center mt-[6px] gap-[12px]">
          <div className="w-full h-[47px] rounded-[6px] bg-[#191E27] px-[12px] flex items-center">
            <input
              className="w-full text-[14px] text-white"
              value={amount}
              onChange={(e) => {
                if (isNaN(Number(e.target.value))) {
                  return;
                }
                setAmount(e.target.value);
              }}
              placeholder="Input amount"
            />
            <button
              className="button text-[#BBACA6] text-[12px]"
              onClick={() => {
                setAmount(
                  selectedItem.symbol === "USDC" ? usdcBalance : btcBalance
                );
              }}
            >
              Max
            </button>
            <img
              src={selectedItem.icon}
              className="w-[20px] h-[20px] rounded-full ml-[5px]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-[10px] px-[7px] text-[14px] text-white">
          <div className="text-[#BBACA6]">Est. Received</div>

          <div className="flex items-center">
            <span>{formatNumber(amount, 0, true, { isShort: true })}</span>
            <img
              src={selectedItem.icon}
              alt="bid-coins"
              className="w-[20px] h-[20px] rounded-full ml-[10px] mr-[7px]"
            />
          </div>
        </div>
      </>
      <>
        <div className="text-[14px] text-[#BBACA6] mt-[20px]">
          Receive Address
        </div>
        <input
          className={clsx(
            "h-[47px] w-full rounded-[6px] !bg-[#191E27] leading-[47px] px-[12px] text-[#ADBCCF] mt-[6px]",
            !isAddressValid && receiveAddress && "border border-[#FF5A974D]"
          )}
          value={receiveAddress}
          onChange={(e) => {
            setReceiveAddress(e.target.value);
          }}
          placeholder="Please input the address"
        />
      </>
      <ButtonWithAuth
        className="mt-[20px] w-[160px] mx-auto h-[40px]"
        disabled={!isAddressValid || !amount || !receiveAddress}
        loading={false}
        onClick={() => {
          onTransfer(Number(amount), receiveAddress);
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
        "button flex-1 border border-[#191E27] w-[142px] h-[159px] pt-[20px] shrink-0 bg-[#191E27] rounded-[6px] flex flex-col items-center text-[14px]",
        active && "border-[#FFC42F]"
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
      <div className="text-white text-[16px]">{data.symbol}</div>
      {balance ? (
        <div className="text-white text-[20px]">
          {formatNumber(balance, 0, true, { isShort: true })}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
