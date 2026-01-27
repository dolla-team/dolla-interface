import { ethers } from "ethers";
import { useSignMessage as usePrivySignMessage } from "@privy-io/react-auth";

export default function useSignMessage({ privyEvmWallet, chainType }: any) {
  const { signMessage: privySignMessage } = usePrivySignMessage()
  const signMessage = async (message: string, isContract = false) => {
    console.log('signing message', chainType)
    if (chainType === "Evm") {
      // Use MetaMask for signing
      const ethereumProvider = await (
        privyEvmWallet as any
      ).getEthereumProvider();
      if (!ethereumProvider) {
        throw new Error("Failed to get Ethereum provider");
      }
      const provider = new ethers.providers.Web3Provider(ethereumProvider);
      const signer = provider.getSigner();
      return await signer.signMessage(message);
    } else if (chainType === "solana") {
      const encodedMessage = new TextEncoder().encode(message);

      // Sign message with Solana wallet

      const signResult = await (window as any).solana?.signMessage(
        encodedMessage
      );

      // Handle different signature formats
      // Privy Solana wallet may return signature as Uint8Array or base58 string
      if (typeof signResult === "string") {
        return signResult;
      } else if (signResult?.signature) {
        // If it's an object with signature property
        const sig = signResult.signature;
        return typeof sig === "string"
          ? sig
          : isContract
          ? Buffer.from(sig).toString("hex")
          : Buffer.from(sig).toString("base64");
      } else if (signResult instanceof Uint8Array) {
        // Convert Uint8Array to base64 string
        return isContract
          ? Buffer.from(signResult).toString("hex")
          : Buffer.from(signResult).toString("base64");
      } else {
        throw new Error("Unexpected signature format from Solana wallet");
      }
    } else {
      // Use Privy embedded wallet for signing
      const { signature: privySignature } = await privySignMessage({
        message,
      })
      return privySignature
    }
  };

  return signMessage;
}
