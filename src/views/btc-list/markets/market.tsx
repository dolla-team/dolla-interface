import SellerLevel from "@/components/seller-level";
import columns from "./columns";
import { formatAddress } from "@/utils/format/address";
import { formatNumber } from "@/utils/format/number";
import ProgressBar from "@/components/nft-card/progress-bar";
import BtcImg from "./btc";

export default function Market({
  data,
  onClick
}: {
  data: any;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center h-[70px] rounded-[10px] bg-[#0000000D] border border-[#F2F2F233] backdrop-blur-[25px] pl-[14px] pr-[20px]">
      {columns.map((column: any) => (
        <div
          key={column.title}
          className="flex items-center"
          style={{ width: column.width }}
        >
          {column.dataIndex === "pool_id" && (
            <div
              className="text-[14px] text-black button hover:underline"
              onClick={onClick}
            >
              {data.pool_id}
            </div>
          )}
          {column.dataIndex === "market" && (
            <div className="flex items-center gap-[16px]">
              {data.nft_ids ? (
                <img
                  src={data.reward_token_info?.[0]?.icon}
                  alt="token"
                  className="w-[52px] h-[52px] rounded-[10px]"
                />
              ) : (
                <BtcImg amount={data.amount} />
              )}

              <div>
                <div className="text-[14px] text-black font-semibold">
                  {data.reward_token_info?.[0]?.name}
                  {` #${data.reward_token_info?.[0]?.token_id}`}
                </div>
                <div className="flex items-center gap-[4px] mt-[6px]">
                  <span className="text-[10px] text-[#2B3337]">
                    {data?.user ? formatAddress(data.user) : "-"}
                  </span>
                  <SellerLevel isSmall />
                </div>
              </div>
            </div>
          )}
          {column.dataIndex === "anchor_price" && (
            <div className="text-[14px] text-black">
              {formatNumber(data.value, 0, true, {
                prefix: "$"
              })}
            </div>
          )}
          {column.dataIndex === "accumulative_bids" && (
            <div className="text-[14px] text-black">
              {formatNumber(data.accumulative_bids, 0, true, {
                prefix: "$"
              })}
            </div>
          )}
          {column.dataIndex === "participants" && (
            <div className="text-[14px] text-black">{data.participants}</div>
          )}
          {column.dataIndex === "hitting" && (
            <ProgressBar
              type="basic"
              progress={data.progress}
              className="w-full"
              isNft={!!data.nft_ids}
            />
          )}
        </div>
      ))}
    </div>
  );
}
