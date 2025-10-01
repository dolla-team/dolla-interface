import Modal from "@/components/modal";
import Avatar from "@/components/avatar";
import { useAuth } from "@/contexts/auth";
import { formatAddress } from "@/utils/format/address";
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
  const { userInfo } = useAuth();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
  const isMobile = useIsMobile();
  const close = () => {
    onClose();
    setSelectedItem(null);
    setShowHistory(false);
  };

  return (
    <>
      <Modal open={showRedeemSelection} onClose={close}>
        <div
          className={clsx(
            " rounded-[16px] border border-[#E4E4E4] bg-white",
            isMobile ? "w-full" : "w-[814px] h-[422px]"
          )}
        >
          <div className="h-[54px] bg-[#000000] rounded-t-[16px] flex items-center justify-between px-[16px]">
            <div className="text-[20px] text-white">Points Redemption</div>
            <button className="w-[24px] h-[24px] button" onClick={close}>
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
          <div className="p-[20px]">
            <div className="flex items-center justify-between">
              <div
                className={clsx(
                  "flex items-center",
                  isMobile ? "gap-[8px]" : "gap-[16px]"
                )}
              >
                <Avatar
                  size={46}
                  address={userInfo?.user}
                  email={userInfo?.email}
                />
                <div className="font-[DelaGothicOne] flex items-center">
                  <div className={isMobile ? "text-[16px]" : "text-[20px]"}>
                    {userInfo?.name || formatAddress(userInfo?.user)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-[8px]">
                  <PointIcon />
                  <span
                    className="text-[#FFEF43] text-[20px] font-bold font-[AlfaSlabOne]"
                    style={{
                      WebkitTextStrokeWidth: "1px",
                      WebkitTextStrokeColor: "#5E3737"
                    }}
                  >
                    x
                    {formatNumber(points.toString(), 0, true, {
                      isShort: isMobile
                    })}
                  </span>
                </div>
                <button
                  className="underline button text-white text-[14px]"
                  onClick={() => setShowHistory(true)}
                >
                  Redeem History
                </button>
              </div>
            </div>
            <div
              className={clsx(
                "flex gap-[16px] mt-[20px]",
                isMobile ? "flex-wrap" : "flex-nowrap"
              )}
            >
              {items.map((item: any, index: number) => (
                <RedeemSelectionItem
                  key={index}
                  data={item}
                  onClick={() => {
                    setSelectedItem(item);
                  }}
                  className={isMobile ? "w-[calc(50%-8px)]" : "w-1/4"}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>
      <Redeem
        data={selectedItem}
        showRedeem={!!selectedItem}
        points={points}
        onClose={() => {
          setSelectedItem(null);
        }}
        onSuccess={() => {
          setSelectedItem(null);
        }}
      />
      <History
        itemsMap={itemsMap}
        showHistory={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </>
  );
}
