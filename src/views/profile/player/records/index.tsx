import Switch from "@/components/switch";
import SwitchPanel from "@/components/switch/switch-panel";
import clsx from "clsx";
import { AnimatePresence } from "framer-motion";
import { memo, useState, useRef, useEffect } from "react";
import BidHistory from "./bid-history";
import Account from "./account";

const Records = (props: any) => {
  const { className, ref, ...restProps } = props;
  const [tab, setTab] = useState("bidHistory");
  const accountRef = useRef<any>(null);
  const contentRef = useRef<any>(null);

  useEffect(() => {
    setTimeout(() => {
      const height = contentRef.current?.clientHeight;
      const _height = (height || 240) + 244;
      const element = document.getElementById("objectives-container");
      if (element) {
        element.style.maxHeight = _height + "px";
      }
    }, 300);
  }, [tab]);

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
      <div className="" ref={contentRef}>
        <AnimatePresence>
          {tab === "bidHistory" && (
            <SwitchPanel>
              <BidHistory {...restProps} />
            </SwitchPanel>
          )}
          {tab === "account" && (
            <SwitchPanel>
              <Account ref={accountRef} />
            </SwitchPanel>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default memo(Records);
