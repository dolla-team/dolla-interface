import Avatar from "@/components/avatar";
import { formatAddress } from "@/utils/format/address";
import SellerLevel from "@/components/seller-level";
import dayjs from "dayjs";
// import { useState } from "react";
// import ProvablyFair from "@/sections/provably-fair";

export default function UnactivePanel({ pool }: { pool: any }) {
  // const [showProvablyFair, setShowProvablyFair] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mt-[8px]">
        <div className="px-[8px] py-[3px] rounded-[10px] border border-[#6A5D3A] bg-[#00000033] backdrop-blur-[10px] text-white text-[14px]">
          {pool?.status === 2 ? "Sold" : "Cancelled"}
        </div>
        {/* <button onClick={() => {setShowProvablyFair(true)}} className="text-[14px] text-[#FFE9B2]">Provably fair</button>
        <ProvablyFair
          open={showProvablyFair}
          onClose={() => setShowProvablyFair(false)}
          pool={pool?.id}
        /> */}
      </div>
      <div className="flex items-center justify-between mt-[8px]">
        <div className="flex items-center gap-[10px]">
          <Avatar
            size={24}
            address={pool?.user_info?.address}
            email={pool?.user_info?.show_email}
            src={pool?.user_info?.icon}
            className="rounded-[6px] text-[12px]"
          />
          <div>
            <div className="text-[#FFE9B2] text-[12px]">Seller</div>
            <div className="flex items-center">
              <div className="text-white text-[12px] mr-[4px] font-[DelaGothicOne]">
                {pool?.user ? formatAddress(pool.user) : "-"}
              </div>
              <SellerLevel />
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[12px] text-[#FFE9B2]">Started from </div>
          <div className="text-[14px] text-white">
            {dayjs(pool?.start_time).format("HH:mm DD MMM, YYYY")}
          </div>
        </div>
      </div>
    </>
  );
}
