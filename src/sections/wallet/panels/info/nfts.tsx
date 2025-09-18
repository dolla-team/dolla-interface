import clsx from "clsx";
import Empty from "./empty";
import Button from "@/components/button/v2";
import { useNavigate } from "react-router-dom";
import useNftsStore from "@/stores/use-nfts";
import useTokenPrice from "@/hooks/use-token-price";
import { useEffect, useMemo } from "react";
import { formatNumber } from "@/utils/format/number";
import Loading from "@/components/icons/loading";

export default function Nfts({
  onDeposit,
  onSend
}: {
  onDeposit: () => void;
  onSend?: () => void;
}) {
  const nftsStore = useNftsStore();
  const tokens = useMemo(() => {
    return nftsStore.nfts.map((item: any) => ({
      chain: "Berachain",
      address: item.token.contract,
      tokenIds: [item.token.tokenId]
    }));
  }, [nftsStore.nfts]);
  const { prices } = useTokenPrice(tokens);

  useEffect(() => {
    nftsStore.set({
      refresher: nftsStore.refresher + 1
    });
  }, []);

  return nftsStore.loading ? (
    <div className="text-[14px] text-[#5E6B7D] w-full h-[100px] flex items-center justify-center">
      <Loading size={20} />
    </div>
  ) : nftsStore.nfts.length === 0 ? (
    <Empty onDeposit={onDeposit} text="No NFTs found" />
  ) : (
    <div className="flex gap-[20px] flex-wrap">
      {nftsStore.nfts.map((item: any, index: number) => (
        <Item
          data={item.token}
          key={item.id}
          onSend={onSend}
          price={prices[index]}
        />
      ))}
    </div>
  );
}

export const Item = ({
  data = {},
  onClick,
  onSend,
  active = false,
  price
}: {
  data: any;
  onClick?: () => void;
  onSend?: () => void;
  active?: boolean;
  price?: any;
}) => {
  const navigate = useNavigate();
  return (
    <div className="w-[178px] relative group" onClick={onClick}>
      {!onClick && (
        <div className="absolute top-0 left-0 z-[6] w-[178px] h-[178px] rounded-[10px] bg-[#00000080] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            className="button w-[150px] h-[36px] !text-[12px]"
            onClick={() => {
              navigate("nft/create");
            }}
          >
            Creat Market
          </Button>
          <Button
            className="button w-[150px] h-[36px] !text-[12px] !bg-[#1A1E24] mt-[10px]"
            onClick={onSend}
          >
            Send
          </Button>
        </div>
      )}
      {active && (
        <>
          <div className="absolute top-[-6px] left-[-6px] w-[190px] h-[190px] bg-[#00000080] rounded-[16px] border border-[#743EFF]" />
          <div className="absolute top-[148px] right-[-2px] z-[3] w-[31px] h-[31px] rounded-full bg-[#1A1E24] border border-[#383F47] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
            >
              <circle cx="11.5005" cy="11.5" r="11.3667" fill="#743EFF" />
              <path
                d="M7.02246 11.1555L10.4669 14.5999L16.6669 8.3999"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </>
      )}
      <img
        src={data.image || "/default-nft.png"}
        className={clsx(
          "relative z-[2] w-full h-[178px] object-cover rounded-[10px] border border-[#434343CC] button"
        )}
      />
      <div className="text-[12px] font-semibold text-black mt-[10px]">
        {data.collection.symbol} #{data.tokenId}
      </div>
      <div className="text-[12px] flex gap-[4px] items-center mt-[4px]">
        <span className="text-[#8A87AA]">Token ID</span>
        <span className="text-black">#{data.tokenId}</span>
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <path d="M1 9.5L9.5 1M9.5 1H1M9.5 1V9.5" stroke="white" />
        </svg> */}
      </div>
      <div className="text-[12px] mt-[4px]">
        <span className="text-[#8A87AA]">Valued</span>{" "}
        <span className="text-black">
          {formatNumber(price?.floor_price, 2, true, { prefix: "$" })}
        </span>
      </div>
    </div>
  );
};
