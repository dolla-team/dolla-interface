"use client";
import { useMemo, useEffect, useState } from "react";
import Range from "@/components/range";
import { motion } from "framer-motion";
import Big from "big.js";
import LazyImage from "@/components/layz-image";
import clsx from "clsx";
import { useAuth } from "@/contexts/auth";
import { balanceFormated } from "../utils/balance";
import { formatNumber } from "@/utils/format/number";

export default function TokenAmount({
  className,
  type,
  amount,
  currency,
  prices,
  outputCurrencyReadonly,
  onCurrencySelectOpen,
  onAmountChange,
  onUpdateCurrencyBalance,
  isPrice = true,
  balanceLabel = "Bal.",
  balancePercentClassName,
  balanceContainerClassName,
  inputDisabled,
  isRange = true,
  currencyClassName
}: any) {
  const { nearAccount } = useAuth();
  const [tokenPrice, tokenBalance] = useMemo(
    () =>
      currency
        ? [
            currency && prices ? prices[currency.address] : 0,
            currency?.isBaseToken
              ? nearAccount?.prizeBalance
              : nearAccount?.onlyQuoteBalance
          ]
        : [0, "0"],
    [prices, currency, nearAccount]
  );

  const [percent, setPercent] = useState<any>(0);
  const handleRangeChange = (e: any, isAmountChange = true) => {
    const formatedBalance = balanceFormated(tokenBalance);
    if (["-", "Loading", "0"].includes(formatedBalance)) return;
    const _percent = e.target.value || 0;
    setPercent(_percent);
    isAmountChange &&
      onAmountChange?.(
        Big(tokenBalance || "0")
          .times(Big(_percent).div(100))
          .toFixed(currency?.decimals)
          .replace(/[.]?0+$/, "")
      );
  };
  const setRange = (val: string) => {
    if (type !== "in") return;
    const formatedBalance = balanceFormated(tokenBalance);
    if (["-", "Loading", "0"].includes(formatedBalance)) return;
    let percent: any = Big(val || 0)
      .div(formatedBalance)
      .times(100)
      .toFixed(2);
    percent = Math.min(Math.max(+percent, 0), 100);
    handleRangeChange?.({ target: { value: percent } }, false);
  };
  useEffect(() => {
    if (tokenBalance && onUpdateCurrencyBalance)
      onUpdateCurrencyBalance(tokenBalance);
  }, [tokenBalance]);

  useEffect(() => {
    if (!amount) {
      setPercent(0);
    }
  }, [amount]);

  useEffect(() => {
    setPercent(0);
    onAmountChange?.("");
  }, [currency]);

  return (
    <div
      className={clsx(
        "border border-[#8A87AA4D] rounded-[10px] px-[6px] py-[10px] leading-[100%] bg-white",
        className
      )}
    >
      <div className="flex items-center justify-between text-[#8A87AA]">
        <div className="text-[14px] font-[400]">
          {type === "in" ? "From" : "To"}
        </div>
        <div className="text-[12px]">
          {balanceLabel}{" "}
          <span
            className="underline button"
            onClick={() => {
              const formatedBalance = balanceFormated(tokenBalance);
              if (["-", "Loading", "0"].includes(formatedBalance)) return;
              onAmountChange?.(tokenBalance);
              setRange(tokenBalance || "0");
            }}
          >
            {formatNumber(tokenBalance, currency?.decimals === 6 ? 2 : 6, true)}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-[10px] mt-[10px]">
        <div className="flex-1">
          <input
            className="w-[100%] h-[100%] text-[22px]"
            value={amount}
            onChange={(ev) => {
              if (isNaN(Number(ev.target.value))) return;
              const val = ev.target.value.replace(/\s+/g, "");
              onAmountChange?.(val);
              setRange(val);
            }}
            placeholder="0"
            disabled={inputDisabled}
          />
        </div>
        <div
          className={`${
            outputCurrencyReadonly ? "" : "border"
          } flex items-center justify-between border-[#8A87AA4D] rounded-[10px] w-[124px] h-[42px] px-[7px] cursor-pointer ${
            currencyClassName ?? ""
          }`}
          onClick={() => {
            onCurrencySelectOpen?.();
          }}
        >
          {currency ? (
            <div className="flex items-center gap-[10px] md:gap-[5px] flex-1">
              <div className="relative shrink-0">
                {!currency.icon && currency.underlyingTokens ? (
                  <div className="flex items-center">
                    {currency.underlyingTokens.map(
                      (_currency: any, _index: number) => (
                        <LazyImage
                          key={_index}
                          src={_currency.icon}
                          fallbackSrc="/assets/tokens/default_icon.png"
                          containerClassName={clsx(
                            "!w-[26px] !h-[26px] shrink-0 rounded-full overflow-hidden",
                            _index > 0 && "ml-[-15px]"
                          )}
                        />
                      )
                    )}
                  </div>
                ) : (
                  <LazyImage
                    src={currency.icon}
                    fallbackSrc="/assets/tokens/default_icon.png"
                    containerClassName="!w-[26px] !h-[26px] shrink-0 rounded-full overflow-hidden"
                  />
                )}
              </div>
              <div className="text-[14px] flex-1 w-0 truncate">
                {currency?.symbol}
              </div>
            </div>
          ) : (
            <div className="text-[12px]">Select a token</div>
          )}
          {!outputCurrencyReadonly && (
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path
                d="M1 1L6 5L11 1"
                stroke="#8A87AA"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      </div>

      {isPrice && (
        <div className="text-[12px] text-[#8A87AA]">
          $
          {amount && tokenPrice
            ? balanceFormated(Big(amount).mul(tokenPrice).toString())
            : "-"}
        </div>
      )}

      {/* {type === "in" && (
        <div className="flex justify-between md:flex-col md:items-stretch md:justify-start items-center gap-[22px] mt-[10px]">
          <div className="flex items-center gap-[8px]">
            {BalancePercentList.map((p) => (
              <motion.div
                key={p.value}
                className={clsx(
                  "cursor-pointer h-[22px] rounded-[6px] border border-[#8A87AA] text-[12px] font-[400] px-[8px] flex justify-center items-center",
                  typeof balancePercentClassName === "function"
                    ? balancePercentClassName?.({
                        selected: percent == p.value
                      })
                    : balancePercentClassName
                )}
                animate={
                  percent == p.value
                    ? { color: "#743EFF", borderColor: "#743EFF" }
                    : { color: "#8A87AA", borderColor: "#8A87AA" }
                }
                onClick={() => handleRangeChange({ target: p })}
              >
                {p.label}
              </motion.div>
            ))}
          </div>
          {isRange && (
            <Range
              style={{ marginTop: 0, flex: 1 }}
              value={percent}
              onChange={handleRangeChange}
            />
          )}
        </div>
      )} */}
    </div>
  );
}

const BalancePercentList = [
  { value: 25, label: "25%" },
  { value: 50, label: "50%" },
  { value: 75, label: "75%" },
  { value: 100, label: "Max" }
];
