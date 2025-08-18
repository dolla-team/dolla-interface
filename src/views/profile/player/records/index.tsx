import Switch from "@/components/switch";
import SwitchPanel from "@/components/switch/switch-panel";
import clsx from "clsx";
import { AnimatePresence, rgba } from "framer-motion";
import { useState } from "react";
import BidHistory from "./bid-history";
import Account from "./account";

const Records = (props: any) => {
  const { className, ...restProps } = props;

  const [tab, setTab] = useState("bidHistory");

  return (
    <div
      className={clsx(
        "w-full rounded-[16px] border border-[#383F47] p-[17px_22px_21px] mt-[20px] max-md:w-screen max-md:mt-0 max-md:p-[17px_0]",
        className
      )}
      style={{
        background:
          "radial-gradient(27.7% 35.89% at 1.18% 2.95%, rgba(111, 55, 255, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #1A1E24"
      }}
    >
      <Switch
        tab={tab}
        tabs={[
          { label: "Bid History", value: "bidHistory" },
          { label: "Account", value: "account" }
        ]}
        onChange={setTab}
        className="w-[241px] !border-[1px] !border-[#383F47] !rounded-[19px] !p-[4px] max-md:mx-auto"
        cursorClassName="!rounded-[15px] !shadow-[unset]"
        tabClassName="!px-[15px]"
      />
      <div className="">
        <AnimatePresence>
          {tab === "bidHistory" && (
            <SwitchPanel>
              <BidHistory {...restProps} />
            </SwitchPanel>
          )}
          {tab === "account" && (
            <SwitchPanel>
              <Account />
            </SwitchPanel>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Records;
