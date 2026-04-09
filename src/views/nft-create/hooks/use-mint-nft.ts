import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import nftAbi from "@/config/abis/evm-nft";
import useToast from "@/hooks/use-toast";
import { useAuth } from '@/contexts/wallet'
import useGelatonetwork from "@/hooks/evm/use-gelatonetwork";

export default function useMintNft(
  nftAddress?: string,
  onSuccess?: () => void
) {
  const [minting, setMinting] = useState(false);
  const [nftNumber, setNftNumber] = useState(0);
  const { wallet } = useAuth();

  const toast = useToast();
  const { executeTransaction } = useGelatonetwork();
  const mintNft = async () => {
    try {
      setMinting(true);

      const ethereumProvider = await wallet?.getEthereumProvider();
      if (!ethereumProvider || !nftAddress) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereumProvider);
      const signer = provider.getSigner();

      const NftContract = new Contract(nftAddress, nftAbi, signer);

      const tx = await NftContract.populateTransaction.safeMint();
      executeTransaction({
        calls: [tx],
        onSuccess: (receipt: any) => {
          console.log("receipt", receipt);
          setMinting(false);
          if (receipt?.status === 0) {
            toast.fail({ title: "Mint NFT failed" });
          } else {
            const tokenId = receipt.logs[0].topics[3];
            console.log("tokenId", Number(tokenId));
            toast.success({ title: "Mint NFT success" });
            onSuccess?.();
          }
        },
        onError: () => {
          toast.fail({ title: "Mint NFT failed" });
          setMinting(false);
        }
      });
    } catch (error) {
      console.error(error);
      setMinting(false);
    }
  };

  const fetchNftNumber = async () => {
    const ethereumProvider = await wallet?.getEthereumProvider();
    if (!ethereumProvider || !nftAddress) {
      return;
    }
    const provider = new ethers.providers.Web3Provider(ethereumProvider);
    const NftContract = new Contract(nftAddress, nftAbi, provider);
    const balance = await NftContract.balanceOf(wallet?.address);
    setNftNumber(Number(balance));
  };

  useEffect(() => {
    if (nftAddress && wallet) fetchNftNumber();
  }, [nftAddress, wallet]);

  return { mintNft, minting, nftNumber };
}
