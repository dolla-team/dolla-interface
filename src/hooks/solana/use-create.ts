import { useState } from "react";
import { BASE_TOKEN, QUOTE_TOKEN } from "@/config/btc";
import useToast from "@/hooks/use-toast";
import reportHash from "@/utils/report-hash";
import * as anchor from "@coral-xyz/anchor";
import useProgram from "./use-program";
import {
  getState,
  getNextOrderId,
  getPool,
  getAccountsInfo,
  getWrapToSolIx,
  wrapTxWithBugetFee
} from "./helpers";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { useSolanaWallets } from "@privy-io/react-auth";
import { sendSolanaTransaction } from "@/utils/transaction/send-solana-transaction";

import {
  PublicKey,
  Transaction,
  TransactionInstruction
} from "@solana/web3.js";

export default function useCreate({
  amount,
  anchorPrice,
  onCreateSuccess
}: {
  amount: number;
  anchorPrice: number;
  onCreateSuccess?: (poolId: number) => void;
}) {
  const [creating, setCreating] = useState(false);
  const { wallets } = useSolanaWallets();
  const toast = useToast();
  const { program, provider } = useProgram();

  const onCreate = async () => {
    if (!wallets.length) {
      toast.fail({ title: "Please connect your wallet" });
      return;
    }
    const payer = wallets[0];
    let toastId = toast.loading({ title: "Creating market..." });
    try {
      setCreating(true);
      const state = getState(program);
      let baseAmount = new anchor.BN(amount * 10 ** BASE_TOKEN.decimals);
      let expectedQuoteAmount = new anchor.BN(
        anchorPrice * amount * 10 ** QUOTE_TOKEN.decimals
      );
      let nextOrderId = await getNextOrderId(program, state.pda);
      nextOrderId = new anchor.BN(nextOrderId);
      console.log("nextOrderId", nextOrderId.toNumber());
      const pool = await getPool(program, provider, state.pda, nextOrderId);

      const [userBaseAccount, poolBaseAccount] = await getAccountsInfo([
        [BASE_TOKEN.address, payer.address],
        [BASE_TOKEN.address, pool.pda.toString()]
      ]);

      // Ensure all accounts are properly defined

      // if (!userBaseAccount?.address || !poolBaseAccount?.address) {
      //   throw new Error("Failed to get associated token accounts");
      // }

      let wrapTx: any[] = [];
      if (
        BASE_TOKEN.address.toString() ==
        "So11111111111111111111111111111111111111112"
      ) {
        wrapTx = getWrapToSolIx(payer, userBaseAccount, expectedQuoteAmount);
      }

      let createPoolAccounts = {
        dollaState: state.pda,
        poolState: pool.pda,
        baseMint: new PublicKey(BASE_TOKEN.address),
        quoteMint: new PublicKey(QUOTE_TOKEN.address),
        userBaseAccount: userBaseAccount.address,
        poolBaseAccount: poolBaseAccount.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        user: new PublicKey(payer.address),
        systemProgram: anchor.web3.SystemProgram.programId,
        operator: new PublicKey(import.meta.env.VITE_SOLANA_OPERATOR)
      };

      const createIx: TransactionInstruction = await program.methods
        .createPool({
          baseAmount: baseAmount,
          expectedQuoteAmount: expectedQuoteAmount
        })
        .accounts(createPoolAccounts as any)
        .instruction();

      const tx = new Transaction();
      for (let i = 0; i < wrapTx.length; i++) {
        tx.add(wrapTx[i]);
      }
      if (userBaseAccount?.instruction) {
        tx.add(userBaseAccount.instruction);
      }
      if (poolBaseAccount?.instruction) {
        tx.add(poolBaseAccount.instruction);
      }

      tx.feePayer = new PublicKey(import.meta.env.VITE_SOLANA_OPERATOR);

      tx.recentBlockhash = "11111111111111111111111111111111";

      const txs = await wrapTxWithBugetFee(tx);

      tx.add(...txs);
      tx.add(createIx);

      const result = await sendSolanaTransaction(tx, "createPool");

      // console.log(151, provider.connection);
      // const receipt = await sendTransaction({
      //   transaction: tx,
      //   connection: provider.connection
      // });
      // console.log("receipt:", receipt);
      // Report hash for tracking
      // Extract pool ID from transaction logs or use nextOrderId
      const poolId = nextOrderId.toNumber();

      onCreateSuccess?.(poolId);
      toast.dismiss(toastId);
      toast.success({
        title: "Market created successfully"
      });

      const slot = await provider.connection.getSlot();
      reportHash({
        chain: "solana",
        user: payer.address,
        hash: result.data.data.hash,
        block_number: slot
      });
    } catch (error) {
      console.error("Create error:", error);
      toast.dismiss(toastId);
      toast.fail({
        title: "Create market failed"
      });
      throw error;
    } finally {
      setCreating(false);
    }
  };

  return {
    creating,
    onCreate
  };
}
