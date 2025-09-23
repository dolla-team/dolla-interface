import clsx from "clsx";
import { useNftContext } from "../../context";

import { useMemo, useState } from "react";
import Big from "big.js";
import Btn from "./btn";

import ProgressBar from "@/components/nft-card/progress-bar";
import { useNavigate } from "react-router-dom";
// import ProvablyFair from "@/sections/provably-fair";

export default function Header({ className }: { className?: string }) {
  const { pool } = useNftContext();
  // const [openProvablyFair, setOpenProvablyFair] = useState(false);
  const navigate = useNavigate();
  const [rewardTokenInfo, type, process] = useMemo(() => {
    if (!pool) return [{}, "basic", 0];
    let _type = "basic";
    if (Number(pool?.rare) === 1) _type = "saudi";
    if (Number(pool?.rare) === 2) _type = "redOg";
    const _p = Big(pool?.accumulative_bids || 0)
      .div(pool?.anchor_price || 1)
      .mul(1e18)
      .mul(100)
      .toNumber();

    return [pool.reward_token_info?.[0], _type, _p];
  }, [pool]);

  return (
    <div className={clsx("w-full relative", className)}>
      <div className="absolute left-[50%] translate-x-[-50%] top-[-2px] w-[506px] h-[112px] bg-[url('/nft/header-bg.png')] bg-cover bg-center">
        <Btn
          className="absolute left-[-166px]"
          onClick={() => {
            navigate(`/nft-list`);
          }}
        >
          More Market
        </Btn>
        {/* <Btn
          className="absolute right-[-166px]"
          isBgReserve
          onClick={() => {
            setOpenProvablyFair(true);
          }}
        >
          Provably fair
        </Btn> */}
        <div className="absolute w-full text-center top-[50%] translate-y-[-50%]">
          <div
            className=" font-bold text-[32px]"
            style={{
              background:
                "radial-gradient(126.53% 77.78% at 50% 22.22%, #F6F3FF 29.81%, #B396FF 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            {rewardTokenInfo.name} {rewardTokenInfo.token_id}
          </div>
          <div className="flex items-center justify-center gap-[12px] mt-[10px]">
            <div className="text-[14px] text-[#8A87AA]">Total Bid</div>
            <ProgressBar
              type={type}
              progress={process}
              className="w-[278px]"
              bids={pool?.accumulative_bids}
            />
            {/* <div
              className="text-[26px] text-white font-bold"
              style={{
                background: "linear-gradient(90deg, #FFE9B2 0%, #FFC42F 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              ${amount}
            </div> */}
          </div>
        </div>
        {/* <div className="absolute w-[316px] h-[56px] bottom-[-60px] left-[50%] translate-x-[-50%]">
          <SellerBg />
          <div className="absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] flex items-center gap-[12px]">
            <div className="w-[39px] h-[39px] bg-linear-to-b from-[#FFC42F] to-[#99761C] rounded-[12px] p-[2px]">
              <Avatar
                size={35}
                address={pool?.user_info?.address}
                email={pool?.user_info?.email}
                className="rounded-[12px]"
              />
            </div>
            <div>
              <div>
                <span className="text-[16px] text-white">Seller</span>
              </div>
              <div className="flex items-center gap-[4px]">
                <span className="text-[14px] text-white">
                  {pool?.user ? formatAddress(pool.user) : "-"}
                </span>
                <SellerLevel />
              </div>
            </div>
          </div>
        </div> */}
      </div>
      {/* <ProvablyFair
        pool={pool}
        open={openProvablyFair}
        onClose={() => {
          setOpenProvablyFair(false);
        }}
        defaultTab="provably-fair"
      /> */}
    </div>
  );
}
