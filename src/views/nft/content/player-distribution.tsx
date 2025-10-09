import { useNftContext } from "../context";
import { useMemo } from "react";
import Avatar from "@/components/avatar";
import { usePoolDistributed } from "@/hooks/use-pool-distributed";
import useWinnerBidList from "../detail/use-winner-bid-list";
import clsx from "clsx";

export default function PlayerDistribution() {
  const { pool } = useNftContext();
  const { distributed } = usePoolDistributed(pool);
  const { winnerBidList } = useWinnerBidList(pool);
  const total = useMemo(() => {
    return Object.values(distributed).reduce((acc, curr) => acc + curr, 0);
  }, [distributed]);

  const [bidsDistribution] = useMemo(() => {
    if (!winnerBidList?.length) return [{}];
    let _bidsDistribution: any = {};

    winnerBidList.forEach((item: any) => {
      _bidsDistribution[item.times] = (_bidsDistribution[item.times] || 0) + 1;
    });

    return [_bidsDistribution];
  }, [winnerBidList, pool]);

  return (
    <div className="w-[428px] h-[242px] rounded-[20px] border border-[#E4E4E4] bg-[#FFFFFF99] p-[20px]">
      <div className="flex justify-between items-center text-[14px] text-[#8A87AA]">
        <span>Player Distribution</span>
      </div>
      <div
        className={clsx("h-full pt-[30px] pb-[20px] flex flex-col gap-[18px]")}
      >
        {[
          { value: 1, color: "#D3D1E9" },
          { value: 5, color: "#C3C1DC" },
          { value: 10, color: "#ACA9CA" },
          { value: 20, color: "#8A87AA" }
        ].map((item) => (
          <Item
            data={item}
            key={item.value}
            number={distributed[item.value as keyof typeof distributed]}
            total={total}
            winner={pool?.winner_user_info}
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
      <div className="text-[12px] text-[#8A87AA] w-[70px] mr-[11px] shrink-0">
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
                email={winner?.show_email}
                src={winner?.icon}
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
