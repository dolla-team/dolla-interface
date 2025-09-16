import TopWinnersContainer from "@/views/btc-list/top-winners/container";
import TopWinnersItem from "@/views/btc-list/top-winners/item";
import axiosInstance from "@/libs/axios";
import { useEffect, useState } from "react";

export default function TopWinners({ type }: { type: "winners" | "sellers" }) {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const getData = async () => {
      const res = await axiosInstance.get(
        "/api/v1/pool/winner/bid/recommend?chain=Berachain"
      );

      setData(res.data.data);
    };

    getData();
  }, []);
  return (
    <TopWinnersContainer
      title={type === "winners" ? "Top NFT Winners" : "Top NFT Sellers"}
    >
      {data.map((item, index) => (
        <TopWinnersItem key={item.id} data={item} level={index + 1} />
      ))}
    </TopWinnersContainer>
  );
}
