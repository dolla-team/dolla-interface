import { useState } from "react";
import { QUOTE_TOKEN } from "@/config/btc";
import useToast from "@/hooks/use-toast";
import reportHash from "@/utils/report-hash";
import * as anchor from "@coral-xyz/anchor";
import useProgram from "./use-program";
import { getState, getAccountsInfo, wrapTxWithBugetFee } from "./helpers";
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

export default function useTransfer({
  token,
  isTicket,
  onTransferSuccess
}: {
  token: any;
  isTicket?: boolean;
  onTransferSuccess?: (amount: number) => void;
}) {
  const [transferring, setTransferring] = useState(false);
  const { wallets } = useSolanaWallets();
  const toast = useToast();
  const { program, provider } = useProgram();

  const onTransfer = async (amount: number, to: string) => {
    if (!wallets.length || !amount) {
      toast.fail({ title: "Please connect your wallet" });
      return;
    }
    const payer = wallets[0];
    try {
      setTransferring(true);
      const transferAmount = new anchor.BN(amount * 10 ** token.decimals);
      const state = getState(program);

      const [
        userTokenAccount,
        toTokenAccount,
        userPaidAccount,
        operatorPaidAccount
      ] = await getAccountsInfo([
        [token.address, payer.address],
        [token.address, to],
        [QUOTE_TOKEN.address, payer.address],
        [QUOTE_TOKEN.address, import.meta.env.VITE_SOLANA_OPERATOR]
      ]);

      let transferAccounts = {
        dollaState: state.pda,
        tokenMint: new PublicKey(token.address),
        paidMint: new PublicKey(QUOTE_TOKEN.address),
        userTokenAccount: userTokenAccount?.address,
        toTokenAccount: toTokenAccount?.address,
        userPaidAccount: userPaidAccount?.address,
        operatorPaidAccount: operatorPaidAccount?.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        user: new PublicKey(payer.address),
        toUser: new PublicKey(to),
        operator: new PublicKey(import.meta.env.VITE_SOLANA_OPERATOR),
        systemProgram: anchor.web3.SystemProgram.programId,
        splMemoProgram: new PublicKey(
          "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
        )
      };
      const params = isTicket
        ? [
            transferAmount,
            JSON.stringify({ type: "buy_ticket", address: payer.address })
          ]
        : [transferAmount];

      const tx: TransactionInstruction = await program.methods
        .transferHelper(...params)
        .accounts(transferAccounts)
        .instruction();
      const batchTx = new Transaction();

      if (userTokenAccount?.instruction) {
        batchTx.add(userTokenAccount.instruction);
      }
      if (toTokenAccount?.instruction) {
        batchTx.add(toTokenAccount.instruction);
      }
      if (userPaidAccount?.instruction) {
        batchTx.add(userPaidAccount.instruction);
      }
      if (operatorPaidAccount?.instruction) {
        batchTx.add(operatorPaidAccount.instruction);
      }

      batchTx.feePayer = new PublicKey(import.meta.env.VITE_SOLANA_OPERATOR);
      // Get the latest blockhash
      batchTx.recentBlockhash = "11111111111111111111111111111111";

      const txs = await wrapTxWithBugetFee(batchTx);

      batchTx.add(...txs);
      batchTx.add(tx);

      const result = await sendSolanaTransaction(batchTx, "transferHelper");
      console.log("receipt:", result);
      // Report hash for tracking
      const slot = await provider.connection.getSlot();
      reportHash({
        chain: "solana",
        user: payer.address,
        hash: result.data.data.hash,
        block_number: slot
      });

      onTransferSuccess?.(amount);
    } catch (error) {
      console.error("Create error:", error);
      throw error;
    } finally {
      setTransferring(false);
    }
  };

  return {
    transferring,
    onTransfer
  };
}
