import axiosInstance from "@/libs/axios";
import { useAuth } from "@/contexts/auth";
import useGenerateKey from "@/hooks/near/use-generate-key";
import { KeyPair } from "near-api-js";
import { viewMethod, getUserId } from "./util";
import { QUOTE_TOKEN } from "@/config/btc";
import useBtcDetailStore from "@/stores/use-btc-detail";


export default function useBid(
  poolId: number,
  onTxSuccess: (id: string) => void,
  onTxFail: () => void,
  onTxFail2: (msg?: string,args?: any) => void
) {
  const { address, chainType } = useAuth();
  const { generateKeyPair } = useGenerateKey();
  const btcDetailStore = useBtcDetailStore();

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
    // onTxSuccess("800");

    // setTimeout(() => {
    //   btcDetailStore.set({
    //     bidResult: {
    //       is_winner: false,
    //       winner_point: "10,10",
    //       winner_ticket: "0,0"
    //     },
    //     flipStatus: 4
    //   });
    // }, 3000);

    // return;

   
    if (!address) {
      onTxFail2();
      return;
    }
    const { publicKey, privateKey } = await generateKeyPair();

    if (!publicKey) {
      onTxFail2();
      return;
    }

    // let toastId = toast.loading({ title: "Bidding..." });
    try {
      const poolInfo = await viewMethod({
        method: "get_game",
        args: { game_id: poolId }
      });
      if(poolInfo?.status !== 0){
        let _status = 1;
        if(poolInfo?.status === 1){
          _status = 3;
        }else if(poolInfo?.status === 2){
          _status = 2;
        }
        onTxFail2("pool_status_changed",{status: _status});
        return;
      }
      const res = await viewMethod({
        method: "get_account",
        args: { user_id: getUserId(address, chainType) }
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
        user_id: getUserId(address, chainType)
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

      console.log("response", response);

      if (!response.data.data) {
        throw new Error("Bid failed");
      }

      onTxSuccess(response.data.data);

      let count = 0;

      const loopBidData = async () => {
        const result = await axiosInstance.get(
          `/api/v1/user/bid/data/detail?id=${response.data.data}`
        );
        if (result.data.data?.tx_hash) {
          btcDetailStore.set({ currentHash: result.data.data.tx_hash });
          window.bidResultTimer = setTimeout(() => {
            btcDetailStore.set({ currentHash: "" });
            onTxFail();
          }, 20000);
          return;
        }
        if (count > 30) {
          clearTimeout(window.bidDataTimer);
          onTxFail();
          return;
        }
        if (window.bidDataTimer) {
          clearTimeout(window.bidDataTimer);
        }
        count++;
        window.bidDataTimer = setTimeout(loopBidData, 1000);
      };

      loopBidData();

      // toast.dismiss(toastId);
      // toast.success({ title: "Bid success" });
    } catch (error) {
      // toast.dismiss(toastId);
      // toast.fail({
      //   title: "Bid failed",
      //   description:
      //     error instanceof Error ? error.message : "Unknown error occurred"
      // });
      console.log("bid error", error);
      onTxFail();
    }
  };

  return {
    onBid
  };
}
