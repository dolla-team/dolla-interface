import Item from "../redeem-selection/item";
import AmountInput from "@/sections/lucy-draw/amount-input";
import { useMemo, useState } from "react";
import { addThousandSeparator } from "@/utils/format/number";
import PointIcon from "@/components/icons/point-icon";
import clsx from "clsx";
import useRedeem from "../use-redeem";
import Loading from "@/components/icons/loading";
import useIsMobile from "@/hooks/use-is-mobile";
import Big from "big.js";

export default function Redeem({
  data,
  points,
  onSuccess
}: {
  data: any;
  points: number;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState(1);
  const isMobile = useIsMobile();
  const { redeem, loading } = useRedeem({
    token: data,
    onSuccess: () => {
      onSuccess();
    }
  });
  const max = useMemo(() => {
    if (!data?.number) return 0;
    return Math.floor(points / data.number);
  }, [points, data]);

  return (
    <div className="px-[20px] py-[40px] flex gap-[40px]">
      {!isMobile && <Item data={data} className="w-[246px] h-[308px]" />}
      <div className={!isMobile ? "grow" : "w-full"}>
        <div className="flex items-center justify-between text-[14px] mb-[4px]">
          <span>Amount</span>
          <span
            className="underline button text-[12px]"
            onClick={() => {
              setAmount(max);
            }}
          >
            Max
          </span>
        </div>
        <AmountInput
          amount={amount}
          onChange={(value) => {
            setAmount(value);
          }}
          max={max}
          className="h-[64px] mt-[20px]"
        />
        <div className="flex items-center justify-between mt-[30px]">
          <span className="text-[12px] text-[#8A87AA]">Subtotal</span>
          <div className="flex items-center gap-[8px]">
            <span className="text-black text-[14px] font-[600]">
              {data?.number
                ? addThousandSeparator((amount * data.number).toString())
                : 0}
            </span>
            <PointIcon />
          </div>
        </div>
        <div className="flex items-center justify-between mt-[30px]">
          <span className="text-[12px] text-[#8A87AA]">Redeem</span>
          <div className="flex items-center gap-[8px]">
            <span className="text-black text-[14px] font-[600]">
              {Big(amount || 0)
                .mul(data?.token_volume || 0)
                .toString()}
            </span>
            {data?.icon ? (
              <img className="w-[26px] h-[26px]" src={data.icon} />
            ) : (
              <span>{data?.name}</span>
            )}
          </div>
        </div>
        <button
          className={clsx(
            "w-full h-[54px] bg-linear-to-b from-[#FFF698] to-[#FFC42F] rounded-[8px] text-black text-[14px] mx-auto mt-[30px] flex items-center justify-center gap-[8px]",
            loading ? "opacity-50" : "button"
          )}
          onClick={() => {
            redeem(amount);
          }}
          disabled={amount > max}
        >
          {loading ? (
            <Loading />
          ) : amount > max ? (
            "Insufficient points"
          ) : (
            "Redeem"
          )}
        </button>
      </div>
    </div>
  );
}
