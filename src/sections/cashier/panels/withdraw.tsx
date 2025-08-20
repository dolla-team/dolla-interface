import Coin from "@/components/icons/coin";
import ButtonWithAuth from "@/components/button/button-with-auth";
import config from "@/config/bera";
import { formatNumber } from "@/utils/format/number";
import useTokenBalance from "@/hooks/evm/use-token-balance";
import { useMemo, useState } from "react";
import clsx from "clsx";
import useWithdraw from "@/hooks/evm/use-withdraw";
import useUserWinner from "@/hooks/use-user-winner";
import Loading from "@/components/icons/loading";
import { useAuth } from "@/contexts/auth";

export default function Withdraw() {
  const { tokenBalance } = useTokenBalance(config.purchaseToken);
  const [receiveAddress, setReceiveAddress] = useState("");
  const { address } = useAuth();
  const isAddressValid = useMemo(() => {
    return (
      receiveAddress.length === 42 &&
      receiveAddress.startsWith("0x") &&
      receiveAddress === address
    );
  }, [receiveAddress]);
  const { nfts, coinItem, loading } = useUserWinner();

  const [selectedItem, setSelectedItem] = useState<any>(nfts[0]);
  const { withdrawing, onWithdraw } = useWithdraw(() => {
    setSelectedItem(null);
    setReceiveAddress("");
    setAmount("");
  });

  const [amount, setAmount] = useState("");
  return (
    <div className="pt-[20px]">
      <div className="flex gap-[6px] min-h-[160px]">
        {coinItem && (
          <Item
            data={coinItem}
            active={selectedItem?.address === coinItem.address}
            onClick={() => {
              setSelectedItem(coinItem);
            }}
            key={coinItem.address}
          />
        )}
        {loading ? (
          <div className="w-[142px] h-[159px] bg-[#191E27] rounded-[6px] flex items-center justify-center">
            <Loading size={20} />
          </div>
        ) : (
          <>
            {nfts.map((item) => {
              return (
                <Item
                  data={item}
                  key={item.address}
                  active={selectedItem?.address === item.address}
                  onClick={() => {
                    setSelectedItem(item);
                  }}
                />
              );
            })}
          </>
        )}
      </div>
      {selectedItem?.type === "coin" && (
        <>
          <div className="text-[14px] text-[#ADBCCF] mt-[20px]">
            Withdraw Amount
          </div>
          <div className="flex items-center mt-[6px] gap-[12px]">
            <div className="w-[235px] h-[47px] rounded-[6px] bg-[#191E27] px-[12px] flex items-center">
              <input
                className="w-[166px] text-[14px] text-white"
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
                className="button underline text-[#ADBCCF] text-[12px] mr-[6px]"
                onClick={() => {
                  setAmount(tokenBalance);
                }}
              >
                Max
              </button>
              <Coin />
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="8"
              viewBox="0 0 18 8"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M1 3.5C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5V3.5ZM17.3536 4.35355C17.5488 4.15829 17.5488 3.84171 17.3536 3.64645L14.1716 0.464466C13.9763 0.269204 13.6597 0.269204 13.4645 0.464466C13.2692 0.659728 13.2692 0.976311 13.4645 1.17157L16.2929 4L13.4645 6.82843C13.2692 7.02369 13.2692 7.34027 13.4645 7.53553C13.6597 7.7308 13.9763 7.7308 14.1716 7.53553L17.3536 4.35355ZM1 4V4.5H17V4V3.5H1V4Z"
                fill="#9AA8B9"
              />
            </svg>
            <div className="flex items-center text-[14px] text-white">
              <span>
                {formatNumber(tokenBalance, 0, true, { isShort: true })}
              </span>
              <img
                src="/tokens/usdc.png"
                alt="bid-coins"
                className="w-[20px] h-[20px] rounded-full ml-[10px] mr-[7px]"
              />
              <span>{config.purchaseToken.symbol}</span>
            </div>
          </div>
        </>
      )}
      <>
        <div className="text-[14px] text-[#ADBCCF] mt-[20px]">
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
        className="mt-[20px] w-full h-[40px]"
        disabled={!isAddressValid || !amount || !receiveAddress}
        loading={withdrawing}
        onClick={() => {
          onWithdraw({
            ...selectedItem,
            receiveAddress,
            amount: Number(amount)
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
    </div>
  );
}

const Item = ({
  data,
  onClick,
  active
}: {
  data: any;
  onClick: () => void;
  active: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "button border border-[#191E27] w-[142px] h-[159px] shrink-0 bg-[#191E27] rounded-[6px] flex flex-col items-center text-[14px] pt-[10px]",
        active && "border-[#FFC42F]"
      )}
    >
      <div className="text-[#ADBCCF]">{data.label}</div>
      <div className="w-[74px] h-[74px] my-[10px] flex justify-center items-center">
        {data.label === "Bid Coins" ? (
          <Coin size={50} />
        ) : data.icon ? (
          <img src={data.icon} alt={data.label} className="w-full h-full" />
        ) : (
          <div className="w-full h-full bg-[#191E27] rounded-[6px]" />
        )}
      </div>
      {data.amount ? (
        <div className="text-white">
          {formatNumber(data.amount, 0, true, { isShort: true })}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
