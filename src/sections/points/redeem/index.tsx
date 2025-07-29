import Modal from "@/components/modal";
import Item from "../redeem-selection/item";
import AmountInput from "@/sections/lucy-draw/amount-input";
import { useMemo, useState } from "react";
import { addThousandSeparator } from "@/utils/format/number";
import PointIcon from "@/components/icons/point-icon";
import clsx from "clsx";
import useRedeem from "../use-redeem";
import Loading from "@/components/icons/loading";
import useIsMobile from "@/hooks/use-is-mobile";

export default function Redeem({
  data,
  showRedeem,
  points,
  onClose,
  onSuccess
}: {
  data: any;
  showRedeem: boolean;
  points: number;
  onClose: () => void;
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
    <Modal open={showRedeem} onClose={onClose}>
      <div
        className={clsx(
          "rounded-[16px] border border-[#6A5D3A] bg-[#35302B]",
          isMobile ? "w-full" : "w-[618px]"
        )}
      >
        <div className="h-[54px] bg-[#00000033] rounded-t-[16px] flex items-center justify-between px-[16px]">
          <div className="text-[20px] text-white">Points Redemption</div>
          <button className="w-[24px] h-[24px] button" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="12"
              viewBox="0 0 10 12"
              fill="none"
            >
              <path
                d="M5 4.57422L8 0.592773H10L6 5.90137L10 11.21H8L5 7.22852L2 11.21H0L4 5.90137L0 0.592773H2L5 4.57422Z"
                fill="#BBACA6"
              />
            </svg>
          </button>
        </div>
        <div className="p-[20px] flex gap-[40px]">
          {!isMobile && <Item data={data} className="w-[180px]" />}
          <div className={!isMobile ? "grow" : "w-full"}>
            <div className="flex items-center justify-between text-[14px] text-[#BBACA6]">
              <span>Amount</span>
              <span
                className="underline button"
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
            />
            <div className="flex items-center justify-between mt-[10px]">
              <span className="text-[14px] text-[#BBACA6]">Subtotal</span>
              <div className="flex items-center gap-[8px]">
                <PointIcon />
                <span
                  className="text-[#FFEF43] text-[20px] font-bold font-[AlfaSlabOne]"
                  style={{
                    WebkitTextStrokeWidth: "1px",
                    WebkitTextStrokeColor: "#5E3737"
                  }}
                >
                  x
                  {data?.number
                    ? addThousandSeparator((amount * data.number).toString())
                    : 0}
                </span>
              </div>
            </div>
            <button
              className={clsx(
                "w-full h-[40px] bg-linear-to-b from-[#FFF698] to-[#FFC42F] rounded-[8px] text-black text-[20px] mx-auto mt-[70px] flex items-center justify-center gap-[8px]",
                loading ? "opacity-50" : "button"
              )}
              onClick={() => {
                redeem(amount);
              }}
            >
              {loading ? <Loading /> : "Redeem"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
