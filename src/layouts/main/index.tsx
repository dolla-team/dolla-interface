import AvatarAction from "./avatar-action";
import { Outlet, useNavigate } from "react-router-dom";
import Button from "@/components/button";
import { useAuth } from "@/contexts/auth";
import DollaEye from "@/components/dolla-eye";

export default function MainLayout() {
  const { userInfo, login } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="h-screen overflow-hidden bg-black relative">
      {/* header */}
      <>
        <DollaEye
          className="absolute left-[20px] top-[15px] z-[20] button origin-left"
          height={32}
          onClick={() => {
            navigate("/");
          }}
        />
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
