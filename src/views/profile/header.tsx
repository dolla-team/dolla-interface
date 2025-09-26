import Switch from "@/components/switch";
import { useNavigate } from "react-router-dom";

export default function Header({ tab }: any) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center gap-[16px] max-md:flex-col-reverse max-md:gap-[20px]">
      <Switch
        tab={tab}
        tabs={[
          { label: "Player", value: "player" },
          { label: "Seller", value: "seller" }
        ]}
        onChange={(value) => {
          navigate(`/portfolio/${value}`);
        }}
        className="!h-[38px] !border-[1px] !border-[#383F47] !rounded-[19px] !p-[4px]"
        cursorClassName="!rounded-[15px] !shadow-[unset]"
        tabClassName="!px-[15px]"
      />
      <span className="text-[20px] font-[400] leading-[100%] font-[DelaGothicOne] text-white">
        Portfolio
      </span>
    </div>
  );
}
