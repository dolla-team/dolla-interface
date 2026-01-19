import TopWinnersContainer from "./container";
import TopWinnersItem from "./item";
import axiosInstance from "@/libs/axios";
import Empty from "@/sections/wallet/panels/info/empty";
import { useEffect, useState, useRef } from "react";

export default function TopWinners({
  type,
  limit = 10,
  onDataChange
}: {
  type: "winners" | "sellers" | "losers";
  limit?: number;
  onDataChange?: (data: any[]) => void;
}) {
  const [data, setData] = useState<any[]>([]);
  const onDataChangeRef = useRef(onDataChange);

  useEffect(() => {
    onDataChangeRef.current = onDataChange;
  }, []);

  useEffect(() => {
    const getData = async () => {
      const res = await axiosInstance.get(
        type === "winners"
          ? `/api/v1/user/top/winners?limit=${limit}`
          : type === "sellers"
          ? `/api/v1/user/top/seller?limit=${limit}&chain=near`
          : `/api/v1/user/top/loss?limit=${limit}`
      );

      const fetchedData = res.data.data;
      setData(fetchedData);
      onDataChangeRef.current?.(fetchedData);
    };

    getData();
  }, [type, limit]);
  return (
    <TopWinnersContainer
      title={
        type === "winners"
          ? "Top Realizations"
          : type === "sellers"
          ? "Top Market List"
          : "Top Market Loss"
      }
    >
      {data.map((item, index) => (
        <TopWinnersItem
          key={item.id}
          data={item}
          level={index + 1}
          type={type}
          maxLevel={limit === 10 ? 5 : limit}
        />
      ))}
      {data.length === 0 && (
        <Empty className="!pt-[60px]" text={`No ${type}`} />
      )}
    </TopWinnersContainer>
  );
}
