import { useState, useEffect } from "react";
import mock from "../mock";
import axiosInstance from "@/libs/axios";
import nftAbi from "@/config/abis/evm-nft";
import { useAuth } from "@/contexts/auth";
import { ethers } from "ethers";
import { useConfigStore } from "@/stores/use-config";
import useNftsStore from "@/stores/use-nfts";

export default function useNfts() {
  const [chains, setChains] = useState<any[]>([]);
  const [chain, setChain] = useState<any>({});
  const [collections, setCollections] = useState<any[]>([]);
  const [collection, setCollection] = useState<any>({});
  const [nfts, setNfts] = useState<any[]>([]);
  const [nft, setNft] = useState<any>(null);
  const [loadingCollections, setLoadingCollections] = useState<boolean>(false);
  const [listPrice, setListPrice] = useState<number>(100);
  // const [loadingNfts, setLoadingNfts] = useState<boolean>(false);
  const { userInfo, wallet } = useAuth();
  const configStore = useConfigStore();
  const nftsStore = useNftsStore();

  const onSelectCollection = (collection: any) => {
    setCollection(collection);
  };
  const onSelectNft = (nft: any) => {
    setNft({ id: nft.token.tokenId });
    setListPrice(0);
  };

  const fetchCollections = async () => {
    if (configStore.config?.nft_config) {
      setCollections(configStore.config.nft_config);
      setCollection(configStore.config.nft_config[0]);
      return;
    }
    setLoadingCollections(true);
    try {
      const res = await axiosInstance.get(`/api/v1/config`);
      setCollections(res.data.data.nft_config);
      setCollection(res.data.data.nft_config[0]);
      configStore.set({ config: res.data.data });
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadingCollections(false);
    }
  };

  const fetchNfts = async () => {
    nftsStore.set({
      refresher: nftsStore.refresher + 1
    });
    return;
    try {
      if (!collection.address) {
        setNfts([]);
        return;
      }
      const address = wallet?.address;
      if (!address) {
        setNfts([]);
        return;
      }
      const ethereumProvider = await wallet?.getEthereumProvider();
      if (!ethereumProvider) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereumProvider);
      const nftCollectionContract = new ethers.Contract(
        collection.address as `0x${string}`,
        nftAbi as any,
        provider
      );
      // Method 1: Using viem's readContract for single calls
      const balanceOfResult = await nftCollectionContract.balanceOf(address);
      let balance = Number(balanceOfResult);
      if (!balance) {
        setNfts([]);
        return;
      }
      console.log("User NFT balance:", balance);
      // Method 2: Using viem's multicall for batch reading
      // Create contracts array for multicall
      const ownerResults: any[] = [];
      while (balance > 0) {
        const tokenOfOwnerByIndex =
          await nftCollectionContract.tokenOfOwnerByIndex(address, balance - 1);
        ownerResults.push(tokenOfOwnerByIndex);
        balance--;
      }
      const _nfts = ownerResults
        .filter((nft: any) => Number(nft) > 0)
        .map((nft: any) => {
          return {
            token: {
              tokenId: Number(nft),
              contract: collection.address
            }
          };
        });
      if (_nfts.length > 0) {
        setNfts(_nfts);
        setNft(_nfts[0]);
      } else {
        setNfts([]);
      }
    } catch (error) {
      console.log("error", error);
      setNfts([]);
    } finally {
    }
  };

  useEffect(() => {
    setChains(mock);
    setChain(mock[0]);
    fetchCollections();
  }, []);

  useEffect(() => {
    if (collection?.address && userInfo?.user) {
      fetchNfts();
    } else {
      setNfts([]);
    }
  }, [collection, userInfo]);

  useEffect(() => {
    if (nftsStore.nfts.length > 0 && collection?.address) {
      const _nfts = nftsStore.nfts.filter(
        (nft) =>
          nft.token.contract.toLowerCase() ===
          collection?.address?.toLowerCase()
      );
      // const _nfts = [];

      const nft = _nfts[0];

      if (nft) {
        setNft({
          id: nft.token.tokenId
        });
      } else {
        setNft(null);
      }
      setNfts(_nfts);
    }
  }, [nftsStore.nfts]);

  return {
    chains,
    chain,
    collections,
    onSelectCollection,
    nfts,
    collection,
    onSelectNft,
    nft,
    setNft,
    loadingCollections,
    listPrice,
    setListPrice,
    loadingNfts: nftsStore.loading,
    fetchNfts
  };
}
