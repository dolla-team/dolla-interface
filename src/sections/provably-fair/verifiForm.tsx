import useIsMobile from "@/hooks/use-is-mobile";
import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { formatAddress } from "@/utils/format/address";
import { TOKNES } from '@/sections/cashier/panels/withdraw-solana'

const panel_cls = 'bg-[#00000033] rounded-[10px] flex items-center justify-center flex-col py-[10px] text-white text-[16px]'

const tokensByAddresses = {
    [TOKNES[0].address]: TOKNES[0],
    [TOKNES[1].address]: TOKNES[1],
}
export default function VerifiForm({ handleVerify, onPoolIdChange }: { handleVerify: (query: any) => void, onPoolIdChange: (value: string) => void }) {
    const isMobile = useIsMobile();
    const [value, setValue] = useState('');
    const [result, setResult] = useState<any>(null);

    const handleVerifyFn = useCallback(async (value: string) => {
        const result: any = await handleVerify(value);
        setResult(result);
        if (result?.pool_id) {
            onPoolIdChange(result?.pool_id)
        }
    }, [handleVerify]);

  return (
    <div>
        <div className="text-[16px] text-[#BBACA6]">Verify</div>
          <div className={clsx("flex gap-[18px] mt-[10px]", isMobile ? "flex-col" : "flex-row items-center")}>
            <input
              className={clsx("flex-1 h-[46px] bg-black/20 rounded-[10px] p-[15px] text-[16px] text-white", isMobile ? "w-full" : "flex-1")}
              placeholder="Enter Market ID"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button onClick={() => handleVerifyFn(value)} className={clsx("cursor-pointer h-[36px] rounded-[8px] bg-linear-to-b from-[#FFF698] to-[#FFC42F] text-[16px] text-black", isMobile ? "w-full" : "w-[108px]")}>
              Verify
            </button>
          </div>

          <div className={clsx("grid gap-[12px] mt-[20px] w-full", isMobile ? "grid-cols-2 grid-rows-3" : "grid-cols-3 grid-rows-2")}>
            <div className={panel_cls}>
              <div className="text-[#FFFFFF33]">Market No.</div>
              {
                result && (
                  <div>{result?.pool_id}</div>
                )
              }
            </div>
            <div className={panel_cls}>
              <div className="text-[#FFFFFF33]">Market Size</div>
              {
                result?.pool_id && <div>{result?.reward_amount ? result.reward_amount / (10 ** tokensByAddresses[result?.reward_token]?.decimals) : 0} {tokensByAddresses[result?.reward_token]?.symbol}</div>
              }
            </div>
            <div className={panel_cls}>
              <div className="text-[#FFFFFF33]">Bid Amount</div>
              {
                result?.pool_id && <div>{result?.purchase_amount ? result.purchase_amount / (10 ** tokensByAddresses[result?.purchase_token]?.decimals) : 0} {tokensByAddresses[result?.purchase_token]?.symbol}</div>
              }
            </div>
            <div className={panel_cls}>
              <div className="text-[#FFFFFF33]">Random No.</div>
              {
                result?.pool_id && <div className={clsx("text-white", result?.is_winner ? "text-[#E13535]" : "text-[#FFFFFF33]")}>{result?.random_number}</div>
              }
            </div>
            <div className={panel_cls}>
              <div className="text-[#FFFFFF33]">Win No.</div>
              {
                result?.pool_id && <div>{result?.win_number}</div>
              }
            </div>
            <div className={panel_cls}>
              <div className="text-[#FFFFFF33]">Settle TX</div>
              {
                result?.pool_id && <div>{formatAddress(result?.settle_tx_hash)}</div>
              }
            </div>
          </div>
    </div>
  );
}