import LevelIcon from "@/components/icons/level-icon";
import Switch from "@/components/switch";
import SwitchPanel from "@/components/switch/switch-panel";
import { useState } from "react";
import Progress from "./progress";
import Complete from "./complete";

export default function Objectives({ dataHeight }: { dataHeight: number }) {
  const [tab, setTab] = useState("progress");
  return (
    <div
      className={`
        w-[400px]
        h-full
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
        <div className="flex justify-between items-center">
          <div className="text-[18px] font-[600]">Level</div>
          <div className="flex items-center gap-[6px]">
            <LevelIcon size={30} />
            <span className="text-[14px] font-[600]">Lv. 1</span>
          </div>
        </div>
        <div className="mt-[6px] w-full h-[6px] rounded-[3px] bg-[#000]/15 backdrop-blur-[25px]">
          <div
            className="h-full bg-black rounded-[3px]"
            style={{ width: "50%" }}
          />
        </div>
        <div className="flex justify-between items-center text-[#8C8B8B] text-[10px] mt-[10px]">
          <span>PTS 45</span>
          <span>Next Level 200</span>
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
          className="overflow-y-auto"
          style={{
            maxHeight: dataHeight + 304
          }}
        >
          {tab === "progress" && <Progress />}
          {tab === "complete" && <Complete />}
        </div>
      </SwitchPanel>
    </div>
  );
}
