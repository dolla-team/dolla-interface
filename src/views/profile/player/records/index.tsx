import Switch from "@/components/switch";
import SwitchPanel from "@/components/switch/switch-panel";
import clsx from "clsx";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import BidHistory from "./bid-history";
import Account from "./account";

const Records = (props: any) => {
  const {
    className,
    ...restProps
  } = props;

  const [tab, setTab] = useState("bidHistory");

  return (
    <div className={clsx("w-full rounded-[16px] border border-[#2B2C2F] bg-[#22201D] p-[17px_22px_21px] mt-[20px] max-md:w-screen max-md:mt-0 max-md:p-[17px_0]", className)}>
      <Switch
        tab={tab}
        tabs={[
          { label: "Bid History", value: "bidHistory" },
          { label: "Account", value: "account" }
        ]}
        onChange={setTab}
        className="w-[241px] !h-[38px] !border-[1px] !border-[#6A5D3A] !rounded-[19px] !bg-[#35302B] !p-[4px] max-md:mx-auto"
        cursorClassName="!rounded-[15px] !shadow-[unset] !bg-[radial-gradient(50%_50%_at_50%_50%,_#FFEF43_0%,_#FFC42F_100%)]"
        tabClassName="!px-[15px]"
      />
      <div className="">
        <AnimatePresence>
          {
            tab === "bidHistory" && (
              <SwitchPanel>
                <BidHistory {...restProps} />
              </SwitchPanel>
            )
          }
          {
            tab === "account" && (
              <SwitchPanel>
                <Account />
              </SwitchPanel>
            )
          }
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Records;
