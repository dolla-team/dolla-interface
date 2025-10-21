import LevelIcon from "@/components/icons/level-icon";
import Switch from "@/components/switch";
import SwitchPanel from "@/components/switch/switch-panel";
import { useState } from "react";
import Progress from "./progress";
import Complete from "./complete";
import { useAuth } from "@/contexts/auth";
import useTaskStore from "@/stores/use-task";

export default function Objectives() {
  const [tab, setTab] = useState("progress");
  const taskStore = useTaskStore();
  const { userInfo, onQueryUserInfo } = useAuth();

  return (
    <div
      className={`
        w-[400px]
        rounded-[20px]
        border
        border-[#E4E4E4]
        backdrop-blur-[15px]
        p-[20px]
        pr-[0px]
      `}
      style={{
        background:
          "radial-gradient(66.59% 19.85% at 88.5% 1.03%, rgba(129, 100, 255, 0.20) 0%, rgba(255, 255, 255, 0.20) 100%), #FFF"
      }}
    >
      <div className="pr-[20px]">
        <div className="flex gap-[10px] items-center">
          <div className="text-[18px] font-[600]">Level</div>
          <div className="flex items-center">
            <LevelIcon size={30} className="relative z-[2]" />
            <span className="ml-[-14px] text-[12px] text-right pr-[8px] text-white font-[600] w-[58px] h-[20px] bg-black rounded-[12px]">
              Lv. {userInfo?.level}
            </span>
          </div>
        </div>
        <div className="mt-[6px] w-full h-[6px] rounded-[3px] bg-[#000]/15 backdrop-blur-[25px]">
          <div
            className="h-full bg-black rounded-[3px]"
            style={{ width: `${userInfo?.points_progress || 0}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[#8C8B8B] text-[10px] mt-[10px]">
          <span>Current {userInfo?.current_points} XP</span>
          <span>Next Level {userInfo?.next_level_points} XP</span>
        </div>
        <Switch
          tab={tab}
          tabs={[
            { label: "In Progress", value: "progress" },
            { label: "Complete", value: "complete" }
          ]}
          onChange={setTab}
          className="w-full mt-[20px] !border-[1px] !border-[#E4E4E4] !rounded-[10px] !p-[0px] max-md:mx-auto !bg-[#F2F2F299]"
          cursorClassName="!rounded-[10px] !bg-[#1A1E24] !shadow-[unset]"
          tabClassName="!px-[20px] !w-1/2"
          activeClassName="!text-white"
        />
      </div>
      <SwitchPanel className="mt-[10px]">
        <div
          id="objectives-container"
          className="overflow-y-auto overflow-x-hidden"
        >
          {tab === "progress" && (
            <Progress
              tasks={taskStore.progressTasks}
              loading={taskStore.loading}
              onSuccess={() => {
                onQueryUserInfo();
              }}
            />
          )}
          {tab === "complete" && (
            <Complete
              tasks={taskStore.completedTasks}
              loading={taskStore.loading}
              onSuccess={() => {
                onQueryUserInfo();
              }}
            />
          )}
        </div>
      </SwitchPanel>
    </div>
  );
}
