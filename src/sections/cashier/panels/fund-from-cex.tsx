import { useEffect, useRef } from "react";

export default function FundFromCex({ amount, disabled, setAmount, onBack, onOrderIdCreated }: { amount: string, disabled?: boolean, setAmount: (v: string) => void, onBack: () => void, onOrderIdCreated: () => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return <div className="relative flex flex-col items-center justify-center min-h-[320px]">

        <button
            className="flex absolute top-[10px] left-[10px] items-center px-4 py-1 cursor-pointer gap-2 rounded-full bg-[#00000033] focus:outline-none"
            onClick={onBack}
        >
            <svg width="6" height="14" viewBox="0 0 6 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.40381 0.60182L1.74981 6.60782L5.40381 12.6138L4.01781 13.2158L-0.000191689 6.60782L4.01781 -0.000180244L5.40381 0.60182Z" fill="#BBACA6" />
            </svg>
            <span className="text-[#BBACA6] text-[14px] font-normal">back</span>
        </button>

        <div className="mt-[40px] mb-[32px] text-[#BBACA6] text-[16px] text-center">
            Enter an amount (${amount} minimum)
        </div>
        <div className="flex flex-col items-center mb-[40px] ">
            <div
                className="flex justify-center items-center text-[32px] text-white tracking-wide"
                style={{
                    textShadow: '0px 2px 0px #000, 0px 4px 8px #00000055'
                }}
            >
                {/* <span className="text-[32px]">$</span> */}
                <input
                    className="text-[32px] text-white tracking-wide w-[100px] font-[DelaGothicOne] text-center"
                    placeholder="$0"
                    value={amount}
                    ref={inputRef}
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    onChange={(e) => setAmount(e.target.value as string)}
                />
            </div>
            <span className="text-[#BBACA6] text-[15px] mt-1">USDC</span>
        </div>
        <button
            disabled={disabled}
            onClick={() => {
                if (amount) {
                    onOrderIdCreated();
                }
            }}
            className="w-[200px] h-[42px] cursor-pointer rounded-[10px] bg-gradient-to-b from-[#FFF698] to-[#FFC42F] text-black text-[16px] font-bold shadow-md active:scale-95 transition-all disabled:opacity-50"
        >
            Next
        </button>
    </div>

}