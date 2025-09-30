import AvatarAction from "./avatar-action";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Button from "@/components/button";
import { useAuth } from "@/contexts/auth";
import DollaEye from "@/components/dolla-eye";
import EstGas from "@/sections/est-gas";
// import useIsMobile from "@/hooks/use-is-mobile";
import Wallet from "@/sections/wallet";
import Infos from "@/sections/infos";
import UserInfo from "@/sections/user-info";
import useWalletStore from "@/stores/use-wallet";
import { useEffect, useRef } from "react";

export default function MainLayout() {
  const { userInfo, login } = useAuth() || {};
  // const isMobile = useIsMobile();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const walletStore = useWalletStore();
  const pathname = useLocation();
  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
    if (pathname.pathname.includes("/portfolio")) {
      walletStore.set({ showUserInfo: false });
    }
  }, [pathname]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-white relative">
      {/* header */}
      <div className="flex justify-between items-center h-[76px] sticky top-0 bg-white z-[20]">
        <div className="flex items-center gap-[30px] pl-[30px]">
          <DollaEye
            className="button origin-left"
            height={32}
            onClick={() => {
              navigate("/");
            }}
          />
          {/* {!isMobile && <EstGas />} */}
        </div>

        <div className="flex items-center gap-[12px] pr-[12px]">
          {/* <div className="flex items-center gap-[8px]">
            <TicketIcon />
            <span
              className="text-[#FFEF43] text-[20px] font-bold font-[AlfaSlabOne]"
              style={{
                WebkitTextStrokeWidth: "1px",
                WebkitTextStrokeColor: "#5E3737"
              }}
            >
              x35
            </span>
          </div> */}
          <EstGas />

          {!userInfo ? (
            <Button onClick={login} className="w-[100px] h-[36px]">
              Connect
            </Button>
          ) : (
            <>
              <AvatarAction />
              {/* <Menu
            onClick={() => {
              logout();
            }}
          /> */}
            </>
          )}
        </div>
        {/* <PageTabs /> */}
      </div>
      <Infos />
      <div className="flex h-full">
        <div
          className="h-[calc(100vh-76px)] overflow-y-auto relative z-[2] bg-[#F0F0F0]"
          style={{
            width: walletStore.showUserInfo ? window.innerWidth - 294 : "100%"
          }}
          ref={contentRef}
        >
          <Outlet />
        </div>
        <UserInfo />
      </div>
      <Wallet />
    </div>
  );
}
