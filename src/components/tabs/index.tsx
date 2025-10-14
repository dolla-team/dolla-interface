import { motion } from "framer-motion";
import { useRef } from "react";
import clsx from "clsx";

export default function Tabs({
  currentTab,
  onChangeTab,
  tabs,
  className,
  tabClassName,
  cursorClassName,
  activeClassName
}: any) {
  const prevI = useRef<number[]>([0]);
  return (
    <div className={clsx("flex items-center gap-[50px]", className)}>
      {tabs.map((tab: any, i: number) => (
        <div
          key={tab.key}
          id={tab.id} // Support custom ID for each tab
          className={clsx(
            "button relative pb-[10px]",
            tabClassName,
            tab.key === currentTab && activeClassName
          )}
          onClick={() => {
            onChangeTab(tab.key);
            prevI.current.push(i);
            if (prevI.current.length > 2) prevI.current.shift();
          }}
        >
          <span className="relative z-[2] whitespace-nowrap text-ellipsis overflow-hidden">
            {tab.label}
          </span>
          {currentTab === tab.key && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {
                  x: i < prevI.current[0] ? "50%" : "-50%"
                },
                show: {
                  x: "0%",
                  transition: {
                    staggerChildren: 0.3
                  }
                }
              }}
              className={clsx(
                "absolute rounded-[3px] w-full h-[3px] bottom-0",
                cursorClassName
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
