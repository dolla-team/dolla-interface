import FundList from "@/sections/cashier/panels/fund-list";

export default function Deposit({ onBack }: { onBack: () => void }) {
  return (
    <div className="px-[20px] pt-[30px]">
      <FundList onBack={onBack} />
    </div>
  );
}
