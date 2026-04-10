import AvatarAction from "./avatar-action";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "@/libs/router";
import Button from "@/components/button";
import { useAuth } from '@/contexts/wallet'
import DollaEye from "@/components/dolla-eye";
import EstGas from "@/sections/est-gas";
// import useIsMobile from "@/hooks/use-is-mobile";
import Wallet from "@/sections/wallet";
import Infos from "@/sections/infos";
import UserInfo from "@/sections/user-info";
import { useEffect, useRef } from "react";
import PageTabs from "./tabs";
import Alerts from "@/sections/alerts";
import { useGlobalStore } from "@/stores/use-global";
import useTaskCurrent from "@/hooks/task/use-task-current";
import useTaskStore from "@/stores/use-task";
import useBindSocial from "@/hooks/task/use-bind-social";
import ProfileSetting from "@/views/profile/components/profile-setting";
import useUserInfoStore from "@/stores/use-user-info";
import useRegisterCode from "@/hooks/user/use-register-code";
import LucyDrawHistory from "@/sections/lucy-draw/history";
import HowItWork from "@/sections/how-it-work";
import XKolModal from "@/sections/x-kol";

export default function MainLayout() {
  const { userInfo, login } = useAuth() || {};
  const taskStore = useTaskStore();
  // const isMobile = useIsMobile();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const globalStore = useGlobalStore();
  const pathname = useLocation();
  const userInfoStore = useUserInfoStore();
  const prevUserInfoStatus = useRef(false);
  const { fetchTasks } = useTaskCurrent();
  const { handleBind } = useBindSocial();

  useRegisterCode();

  useEffect(() => {
    if (pathname.pathname.includes("portfolio")) {
      if (globalStore.showUserInfo) {
        globalStore.set({ showUserInfo: false });
        prevUserInfoStatus.current = true;
      }
    } else {
      if (prevUserInfoStatus.current) {
        globalStore.set({ showUserInfo: true });
      }
      prevUserInfoStatus.current = false;
    }
    contentRef.current?.scrollTo(0, 0);
    if (taskStore.isBid) {
      taskStore.set({ isBid: false });
    }
  }, [pathname]);

  useEffect(() => {
    if (taskStore.isBid) {
      contentRef.current?.scrollTo(0, 560);
    }
  }, [taskStore.isBid]);

  useEffect(() => {
    if (userInfo?.user) {
      fetchTasks();
    }
  }, [userInfo?.user]);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!userInfo?.user || !code || code?.length < 10) return;
    handleBind("twitter", code);
  }, [userInfo?.user]);

  useEffect(() => {
    return () => {
      taskStore.set({ isBid: false });
    };
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-white relative">
      {/* header */}
      <div className="flex justify-between items-center h-[60px] sticky top-0 bg-white z-[20]">
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
          <EstGas />

          {!userInfo ? (
            <Button
              onClick={login}
              className="w-[100px] h-[36px] !bg-black text-white"
            >
              Login
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
        <PageTabs />
      </div>
      <Infos />
      <div className="flex h-full">
        <div
          className="h-[calc(100vh-60px)] overflow-y-auto relative z-[2] bg-[#F0F0F0]"
          style={{
            width: globalStore.showUserInfo ? window.innerWidth - 294 : "100%",
            scrollBehavior: "smooth"
          }}
          ref={contentRef}
        >
          <Outlet />
        </div>
        <UserInfo />
      </div>
      <Wallet />
      <Alerts />
      <ProfileSetting
        open={userInfoStore.showSetting}
        onClose={() => {
          userInfoStore.set({ showSetting: false, settingFrom: '' })
        }}
      />
      <HowItWork />
      <LucyDrawHistory />
      <XKolModal />
    </div>
  );
}
