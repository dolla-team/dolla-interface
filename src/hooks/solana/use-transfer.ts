import { useState } from "react";
import { PAID_TOKEN } from "@/config/btc";
import useToast from "@/hooks/use-toast";
import reportHash from "@/utils/report-hash";
import * as anchor from "@coral-xyz/anchor";
import useProgram from "./use-program";
import { getState, getAccountsInfo, buildTxWithGas } from "./helpers";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { useSolanaWallets } from "@privy-io/react-auth";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { sendSolanaTransaction } from "@/utils/transaction/send-solana-transaction";
import config from "@/config/solana";

export default function useTransfer({
  token,
  type,
  onTransferSuccess
}: {
  token: any;
  type?: string;
  onTransferSuccess?: (amount: number) => void;
}) {
  const [transferring, setTransferring] = useState(false);
  const { wallets } = useSolanaWallets();
  const toast = useToast();
  const { program, provider } = useProgram();

  const onTransfer = async (amount: number, to: string) => {
    if (!wallets.length || !amount || transferring) {
      return;
    }
    const payer = wallets[0];
    let toastId = toast.loading({ title: "Transferring..." });
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
        [PAID_TOKEN.address, payer.address],
        [PAID_TOKEN.address, config.operator]
      ]);

      let transferAccounts = {
        dollaState: state.pda,
        tokenMint: new PublicKey(token.address),
        paidMint: new PublicKey(PAID_TOKEN.address),
        userTokenAccount: userTokenAccount?.address,
        toTokenAccount: toTokenAccount?.address,
        userPaidAccount: userPaidAccount?.address,
        operatorPaidAccount: operatorPaidAccount?.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        user: new PublicKey(payer.address),
        toUser: new PublicKey(to),
        operator: new PublicKey(config.operator),
        systemProgram: anchor.web3.SystemProgram.programId,
        splMemoProgram: new PublicKey(
          "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
        )
      };
      const getParams = (_gas: string) => {
        if (type === "buy_ticket") {
          return [
            transferAmount,
            new anchor.BN(_gas),
            JSON.stringify({
              type: "dolla_buy_ticket",
              address: payer.address
            })
          ];
        }
        return [
          transferAmount,
          new anchor.BN(_gas),
          JSON.stringify({
            type: "dolla_withdraw",
            amount: transferAmount.toString(),
            token: token.address,
            from: payer.address,
            to: to
          })
        ];
      };

      const transferTx: TransactionInstruction = await program.methods
        .transferHelper(...getParams("100000"))
        .accounts(transferAccounts)
        .instruction();

      const otherTxs: any = [];

      if (userTokenAccount?.instruction) {
        otherTxs.push(userTokenAccount.instruction);
      }
      if (toTokenAccount?.instruction) {
        otherTxs.push(toTokenAccount.instruction);
      }
      if (userPaidAccount?.instruction) {
        otherTxs.push(userPaidAccount.instruction);
      }
      if (operatorPaidAccount?.instruction) {
        otherTxs.push(operatorPaidAccount.instruction);
      }

      const { transaction: tx, gas } = await buildTxWithGas({
        tx: transferTx,
        otherTxs,
        action: "transferHelper"
      });

      const transferTxWithGas: TransactionInstruction = await program.methods
        .transferHelper(...getParams(gas))
        // @ts-ignore
        .accounts(transferAccounts)
        .instruction();

      tx.add(transferTxWithGas);

      const result = await sendSolanaTransaction(tx, "transferHelper");
      console.log("receipt:", result);
      toast.dismiss(toastId);
      toast.success({
        title: "Transfer successfully"
      });
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
      toast.dismiss(toastId);
      toast.fail({
        title: "Transfer failed"
      });
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
