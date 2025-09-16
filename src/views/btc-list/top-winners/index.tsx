import TopWinnersContainer from "./container";
import TopWinnersItem from "./item";
import axiosInstance from "@/libs/axios";
import { useEffect, useState } from "react";

export default function TopWinners() {
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
    <TopWinnersContainer title="Top Winners">
      {data.map((item, index) => (
        <TopWinnersItem key={item.id} data={item} level={index + 1} />
      ))}
    </TopWinnersContainer>
  );
}
