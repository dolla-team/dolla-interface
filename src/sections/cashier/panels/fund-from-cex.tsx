import { useEffect, useRef } from "react";
import config from "@/config/bera";
import ButtonV2 from "@/components/button/v2";
import BackIcon from "@/sections/wallet/back-icon";

export default function FundFromCex({
  amount,
  disabled,
  setAmount,
  onBack,
  onOrderIdCreated
}: {
  amount: string;
  disabled?: boolean;
  setAmount: (v: string) => void;
  onBack: () => void;
  onOrderIdCreated: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="relative min-h-[320px]">
      <div
        className="flex items-center gap-[18px] text-[16px] cursor-pointer button"
        onClick={onBack}
      >
        <BackIcon />
        <div className="text-[#8A87AA] text-[12px]">Back</div>
      </div>

      <div className="mt-[40px] mb-[32px] text-white text-[14px] text-center">
        Enter an amount
      </div>
      <div className="flex flex-col items-center mb-[40px] ">
        <div
          className="flex justify-center items-center text-[32px] text-white tracking-wide"
          style={{
            textShadow: "0px 2px 0px #000, 0px 4px 8px #00000055"
          }}
        >
          {/* <span className="text-[32px]">$</span> */}
          <input
            className="text-[32px] text-white tracking-wide w-[100px] text-center"
            placeholder="$0"
            value={amount}
            ref={inputRef}
            pattern="^[0-9]*[.,]?[0-9]*$"
            onChange={(e) => setAmount(e.target.value as string)}
          />
        </div>
        <span className="text-white text-[15px] mt-1">
          {config.purchaseToken.symbol}
        </span>
      </div>
      <div className="flex justify-center">
        <ButtonV2
          disabled={disabled}
          onClick={() => {
            if (amount) {
              onOrderIdCreated();
            }
          }}
          className="w-[200px] h-[42px]"
        >
          Next
        </ButtonV2>
      </div>
    </div>
  );
}
