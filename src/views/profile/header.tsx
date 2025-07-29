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
        className="!h-[38px] !border-[1px] !border-[#6A5D3A] !rounded-[19px] !bg-[#35302B] !p-[4px]"
        cursorClassName="!rounded-[15px] !shadow-[unset] !bg-[radial-gradient(50%_50%_at_50%_50%,_#FFEF43_0%,_#FFC42F_100%)]"
        tabClassName="!px-[15px]"
      />
      <span className="text-white text-[20px] font-[400] leading-[100%] font-[DelaGothicOne]">
        Portfolio
      </span>
    </div>
  );
}
