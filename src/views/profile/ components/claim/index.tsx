import Empty from "@/components/empty";
import Loading from "@/components/icons/loading";
import { useRequest } from "ahooks";
import { useEffect } from "react";
import ButtonV2 from "@/components/button/v2";
import { formatAddress } from "@/utils/format/address";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import clsx from "clsx";
import useClaimFunds from "@/hooks/use-claim-funds";

const ClaimIndex = (props: any) => {
  const { className } = props;

  const { runAsync: getData, data, loading }: any = useRequest(async () => {
    // FIXME mock data
    const _request = () => new Promise((resolve) => {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        resolve([]);
      }, 1000);
    });
    const _data = await _request();
    return _data;
  }, { manual: true });

  const { onClaim, claiming } = useClaimFunds({
    onClaimSuccess: () => {
      getData();
    },
  });

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={clsx("w-full h-full flex flex-col items-stretch font-[SpaceGrotesk] text-white text-[16px] font-[400] leading-[100%]", className)}>
      <div className="w-full shrink-0 grid grid-cols-[120px_120px_auto_110px_70px] gap-x-[5px] pl-[8px] pr-[17px] text-[14px] text-[#BBACA6]">
        <div className="py-[10px]">Market ID</div>
        <div className="py-[10px]">Market Size</div>
        <div className="py-[10px]">Winner</div>
        <div className="py-[10px]">Claimable</div>
        <div className="py-[10px]">Action</div>
      </div>
      <div className="w-full mt-[9px] flex flex-col gap-y-[10px] items-stretch flex-1 h-0 overflow-y-auto">
        {
          loading ? (
            <div className="w-full py-[100px] flex justify-center items-center">
              <Loading size={16} />
            </div>
          ) : (
            (data && data.length > 0) ? data.map((item: any, index: number) => (
              <div key={index} className="w-full bg-black/20 rounded-[10px] grid grid-cols-[120px_120px_auto_110px_70px] gap-x-[5px] pl-[8px] pr-[17px]">
                <div className="py-[10px] flex items-center gap-[7px]">
                  <div>
                    #{item.id}
                  </div>
                  <img src="/profile/icon-share.svg" className="w-[9px] h-[9px] shrink-0" />
                </div>
                <div className="py-[10px] flex items-center">
                  {item.marketSize} BTC
                </div>
                <div className="py-[10px] flex items-center gap-[5px]">
                  <img src="/avatar/1.svg" className="w-[20px] h-[20px] shrink-0 rounded-full border-[2px] border-[#131417] object-center object-cover" />
                  <div className="">
                    {formatAddress(item.winner)}
                  </div>
                </div>
                <div className="py-[10px] flex items-center">
                  {formatNumber(item.claimable, 2, true, { prefix: "$", isShort: Big(item.claimable || 0).gt(100000), isShortUppercase: true })}
                </div>
                <div className="py-[10px] flex items-center">
                  <ButtonV2
                    className="!w-[69px] !px-[unset]"
                    loading={claiming}
                    disabled={claiming}
                    onClick={() => {
                      onClaim();
                    }}
                  >
                    Claim
                  </ButtonV2>
                </div>
              </div>
            )) : (
              <Empty />
            )
          )
        }
      </div>
    </div>
  );
};

export default ClaimIndex;