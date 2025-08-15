import AvatarAction from "./avatar-action";
import { Outlet, useNavigate } from "react-router-dom";
import Button from "@/components/button";
import { useAuth } from "@/contexts/auth";
import DollaEye from "@/components/dolla-eye";
import EstGas from "@/sections/est-gas";
import Loading from "@/components/loading";
import useIsMobile from "@/hooks/use-is-mobile";
import { useEffect, useState } from "react";

export default function MainLayout() {
  const { userInfo, login, ready, user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!user) {
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [ready, user]);

  return isLoading ? (
    <Loading />
  ) : (
    <div className="h-screen overflow-hidden bg-black relative">
      {/* header */}
      <>
        <div className="absolute left-[20px] top-[15px] z-[20] flex items-center gap-[30px]">
          <DollaEye
            className="button origin-left"
            height={32}
            onClick={() => {
              navigate("/");
            }}
          />
        </div>

        <div className="absolute right-[10px] top-[10px] z-[20] flex items-center gap-[36px]">
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
          {!isMobile && <EstGas />}
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
      </>
      <Outlet />
    </div>
  );
}
