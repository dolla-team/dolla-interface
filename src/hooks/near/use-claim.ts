import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { getNonce, getProvider, quote } from "./util";
import { KeyPairSigner, transactions } from "near-api-js";
import { PublicKey } from "near-api-js/lib/utils/key_pair";
import { functionCall } from "near-api-js/lib/transaction";
import { base_decode } from "near-api-js/lib/utils/serialize";
import { useNearKeyStore } from "@/stores/use-near-key";
const THIRTY_TGAS = "300000000000000";

export default function useClaim() {
  const [loading, setLoading] = useState(false);
  const { publicKey, privateKey } = useNearKeyStore();

  const keyPairSigner = useMemo(() => {
    return KeyPairSigner.fromSecretKey(("ed25519:" + privateKey) as any);
  }, [privateKey]);

  async function claim({
    gameId,
    swapType = "EXACT_INPUT",
    evmAddress,
    slippageTolerance = 50,
    originAsset,
    depositType = "ORIGIN_CHAIN",
    destinationAsset,
    amount,
    refundTo,
    refundType = "ORIGIN_CHAIN",
    recipientType = "DESTINATION_CHAIN",
    referral = "referral",
    quoteWaitingTimeMs = 3000
  }: {
    gameId: string;
    swapType?: string;
    evmAddress?: string;
    slippageTolerance?: number;
    originAsset: string;
    depositType?: string;
    destinationAsset: string;
    amount: string;
    refundTo: string;
    refundType?: string;
    recipientType?: string;
    referral?: string;
    quoteWaitingTimeMs?: number;
  }) {
    try {
      setLoading(true);
      const body = {
        dry: false,
        swapType,
        slippageTolerance,
        originAsset,
        depositType,
        destinationAsset,
        amount,
        refundTo: refundTo || import.meta.env.VITE_NEAR_ACCOUNT_ID,
        refundType,
        recipient: evmAddress,
        recipientType,
        deadline: dayjs().add(1, "hour").toISOString(),
        referral,
        quoteWaitingTimeMs
      };

      const data = await quote(body);

      if (data && keyPairSigner) {
        const depositAddress = data.quote.depositAddress;
        const provider = getProvider();
        const { header } = await provider.block({ finality: "final" });

        const args = {
          game_args: {
            ByAk: {
              game_id: Number(gameId),
              recipient_account: depositAddress
            }
          }
        };

        const nonce = await getNonce(publicKey);

        const transaction = transactions.createTransaction(
          import.meta.env.VITE_NEAR_ACCOUNT_ID,
          PublicKey.from(publicKey),
          import.meta.env.VITE_NEAR_ACCOUNT_ID,
          nonce,
          [functionCall("claim_prize", args, BigInt(THIRTY_TGAS), BigInt(0))],
          base_decode(header.hash)
        );

        const [, signedTransaction] = await keyPairSigner.signTransaction(
          transaction
        );

        const result: any = await provider.sendTransaction(signedTransaction);

        if (result.status.SuccessValue) {
          console.log("success:", result);
        } else {
          console.log("fail:", result);
        }

        return result;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function refund({ gameId }: { gameId: string }) {
    if (!keyPairSigner) {
      return;
    }

    try {
      const provider = getProvider();
      const { header } = await provider.block({ finality: "final" });

      const args = {
        game_args: {
          ByAk: {
            game_id: Number(gameId)
          }
        }
      };

      const nonce = await getNonce(publicKey);

      const transaction = transactions.createTransaction(
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        PublicKey.from(publicKey),
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        nonce,
        [functionCall("refund_bet", args, BigInt(THIRTY_TGAS), BigInt(0))],
        base_decode(header.hash)
      );

      const [, signedTransaction] = await keyPairSigner.signTransaction(
        transaction
      );

      const result: any = await provider.sendTransaction(signedTransaction);

      if (result.status.SuccessValue) {
        console.log("success:", result);
      } else {
        console.log("fail:", result);
      }

      return result;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    claim,
    loading,
    refund
  };
}
