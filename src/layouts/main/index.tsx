import AvatarAction from "./avatar-action";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import Points from "@/sections/points";
import NearWalletButton from "@/components/button/near-wallet-button";

export default function MainLayout() {
  const { userInfo, login } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="h-screen overflow-hidden bg-black relative">
      {/* header */}
      <>
        <img
          src="/logo.svg"
          alt="dolla"
          className="w-[78px] h-[39px] absolute left-[10px] top-[4px] z-[20] button"
          onClick={() => {
            navigate("/");
          }}
        />
        <div className="absolute right-[10px] top-[10px] z-[20] flex items-center gap-[36px]">
          <Points />
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