import Modal from "@/components/modal";
import clsx from "clsx";
import useProvably from "./use-provably";
import VerifiForm from "./verifiForm";
import VerifyList from "./verifyList";
import Switch from "@/components/switch";
import { useEffect, useState } from "react";
import useIsMobile from "@/hooks/use-is-mobile";

export default function ProvablyFair({ open, onClose, defaultTab }: { open: boolean, onClose: () => void, defaultTab?: string }) {
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
    hasNext, verifySolana, 
    setYouParticipateOnly, 
    youParticipateOnly, 
    offset, 
    setOffset, 
    setPoolId,
    setChain,
  } = useProvably();

  return (
    <Modal open={open} onClose={onClose}>
      <div className={clsx("bg-[#35302B] border border-[#6A5D3A]", isMobile ? "w-full rounded-t-[16px]" : "w-[828px] rounded-[16px]")}>
        {
          !isMobile && (<div className="flex justify-between items-center rounded-t-[16px] h-[54px] px-[30px] bg-[#00000033]">
            <div className="text-[20px] font-bold text-white">Provably Fair</div>
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
          )
        }

        {
          isMobile && (
            <Switch
              tabs={[
                { label: "Bid Verify", value: "verify" },
                { label: "Ended Markets", value: "markets" }
                // { label: "Records", value: "records" }
              ]}
              onChange={(value) => {
                setTab(value as string);
              }}
              tab={tab}
              className="bg-[#00000033] h-[46px] w-full px-[20px] justify-center gap-[50px] rounded-t-[16px]"
              type="line"
            />
          )
        }

        {
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

              {/* <div className="w-[544px] flex items-center gap-[12px] mt-[14px] text-white">
            <input
              className="w-1/3 h-[46px] bg-[#00000033] rounded-[10px] p-[15px] text-[16px]"
              placeholder="Server Seed"
            />
            <input
              className="w-1/3 h-[46px] bg-[#00000033] rounded-[10px] p-[15px] text-[16px]"
              placeholder="Public Seed"
            />
            <input
              className="w-1/3 h-[46px] bg-[#00000033] rounded-[10px] p-[15px] text-[16px]"
              placeholder="EOS Block"
            />
          </div> */}

            </div>
          )
        }

        {
          isMobile && (
            <div className="p-[10px] pt-[20px]">
              {
                tab === "verify" && (
                  <VerifiForm handleVerify={verifySolana} onPoolIdChange={(value: any) => {
                    console.log('value:', value);
                    setPoolId(value.pool_id)
                    setChain(value.chain || 'solana')
                  }} />
                )
              }
              {
                tab === "markets" && (
                  <VerifyList
                    hasNext={hasNext}
                    list={provablyData}
                    loading={provablyLoading}
                    setYouParticipateOnly={setYouParticipateOnly}
                    youParticipateOnly={youParticipateOnly}
                    offset={offset}
                    setOffset={setOffset} />
                )
              }
            </div>
          )
        }

      </div>
    </Modal>
  );
}

