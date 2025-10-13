import { useEffect, useRef } from "react";
import Button from "@/components/button";
import BackIcon from "@/sections/wallet/back-icon";
import useWalletStore from "@/stores/use-wallet";

export default function FundFromCex({
  loading = false,
  amount,
  disabled,
  setAmount,
  onBack,
  onOrderIdCreated,
  minAmount
}: {
  loading?: boolean;
  amount: string;
  disabled?: boolean;
  setAmount: (v: string) => void;
  onBack: () => void;
  onOrderIdCreated: () => void;
  minAmount: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const walletStore = useWalletStore();
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="relative min-h-[320px]">
      <div
        className="flex items-center gap-[8px] text-[16px] cursor-pointer button"
        onClick={onBack}
      >
        <BackIcon />
        <div className="text-black text-[14px]">Deposit</div>
      </div>

      <div className="mt-[40px] mb-[32px] text-black text-[14px] text-center">
        Enter an amount (min {minAmount})
      </div>
      <div className="flex flex-col items-center mb-[40px] ">
        <div
          className="flex justify-center items-center text-[32px] text-black tracking-wide"
          style={{
            textShadow: "0px 2px 0px #000, 0px 4px 8px #00000055"
          }}
        >
          {/* <span className="text-[32px]">$</span> */}
          <input
            className="text-[32px] text-black tracking-wide w-[100px] text-center"
            placeholder="$0"
            value={amount}
            ref={inputRef}
            pattern="^[0-9]*[.,]?[0-9]*$"
            onChange={(e) => setAmount(e.target.value as string)}
          />
        </div>
        <span className="text-black text-[15px] mt-1">
          {walletStore.selectedToken?.symbol}
        </span>
      </div>
      <div className="flex justify-center">
        <Button
          disabled={disabled}
          loading={loading}
          onClick={() => {
            if (amount) {
              onOrderIdCreated();
            }
          }}
          className="w-full h-[42px] !bg-black !text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
