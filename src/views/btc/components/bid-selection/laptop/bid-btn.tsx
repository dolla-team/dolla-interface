import clsx from "clsx";
import DollaEye from "@/components/dolla-eye";
import BtnBg, { BtnBidBg } from "./btn-bg";

export default function BidBtn({
  disabled,
  flipStatus,
  onClick
}: {
  disabled: boolean;
  flipStatus: number;
  onClick: () => void;
}) {
  return (
    <div className="w-[197px] h-[235px] relative mx-[100px] top-[-56px]">
      <BtnBg />
      <button
        className={clsx(
          "absolute bottom-[-8px] left-0 w-[197px] h-[138px]",
          disabled && flipStatus !== 4 ? "opacity-50" : "button"
        )}
        onClick={onClick}
      >
        <div
          className={clsx(
            "relative z-[2] font-bold uppercase mt-[10px]",
            flipStatus === 4 ? "text-[36px]" : "text-[42px]"
          )}
        >
          {flipStatus === 4 ? "AUTO" : "BID"}
        </div>
        {/* {disabled && flipStatus !== 4 ? (
          <DollaEye
            className="w-[50px] h-[50px] absolute left-[76px] bottom-[40px]"
            onlyEye
          />
        ) : (
          <div
            className={clsx(
              "relative z-[2] font-bold uppercase mt-[10px]",
              flipStatus === 4 ? "text-[36px]" : "text-[42px]"
            )}
          >
            {flipStatus === 4 ? "AUTO" : "BID"}
          </div>
        )} */}
        <BtnBidBg className="absolute bottom-0 left-0" />
      </button>
    </div>
  );
}
