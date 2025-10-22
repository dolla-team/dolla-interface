import dayjs from "@/libs/dayjs";
import clsx from "clsx";

export default function Record({ data }: { data: any }) {
  return (
    <div className="px-[20px] py-[10px]">
      <div className="text-[10px] text-[#8A87AA]">
        {dayjs(data.updated_at).format("YYYY/MM/DD")}
      </div>
      <div className="flex items-center justify-between mt-[4px]">
        <div className="flex gap-[8px]">
          {data.type === "withdraw" && <WithdrawIcon />}
          {data.type === "deposit" && <DepositIcon />}
          {data.type === "swap" && <SwapIcon />}
          <div>
            <div className="text-[14px] text-black">{data.business_type}</div>
            <div className="text-[10px] text-[#8A87AA] mt-[2px]">{data.to}</div>
          </div>
        </div>
        <div className="text-right">
          <div
            className={clsx(
              "text-[14px]",
              data.type === "deposit" ? "text-[#27C627]" : "text-black"
            )}
          >
            {data.type === "deposit" ? "+" : "-"}
            {data.amount} {data.tokens[0]?.symbol}
          </div>
          {/* <div className="text-[10px] text-[#8A77AA] mt-[2px]">
            fee 0.005 USDT
          </div> */}
        </div>
      </div>
    </div>
  );
}

const WithdrawIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="14"
    viewBox="0 0 12 14"
    fill="none"
    className="mt-[4px]"
  >
    <path
      d="M6 13V1M6 1L1 6.09091M6 1L11 6.09091"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DepositIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="14"
    viewBox="0 0 12 14"
    fill="none"
    className="mt-[4px]"
  >
    <path
      d="M6 1V13M6 13L1 7.90909M6 13L11 7.90909"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SwapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="15"
    viewBox="0 0 16 15"
    fill="none"
    className="mt-[4px]"
  >
    <path
      d="M1.73682 5.49758C3.60344 -0.443277 12.3144 -0.773633 14.181 6.15753M14.181 6.15753L14.9997 3.94706M14.181 6.15753L12.4208 5.49758"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.2632 9.02806C12.3966 14.9689 3.68564 15.2993 1.81902 8.3681M1.81902 8.3681L1.00032 10.5786M1.81902 8.3681L3.57921 9.02806"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
