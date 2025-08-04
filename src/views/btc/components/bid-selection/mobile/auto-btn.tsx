import clsx from "clsx";
import { useBtcContext } from "../../../context";

export default function AutoBtn() {
  const { setFlipStatus } = useBtcContext();

  return (
    <button
      className={clsx(
        "h-[46px] button w-full rounded-[12px] bg-linear-to-b from-[#40FF00] to-[#269900]",
        "text-[20px] text-[#3E2B2B] font-[DelaGothicOne]"
      )}
      onClick={() => {
        setFlipStatus(5);
      }}
    >
      AUTO FLIP
    </button>
  );
}
