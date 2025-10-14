import { useState } from "react";
import { getProvider, viewMethod, getNonce } from "./util";
import { transactions } from "near-api-js";
import { PublicKey } from "near-api-js/lib/utils/key_pair";
import useGenerateKey from "@/hooks/near/use-generate-key";
import { functionCall } from "near-api-js/lib/transaction";
import { base_decode } from "near-api-js/lib/utils/serialize";
import { QUOTE_TOKEN } from "@/config/btc";
import useToast from "../use-toast";
import reportHash from "@/utils/report-hash";
import { useAuth } from "@/contexts/auth";

const THIRTY_TGAS = "300000000000000";
export default function useGameAction({
  gameId,
  onPauseSuccess,
  onResumeSuccess,
  onCancelSuccess
}: {
  gameId?: string;
  onPauseSuccess?: () => void;
  onResumeSuccess?: () => void;
  onCancelSuccess?: () => void;
}) {
  const { generateKeyPair } = useGenerateKey();
  const [resuming, setResuming] = useState(false);
  const [pausing, setPausing] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const toast = useToast();
  const { address } = useAuth();

  async function pauseGame() {
    const { publicKey, keyPairSigner } = await generateKeyPair();
    if (!publicKey) return;
    let toastId = toast.loading({ title: "Pausing game..." });
    try {
      setPausing(true);

      const provider = getProvider();
      const { header } = await provider.block({ finality: "final" });

      const gameArgs = { game_args: { ByAk: { game_id: Number(gameId) } } };

      const nonce = await getNonce(publicKey);

      const transaction = transactions.createTransaction(
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        PublicKey.from(publicKey),
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        nonce,
        [functionCall("pause_game", gameArgs, BigInt(THIRTY_TGAS), BigInt(0))],
        base_decode(header.hash)
      );

      console.log("transaction:", transaction);

      const [, signedTransaction] = await keyPairSigner.signTransaction(
        transaction
      );

      console.log("signedTransaction:", signedTransaction);

      const result: any = await provider.sendTransaction(signedTransaction);

      toast.dismiss(toastId);

      reportHash({
        hash: result.transaction.hash,
        chain: "near",
        user: address
      });

      if (result.status.SuccessValue) {
        console.log("success:", result);
        toast.success({ title: "Paused game successfully" });
        onPauseSuccess?.();
      } else {
        console.log("fail:", result);
        toast.fail({ title: "Paused game failed" });
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.fail({ title: "Paused game failed" });
    } finally {
      setPausing(false);
    }
  }

  async function resumeGame() {
    const { publicKey, keyPairSigner } = await generateKeyPair();
    if (!publicKey) return;
    let toastId = toast.loading({ title: "Resuming game..." });
    try {
      setResuming(true);

      const provider = getProvider();
      const { header } = await provider.block({ finality: "final" });

      const gameArgs = {
        game_args: {
          ByAk: { game_id: Number(gameId), token: { FT: QUOTE_TOKEN.address } }
        }
      };
      const nonce = await getNonce(publicKey);

      const transaction = transactions.createTransaction(
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        PublicKey.from(publicKey),
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        nonce,
        [functionCall("resume_game", gameArgs, BigInt(THIRTY_TGAS), BigInt(0))],
        base_decode(header.hash)
      );

      const [, signedTransaction] = await keyPairSigner.signTransaction(
        transaction
      );

      const result: any = await provider.sendTransaction(signedTransaction);

      reportHash({
        hash: result.transaction.hash,
        chain: "near",
        user: address
      });

      toast.dismiss(toastId);
      if (result.status.SuccessValue) {
        console.log("success:", result);
        toast.success({ title: "Resumed game successfully" });
        onResumeSuccess?.();
      } else {
        toast.fail({ title: "Resumed game failed" });
        console.log("fail:", result);
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.fail({ title: "Resumed game failed" });
    } finally {
      setResuming(false);
    }
  }

  async function cancelGame() {
    const { publicKey, keyPairSigner } = await generateKeyPair();
    if (!publicKey) return;
    let toastId = toast.loading({ title: "Canceling game..." });
    try {
      setCanceling(true);

      const provider = getProvider();
      const { header } = await provider.block({ finality: "final" });

      const gameArgs = {
        game_args: {
          ByAk: { game_id: Number(gameId), token: { FT: QUOTE_TOKEN.address } }
        }
      };
      const nonce = await getNonce(publicKey);
      const transaction = transactions.createTransaction(
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        PublicKey.from(publicKey),
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        nonce,
        [functionCall("cancel_game", gameArgs, BigInt(THIRTY_TGAS), BigInt(0))],
        base_decode(header.hash)
      );

      const [, signedTransaction] = await keyPairSigner.signTransaction(
        transaction
      );

      const result: any = await provider.sendTransaction(signedTransaction);

      reportHash({
        hash: result.transaction.hash,
        chain: "near",
        user: address
      });

      toast.dismiss(toastId);
      if (result.status.SuccessValue) {
        console.log("success:", result);
        toast.success({ title: "Canceled game successfully" });
        onCancelSuccess?.();
      } else {
        console.log("fail:", result);
        toast.fail({ title: "Canceled game failed" });
      }

      return result;
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.fail({ title: "Canceled game failed" });
    } finally {
      setCanceling(false);
    }
  }

  async function getAllGames() {
    const res = await viewMethod({
      method: "list_games",
      args: {}
    });

    return res;
  }

  return {
    pauseGame,
    resumeGame,
    cancelGame,
    getAllGames,
    pausing,
    resuming,
    canceling
  };
}
