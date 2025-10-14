import Modal from "@/components/modal";
import clsx from "clsx";
import Tokens from "@/sections/wallet/panels/info/tokens";

export default function CurrencySelect({
  display,
  onClose,
  onSelect,
  className,
  titleClassName
}: any) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={display} onClose={handleClose}>
      <div
        className={clsx(
          "w-[380px] border border-[#E4E4E4] rounded-[12px] max-w-[100vw] md:rounded-t-[12px]",
          className
        )}
      >
        <div
          className={clsx(
            "flex justify-between items-center gap-[10px] cursor-pointer text-[16px] bg-black rounded-t-[10px] p-[20px] text-white",
            titleClassName
          )}
        >
          <div>Select Token</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="12"
            viewBox="0 0 10 12"
            fill="none"
            onClick={handleClose}
            className="button"
          >
            <path
              d="M5 4.57422L8 0.592773H10L6 5.90137L10 11.21H8L5 7.22852L2 11.21H0L4 5.90137L0 0.592773H2L5 4.57422Z"
              fill="#BBACA6"
            />
          </svg>
        </div>
        <div className="bg-white rounded-b-[10px] p-[10px] h-[calc(60vh-120px)]">
          <Tokens onClick={onSelect} />
        </div>

        {/* <div className="h-[calc(60vh-120px)] overflow-y-auto overflow-x-hidden p-[10px] bg-white rounded-b-[10px]">
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
        </div> */}
      </div>
    </Modal>
  );
}
