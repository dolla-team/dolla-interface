import { useState } from "react";
import { Contract, ethers } from "ethers";
import tokenAbi from "@/config/abis/evm-token";
import useToast from "@/hooks/use-toast";
import { useAuth } from '@/contexts/wallet'
import { TOKEN } from "@/config/btc";

export default function useMintBtc(onSuccess?: () => void) {
  const [minting, setMinting] = useState(false);
  const { wallet } = useAuth();
  const toast = useToast();
  const mintBtc = async () => {
    try {
      setMinting(true);

      const ethereumProvider = await wallet?.getEthereumProvider();
      if (!ethereumProvider) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereumProvider);
      const signer = provider.getSigner();

      const BTCContract = new Contract(TOKEN.address, tokenAbi, signer);
      const amount = ethers.utils.parseUnits("1000", TOKEN.decimals);
      console.log("amount", amount);
      const tx = await BTCContract.mint(amount);
      const receipt = await tx.wait();
      console.log(receipt);
      if (receipt.status === 0) {
        toast.fail({ title: "Mint BTC failed" });
        throw new Error("Mint BTC failed");
      }

      toast.success({ title: "Mint BTC success" });
      onSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      setMinting(false);
    }
  };

  return { mintBtc, minting };
}
