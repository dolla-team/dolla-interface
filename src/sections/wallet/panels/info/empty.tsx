import EmptyEye from "@/components/dolla-eye/empty";

export default function Empty({
  onDeposit,
  text = "No assets found"
}: {
  onDeposit?: () => void;
  text?: string;
}) {
  return (
    <div className="w-full pt-[60px] flex flex-col items-center">
      <EmptyEye />
      <div className="text-[12px] text-[#8A87AA] mt-[10px]">{text}</div>
      {onDeposit && (
        <button
          className="button text-[12px] text-[#10FFBF] mt-[6px]"
          onClick={onDeposit}
        >
          Deposit now
        </button>
      )}
    </div>
  );
}
