import clsx from "clsx";

export default function AmountInput({
  amount,
  onChange,
  max
}: {
  amount: number;
  onChange: (value: number) => void;
  max: number;
}) {
  return (
    <div className="w-full rounded-[10px] bg-[#00000033] flex items-center justify-between p-[10px] mt-[6px]">
      <button
        className={clsx(
          "w-[24px] h-[24px] rounded-full border border-[#6A5D3A] bg-[#00000033] flex justify-center items-center shrink-0",
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
          width="10"
          height="2"
          viewBox="0 0 10 2"
          fill="none"
        >
          <path
            d="M9.59961 1.54492H0V0.0449219H9.59961V1.54492Z"
            fill="white"
          />
        </svg>
      </button>
      <input
        className="w-[calc(100%-78px)] text-center text-white text-[14px] font-[DelaGothicOne] shrink-1"
        value={amount}
        onChange={(e) => {
          if (!isNaN(Number(e.target.value))) {
            onChange(Number(e.target.value));
          }
        }}
      />
      <button
        className={clsx(
          "w-[24px] h-[24px] rounded-full border border-[#6A5D3A] bg-[#00000033] flex justify-center items-center shrink-0",
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
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <path
            d="M5.54492 4.04492H9.59961V5.54492H5.54492V9.59961H4.04492V5.54492H0V4.04492H4.04492V0H5.54492V4.04492Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  );
}
