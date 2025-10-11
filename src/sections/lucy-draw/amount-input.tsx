import clsx from "clsx";

export default function AmountInput({
  amount,
  onChange,
  max,
  className
}: {
  amount: number;
  onChange: (value: number) => void;
  max: number;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "w-full h- rounded-[10px] border border-[#E4E4E4] flex items-center justify-between p-[10px] mt-[6px]",
        className
      )}
    >
      <button
        className={clsx(
          "w-[26px] h-[26px] rounded-full bg-black/5 flex justify-center items-center shrink-0",
          amount === 1 ? "opacity-50" : "button"
        )}
        onClick={() => {
          if (amount > 1) {
            onChange(amount - 1);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="2"
          viewBox="0 0 14 2"
          fill="none"
        >
          <path
            d="M13.8359 1.51477H0.737305V0.0147705H13.8359V1.51477Z"
            fill="black"
          />
        </svg>
      </button>
      <input
        className="w-[calc(100%-78px)] text-center text-[14px] font-[DelaGothicOne] shrink-1"
        value={amount}
        onChange={(e) => {
          if (!isNaN(Number(e.target.value))) {
            onChange(Number(e.target.value));
          }
        }}
      />
      <button
        className={clsx(
          "w-[26px] h-[26px] rounded-full bg-black/5 flex justify-center items-center shrink-0",
          amount === Number(max) ? "opacity-50" : "button"
        )}
        onClick={() => {
          if (amount < Number(max)) {
            onChange(amount + 1);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M7.29297 5.79199H13.0986V7.29199H7.29297V13.0986H5.79297V7.29199H0V5.79199H5.79297V0H7.29297V5.79199Z"
            fill="black"
          />
        </svg>
      </button>
    </div>
  );
}
