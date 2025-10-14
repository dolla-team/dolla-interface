import clsx from "clsx";

export default function WildTime() {
  return (
    <div className="flex items-center gap-[8px]">
      <span className="text-[#FFEF43] text-[16px] font-[600]">Wild Time</span>
      <img src="/new-btc/wild.gif" className="w-[28px] h-[28px]" />
      <div className="flex p-[2px] border border-[#3C3420] rounded-[4px] gap-[4px]">
        <Item active />
        <Item />
        <Item />
        <Item />
        <Item />
      </div>
    </div>
  );
}

const Item = ({ active }: { active?: boolean }) => {
  return (
    <div
      className={clsx(
        "h-[20px] w-[30px] rounded-[4px]",
        active ? "bg-[#FFEA00]" : "bg-[#3C3420]"
      )}
    />
  );
};
