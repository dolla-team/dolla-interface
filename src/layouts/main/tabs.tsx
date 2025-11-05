import Tabs from "@/components/tabs";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "@/libs/router";
import useIsBtc from "@/hooks/use-is-btc";
import clsx from "clsx";
import { useAuth } from "@/contexts/auth";

export default function PageTabs() {
  const { userInfo, login } = useAuth();
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
        if (!userInfo?.user) {
          login();
          return;
        }
        setTab(tab);
        navigate(
          tab === 0 ? "/" : tab === 1 ? "/portfolio/player" : "/btc/create"
        );
      }}
      className="absolute left-[50%] translate-x-[-50%] w-[336px] h-[40px] p-[2px] !gap-0 rounded-[12px] backdrop-blur-[25px]"
      tabClassName={clsx(
        "text-[14px] w-1/3 text-center h-[34px] leading-[34px] text-[#2B3337]"
      )}
      activeClassName="font-[600]"
      cursorClassName={clsx(
        "!h-[4px] !w-[32px] rounded-[10px] !left-[50%] translate-x-[-50%] !bottom-[-2px] !bg-[#000]"
      )}
    />
  );
}
