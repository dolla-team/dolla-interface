import { useMemo, useState } from "react";
import { getNonce, getProvider } from "./util";
import { KeyPairSigner, transactions } from "near-api-js";
import { PublicKey } from "near-api-js/lib/utils/key_pair";
import { functionCall } from "near-api-js/lib/transaction";
import { base_decode } from "near-api-js/lib/utils/serialize";
import { useNearKeyStore } from "@/stores/use-near-key";
import Big from "big.js";
import useToast from "@/hooks/use-toast";
import { BASE_TOKEN } from "@/config/btc";
import { BET_UNIT } from "@/config";
const THIRTY_TGAS = "300000000000000";

export default function useCreate(onSuccess: () => void) {
  const [loading, setLoading] = useState(false);
  const { publicKey, privateKey } = useNearKeyStore();
  const toast = useToast();
  const keyPairSigner = useMemo(() => {
    if (!privateKey) {
      return null;
    }
    return KeyPairSigner.fromSecretKey(("ed25519:" + privateKey) as any);
  }, [privateKey]);

  async function create({ amount, price }: { amount: string; price: number }) {
    try {
      setLoading(true);

      if (!publicKey || !privateKey) {
        throw new Error(
          "Public key or private key is missing. Please generate key pair first."
        );
      }

      if (!keyPairSigner) {
        throw new Error(
          "KeyPairSigner is not available. Please generate key pair first."
        );
      }

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
            bep: Big(_amount).mul(price).toFixed(0),
            prize: { FT: BASE_TOKEN.address }
          }
        }
      };

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
      if (result.status.SuccessValue) {
        toast.success({ title: "Create success" });
        onSuccess?.();
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
