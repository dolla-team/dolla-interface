import AvatarAction from "./avatar-action";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import DollaEye from "@/components/dolla-eye";
import EstGas from "@/sections/est-gas";
import Loading from "@/components/loading";
import NearWalletButton from "@/components/button/near-wallet-button";
import useIsMobile from "@/hooks/use-is-mobile";
import { useEffect, useState } from "react";

export default function MainLayout() {
  const { userInfo } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userInfo) return;
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [userInfo]);

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
          {!isMobile && <EstGas />}
        </div>

        <div className="absolute right-[10px] top-[10px] z-[20] flex items-center gap-[36px]">
          {!userInfo ? (
            <NearWalletButton />
          ) : (
            <>
              <AvatarAction />
            </>
          )}
        </div>
      </>
      <Outlet />
    </div>
  );
}
