import { useState } from "react";
import { getNonce, getProvider } from "./util";
import { transactions } from "near-api-js";
import { PublicKey } from "near-api-js/lib/utils/key_pair";
import { functionCall } from "near-api-js/lib/transaction";
import { base_decode } from "near-api-js/lib/utils/serialize";
import useGenerateKey from "@/hooks/near/use-generate-key";
import Big from "big.js";
import useToast from "@/hooks/use-toast";
import { BASE_TOKEN } from "@/config/btc";
import { BET_UNIT } from "@/config";
import reportHash from "@/utils/report-hash";
import { useAuth } from "@/contexts/auth";

const THIRTY_TGAS = "300000000000000";

export default function useCreate(onSuccess: (id: string) => void) {
  const [loading, setLoading] = useState(false);
  const { generateKeyPair } = useGenerateKey();
  const toast = useToast();
  const { address } = useAuth();

  async function create({ amount, price }: { amount: string; price: number }) {
    try {
      const { publicKey, keyPairSigner } = await generateKeyPair();
      if (!publicKey) return;

      setLoading(true);

      const provider = getProvider();

      const { header } = await provider.block({ finality: "final" });

      const _amount = Big(amount)
        .mul(10 ** BASE_TOKEN.decimals)
        .toFixed(0);

      const args = {
        create_args: {
          ByAk: {
            amount: _amount,
            bid_unit: BET_UNIT,
            bep: Big(amount)
              .mul(10 ** 6)
              .mul(price)
              .toFixed(0),
            prize: { FT: BASE_TOKEN.address }
          }
        }
      };

      console.log("args:", args);

      const nonce = await getNonce(publicKey);
      const publicKeyObj = PublicKey.from(publicKey);

      const transaction = transactions.createTransaction(
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        publicKeyObj,
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        nonce,
        [functionCall("create_game", args, BigInt(THIRTY_TGAS), BigInt(0))],
        base_decode(header.hash)
      );

      const [, signedTransaction] = await keyPairSigner.signTransaction(
        transaction
      );
      console.log("signedTransaction:", signedTransaction);
      const result: any = await provider.sendTransaction(signedTransaction);
      console.log("result:", result);
      reportHash({
        hash: result.transaction.hash,
        chain: "near",
        user: address
      });

      if (result.status.SuccessValue) {
        toast.success({ title: "Create success" });
        // Decode base64 to string, then parse to number
        const decodedValue = Buffer.from(
          result.status.SuccessValue,
          "base64"
        ).toString("utf-8");
        const gameId = JSON.parse(decodedValue);
        onSuccess?.(gameId);
      } else {
        toast.fail({ title: "Create failed" });
      }
    } catch (error) {
      console.error("Create error:", error);
      toast.fail({ title: "Create failed" });
    } finally {
      setLoading(false);
    }
  }

  return {
    create,
    loading
  };
}
