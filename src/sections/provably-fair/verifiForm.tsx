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
      onPoolIdChange(result)
    } else {
      onPoolIdChange('')
    }
  }, [handleVerify, onPoolIdChange]);

  useEffect(() => {
    if (!value) {
      setResult(null)
      onPoolIdChange('')
    }
  }, [value])

  return (
    <div>
      <div className="text-[16px] text-[#BBACA6]">Verify</div>
      <div className={clsx("flex gap-[18px] mt-[10px]", isMobile ? "flex-col" : "flex-row items-center")}>
        <div className={clsx("flex-1 relative h-[46px] bg-black/20 rounded-[10px] text-[16px] text-white", isMobile ? "w-full" : "flex-1")}>
          <input
            className={clsx("w-[calc(100%-30px)] h-[46px] bg-transparent p-[15px] text-white")}
            placeholder="Bid TX"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {
            value && (
              <div className="absolute z-10 right-[15px] top-[50%] translate-y-[-50%] cursor-pointer" onClick={() => setValue('')}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM5 5L9 10.3086L5 15.6172H7L10 11.6357L13 15.6172H15L11 10.3086L15 5H13L10 8.98145L7 5H5Z" fill="#BBACA6" />
                </svg>
              </div>
            )
          }
        </div>

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
            result?.pool_id && <div className={clsx("text-white", !result?.is_winner ? "text-[#E13535]" : "text-[#3AE135]")}>{result?.random_number}</div>
          }
        </div>
        <div className={panel_cls}>
          <div className="text-[#FFFFFF33]">Win No. Range</div>
          {
            result?.pool_id && <div>0-{result?.win_number}</div>
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