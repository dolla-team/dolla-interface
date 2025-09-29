import Loading from "@/components/icons/loading";
import useToast from "@/hooks/use-toast";
import LazyImage from "@/components/layz-image";
import clsx from "clsx";
import { balanceFormated } from "../../utils/balance";

const checkIcon = (
  <svg
    width="16"
    height="12"
    viewBox="0 0 16 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 5L6 10L15 1"
      stroke="currentColor"
      stroke-width="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function CurrencyRow({
  currency,
  selectedTokenAddress,
  onClick,
  balance,
  loading,
  showBalance,
  customBalanceFormatter
}: any) {
  const isActive = currency.address === selectedTokenAddress;

  const toast = useToast();

  const handleCopyAddress = (currency: any) => {
    window?.navigator?.clipboard?.writeText?.(currency.address as string);
    toast.success({
      title: `Copied ${currency.symbol} address ${currency.address}`
    });
  };

  return (
    <div
      className={clsx(
        "p-[10px] flex justify-between items-center rounded-[10px] cursor-pointer hover:bg-[rgba(151,154,190,0.1)] transition-colors",
        isActive &&
          "bg-[var(--dex-hover-bg-color)] pointer-events-none opacity-80"
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        {!currency.icon && currency.underlyingTokens ? (
          <div className="flex items-center mr-[8px]">
            {currency.underlyingTokens.map((_curreny: any, _index: number) => (
              <LazyImage
                key={_index}
                width={26}
                height={26}
                src={_curreny.icon}
                fallbackSrc="/assets/tokens/default_icon.png"
                containerClassName={clsx(
                  "rounded-full shrink-0 overflow-hidden",
                  _index > 0 && "ml-[-15px]"
                )}
              />
            ))}
          </div>
        ) : currency.icon ? (
          <LazyImage
            width={26}
            height={26}
            src={currency.icon}
            fallbackSrc="/assets/tokens/default_icon.png"
            containerClassName="rounded-full shrink-0 mr-[8px] overflow-hidden"
          />
        ) : null}

        <div>
          <div className="text-base font-semibold text-[14px]">
            {currency.symbol}
          </div>
          <div className="text-[10px] flex items-center gap-[12px]">
            <div className="">{currency.name}</div>
            {currency.address !== "native" && (
              <div className="text-[#3D405A] flex items-center gap-[10px] pointer-events-auto opacity-100">
                <div className="">
                  {currency.address
                    ? `${currency.address.slice(
                        0,
                        6
                      )}...${currency.address.slice(-4)}`
                    : ""}
                </div>
                <button
                  type="button"
                  className="w-[14px] h-[14px] bg-[url('/images/icon-copy.svg')] bg-no-repeat bg-center bg-contain"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyAddress(currency);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {showBalance && (
        <div className="text-base font-normal flex items-center gap-1">
          {loading ? (
            <Loading />
          ) : (
            <>
              {typeof customBalanceFormatter === "function"
                ? customBalanceFormatter(currency, balance)
                : balanceFormated(balance)}
              {isActive ? checkIcon : <div style={{ width: 16 }} />}
            </>
          )}
        </div>
      )}
    </div>
  );
}
