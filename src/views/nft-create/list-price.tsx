import Loading from "@/components/icons/loading";
import PriceChart from "./price-chart";
import clsx from "clsx";
import { formatNumber } from "@/utils/format/number";
import { useMemo } from "react";
import Action from "@/views/nft-create/action";
import Button from "@/components/button";
import useMintNft from "./hooks/use-mint-nft";
import useTokenPrice from "@/hooks/use-token-price";

const ITEMS = [
  {
    label: "Floor price",
    key: "floor_price"
  },
  {
    label: "Last Price",
    key: "last_price"
  },
  {
    label: "Listed price on Magic Eden",
    key: "on_magic_eden_price"
  },
  {
    label: "Top Trait Value",
    key: "top_trait_value_price"
  }
];
export default function ListPrice({
  listPrice,
  onSetListPrice,
  address,
  token,
  onSuccess
}: any) {
  const tokenIds = useMemo(() => {
    return token.id
      ? [
        {
          chain: "Berachain",
          address: token.address,
          tokenIds: [token.id]
        }
      ]
      : [];
  }, [token]);
  const { prices, loading: pricesLoading } = useTokenPrice(tokenIds);
  const price = useMemo(() => {
    if (!prices?.length) return {};
    onSetListPrice(prices[0].floor_price);
    return prices[0];
  }, [prices]);
  const { mintNft, minting, minted, mintedLoading } = useMintNft();

  return (
    <div className="mt-[30px]">
      <div className="text-[16px] text-white">Set List Price</div>
      <div className="text-[14px] text-[#ABABAB] mt-[6px]">
        Set a target prize that you want, a reasonable price will attract more
        people to place bid. *1 Bid = 1 USD
      </div>
      <div className="flex flex-row-reverse gap-[16px] pt-[16px]">
        <div className="flex flex-col gap-[10px] w-[356px]">
          {ITEMS.map((item, index) => (
            <div
              className={clsx(
                "p-[13px] bg-[#222A35] border border-[#373737] text-[12px] flex justify-between items-center font-light rounded-[6px] relative",
                price[item.key] !== "0" && price[item.key]
                  ? "cursor-pointer hover:border-[#FFC42F] hover:shadow-[0px_0px_6px_0px_#FFC530]"
                  : "cursor-not-allowed opacity-50",
                listPrice === price[item.key] &&
                "border-[#FFC42F] shadow-[0px_0px_6px_0px_#FFC530]"
              )}
              key={item.key}
              onClick={() => {
                if (price[item.key] !== "0" && price[item.key]) {
                  onSetListPrice(price[item.key]);
                }
              }}
            >
              {index === 0 && (
                <div className="w-[90px] h-[16px] rounded-[4px] bg-[#57FF70] text-[12px] text-black text-center font-medium absolute top-[-8px] left-[-4px]">
                  Recommend
                </div>
              )}
              <div className="text-[#ABABAB]">
                <div>
                  {item.label} ( $
                  {price[item.key] !== "0"
                    ? formatNumber(price[item.key], 2, true)
                    : "-"}
                  )
                </div>
                {item.key === "highest_attribute_floor_price_usd" && (
                  <div className="mt-[6px]">
                    {price["highest_attribute_info"]?.trait_type}:{" "}
                    {price["highest_attribute_info"]?.value}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-[8px]">
                {pricesLoading ? (
                  <Loading size={12} />
                ) : (
                  <>
                    {price[item.key] !== "0" && (
                      <div className="w-[52px] h-[17px] leading-[17px] rounded-[4px] bg-[#EBFF57] text-black text-center text-[10px] font-medium">
                        +20%
                      </div>
                    )}
                    <span className="text-white">
                      $
                      {price[item.key] !== "0"
                        ? formatNumber(price[item.key] * 1.2, 2, true)
                        : "-"}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
          {minted && token?.id && (
            <Action
              amount={1}
              loading={pricesLoading}
              token={token}
              paymentMethod={1}
              address={address}
              anchorPrice={listPrice}
              onSuccess={() => {
                onSuccess();
              }}
            />
          )}
          {(!minted || !token?.id) && token?.address && (
            <Button
              loading={minting || mintedLoading}
              className="button w-full h-[40px] mt-[20px]"
              onClick={mintNft}
            >
              Mint NFT
            </Button>
          )}
        </div>
        <PriceChart
          anchorPrice={listPrice}
          className="h-[328px] !w-[474px] bg-[#1A1E24] rounded-[6px]"
        />
      </div>
    </div>
  );
}