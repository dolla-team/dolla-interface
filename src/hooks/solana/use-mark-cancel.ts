import { useState } from "react";
import useToast from "@/hooks/use-toast";
import reportHash from "@/utils/report-hash";
import * as anchor from "@coral-xyz/anchor";
import useProgram from "./use-program";
import { getState, getPool, wrapTxWithBugetFee } from "./helpers";
import { useSolanaWallets } from "@privy-io/react-auth";
import {
  PublicKey,
  Transaction,
  TransactionInstruction
} from "@solana/web3.js";
import { sendSolanaTransaction } from "@/utils/transaction/send-solana-transaction";
import config from "@/config/solana";

export default function useMarkCancel({
  onCancelSuccess
}: {
  onCancelSuccess?: () => void;
}) {
  const [canceling, setCanceling] = useState(false);
  const { wallets } = useSolanaWallets();
  const toast = useToast();
  const { program, provider } = useProgram();

  const onMarkCancel = async (orderId: number) => {
    if (canceling) {
      return;
    }
    if (!wallets.length || !orderId) {
      return;
    }
    const payer = wallets[0];
    let toastId = toast.loading({ title: "Canceling..." });
    try {
      console.log("onCancel", orderId);
      setCanceling(true);
      const state = getState(program);
      const poolIdBN = new anchor.BN(orderId);
      const pool = await getPool(program, provider, state.pda, poolIdBN);

      const batchTx = new Transaction();

      let cancelPoolAccounts = {
        dollaState: state.pda,
        poolState: pool.pda,
        user: new PublicKey(payer.address),
        systemProgram: anchor.web3.SystemProgram.programId
      };
      const tx: TransactionInstruction = await program.methods
        .markCancelPool()
        .accounts(cancelPoolAccounts)
        .instruction();

      batchTx.feePayer = new PublicKey(config.operator);
      batchTx.recentBlockhash = "11111111111111111111111111111111";

      const txs = await wrapTxWithBugetFee(batchTx);

      batchTx.add(...txs);
      batchTx.add(tx);

      const simulationResult = await provider.connection.simulateTransaction(
        batchTx
      );
      console.log("cancel:", simulationResult);

      const result = await sendSolanaTransaction(batchTx, "markCancel");
      console.log("receipt:", result);
      toast.dismiss(toastId);
      toast.success({ title: "Canceled" });
      // Report hash for tracking
      const slot = await provider.connection.getSlot();
      reportHash({
        chain: "solana",
        user: payer.address,
        hash: result.data.data.hash,
        block_number: slot
      });

      onCancelSuccess?.();
    } catch (error) {
      console.error("Create error:", error);
      toast.dismiss(toastId);
      toast.fail({ title: "Cancel failed" });
      throw error;
    } finally {
      setCanceling(false);
    }
  };

  return {
    canceling,
    onMarkCancel
  };
}
