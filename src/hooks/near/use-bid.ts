import axiosInstance from "@/libs/axios";
import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import useGenerateKey from "@/hooks/near/use-generate-key";
import { KeyPair } from "near-api-js";
import { viewMethod } from "./util";
import { QUOTE_TOKEN } from "@/config/btc";

export default function useBid(
  poolId: number,
  onSuccess: (result: any) => void,
  onTxSuccess: () => void,
  onTxFail: () => void
) {
  const [biding, setBiding] = useState(false);
  const { address, updateNearAccount } = useAuth();
  const { generateKeyPair } = useGenerateKey();

  // Function to sign a message using NEAR private key
  const signMessage = async (
    message: string,
    privateKey: any
  ): Promise<string | null> => {
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

  const onBid = async (times: number) => {
    // onTxSuccess();

    // setTimeout(() => {
    //   onSuccess({
    //     bid: {
    //       id: 1,
    //       status: 1,
    //       times: times,
    //       created_at: Date.now()
    //     }
    //   });
    // }, 3000);

    // return;
    if (!address) return;
    const { publicKey, privateKey } = await generateKeyPair();
    if (!publicKey) return;
    setBiding(true);

    // let toastId = toast.loading({ title: "Bidding..." });
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
        deadline: String(Date.now() + 1000 * 60 * 60 * 24),
        game_id: poolId,
        nonce: res.nonce,
        bet_token: { FT: QUOTE_TOKEN.address },
        gas_token: { FT: QUOTE_TOKEN.address },
        user_id: {
          Evm: address.slice(2).toLowerCase()
        }
      };

      // Sign the payload using NEAR private key
      const payloadString = JSON.stringify(payload);
      console.log("payloadString", payloadString);

      const signature = await signMessage(
        payloadString + random_seed,
        privateKey
      );
      console.log("signature", signature, payloadString + random_seed);

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

      let count = 0;

      const loopBidData = async () => {
        const result = await axiosInstance.get(
          `/api/v1/user/bid/data/detail?id=${response.data.data}`
        );
        if (result.data.data?.tx_hash) {
          loopBidResult(result.data.data.tx_hash);
          return;
        }
        if (count > 30) {
          clearTimeout(window.bidDataTimer);
          setBiding(false);
          onTxFail();
          return;
        }
        if (window.bidDataTimer) {
          clearTimeout(window.bidDataTimer);
        }
        count++;
        window.bidDataTimer = setTimeout(loopBidData, 1000);
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
          updateNearAccount();
          return;
        }
        if (window.bidResultTimer) {
          clearTimeout(window.bidResultTimer);
        }
        window.bidResultTimer = setTimeout(() => {
          loopBidResult(hash);
        }, 1000);
      };

      loopBidData();

      // toast.dismiss(toastId);
      // toast.success({ title: "Bid success" });
    } catch (error) {
      setBiding(false);
      // toast.dismiss(toastId);
      // toast.fail({
      //   title: "Bid failed",
      //   description:
      //     error instanceof Error ? error.message : "Unknown error occurred"
      // });
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
