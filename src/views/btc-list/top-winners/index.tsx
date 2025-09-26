import TopWinnersContainer from "./container";
import TopWinnersItem from "./item";
import axiosInstance from "@/libs/axios";
import Empty from "@/sections/wallet/panels/info/empty";
import { useEffect, useState } from "react";

export default function TopWinners({ type }: { type: "winners" | "sellers" }) {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const getData = async () => {
      const res = await axiosInstance.get("/api/v1/pool/winner/bid/recommend");

      setData(res.data.data);
    };

    getData();
  }, []);
  return (
    <TopWinnersContainer
      title={type === "winners" ? "Top BTC Winners" : "Top BTC Sellers"}
    >
      {data.map((item, index) => (
        <TopWinnersItem key={item.id} data={item} level={index + 1} />
      ))}
      {data.length === 0 && <Empty className="!pt-[20px]" text="No winners" />}
    </TopWinnersContainer>
  );
}
