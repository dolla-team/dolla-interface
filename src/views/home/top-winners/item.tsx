import Avatar from "@/components/avatar";
import ItemLevel from "./item-level";
export default function TopWinnersItem() {
  return (
    <div className="w-full h-[48px] mt-[5px] px-[10px] relative flex items-center justify-between rounded-[10px] border border-[#F2F2F233] bg-linear-to-r from-[#D565C4]/10 to-[#8C8C8C]/10">
      <ItemLevel
        level={1}
        className="absolute top-[-10px] left-[-10px] z-[2]"
      />
      <div className="flex items-center gap-[10px]">
        <div className="w-[40px] h-[40px] p-[2px] rounded-full bg-linear-to-b from-[#FFE093] via-[#FFECBC] to-[#DEAF37]">
          <Avatar address="0x1234567890" size={36} className="rounded-full" />
        </div>
        <div>
          <div className="text-[10px] text-black/30">Winner</div>
          <div className="text-[12px] text-black font-semibold">0xdolla</div>
        </div>
      </div>
      <div>
        <div className="text-[10px] text-black/30">Return</div>
        <div className="text-[12px] text-black text-right font-semibold">
          800x
        </div>
      </div>
    </div>
  );
}
