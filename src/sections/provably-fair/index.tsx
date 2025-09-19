import Modal from "@/components/modal";
import clsx from "clsx";
import useProvably from "./use-provably";
import VerifiForm from "./verifiForm";
import VerifyList from "./verifyList";
import Switch from "@/components/switch";
import { useEffect, useState } from "react";
import useIsMobile from "@/hooks/use-is-mobile";
import BidHistory from "@/views/profile/player/records/bid-history";

export default function ProvablyFair({
  open,
  onClose,
  defaultTab,
  pool
}: {
  open: boolean;
  onClose: () => void;
  defaultTab?: string;
  pool: string;
}) {
  const [tab, setTab] = useState("verify");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!defaultTab) {
      setTab("verify");
      return;
    }
  }, [defaultTab]);

  const {
    data: provablyData,
    loading: provablyLoading,
    hasNext,
    verifySolana,
    setYouParticipateOnly,
    youParticipateOnly,
    offset,
    setOffset,
    setPoolId,
    setChain,
    getRecords,
    dataRecords,
    recordLoading,
    hasMore
  } = useProvably({ currentPool: pool });

  return (
    <Modal open={open} onClose={onClose}>
      <div
        className={clsx(
          "bg-[#2D2B35] border border-[#514A5D]",
          isMobile ? "w-full rounded-t-[16px]" : "w-[828px] rounded-[16px]"
        )}
      >
        {!isMobile && (
          <div className="flex justify-between items-center rounded-t-[16px] h-[54px] px-[30px] bg-[#00000033]">
            <div className="text-[20px] font-bold text-white">
              Provably Fair
            </div>
            <button className="cursor-pointer" onClick={onClose}>
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
        )}

        {
          <Switch
            tabs={[
              { label: "Current Market", value: "verify" },
              { label: "Ended Markets", value: "markets" }
              // { label: "Records", value: "records" }
            ]}
            onChange={(value) => {
              setTab(value as string);
            }}
            tab={tab}
            className={clsx(
              "h-[46px] w-full px-[20px] justify-center gap-[50px]",
              isMobile ? "rounded-t-[16px] bg-[#00000033]" : "bg-inherit"
            )}
            type="line"
          />
        }

        {/* {
          !isMobile && (
            <div className={clsx("pt-[20px] pb-[30px] pl-[20px] pr-[30px]")}>
              <div className="pl-[10px]">
                <VerifiForm handleVerify={verifySolana} onPoolIdChange={(value: any) => {
                  setPoolId(value.pool_id)
                  setChain(value.chain || 'solana')
                }} />
              </div>

              <VerifyList
                hasNext={hasNext}
                list={provablyData}
                loading={provablyLoading}
                setYouParticipateOnly={setYouParticipateOnly}
                youParticipateOnly={youParticipateOnly}
                offset={offset}
                setOffset={setOffset} />

            </div>
          )
        } */}

        {
          <div className="p-[10px] pt-[20px]">
            {tab === "verify" && (
              <div>
                <BidHistory
                  data={dataRecords}
                  loading={recordLoading}
                  hasMore={hasMore}
                  onPageChange={getRecords}
                  fullAction={true}
                />
                <VerifiForm
                  handleVerify={verifySolana}
                  onPoolIdChange={(value: any) => {
                    setPoolId(value.pool_id);
                    setChain(value.chain || "solana");
                  }}
                />
              </div>
            )}
            {tab === "markets" && (
              <VerifyList
                hasNext={hasNext}
                list={provablyData}
                loading={provablyLoading}
                setYouParticipateOnly={setYouParticipateOnly}
                youParticipateOnly={youParticipateOnly}
                offset={offset}
                setOffset={setOffset}
              />
            )}
          </div>
        }
      </div>
    </Modal>
  );
}
