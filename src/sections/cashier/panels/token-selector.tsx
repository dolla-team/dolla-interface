import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import use1clickTokens from "@/hooks/use-1click-tokens";
import { useDebounce } from "ahooks";
import useDeposit from "@/hooks/near/use-deposit";
import { useUser } from "@privy-io/react-auth";
import Big from "big.js";
import { chainConfig } from "../utils/chainConfig";
import useConfig from "@/hooks/near/use-config";
import useToast from "@/hooks/use-toast";
import Loading from "@/components/icons/loading";
import useWalletStore from "@/stores/use-wallet";

const TOKENS = [
  {
    symbol: "USDC",
    icon: "/tokens/usdc.png",
    address:
      "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
    decimals: 6
  }
  // {
  //   symbol: "BTC",
  //   icon: "/tokens/btc.png",
  //   address: "nep141:nbtc.bridge.near",
  //   decimals: 8
  // },
  // {
  //   symbol: "USDT",
  //   icon: "/tokens/usdt.png",
  //   address: "nep141:usdt.tether-token.near",
  //   decimals: 6
  // }
];
export default function TokenSelector({
  onTokenSelect,
  onQoute,
  onConfirm
}: {
  onTokenSelect: (token: any) => void;
  onQoute: (value: any) => void;
  onConfirm: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<any>(TOKENS[0]);
  const [amount, setAmount] = useState("1");
  const { tokens } = use1clickTokens();
  const { generateDepositAddress } = useDeposit();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const { config } = useConfig();
  const { fail } = useToast();
  const [selectedChain, setSelectedChain] = useState<any>(null);
  const [quote, setQuote] = useState<any>(null);
  const {
    defaultDepositToken: defaultToken,
    defaultDepositAmount: defaultValue
  } = useWalletStore();

  const usedChains = useMemo(() => {
    return tokens.filter(
      (token: any) =>
        token.symbol
          .toUpperCase()
          .includes(selectedToken.symbol.toUpperCase()) &&
        token.blockchain.toUpperCase() !== "NEAR" &&
        token.blockchain.toUpperCase() !== "SOL" &&
        token.blockchain.toUpperCase() !== "SUI" &&
        token.blockchain.toUpperCase() !== "STELLAR" &&
        token.blockchain.toUpperCase() !== "TRON" &&
        token.blockchain.toUpperCase() !== "APTOS" &&
        token.blockchain.toUpperCase() !== "TON"
    );
  }, [tokens, selectedToken]);

  // console.log('usedChains', usedChains);

  const toggleDropdown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    setIsOpen(!isOpen);
  };
  const selectToken = (token: any) => {
    setSelectedToken(token);
    setIsOpen(false);
  };

  const debouncedAmount = useDebounce(amount, { wait: 1000 });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    // onAmountChange(value);
  };

  // useEffect(() => {
  //     if (usedTokens.length > 0) {
  //         // setSelectedToken(usedTokens[0]);
  //         // onTokenSelect(usedTokens[0]);
  //     }
  // }, [usedTokens]);

  useEffect(() => {
    if (defaultToken) {
      setSelectedToken(
        TOKENS.find(
          (token) => token.symbol.toUpperCase() === defaultToken.toUpperCase()
        )
      );
    }
    if (defaultValue) {
      setAmount(defaultValue);
    }
  }, [defaultToken, defaultValue]);

  useEffect(() => {
    onTokenSelect({
      ...selectedChain,
      ...selectedToken
    });
  }, [selectedChain, selectedToken]);

  useEffect(() => {
    if (debouncedAmount && config) {
      let minDepositAmount = 0;

      for (const token in config.legal_bet_tokens) {
        const tokenObj = JSON.parse(token);
        if (
          tokenObj &&
          selectedToken.address
            .toUpperCase()
            .includes(tokenObj.FT?.toUpperCase())
        ) {
          minDepositAmount =
            Number(config.legal_bet_tokens[token]) /
            10 ** selectedToken.decimals;
          break;
        }
      }

      console.log("minDepositAmount", minDepositAmount);

      if (Number(debouncedAmount) < minDepositAmount) {
        fail({
          title: `Minimum deposit amount is ${minDepositAmount} ${selectedToken.symbol}`
        });
        return;
      }
    }

    if (
      debouncedAmount &&
      selectedChain &&
      user?.wallet?.address &&
      selectedToken
    ) {
      (async () => {
        try {
          setQuote(null);
          setLoading(true);
          const qoute = await generateDepositAddress({
            originAsset: selectedChain.assetId,
            destinationAsset: selectedToken.address,
            amount: new Big(debouncedAmount)
              .mul(10 ** selectedChain.decimals)
              .toString(),
            evmAddress: user?.wallet?.address || "",
            slippageTolerance: 50,
            refundTo: user?.wallet?.address || "",
            getFullQuote: true
          });
          setQuote(qoute);
          onQoute(qoute);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      })();
    }
  }, [debouncedAmount, selectedChain, selectedToken, user, config]);

  // console.log('quote', quote);

  return (
    <div
      className="relative h-[calc(100vh-100px)]"
      onClick={(e) => {
        setIsOpen(false);
      }}
    >
      <div className="text-[16px] text-center text-black mb-[20px]">
        Input Deposit Amount
      </div>

      <div className="w-full bg-white rounded-[12px] border border-[#E5E7EB] p-[16px] flex items-center justify-between">
        <div className="relative flex-1">
          <button
            className="w-full flex items-center gap-[12px] py-[5px] px-[10px] bg-white cursor-pointer rounded-[8px] border border-[#E5E7EB] hover:border-[#D1D5DB] transition-colors"
            onClick={toggleDropdown}
          >
            <div className="relative">
              <div className="w-[32px] h-[32px] flex items-center justify-center">
                <img
                  className="w-full h-full object-cover"
                  src={selectedToken?.icon}
                />
              </div>
              {/* <div className="absolute -bottom-1 -right-1 w-[16px] h-[16px]  flex items-center justify-center">
                                <img className="w-full h-full object-cover" src={chainConfig[selectedToken?.blockchain]?.icon} />
                            </div> */}
            </div>

            <div className="flex-1 text-left">
              <div className="text-[16px] text-black">
                {selectedToken?.symbol}
              </div>
              {/* <div className="text-[12px] text-[#6B7280]">{chainConfig[selectedToken?.blockchain]?.name}</div> */}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 mt-[8px] bg-white rounded-[12px] border border-[#E5E7EB] shadow-lg z-10 max-h-[300px] overflow-y-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {TOKENS.map((token) => (
                <div
                  key={token.symbol}
                  className={clsx(
                    "flex items-center gap-[12px] p-[12px] hover:bg-[#F9FAFB] cursor-pointer transition-colors",
                    selectedToken?.symbol === token.symbol && "bg-[#F3F4F6]"
                  )}
                  onClick={() => {
                    selectToken(token);
                    setQuote(null);
                    setSelectedChain(null);
                  }}
                >
                  <div className="relative">
                    <div className="w-[32px] h-[32px] flex items-center justify-center">
                      <img
                        className="w-full h-full object-cover"
                        src={token.icon}
                      />
                    </div>
                    {/* <div className="absolute -bottom-1 -right-1 w-[16px] h-[16px] flex items-center justify-center">
                                            <img className="w-full h-full object-cover" src={chainConfig[token?.blockchain]?.icon} />
                                        </div> */}
                  </div>

                  <div className="flex-1">
                    <div className="text-[16px] font-semibold text-black">
                      {token.symbol}
                    </div>
                    {/* <div className="text-[12px] text-[#6B7280]">{chainConfig[token?.blockchain]?.name}</div> */}
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

      <div className="flex items-center justify-between mt-[10px]">
        <div className="text-[12px] text-[#8A87AA]">Est. Receive</div>
        <div className="text-[14px] text-black font-[600]">
          {quote ? quote.amountOutFormatted : "-"}
        </div>
      </div>

      <div className="mt-[10px] text-[12px] leading-[18px] text-[#8A87AA]">
        The third-party bridge service will be used during the recharge process,
        which requires at least an additional recharge of{" "}
        <span className="font-bold text-black">{defaultValue || "-"}</span>
      </div>

      <div className="mt-[24px]">
        <div className="text-[16px] font-[500] text-center mb-[16px]">
          Select Receiving Network
        </div>
        <div className="flex flex-col gap-[8px] max-h-[400px] overflow-y-auto">
          {usedChains.map((network) => (
            <div
              key={network.name}
              onClick={() => setSelectedChain(network)}
              className={clsx(
                "flex items-center gap-[12px] px-[16px] py-[14px] rounded-[10px] cursor-pointer transition-colors",
                selectedChain?.blockchain === network.blockchain
                  ? "bg-[#F3F4F6]"
                  : "hover:bg-[#F9FAFB]"
              )}
            >
              <div className="w-[32px] h-[32px] flex items-center justify-center">
                <img
                  src={chainConfig[network?.blockchain]?.icon}
                  alt={
                    chainConfig[network?.blockchain]?.name || network.blockchain
                  }
                  className="w-full h-full object-cover rounded-[6px]"
                />
              </div>
              <div className="text-[16px] font-[400] text-black">
                {chainConfig[network?.blockchain]?.name || network.blockchain}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        {quote &&
          quote.amountOut &&
          Number(quote.amountOut) < Number(defaultValue) && (
            <div className="bg-[#FFE5E5] rounded-[12px] px-[16px] py-[12px] text-center pb-[24px] mb-[-10px]">
              <div className="text-[#FF3D2F] text-[12px] font-[400] leading-[120%]">
                You may only receive{" "}
                <span className="font-bold">
                  -{quote ? quote.amountOut : "-"}{" "}
                  {selectedToken?.symbol || "-"}
                </span>
                , which is not enough to create a minimal market.
              </div>
            </div>
          )}

        <button
          disabled={loading || !quote}
          className="w-full bg-black cursor-pointer text-white text-[14px] font-[400] rounded-[12px] py-[14px] transition-colors duration-200 hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            if (quote || loading) {
              onConfirm();
            }
          }}
        >
          {loading ? <Loading size={20} /> : "Confirm"}
        </button>
      </div>
    </div>
  );
}
