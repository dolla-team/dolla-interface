import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import nftAbi from "@/config/abis/evm-nft";
import useToast from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import useGelatonetwork from "@/hooks/evm/use-gelatonetwork";

export default function useMintNft(
  nftAddress?: string,
  onSuccess?: () => void
) {
  const [minting, setMinting] = useState(false);
  const { wallet, address } = useAuth();
  const [minted, setMinted] = useState(false);
  const [mintedLoading, setMintedLoading] = useState(false);
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
            setMinted(true);
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

  const checkMinted = async () => {
    if (
      nftAddress?.toLocaleLowerCase() ===
      "0x2b517b73555598f0b1a0985a04c8cf76d5f54e8b"
    ) {
      setMinted(true);
      return;
    }
    try {
      const ethereumProvider = await wallet?.getEthereumProvider();

      if (!ethereumProvider || !nftAddress) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereumProvider);
      const signer = provider.getSigner();

      const NftContract = new Contract(nftAddress, nftAbi, signer);

      // const res = await NftContract.ownerOf(0);
      // console.log(res);
      const balance = await NftContract.balanceOf(address);
      setMinted(balance.gt(0));
    } catch (error) {
      console.error(error);
    } finally {
      setMintedLoading(false);
    }
  };

  useEffect(() => {
    if (address && nftAddress) {
      checkMinted();
    }
  }, [address, nftAddress]);

  return { mintNft, minting, minted, mintedLoading };
}
