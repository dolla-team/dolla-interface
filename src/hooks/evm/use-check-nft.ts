import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth";
import nftAbi from "@/config/abis/evm-nft";

export default function useCheckNft(nft: any) {
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const { wallet } = useAuth();

  const checkNft = async () => {
    if (!nft || !wallet) return;
    try {
      setLoading(true);
      const ethereumProvider = await wallet.getEthereumProvider();
      const provider = new ethers.providers.Web3Provider(ethereumProvider);
      const contract = new ethers.Contract(nft.address, nftAbi, provider);
      const owner = await contract.ownerOf(nft.token_id);

      setIsOwner(owner.toLowerCase() === wallet.address.toLowerCase());
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nft?.address && nft?.token_id) checkNft();
  }, [nft]);

  return { loading, isOwner };
}
