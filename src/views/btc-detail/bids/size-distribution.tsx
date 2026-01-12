import clsx from "clsx";
import { BID_UNITS } from "@/config";
import { usePoolDistributed } from "@/hooks/use-pool-distributed";
import Avatar from "@/components/avatar";

export default function SizeDistribution({
  data,
  winnerDistribution
}: {
  data: any;
  winnerDistribution: any;
}) {
  const { distributed } = usePoolDistributed(data);

  return (
    <div className="mt-[30px]">
      <div className="text-[14px] text-black/60 pb-[20px]">
        Size Distribution
      </div>
      <div className="grid grid-cols-2 gap-[10px] gap-[20px]">
        {BID_UNITS.map((item) => (
          <div key={item} className="flex items-center gap-[10px]">
            <div className="px-[12px] py-[3px] rounded-[13px] bg-[#0000000D] border border-[#F2F2F233] text-[12px] text-black/60">
              ${item}
            </div>
            <div
              className={clsx(
                "text-[16px] text-black font-[600]",
                distributed[item as keyof typeof distributed] === 0 &&
                  "opacity-30"
              )}
            >
              x{distributed[item as keyof typeof distributed]}
            </div>
            {winnerDistribution[item as keyof typeof winnerDistribution] && (
              <div className="flex items-center gap-[4px]">
                <div className="rounded-full border border-[#DD9000]">
                  <Avatar
                    size={20}
                    src={data?.winner_user_info?.icon}
                    address={data?.winner_user_info?.user}
                    className="rounded-full"
                  />
                </div>
                <span className="text-[12px] text-[#DD9000]">
                  x{winnerDistribution[item as keyof typeof winnerDistribution]}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
