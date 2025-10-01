import Tabs from "@/components/tabs";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useIsBtc from "@/hooks/use-is-btc";
import clsx from "clsx";

export default function PageTabs() {
  const isBtc = useIsBtc();
  const [tab, setTab] = useState(isBtc ? 0 : 1);
  const navigate = useNavigate();
  const pathname = useLocation();

  useEffect(() => {
    if (!pathname?.pathname) return;
    if (pathname.pathname.includes("portfolio")) {
      setTab(1);
    } else if (pathname.pathname.includes("create")) {
      setTab(2);
    } else if (pathname.pathname === "/") {
      setTab(0);
    }
  }, [pathname?.pathname]);

  return (
    <Tabs
      tabs={[
        { label: "Explore", key: 0 },
        { label: "Profile", key: 1 },
        { label: "Create", key: 2 }
      ]}
      currentTab={tab}
      onChangeTab={(tab: any) => {
        setTab(tab);
        navigate(
          tab === 0 ? "/" : tab === 1 ? "/portfolio/player" : "/btc/create"
        );
      }}
      className="absolute left-[50%] translate-x-[-50%] w-[336px] h-[40px] p-[2px] !gap-0 border border-[#E4E4E4] bg-[#F2F2F299] rounded-[12px] backdrop-blur-[25px]"
      tabClassName={clsx(
        "text-[14px] w-1/2 text-center h-[34px] leading-[34px] text-[#2B3337]"
      )}
      activeClassName="!text-white"
      cursorClassName={clsx(
        "h-[34px] rounded-[12px] w-full !bottom-[0px]",
        isBtc ? "!bg-[#000]" : "!bg-[#6F37FF]"
      )}
    />
  );
}
