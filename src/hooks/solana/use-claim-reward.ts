import { useState } from "react";
import { BASE_TOKEN, QUOTE_TOKEN } from "@/config/btc";
import useToast from "@/hooks/use-toast";
import reportHash from "@/utils/report-hash";
import * as anchor from "@coral-xyz/anchor";
import useProgram from "./use-program";
import { getState, getPool, getAccountsInfo } from "./helpers";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { useSolanaWallets } from "@privy-io/react-auth";
import {
  PublicKey,
  Transaction,
  TransactionInstruction
} from "@solana/web3.js";
import { sendSolanaTransaction } from "@/utils/transaction/send-solana-transaction";
import config from "@/config/solana";

export default function useClaimReward({
  onClaimSuccess
}: {
  onClaimSuccess?: () => void;
}) {
  const [claiming, setClaiming] = useState(false);
  const { wallets } = useSolanaWallets();
  const toast = useToast();
  const { program, provider } = useProgram();
  const onClaim = async (orderId: number) => {
    if (!wallets.length || !orderId || claiming) {
      return;
    }
    const payer = wallets[0];
    let toastId = toast.loading({ title: "Claiming..." });
    try {
      setClaiming(true);
      const state = getState(program);
      console.log("poolId:", orderId);
      const poolIdBN = new anchor.BN(orderId);
      const pool = await getPool(program, provider, state.pda, poolIdBN);

      const [userBaseAccount, poolBaseAccount] = await getAccountsInfo([
        [BASE_TOKEN.address, payer.address],
        [BASE_TOKEN.address, pool.pda.toString()]
      ]);

      let claimRewardAccounts = {
        dollaState: state.pda,
        poolState: pool.pda,
        baseMint: new PublicKey(BASE_TOKEN.address),
        userBaseAccount: userBaseAccount?.address,
        poolBaseAccount: poolBaseAccount?.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        user: new PublicKey(payer.address),
        systemProgram: anchor.web3.SystemProgram.programId
      };
      const tx: TransactionInstruction = await program.methods
        .claimReward()
        .accounts(claimRewardAccounts)
        .instruction();
      const batchTx = new Transaction();

      if (userBaseAccount?.instruction) {
        batchTx.add(userBaseAccount.instruction);
      }
      if (poolBaseAccount?.instruction) {
        batchTx.add(poolBaseAccount.instruction);
      }

      batchTx.add(tx);

      batchTx.feePayer = new PublicKey(config.operator);
      // Get the latest blockhash
      batchTx.recentBlockhash = "11111111111111111111111111111111";

      // const signedTx = await signTransaction({
      //   transaction: tx,
      //   connection: provider.connection
      // });

      // const receipt = await sendTransaction({
      //   transaction: batchTx,
      //   connection: provider.connection
      // });
      const result = await sendSolanaTransaction(batchTx, "claimReward");
      console.log("receipt:", result);
      // Report hash for tracking
      const slot = await provider.connection.getSlot();
      reportHash({
        chain: "solana",
        user: payer.address,
        hash: result.data.data.hash,
        block_number: slot
      });
      toast.dismiss(toastId);
      toast.success({ title: "Claim successfully" });
      onClaimSuccess?.();
    } catch (error: any) {
      console.error("Create error:", error);
      toast.dismiss(toastId);
      toast.fail({ title: "Claim failed", text: error?.message });
      throw error;
    } finally {
      setClaiming(false);
    }
  };

  return {
    claiming,
    onClaim
  };
}
