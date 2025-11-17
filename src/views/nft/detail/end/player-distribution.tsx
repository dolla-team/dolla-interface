import Avatar from "@/components/avatar";
import { usePoolDistributed } from "@/hooks/use-pool-distributed";
import { useMemo } from "react";
import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";

export default function PlayerDistribution({
  data,
  bidsDistribution
}: {
  data: any;
  bidsDistribution: any;
}) {
  const { distributed } = usePoolDistributed(data);
  const isMobile = useIsMobile();

  const total = useMemo(() => {
    return Object.values(distributed).reduce((acc, curr) => acc + curr, 0);
  }, [distributed]);

  return (
    <div className="w-full h-full rounded-[10px] bg-[#00000033] mt-[10px]">
      <div
        className={clsx(
          "h-full pt-[12px] pb-[20px] flex flex-col justify-between",
          isMobile ? "px-[0px]" : "px-[18px]"
        )}
      >
        {[
          { value: 1, color: "#FFC42F" },
          { value: 5, color: "#FF9B43" },
          { value: 10, color: "#83FF52" },
          { value: 20, color: "#7357FF" }
        ].map((item) => (
          <Item
            data={item}
            key={item.value}
            number={distributed[item.value as keyof typeof distributed]}
            total={total}
            winner={data.winner_user_info}
            bidsDistribution={bidsDistribution[item.value]}
          />
        ))}
      </div>
    </div>
  );
}

const Item = ({ data, number, total, winner, bidsDistribution }: any) => {
  const width = useMemo(() => {
    if (total === 0) return 0;
    return (number / total) * 100;
  }, [number, total]);

  return (
    <div className="flex items-center">
      <div className="text-[12px] text-[#FFE9B2] w-[70px] mr-[11px] shrink-0">
        BID x{data.value}
      </div>
      <div className="h-[12px] w-[292px] rounded-[6px] flex items-center">
        <div
          className="h-full rounded-[6px] mr-[16px]"
          style={{ width: `${width}%`, backgroundColor: data.color }}
        />
        {!!bidsDistribution && (
          <>
            <div className="text-[14px] text-[#ADBCCF]">{number}</div>
            <div className="flex items-center gap-[6px] ml-[10px]">
              <Avatar
                size={20}
                address={winner?.user}
                src={winner?.icon}
                className="text-[12px]"
              />
              <span className="text-[12px] text-white">
                x{bidsDistribution}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
