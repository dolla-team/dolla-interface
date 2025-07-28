import Modal from "@/components/modal";
import Switch from "@/components/switch";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FundList from "./panels/fund-list";
import WithdrawSolana from "./panels/withdraw-solana";
import { useUserAgent } from "@/contexts/user-agent";
import clsx from "clsx";

export default function CashierModal({ open, onClose, defaultTab }: any) {
  const [tab, setTab] = useState("fund");
  const { isMobile } = useUserAgent();

  useEffect(() => {
    if (!defaultTab) {
      setTab("fund");
      return;
    }
    setTab(defaultTab);
  }, [defaultTab]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className={clsx("bg-[#35302B] border border-[#6A5D3A]", isMobile ? 'w-full rounded-t-[16px] ' : 'w-[526px] rounded-[16px] ')}>
        <div className="h-[46px] bg-[#00000033] rounded-t-[16px] relative">
          <Switch
            tabs={[
              { label: "Top Up", value: "fund" },
              { label: "Withdraw", value: "withdraw" }
              // { label: "Records", value: "records" }
            ]}
            onChange={(value) => {
              setTab(value as string);
            }}
            tab={tab}
            className="bg-[#00000033] h-full w-full px-[20px] justify-center gap-[50px] rounded-t-[16px]"
            type="line"
          />
          {
            !isMobile && <button
              className="absolute right-[10px] top-[10px] button p-[10px]"
              onClick={() => {
                onClose();
              }}
            >
              <svg
                width="10"
                height="9"
                viewBox="0 0 10 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 3.375L8 0H10L6 4.5L10 9H8L5 5.625L2 9H0L4 4.5L0 0H2L5 3.375Z"
                  fill="#BBACA6"
                />
              </svg>
            </button>
          }

          {
            isMobile && <button
              className="absolute left-[10px] top-[10px] button p-[10px]"
              onClick={() => {
                onClose();
              }}
            >
              <svg width="6" height="14" viewBox="0 0 6 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.40381 0.602797L1.74981 6.6088L5.40381 12.6148L4.01781 13.2168L-0.000191689 6.6088L4.01781 0.000796318L5.40381 0.602797Z" fill="#BBACA6" />
              </svg>
            </button>
          }

        </div>
        {tab === "fund" && (
          <PanelWrapper className="px-[14px] pb-[20px]">
            <FundList />
          </PanelWrapper>
        )}

        {tab === "withdraw" && (
          <PanelWrapper className="px-[14px] pb-[20px]">
            <WithdrawSolana />
          </PanelWrapper>
        )}

        {/* {tab === "records" && (
          <PanelWrapper className="px-[14px]">
            <Records />
          </PanelWrapper>
        )} */}
      </div>
    </Modal>
  );
}

const PanelWrapper = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      exit={{ opacity: 0 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
