import Avatar from "@/components/avatar";
import { formatAddress } from "@/utils/format/address";
import SellerLevel from "@/components/seller-level";
// import ProvablyFair from "@/sections/provably-fair";
// import { useState } from "react";

export default function MSellerInfo({ pool }: any) {
  // const [showProvablyFair, setShowProvablyFair] = useState(false);

  return (
    <>
      <div className="mt-[6px] flex items-center justify-between">
        <div className="flex items-center">
          <Avatar
            size={24}
            address={pool?.user_info?.address}
            email={pool?.user_info?.show_email}
            src={pool?.user_info?.icon}
            className="rounded-[6px] text-[12px]"
          />
          <div className="text-[#FFE9B2] text-[14px] ml-[7px] mr-[4px]">
            {pool?.user ? formatAddress(pool.user) : "-"}
          </div>
          <SellerLevel />
        </div>
        {/* <button className="button text-[#FFE9B2] text-[14px]" onClick={() => setShowProvablyFair(true)}>
          Provably fair
        </button> */}
      </div>
      {/* <ProvablyFair
        open={showProvablyFair}
        onClose={() => setShowProvablyFair(false)}
        pool={pool?.id}
      /> */}
    </>
  );
}
