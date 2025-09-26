import { useMemo, useState } from "react";
import Modal from "@/components/modal";
import CurrencyRow from "./currency-row";
import Big from "big.js";
import clsx from "clsx";
import { useAuth } from "@/contexts/auth";

export default function CurrencySelect({
  display,
  tokens,
  account,
  onClose,
  onSelect,
  selectedTokenAddress,
  showBalance = true,
  isSortByBalance = true,
  sortCustom,
  customBalanceFormatter,
  className,
  titleClassName
}: any) {
  const { nearAccount } = useAuth();

  const handleClose = () => {
    onClose();
  };

  const balances = useMemo(() => {
    return tokens.reduce((acc: any, token: any) => {
      acc[token.address] = token.isBaseToken
        ? nearAccount?.prizeBalance
        : nearAccount?.balance;
      return acc;
    }, {});
  }, [tokens, nearAccount]);

  return (
    <Modal open={display} onClose={handleClose}>
      <div
        className={clsx(
          "w-[380px]  p-[20px] bg-[#1A1E24] text-white border border-[#383F47] rounded-[12px] max-w-[100vw] md:rounded-t-[12px]",
          className
        )}
      >
        <div
          className={clsx(
            "flex items-center gap-[10px] cursor-pointer text-[16px]",
            titleClassName
          )}
        >
          <button
            type="button"
            className="w-[16px] h-[16px] rotate-90 bg-[url('/images/icon-arrow.svg')] bg-no-repeat bg-center"
            onClick={handleClose}
          />
          <div>Select Token</div>
        </div>

        <div className="h-[calc(60vh-120px)] overflow-y-auto overflow-x-hidden">
          {tokens
            ?.slice()
            ?.sort((a: any, b: any) => {
              if (isSortByBalance) {
                if (typeof sortCustom === "function") {
                  return sortCustom(a, b, balances);
                }

                const balanceA = balances[a.address] || "0";
                const balanceB = balances[b.address] || "0";

                return Big(balanceA || 0)?.gt(balanceB || 0) ? -1 : 1;
              }
              return 0;
            })
            ?.map((currency: any) => (
              <CurrencyRow
                key={currency.address}
                selectedTokenAddress={selectedTokenAddress}
                currency={currency}
                display={display}
                account={account}
                onClick={() => {
                  onSelect?.(currency);
                  handleClose();
                }}
                balance={balances[currency.address] || currency.balance}
                showBalance={showBalance}
                customBalanceFormatter={customBalanceFormatter}
              />
            ))}
        </div>
      </div>
    </Modal>
  );
}
