import { useState } from "react";
import useToast from "@/hooks/use-toast";
import reportHash from "@/utils/report-hash";
import * as anchor from "@coral-xyz/anchor";
import useProgram from "./use-program";
import { getState, getPool, buildTxWithGas, getAccountsInfo } from "./helpers";
import { useSolanaWallets } from "@privy-io/react-auth";
import {
  PublicKey,
  Transaction,
  TransactionInstruction
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { sendSolanaTransaction } from "@/utils/transaction/send-solana-transaction";
import config from "@/config/solana";
import { BASE_TOKEN, PAID_TOKEN, QUOTE_TOKEN } from "@/config/btc";

export default function useMarkCancel({
  onCancelSuccess
}: {
  onCancelSuccess?: () => void;
}) {
  const [canceling, setCanceling] = useState(false);
  const { wallets } = useSolanaWallets();
  const toast = useToast();
  const { program, provider } = useProgram();

  const onRevertCancel = async (orderId: number) => {
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

      const [userPaidAccount, operatorPaidAccount] = await getAccountsInfo([
        [PAID_TOKEN.address, payer.address],
        [PAID_TOKEN.address, config.operator]
      ]);

      let cancelPoolAccounts = {
        dollaState: state.pda,
        poolState: pool.pda,
        paidMint: PAID_TOKEN.address,
        userPaidAccount: userPaidAccount.address,
        operatorPaidAccount: operatorPaidAccount.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        user: new PublicKey(payer.address),
        operator: new PublicKey(config.operator),
        systemProgram: anchor.web3.SystemProgram.programId
      };
      const otherTxs: any = [];

      if (userPaidAccount?.instruction) {
        otherTxs.push(userPaidAccount.instruction);
      }
      if (operatorPaidAccount?.instruction) {
        otherTxs.push(operatorPaidAccount.instruction);
      }

      const cancelTx: TransactionInstruction = await program.methods
        .cancelCancelPool(new anchor.BN(100000))
        .accounts(cancelPoolAccounts)
        .instruction();

      const { transaction: tx, gas } = await buildTxWithGas({
        tx: cancelTx,
        otherTxs: otherTxs,
        action: "cancelCancel"
      });

      const cancelTxWithGas: TransactionInstruction = await program.methods
        .cancelCancelPool(new anchor.BN(gas))
        // @ts-ignore
        .accounts(cancelPoolAccounts)
        .instruction();

      tx.add(cancelTxWithGas);

      const simulationResult = await provider.connection.simulateTransaction(
        tx
      );
      console.log("cancel:", simulationResult);

      const result = await sendSolanaTransaction(tx, "cancelCancel");
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
    onRevertCancel
  };
}
