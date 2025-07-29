import Avatar from "@/components/avatar";
import { formatAddress } from "@/utils/format/address";
import SellerLevel from "@/components/seller-level";

export default function MSellerInfo({ pool }: any) {
  return (
    <div className="mt-[6px] flex items-center justify-between">
      <div className="flex items-center">
        <Avatar
          size={24}
          address={pool?.user_info?.address}
          email={pool?.user_info?.email}
          className="rounded-[6px]"
        />
        <div className="text-[#FFE9B2] text-[14px] ml-[7px] mr-[4px]">
          {pool?.user ? formatAddress(pool.user) : "-"}
        </div>
        <SellerLevel />
      </div>
      <button className="button text-[#FFE9B2] text-[14px]">
        Provably fair
      </button>
    </div>
  );
}
