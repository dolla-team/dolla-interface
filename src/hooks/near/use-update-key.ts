import axiosInstance from "@/libs/axios";
import useGenerateKey from "@/hooks/near/use-generate-key";
import { KeyPair } from "near-api-js";
import { viewMethod } from "./util";
import { QUOTE_TOKEN } from "@/config/btc";
import { useAuth } from "@/contexts/auth";

export default function useUpdateKey() {
  const { generateKeyPair } = useGenerateKey();
  const { address } = useAuth();

  // Function to sign a message using NEAR private key
  const signMessage = async (
    message: string,
    privateKey: string
  ): Promise<string | null> => {
    try {
      // Create KeyPair from private key (add ed25519: prefix if not present)
      const fullPrivateKey = privateKey.startsWith("ed25519:")
        ? privateKey
        : `ed25519:${privateKey}`;
      const keyPair = KeyPair.fromString(fullPrivateKey as any);

      // Convert message to buffer for signing
      const messageBuffer = Buffer.from(message);

      // Sign the message
      const signature = keyPair.sign(messageBuffer);
      console.log(
        "signature",
        Buffer.from(signature.signature).toString("hex")
      );
      // Return signature as hex string
      return Buffer.from(signature.signature).toString("hex");
    } catch (error) {
      console.error("Error signing message:", error);
      return null;
    }
  };

  const onUpdateKey = async () => {
    if (!address) return;
    try {
      const res = await viewMethod({
        method: "get_account",
        args: { user_id: { Evm: address.replace(/^0x/, "").toLowerCase() } }
      });

      const { privateKey, publicKey } = await generateKeyPair();

      const payload = {
        ak: publicKey,
        nonce: res.nonce,
        gas_token: { FT: QUOTE_TOKEN.address },
        deadline: String(Date.now() + 1000 * 60 * 60),
        user_id: {
          Evm: address.slice(2).toLowerCase()
        }
      };

      // Sign the payload using NEAR private key
      const payloadString = JSON.stringify(payload);
      console.log("payloadString", payloadString);

      const signature = await signMessage(payloadString, privateKey);
      console.log("signature", signature, payloadString);

      const response = await axiosInstance.post(`/api/v1/user/bid/data`, {
        payload: payloadString,
        signature: signature || ""
      });

      console.log("response", response);

      if (!response.data.data) {
        throw new Error("Update key failed");
      }
    } catch (error) {}
  };

  return {
    onUpdateKey
  };
}
