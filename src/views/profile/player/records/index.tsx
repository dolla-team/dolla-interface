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
        "w-full rounded-[20px] border border-[#E4E4E4] bg-white p-[17px_22px_21px] mt-[20px] max-md:w-screen max-md:mt-0 max-md:p-[17px_0]",
        className
      )}
    >
      <Switch
        tab={tab}
        tabs={[
          { label: "Bid History", value: "bidHistory" },
          { label: "Account", value: "account" }
        ]}
        onChange={setTab}
        className="w-[241px] !border-[1px] !border-[#E4E4E4] !rounded-[10px] !p-[0px] max-md:mx-auto !bg-[#F2F2F299]"
        cursorClassName="!rounded-[10px] !bg-[#1A1E24] !shadow-[unset]"
        tabClassName="!px-[20px]"
        activeClassName="!text-white"
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
