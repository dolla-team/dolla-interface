import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import use1clickTokens from "@/hooks/use-1click-tokens";
import { useDebounce } from "ahooks";
import useDeposit from "@/hooks/near/use-deposit";
import { useUser } from "@privy-io/react-auth";
import Big from "big.js";
import { chainConfig } from "../utils/chainConfig";
export default function TokenSelector({ onTokenSelect, onAddressCreated, onLoading }: { onTokenSelect: (token: any) => void, onAddressCreated: (amount: any) => void, onLoading: (loading: boolean) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedToken, setSelectedToken] = useState<any>(null);
    const [amount, setAmount] = useState("10");
    const { tokens } = use1clickTokens();
    const { generateDepositAddress } = useDeposit();
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    

    const usedTokens = useMemo(() => {
        return tokens.filter((token: any) => token.symbol.toUpperCase() === "USDC"
            && token.blockchain.toUpperCase() !== 'NEAR'
            && token.blockchain.toUpperCase() !== 'SOL'
            && token.blockchain.toUpperCase() !== 'SUI'
            && token.blockchain.toUpperCase() !== 'STELLAR'
        );
    }, [tokens]);

    const toggleDropdown = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation()
        setIsOpen(!isOpen);
    };
    const selectToken = (token: any) => {
        setSelectedToken(token);
        setIsOpen(false);
        onTokenSelect(token);
    };

    const debouncedAmount = useDebounce(amount, { wait: 1000 });

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAmount(value);
        // onAmountChange(value);
    };

    useEffect(() => {
        if (usedTokens.length > 0) {
            setSelectedToken(usedTokens[0]);
            onTokenSelect(usedTokens[0]);
        }
    }, [usedTokens]);

    useEffect(() => {
        if (debouncedAmount && Number(debouncedAmount) > 0 && selectedToken && user?.wallet?.address) {
            (async () => {
                onLoading(true);
                const depositAddress = await generateDepositAddress({
                    originAsset: selectedToken?.assetId,
                    destinationAsset: "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
                    amount: new Big(debouncedAmount).mul(10 ** 6).toString(),
                    evmAddress: user?.wallet?.address || "",
                    slippageTolerance: 50,
                    refundTo: user?.wallet?.address || ""
                });
                onAddressCreated(depositAddress);
                onLoading(false);
            })()
        }
    }, [debouncedAmount, selectedToken, user]);

    return (
        <div className="relative" onClick={(e) => {
            setIsOpen(false);
        }}>
            <div className="w-full bg-white rounded-[12px] border border-[#E5E7EB] p-[16px] flex items-center justify-between">
                <div className="relative flex-1">
                    <button
                        className="w-full flex items-center gap-[12px] py-[5px] px-[10px] bg-white cursor-pointer rounded-[8px] border border-[#E5E7EB] hover:border-[#D1D5DB] transition-colors"
                        onClick={toggleDropdown}
                    >
                        <div className="relative">
                            <div className="w-[32px] h-[32px] flex items-center justify-center">
                                <img className="w-full h-full object-cover" src="/tokens/usdc.png" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-[16px] h-[16px]  flex items-center justify-center">
                                <img className="w-full h-full object-cover" src={chainConfig[selectedToken?.blockchain]?.icon} />
                            </div>
                        </div>

                        <div className="flex-1 text-left">
                            <div className="text-[16px] text-black">{selectedToken?.symbol}</div>
                            <div className="text-[12px] text-[#6B7280]">{chainConfig[selectedToken?.blockchain]?.name}</div>
                        </div>

                        <svg
                            className={clsx(
                                "w-[16px] h-[16px] text-[#6B7280] transition-transform",
                                isOpen && "rotate-180"
                            )}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isOpen && (
                        <motion.div
                            className="absolute top-full left-0 right-0 mt-[8px] bg-white rounded-[12px] border border-[#E5E7EB] shadow-lg z-10 max-h-[300px] overflow-y-auto"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {usedTokens.map((token) => (
                                <div
                                    key={token.assetId}
                                    className={clsx(
                                        "flex items-center gap-[12px] p-[12px] hover:bg-[#F9FAFB] cursor-pointer transition-colors",
                                        selectedToken?.assetId === token.assetId && "bg-[#F3F4F6]"
                                    )}
                                    onClick={() => selectToken(token)}
                                >
                                    <div className="relative">
                                        <div className="w-[32px] h-[32px] flex items-center justify-center">
                                            <img className="w-full h-full object-cover" src="/tokens/usdc.png" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-[16px] h-[16px] flex items-center justify-center">
                                            <img className="w-full h-full object-cover" src={chainConfig[token?.blockchain]?.icon} />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="text-[16px] font-semibold text-black">{token.symbol}</div>
                                        <div className="text-[12px] text-[#6B7280]">{chainConfig[token?.blockchain]?.name}</div>
                                    </div>

                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>

                <div className="ml-[16px] flex flex-col items-end">
                    <input
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        className="text-[24px] text-black text-right bg-transparent border-none outline-none w-[80px]"
                        placeholder="0"
                    />
                    {/* <div className="text-[14px] text-[#6B7280]">{usdAmount}</div> */}
                </div>
            </div>
        </div>
    );
}