import TopWinnersContainer from "./container";
import TopWinnersItem from "./item";
import axiosInstance from "@/libs/axios";
import Empty from "@/sections/wallet/panels/info/empty";
import { useEffect, useState } from "react";
import Big from "big.js";

export default function TopWinners({
  type
}: {
  type: "winners" | "sellers" | "losers";
}) {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const getData = async () => {
      const res = await axiosInstance.get(
        type === "winners"
          ? `/api/v1/user/top/winners?limit=10`
          : type === "sellers"
          ? `/api/v1/user/top/seller?limit=10&chain=near`
          : `/api/v1/user/top/loss?limit=10`
      );

      setData(res.data.data);
    };

    getData();
  }, []);
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
        />
      ))}
      {data.length === 0 && (
        <Empty className="!pt-[60px]" text={`No ${type}`} />
      )}
    </TopWinnersContainer>
  );
}
