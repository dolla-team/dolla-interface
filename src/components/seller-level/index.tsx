import StarIcon from "./star-icon";

export default function SellerLevel() {
  return (
    <div className="relative py-[1px] pl-[22px] pr-[10px] flex items-center rounded-[16px] border border-[#6A5D3A] bg-[#35302B]">
      <span className="text-[12px] text-[#FFE9B2] leading-[12px]">4.2</span>
      <StarIcon className="absolute top-[-2px] left-[0px]" />
    </div>
  );
}
