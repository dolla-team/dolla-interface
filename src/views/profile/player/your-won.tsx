import { useMemo } from "react";
import { formatNumber } from "@/utils/format/number";
import clsx from "clsx";

export default function YourWon({ data }: { data: any[] }) {
  const total = useMemo(() => {
    return data.reduce((acc, item) => acc + item.token_usd, 0);
  }, [data]);
  return (
    // total > 0 && "group"
    <button className={clsx("relative")}>
      <div
        className={clsx(
          "button text-[#57FF70] text-[20px] font-medium",
          false && "border-b border-dashed border-[#5E6B7D]"
        )}
      >
        ~
        {formatNumber(total, 2, true, {
          prefix: "$"
        })}
      </div>
      {total > 0 && (
        <div className="absolute z-[100] top-[30px] left-[-70px] w-[160px] border border-[#484848] bg-[#1A1E24] rounded-[6px] px-[11px] text-[12px] py-[8px] flex flex-col justify-around opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          {data.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-[4px]">
                {item.token_icon && (
                  <img
                    className="w-[20px] h-[20px]"
                    src={item.token_icon}
                    alt="coin"
                  />
                )}
                <span>{formatNumber(item.token_amount, 2, true)}</span>
              </div>
              <div className="flex items-center gap-[2px]">
                <span className="text-white">
                  {formatNumber(item.token_usd, 2, true, {
                    prefix: "$"
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </button>
  );
}
