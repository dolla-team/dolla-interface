import axiosInstance from "@/libs/axios";
import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { useNearKeyStore } from "@/stores/use-near-key";
import useToast from "@/hooks/use-toast";
import { KeyPair } from "near-api-js";
import { viewMethod } from "./util";

export default function useBid(
  poolId: number,
  onSuccess: (result: any) => void,
  onTxSuccess: () => void,
  onTxFail: () => void
) {
  const [biding, setBiding] = useState(false);
  const { address } = useAuth();
  const { privateKey } = useNearKeyStore();
  const toast = useToast();

  // Function to sign a message using NEAR private key
  const signMessage = (message: string): string | null => {
    if (!privateKey) {
      console.error("Private key not available");
      return null;
    }

    try {
      // Create KeyPair from private key (add ed25519: prefix if not present)
      const fullPrivateKey = privateKey.startsWith("ed25519:")
        ? privateKey
        : `ed25519:${privateKey}`;
      const keyPair = KeyPair.fromString(fullPrivateKey);

      // Convert message to buffer for signing
      const messageBuffer = Buffer.from(message);

      // Sign the message
      const signature = keyPair.sign(messageBuffer);

      // Return signature as hex string
      return Buffer.from(signature.signature).toString("hex");
    } catch (error) {
      console.error("Error signing message:", error);
      return null;
    }
  };

  const onBid = async (times: number) => {
    if (!address) return;
    setBiding(true);

    let toastId = toast.loading({ title: "Bidding..." });
    try {
      const res = await viewMethod({
        method: "get_account",
        args: { user_id: { Evm: address.replace(/^0x/, "").toLowerCase() } }
      });
      const random_seed = Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");

      const payload = {
        bets: times,
        deadline: Date.now() + 1000 * 60 * 60 * 24,
        game_id: poolId,
        nonce: res.nonce,
        user_id: {
          Evm: address.slice(2).toLowerCase()
        }
      };

      // Sign the payload using NEAR private key
      const payloadString = JSON.stringify(payload);
      const signature = signMessage(payloadString + random_seed);
      console.log(
        "signature",
        signature,
        random_seed,
        payloadString + random_seed
      );

      const response = await axiosInstance.post(`/api/v1/user/bid/data`, {
        payload: payloadString,
        random_seed,
        user_signature: signature || ""
      });
      onTxSuccess();
      console.log("response", response);

      if (!response.data.data) {
        throw new Error("Bid failed");
      }

      const loopBidData = async () => {
        const result = await axiosInstance.get(
          `/api/v1/user/bid/data/detail?id=${response.data.data}`
        );
        if (result.data.data?.tx_hash) {
          loopBidResult(result.data.data.tx_hash);
        } else {
          if (window.bidDataTimer) {
            clearTimeout(window.bidDataTimer);
          }
          window.bidDataTimer = setTimeout(loopBidData, 1000);
        }
      };

      const loopBidResult = async (hash: string) => {
        const bidResponse = await axiosInstance.get(
          `/api/v1/user/prize/bid?hash=${hash}`
        );
        if (
          bidResponse.data.data.bid !== null &&
          bidResponse.data.data.bid.status !== 0
        ) {
          console.timeEnd("bid time");
          console.timeEnd("bid loop");
          console.log("bidResponse", bidResponse.data.data);
          // bidResponse.data.data.bid.is_winner = true;
          onSuccess(bidResponse.data.data);

          return;
        }
        if (window.bidResultTimer) {
          clearTimeout(window.bidResultTimer);
        }
        window.bidResultTimer = setTimeout(loopBidResult, 1000);
      };

      loopBidData();

      toast.dismiss(toastId);
      toast.success({ title: "Bid success" });
    } catch (error) {
      setBiding(false);
      toast.dismiss(toastId);
      toast.fail({
        title: "Bid failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred"
      });
      onTxFail();
    } finally {
      setBiding(false);
    }
  };

  return {
    biding,
    onBid,
    signMessage
  };
}
