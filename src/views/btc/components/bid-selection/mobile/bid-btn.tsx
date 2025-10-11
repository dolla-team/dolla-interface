import clsx from "clsx";

export default function BidBtn({
  disabled,
  onClick
}: {
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={clsx(
        "h-[46px]  w-full rounded-[12px] bg-linear-to-b from-[#FFF698] to-[#FFC42F]",
        disabled ? "opacity-30" : "button",
        "text-[20px] text-[#3E2B2B] font-[DelaGothicOne]"
      )}
      onClick={onClick}
    >
      BID
    </button>
  );
}
