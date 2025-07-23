import AvatarAction from "./avatar-action";
import { Outlet, useNavigate } from "react-router-dom";
import Button from "@/components/button";
import { useAuth } from "@/contexts/auth";
import Points from "@/sections/points";

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
