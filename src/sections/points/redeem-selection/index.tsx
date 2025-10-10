import Modal from "@/components/modal";
import { formatNumber } from "@/utils/format/number";
import PointIcon from "@/components/icons/point-icon";
import RedeemSelectionItem from "./item";
import { useState } from "react";
import Redeem from "../redeem";
import History from "../history";
import clsx from "clsx";
import useIsMobile from "@/hooks/use-is-mobile";

export default function RedeemSelection({
  points,
  showRedeemSelection,
  items,
  itemsMap,
  onClose
}: {
  points: number;
  showRedeemSelection: boolean;
  items: any[];
  itemsMap: any;
  onClose: () => void;
}) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const isMobile = useIsMobile();
  const close = () => {
    onClose();
    setSelectedItem(null);
  };
  const [tab, setTab] = useState(0); // 0 for index, 1 for history, 2 for redeem

  return (
    <>
      <Modal open={showRedeemSelection} onClose={close}>
        <div
          className={clsx(
            "rounded-[16px] bg-white",
            isMobile ? "w-full" : "w-[814px] h-[458px]"
          )}
        >
          <div className="h-[54px] bg-black rounded-t-[14px] flex items-center justify-between px-[16px]">
            <div
              className="text-[16px] text-white flex items-center gap-[10px] button"
              onClick={() => {
                setTab(0);
              }}
            >
              {tab > 0 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="7"
                  height="14"
                  viewBox="0 0 7 14"
                  fill="none"
                >
                  <path d="M6 1L1 7L6 13" stroke="white" strokeWidth="1.5" />
                </svg>
              )}
              <span>{tab === 1 ? "Redeem History" : "Points Redemption"}</span>
            </div>
            <button className="w-[24px] h-[24px] button" onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="12"
                viewBox="0 0 10 12"
                fill="none"
              >
                <path
                  d="M5 4.57422L8 0.592773H10L6 5.90137L10 11.21H8L5 7.22852L2 11.21H0L4 5.90137L0 0.592773H2L5 4.57422Z"
                  fill="#BBACA6"
                />
              </svg>
            </button>
          </div>

          {tab === 0 && (
            <div className="p-[20px] relative">
              <button
                className="underline button text-[14px] absolute top-[20px] right-[30px]"
                onClick={() => setTab(1)}
              >
                Redeem History
              </button>
              <div className="flex flex-col items-center justify-center text-center">
                <PointIcon size={60} />
                <span className="text-black text-[26px] font-bold mt-[10px]">
                  {formatNumber(points.toString(), 0, true, {
                    isShort: isMobile
                  })}
                </span>
              </div>
              <div
                className={clsx(
                  "flex gap-[16px] mt-[30px]",
                  isMobile ? "flex-wrap" : "flex-nowrap"
                )}
              >
                {items.map((item: any, index: number) => (
                  <RedeemSelectionItem
                    key={index}
                    data={item}
                    onClick={() => {
                      setSelectedItem(item);
                      setTab(2);
                    }}
                    className={isMobile ? "w-[calc(50%-8px)]" : "w-1/4"}
                  />
                ))}
              </div>
            </div>
          )}
          {tab === 1 && <History itemsMap={itemsMap} showHistory={tab === 1} />}
          {tab === 2 && selectedItem && (
            <Redeem
              data={selectedItem}
              points={points}
              onSuccess={() => {
                setSelectedItem(null);
                setTab(0);
              }}
            />
          )}
        </div>
      </Modal>
    </>
  );
}
