// import NFTEmptyCard from "./nft-empty-card";

import ListPrice from "./list-price";
import useNfts from "./hooks/use-nfts";
import { useMemo } from "react";
import clsx from "clsx";
import Nfts from "./nfts";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "@/libs/router";

export default function ListNFT() {
  const navigate = useNavigate();
  const {
    chains,
    chain,
    collections,
    onSelectCollection,
    nfts,
    collection,
    onSelectNft,
    fetchNfts,
    nft,
    setNft,
    listPrice,
    setListPrice
  } = useNfts();
  const { address } = useAuth();

  const errorTips = useMemo(() => {
    if (!chain.id) return "Select a chain";
    if (!collection?.id) return "Select a collection";
    if (!nft?.id) return "Select a NFT";
    if (!listPrice) return "Select a list price";
    return "";
  }, [chain, collection, nft, listPrice]);

  const selectedToken = useMemo(() => {
    return {
      type: "nft",
      address: collection?.address || collection?.id,
      id: nft?.id
    };
  }, [collection, nft]);

  return (
    <div className="w-full h-screen overflow-y-auto pt-[40px] pb-[50px]">
      <div className="max-w-[860px] mx-auto">
        <div className="text-[20px] text-white text-center font-bold mb-[20px] mt-[10px]">
          Create NFT Market
        </div>
        <div className="bg-[#1A1E24] rounded-[12px] bg-[#1A1E24] px-[30px] py-[18px]">
          <div className="flex items-center">
            <div className="text-[14px] text-white font-light w-[100px]">
              Chains
            </div>
            <div className="flex items-center gap-[20px]">
              {chains.map((item) => (
                <div
                  key={item.id}
                  className={clsx(
                    chain.id === item.id &&
                      "p-[4px] pr-[10px] bg-[#743EFF] rounded-[6px] gap-[5px] flex items-center text-white"
                  )}
                  onClick={() => {}}
                >
                  <img
                    className="w-[32px] h-[32px] rounded-[4px"
                    src={item.icon}
                  />
                  {chain.id === item.id && (
                    <span className="text-[12px] font-light">{item.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center mt-[20px]">
            <div className="text-[14px] text-white font-light w-[100px]">
              Collections
            </div>
            <div className="flex items-center gap-[20px]">
              {collections.map((item) => (
                <div
                  key={item.id}
                  className={clsx(
                    "flex rounded-[6px] gap-[5px] flex items-center p-[4px] pr-[10px] button",
                    collection.id === item.id
                      ? "bg-[#743EFF] text-white"
                      : "text-[#ADBCCF] grayscale"
                  )}
                  onClick={() => onSelectCollection(item)}
                >
                  {item.icon && (
                    <img
                      className="w-[30px] h-[30px] rounded-[4px]"
                      src={item.icon}
                    />
                  )}
                  <span className="text-[12px] font-light">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-[#1A1E24] rounded-[6px] p-[20px] mb-[12px] mt-[10px]">
          <div className="text-[14px] text-white font-light w-[100px]">
            Select NFT
          </div>
          <Nfts nfts={nfts} onSelectNft={onSelectNft} currentNft={nft} />
          {/* <div className="flex items-center gap-[8px] flex-wrap mt-[16px]">
          {nfts.map((item) => (
            <NFTCard
              key={item.id}
              data={item}
              checked={nft.id === item.id}
              onSelect={() => onSelectNft(item)}
            />
          ))}
        </div> */}
        </div>
        <ListPrice
          listPrice={listPrice}
          collection={collection}
          onSetListPrice={setListPrice}
          errorTips={errorTips}
          address={address}
          token={selectedToken}
          onSuccess={(type?: string) => {
            fetchNfts();
            if (type === "create") {
              setNft({});
              setTimeout(() => {
                navigate(`/portfolio/lister`);
              }, 1000);
            }
          }}
        />
      </div>
    </div>
  );
}
