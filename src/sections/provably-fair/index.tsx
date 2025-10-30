import Modal from "@/components/modal";
import ModalClose from "@/components/button/modal-close";
import Button from "@/components/button";
import clsx from "clsx";
import useProvablyFair from "./use-provably-fair";
import { formatNumber } from "@/utils/format/number";
import dayjs from "@/libs/dayjs";
import { formatAddress } from "@/utils/format/address";

export default function ProvablyFair({
  data,
  open,
  onClose
}: {
  data: any;
  open: boolean;
  onClose: () => void;
}) {
  const {
    data: hashData,
    loading,
    verifyData,
    verifing,
    onVerfiy
  } = useProvablyFair(data?.hash || data?.result_tx_hash);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[678px]">
        <div className="h-[54px] bg-[#000000] rounded-t-[16px] flex items-center justify-between px-[16px]">
          <div className="text-[16px] text-white">Verify Provably Fair</div>
          <ModalClose onClose={onClose} className="w-[24px] h-[24px] button" />
        </div>
        <div className="p-[20px] bg-white rounded-b-[16px]">
          <div className="grid grid-cols-3 gap-[4px]">
            <div className="w-[202[x] h-[80px] bg-[#F2F2F299] backdrop-blur-[25px] rounded-[12px] flex flex-col items-center justify-center">
              <div className="text-[12px]">Market No.</div>
              <div className="text-[14px] font-[500] mt-[4px]">
                #{data.pool_id}
              </div>
            </div>
            <div className="w-[202[x] h-[80px] bg-[#F2F2F299] backdrop-blur-[25px] rounded-[12px] flex flex-col items-center justify-center">
              <div className="text-[12px]">Market Size</div>
              <div className="text-[14px] font-[500] mt-[4px]">
                ${formatNumber(data.market_size, 2, true)}
              </div>
            </div>
            <div className="w-[202[x] h-[80px] bg-[#F2F2F299] backdrop-blur-[25px] rounded-[12px] flex flex-col items-center justify-center">
              <div className="text-[12px]">Total Bids</div>
              <div className="text-[14px] font-[500] mt-[4px]">{data.bids}</div>
            </div>
            <div className="w-[202[x] h-[80px] bg-[#F2F2F299] backdrop-blur-[25px] rounded-[12px] flex flex-col items-center justify-center">
              <div className="text-[12px]">User Seed</div>
              <div className="text-[14px] font-[500] mt-[4px]">
                {hashData?.user_seed
                  ? formatAddress(hashData.user_seed, 5)
                  : "-"}
              </div>
            </div>
            <div className="w-[202[x] h-[80px] bg-[#F2F2F299] backdrop-blur-[25px] rounded-[12px] flex flex-col items-center justify-center">
              <div className="text-[12px]">Tee Seed</div>
              <div className="text-[14px] font-[500] mt-[4px]">
                {hashData?.tee_seed ? formatAddress(hashData.tee_seed, 5) : "-"}
              </div>
            </div>
            <div className="w-[202[x] h-[80px] bg-[#F2F2F299] backdrop-blur-[25px] rounded-[12px] flex flex-col items-center justify-center">
              <div className="text-[12px]">Block Info</div>
              <div className="text-[14px] font-[500] mt-[4px]">
                <div>height {hashData?.block_height || "-"}</div>
                <div>
                  time{" "}
                  {hashData?.block_time
                    ? dayjs(Number(hashData.block_time)).format("YYYY-MM-DD")
                    : "-"}
                </div>
              </div>
            </div>
          </div>
          {!verifyData ? (
            <Button
              onClick={onVerfiy}
              disabled={!hashData?.play_log}
              loading={loading || verifing}
              className="w-full h-[42px] !bg-[#FFC42F] text-[#2B3337] rounded-[10px] mt-[20px] border border-[#D9D9D9]"
            >
              Generate Random Number
            </Button>
          ) : (
            <div className="rounded-[20px] p-[20px] bg-[#FFC42F] mt-[20px] border border-[#D9D9D9]">
              <div className="text-[14px] font-[500] text-black text-center">
                Result
              </div>
              <div className="grid grid-cols-3 gap-[4px] mt-[10px]">
                <div className="w-[202[x] h-[80px] bg-[#F2F2F299] backdrop-blur-[25px] rounded-[12px] flex flex-col items-center justify-center">
                  <div className="text-[12px]">Random Number</div>
                  <div className="text-[14px] font-[500] mt-[4px]">
                    {verifyData.randomNumber || "-"}
                  </div>
                </div>
                <div className="w-[202[x] h-[80px] bg-[#F2F2F299] backdrop-blur-[25px] rounded-[12px] flex flex-col items-center justify-center">
                  <div className="text-[12px]">Threshold Number</div>
                  <div className="text-[14px] font-[500] mt-[4px]">
                    {verifyData.threshold || "-"}
                  </div>
                </div>
                <div className="w-[202[x] h-[80px] bg-[#F2F2F299] backdrop-blur-[25px] rounded-[12px] flex flex-col items-center justify-center">
                  <div className="text-[12px]">Results</div>
                  <div
                    className={clsx(
                      "text-[14px] font-[500] mt-[4px]",
                      verifyData.isWinner ? "text-[#27C627]" : "text-[#FF0000]"
                    )}
                  >
                    {verifyData.isWinner ? "Win" : "Not win"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
