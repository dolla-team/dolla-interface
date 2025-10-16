import Switch from "@/components/switch";
import { useNavigate } from "react-router-dom";

export default function Tabs({ tab }: { tab: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-end mt-[20px]">
      <Switch
        tab={tab}
        tabs={[
          { label: "Bidder", value: "player" },
          { label: "Seller", value: "seller" }
        ]}
        onChange={(value) => {
          navigate(`/portfolio/${value}`);
        }}
        className="!h-[30px] !border-[1px] !border-[#666666] !rounded-[8px] !p-[1px] bg-[#D9D9D94D]"
        cursorClassName="!rounded-[8px] !shadow-[unset] !bg-[#1A1E24]"
        tabClassName="!px-[15px] !text-white !rounded-[8px] !bg-transparent"
      />
    </div>
  );
}
