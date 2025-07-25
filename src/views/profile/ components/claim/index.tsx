import Empty from "@/components/empty";
import Loading from "@/components/icons/loading";
import { useEffect } from "react";
import ButtonV2 from "@/components/button/v2";
import { formatAddress } from "@/utils/format/address";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import clsx from "clsx";
import useClaimFunds from "@/hooks/solana/use-claim-funds";
import { useAuth } from "@/contexts/auth";
import { useMemo } from "react";
import chains from "@/config/chains";

const ClaimIndex = (props: any) => {
  const { className } = props;

  const { onQueryUserInfo, userInfo, userInfoLoading } = useAuth();

  const list = useMemo(() => {
    if (!userInfo || !userInfo.claim_pool?.length) {
      return [];
    }
    return userInfo.claim_pool.filter((item: any) => !item.is_claim);
  }, [userInfo]);

  useEffect(() => {
    onQueryUserInfo();
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
          userInfoLoading ? (
            <div className="w-full py-[100px] flex justify-center items-center">
              <Loading size={16} />
            </div>
          ) : (
            (list && list.length > 0) ? list.map((item: any, index: number) => {
              const currentChain = Object.values(chains).find((it: any) => it.name.toLowerCase() === item.chain?.toLowerCase());
              let txUrl: any;
              if (currentChain) {
                txUrl = `${currentChain?.blockExplorers?.default?.url}/tx/${item.result_tx_hash || item.tx_hash}`;
              }
              return (
                <div key={index} className="w-full bg-black/20 rounded-[10px] grid grid-cols-[120px_120px_auto_110px_70px] gap-x-[5px] pl-[8px] pr-[17px]">
                  <a
                    className="py-[10px] flex items-center gap-[7px]"
                    target="_blank"
                    href={txUrl || "javascript: void(0);"}
                  >
                    <div>
                      #{item.id}
                    </div>
                    <img src="/profile/icon-share.svg" className="w-[9px] h-[9px] shrink-0" />
                  </a>
                  <div className="py-[10px] flex items-center">
                    {formatNumber(Big(item.reward_amount || 0).div(10 ** item.rewardTokenInfo?.decimals || 1), 4, true, { isShort: true, isShortUppercase: true })} {item.rewardTokenInfo?.symbol}
                  </div>
                  <div className="py-[10px] flex items-center gap-[5px]">
                    {/* <img
                      src="/avatar/1.svg"
                      className="w-[20px] h-[20px] shrink-0 rounded-full border-[2px] border-[#131417] object-center object-cover"
                    /> */}
                    <div className="">
                      {formatAddress(item.winner_user)}
                    </div>
                  </div>
                  <div className="py-[10px] flex items-center">
                    {formatNumber(item.reward_usd, 2, true, { prefix: "$", isShort: Big(item.reward_usd || 0).gt(100000), isShortUppercase: true })}
                  </div>
                  <div className="py-[10px] flex items-center">
                    <ClaimButton
                      onQueryUserInfo={onQueryUserInfo}
                      item={item}
                    />
                  </div>
                </div>
              )
            }) : (
              <Empty />
            )
          )
        }
      </div>
    </div>
  );
};

export default ClaimIndex;

const ClaimButton = (props: any) => {
  const { onQueryUserInfo, item } = props;

  const { onClaim, claiming } = useClaimFunds({
    onClaimSuccess: () => {
      onQueryUserInfo();
    },
  });

  return (
    <ButtonV2
      className="!w-[69px] !px-[unset]"
      loading={claiming}
      disabled={claiming}
      onClick={() => {
        onClaim(item.pool_id);
      }}
    >
      Claim
    </ButtonV2>
  );
};
