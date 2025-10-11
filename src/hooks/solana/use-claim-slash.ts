import { useState } from "react";
import { PAID_TOKEN, QUOTE_TOKEN } from "@/config/btc";
import useToast from "@/hooks/use-toast";
import reportHash from "@/utils/report-hash";
import * as anchor from "@coral-xyz/anchor";
import useProgram from "./use-program";
import {
  getState,
  getPool,
  getBuyState,
  getAccountsInfo,
  buildTxWithGas
} from "./helpers";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { useSolanaWallets } from "@privy-io/react-auth";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { sendSolanaTransaction } from "@/utils/transaction/send-solana-transaction";
import config from "@/config/solana";

// user get quote token from pool when seller cancelled a pool
export default function useClaimSlash({
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
      toast.fail({ title: "Please connect your wallet" });
      return;
    }
    const payer = wallets[0];
    let toastId = toast.loading({ title: "Claiming..." });
    try {
      setClaiming(true);
      const state = getState(program);

      const poolIdBN = new anchor.BN(orderId);
      const pool = await getPool(program, provider, state.pda, poolIdBN);
      const buyerState = await getBuyState(
        program,
        provider,
        pool.pda,
        new PublicKey(payer.address)
      );
      const [
        userQuoteAccount,
        poolQuoteAccount,
        userPaidAccount,
        operatorPaidAccount
      ] = await getAccountsInfo([
        [QUOTE_TOKEN.address, payer.address],
        [QUOTE_TOKEN.address, pool.pda.toString()],
        [PAID_TOKEN.address, payer.address],
        [PAID_TOKEN.address, config.operator]
      ]);

      let claimSlashFundsAccounts = {
        dollaState: state.pda,
        poolState: pool.pda,
        buyerState: buyerState.pda,
        quoteMint: new PublicKey(QUOTE_TOKEN.address),
        paidMint: new PublicKey(PAID_TOKEN.address),
        userQuoteAccount: userQuoteAccount?.address,
        poolQuoteAccount: poolQuoteAccount?.address,
        userPaidAccount: userPaidAccount?.address,
        operatorPaidAccount: operatorPaidAccount?.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        user: new PublicKey(payer.address),
        operator: new PublicKey(config.operator),
        systemProgram: anchor.web3.SystemProgram.programId
      };

      const claimSlashFundsTx: TransactionInstruction = await program.methods
        .claimSlashFunds(new anchor.BN(10000))
        .accounts(claimSlashFundsAccounts)
        .instruction();
      const otherTxs: any = [];
      if (userQuoteAccount.instruction) {
        otherTxs.push(userQuoteAccount.instruction);
      }
      if (poolQuoteAccount.instruction) {
        otherTxs.push(poolQuoteAccount.instruction);
      }
      if (userPaidAccount.instruction) {
        otherTxs.push(userPaidAccount.instruction);
      }
      if (operatorPaidAccount.instruction) {
        otherTxs.push(operatorPaidAccount.instruction);
      }

      const { transaction: tx, gas } = await buildTxWithGas({
        tx: claimSlashFundsTx,
        otherTxs,
        action: "claimSlashFunds"
      });

      const claimSlashFundsTxWithGas: TransactionInstruction =
        await program.methods
          .claimSlashFunds(new anchor.BN(gas))
          // @ts-ignore
          .accounts(claimSlashFundsAccounts)
          .instruction();

      tx.add(claimSlashFundsTxWithGas);

      const simulationResult = await provider.connection.simulateTransaction(
        tx
      );
      console.log("claimSlashFunds:", simulationResult);

      const result = await sendSolanaTransaction(tx, "claimSlashFunds");
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
