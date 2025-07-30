import useToast from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import useProgram from "./use-program";
import reportHash from "@/utils/report-hash";
import {
  getPool,
  getState,
  getBuyState,
  setupQueue,
  getBidGasFee,
  getWrapToSolIx,
  getAccountsInfo,
  buildTxWithGas
} from "./helpers";
import * as anchor from "@coral-xyz/anchor";
import { useSolanaWallets } from "@privy-io/react-auth";
import { BASE_TOKEN, QUOTE_TOKEN } from "@/config/btc";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Randomness } from "@switchboard-xyz/on-demand";
import { sendSolanaTransaction } from "@/utils/transaction/send-solana-transaction";
import axiosInstance from "@/libs/axios";
import { useBtcContext } from "@/views/btc/context";
import { useRandomnessStore } from "@/stores/use-randomness";
import config from "@/config/solana";

export default function useBid(
  poolId: number,
  onSuccess: (result: any) => void,
  onTxSuccess: () => void,
  onTxFail: () => void
) {
  const [bidding, setBidding] = useState(false);
  const toast = useToast();
  const { wallets } = useSolanaWallets();
  const { program, provider } = useProgram();
  const poolInfoRef = useRef<any>(null);
  const { sbProgramRef } = useBtcContext();
  const randomnessStore: any = useRandomnessStore();
  const randomnessTimerRef = useRef<any>(null);

  const onBid = async (times: number) => {
    if (bidding) {
      return;
    }
    if (!wallets.length) {
      toast.fail({ title: "Please connect your wallet" });
      return;
    }
    if (!provider) {
      toast.fail({ title: "Provider not available" });
      return;
    }

    let toastId = toast.loading({ title: "Submit Transaction..." });

    const payer = wallets[0];
    setBidding(true);
    try {
      if (!poolInfoRef.current) {
        await fetchPoolInfo();
      }

      const state = getState(program);
      // Use the actual poolId parameter instead of hardcoded value
      const poolIdBN = new anchor.BN(poolId);
      console.log("Using poolId:", poolId, "as BN:", poolIdBN.toString());
      console.time("bid time");
      console.time("prepare tx");

      let quoteAmount = times * 10 ** QUOTE_TOKEN.decimals;
      if (QUOTE_TOKEN.address === BASE_TOKEN.address) {
        quoteAmount = quoteAmount + poolInfoRef.current.gasFee.toNumber();
      }

      let wrapTx: any[] = [];
      if (
        QUOTE_TOKEN.address.toString() ==
        "So11111111111111111111111111111111111111112"
      ) {
        wrapTx = getWrapToSolIx(
          payer,
          poolInfoRef.current.userQuoteAccount,
          quoteAmount
        );
      }

      const { randomnessAccount, randomnessCreateIx } =
        await getRandomnessAccount();
      console.log("randomnessAccount", randomnessAccount, randomnessCreateIx);

      let bidAccounts = {
        dollaState: state.pda,
        poolState: poolInfoRef.current.pool.pda,
        buyerState: poolInfoRef.current.buyerState.pda,
        randomnessAccount: new PublicKey(randomnessAccount),
        quoteMint: new PublicKey(QUOTE_TOKEN.address),
        paidMint: new PublicKey(QUOTE_TOKEN.address),
        userQuoteAccount: poolInfoRef.current.userQuoteAccount?.address,
        poolQuoteAccount: poolInfoRef.current.poolQuoteAccount?.address,
        userPaidAccount: poolInfoRef.current.userPaidAccount?.address,
        operatorPaidAccount: poolInfoRef.current.operatorPaidAccount?.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        user: new PublicKey(payer.address),
        operator: new PublicKey(config.operator),
        systemProgram: anchor.web3.SystemProgram.programId
      };

      const bidTx: TransactionInstruction = await program.methods
        .bid(times, poolInfoRef.current.gasFee)
        // @ts-ignore
        .accounts(bidAccounts)
        .instruction();

      const otherTxs: any = [];
      for (let i = 0; i < wrapTx.length; i++) {
        otherTxs.push(wrapTx[i]);
      }

      if (poolInfoRef.current.userQuoteAccount?.instruction) {
        otherTxs.push(poolInfoRef.current.userQuoteAccount.instruction);
      }
      if (poolInfoRef.current.poolQuoteAccount?.instruction) {
        otherTxs.push(poolInfoRef.current.poolQuoteAccount.instruction);
      }
      if (poolInfoRef.current.protocolQuoteAccount?.instruction) {
        otherTxs.push(poolInfoRef.current.protocolQuoteAccount.instruction);
      }
      if (poolInfoRef.current.userPaidAccount?.instruction) {
        otherTxs.push(poolInfoRef.current.userPaidAccount.instruction);
      }
      if (poolInfoRef.current.operatorPaidAccount?.instruction) {
        otherTxs.push(poolInfoRef.current.operatorPaidAccount.instruction);
      }
      for (let i = 0; i < randomnessCreateIx.length; i++) {
        console.log("randomnessCreateIx:" + randomnessCreateIx[i].programId);
        otherTxs.push(randomnessCreateIx[i]);
      }

      const { transaction: tx, gas } = await buildTxWithGas({
        tx: bidTx,
        otherTxs,
        action: "bid"
      });
      console.log("gas:", gas);
      const bidTxWithGas: TransactionInstruction = await program.methods
        .bid(times, new anchor.BN(gas))
        // @ts-ignore
        .accounts(bidAccounts)
        .instruction();

      tx.add(bidTxWithGas);

      const simulationResult = await provider.connection.simulateTransaction(
        tx
      );
      console.log("simulation:", simulationResult);
      // const simulationResult = await provider.connection.simulateTransaction(
      //   tx
      // );
      // console.log("bid:", simulationResult);

      // const receipt = await sendTransaction({
      //   transaction: tx,
      //   connection: provider.connection
      // });
      console.timeEnd("prepare tx");

      const result = await sendSolanaTransaction(tx, "bid");
      toast.dismiss(toastId);
      toastId = toast.success({ title: "Bid placed successfully!" });
      onTxSuccess();
      setBidding(false);

      let bidResponse = null;
      let timer: any = null;
      console.time("bid loop");
      const loop = async () => {
        bidResponse = await axiosInstance.get(
          `/api/v1/user/prize/bid?hash=${result.data.data.hash}`
        );
        if (
          bidResponse.data.data.bid !== null &&
          bidResponse.data.data.bid.status !== 0
        ) {
          console.timeEnd("bid time");
          console.timeEnd("bid loop");
          console.log("bidResponse", bidResponse.data.data);
          // bidResponse.data.data.bid.is_winner = true;
          onSuccess(bidResponse.data.data);

          return;
        }
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(loop, 1000);
      };
      loop();

      poolInfoRef.current.userQuoteAccount.instruction = null;
      poolInfoRef.current.poolQuoteAccount.instruction = null;
      poolInfoRef.current.protocolQuoteAccount.instruction = null;
      poolInfoRef.current.userPaidAccount.instruction = null;
      poolInfoRef.current.operatorPaidAccount.instruction = null;

      console.log("bidResponse", bidResponse);
      console.log("receipt:", result);

      const slot = await provider.connection.getSlot();
      // Report hash for tracking
      reportHash({
        chain: "solana",
        user: payer.address,
        hash: result.data.data.hash,
        block_number: slot
      });

      // const pb = new PublicKey("7qKtiPPkK1ZYqVFujVJjsTuGSJNXAvVhLj41HxtQDsTG");
      // const userBaseAccount = await getAssociatedTokenAddress(
      //   new PublicKey(BASE_TOKEN.address),
      //   new PublicKey(payer.address),
      //   provider
      // );

      // const poolBaseAccount = await getAssociatedTokenAddress(
      //   new PublicKey(BASE_TOKEN.address),
      //   new PublicKey(pool.pda.toString()),
      //   provider
      // );
      // let settleBidAccounts = {
      //   dollaState: state.pda,
      //   poolState: pool.pda,
      //   user: new PublicKey(payer.address),
      //   buyerState: buyerState.pda,
      //   randomnessAccount: pb,
      //   baseMint: new PublicKey(BASE_TOKEN.address),
      //   quoteMint: new PublicKey(QUOTE_TOKEN.address),
      //   userBaseAccount: userBaseAccount?.address,
      //   poolBaseAccount: poolBaseAccount?.address,
      //   userQuoteAccount: userQuoteAccount?.address,
      //   poolQuoteAccount: poolQuoteAccount?.address,
      //   tokenProgram: TOKEN_PROGRAM_ID,
      //   associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      //   operator: new PublicKey(config.operator),
      //   systemProgram: anchor.web3.SystemProgram.programId
      // };
      // console.log("userBaseAccount:", userPaidAccount?.address.toString());
      // console.log("settleBidAccounts:", settleBidAccounts);
      // const settleBidIx: TransactionInstruction = await program.methods
      //   .settleBid()
      //   .accounts(settleBidAccounts)
      //   .instruction();

      // const randomness = new Randomness(sbProgram, pb);
      // console.log("randomness", randomness);
      // const revealIx = await randomness.revealIx();
      // console.log("revealIx", revealIx);
      // const settleTx = new Transaction().add(revealIx).add(settleBidIx);

      // settleTx.feePayer = new PublicKey(config.operator);

      // settleTx.recentBlockhash = blockhash;

      // const settleSimulationResult =
      //   await provider.connection.simulateTransaction(settleTx);
      // console.log("settle:", settleSimulationResult);
      // const settleReceipt = await sendTransaction({
      //   transaction: settleTx,
      //   connection: provider.connection
      // });
      // console.log("settleReceipt:", settleReceipt);
    } catch (error) {
      console.error("Bid error:", error);
      setBidding(false);
      toast.dismiss(toastId);
      toast.fail({
        title: "Bid failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred"
      });
      onTxFail();
    }
  };

  const fetchPoolInfo = async () => {
    console.time("fetchPoolInfo");
    const poolIdBN = new anchor.BN(poolId);
    const state = getState(program);
    const payer = wallets[0];

    const sbProgram = sbProgramRef.current;

    const pool = await getPool(program, provider, state.pda, poolIdBN);

    const [buyerState, gasFee, accountsInfo] = await Promise.all([
      getBuyState(program, provider, pool.pda, new PublicKey(payer.address)),
      getBidGasFee(program, state.pda, QUOTE_TOKEN.address),
      getAccountsInfo([
        [QUOTE_TOKEN.address, payer.address],
        [QUOTE_TOKEN.address, pool.pda.toString()],
        [QUOTE_TOKEN.address, state.pda.toString()],
        [QUOTE_TOKEN.address, payer.address],
        [QUOTE_TOKEN.address, config.operator]
      ])
    ]);

    const userQuoteAccount = accountsInfo[0];
    const poolQuoteAccount = accountsInfo[1];
    const protocolQuoteAccount = accountsInfo[2];
    const userPaidAccount = accountsInfo[3];
    const operatorPaidAccount = accountsInfo[4];

    poolInfoRef.current = {
      userQuoteAccount,
      poolQuoteAccount,
      protocolQuoteAccount,
      userPaidAccount,
      operatorPaidAccount,
      gasFee,
      buyerState,
      pool,
      sbProgram
    };
    window.cachedPoolId = poolId;
    console.timeEnd("fetchPoolInfo");
  };

  const getRandomnessAccount = async () => {
    // const expiredTime = 1000 * 30;
    // if (
    //   randomnessStore.randomnessAccount &&
    //   Date.now() - randomnessStore.updateTime < expiredTime
    // ) {
    //   return {
    //     randomnessAccount: randomnessStore.randomnessAccount,
    //     randomnessCreateIx: randomnessStore.randomnessCreateIx
    //   };
    // }
    console.time("randomness");
    const randomnessAccountResult = await axiosInstance.get(
      `/api/v1/paygas/sol/randomnessaccount?pool=${poolInfoRef.current.pool.pda.toString()}`
    );

    const randomnessAccount = randomnessAccountResult.data.data;
    console.log("randomnessAccount", randomnessAccount);
    if (!randomnessAccount) {
      return {
        randomnessAccount: "",
        randomnessCreateIx: []
      };
    }

    const sbQueue = setupQueue();

    let randomnessCreateIx;

    const randomness = new Randomness(
      // @ts-ignore
      sbProgramRef.current,
      new PublicKey(randomnessAccount)
    );

    const commitIx = await randomness.commitIx(
      sbQueue,
      new PublicKey(config.operator)
    );
    randomnessCreateIx = [commitIx];
    console.timeEnd("randomness");
    randomnessStore.set({
      randomnessAccount,
      randomnessCreateIx,
      updateTime: Date.now()
    });
    if (randomnessTimerRef.current) {
      clearTimeout(randomnessTimerRef.current);
    }

    return {
      randomnessAccount,
      randomnessCreateIx
    };
  };

  useEffect(() => {
    if (poolId && wallets.length && window.cachedPoolId !== poolId) {
      fetchPoolInfo();
    }
  }, [poolId, wallets]);

  return {
    bidding,
    onBid
  };
}
