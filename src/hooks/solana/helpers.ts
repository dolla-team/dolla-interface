import * as anchor from "@coral-xyz/anchor";
import {
  getAssociatedTokenAddressSync,
  getAccount,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  createSyncNativeInstruction
} from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  ComputeBudgetProgram
} from "@solana/web3.js";
import { createHash } from "crypto";
import { Buffer } from "buffer";
import * as sb from "@switchboard-xyz/on-demand";
import axios from "axios";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import Big from "big.js";

export function getState(program: anchor.Program) {
  const [globalBalPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("dolla_state")],
    program.programId
  );
  return { pda: globalBalPda, bump: bump };
}

export async function getNextOrderId(
  program: anchor.Program,
  statePda: anchor.web3.PublicKey
) {
  // const stateExist = await accountExists(statePda, provider.connection);
  // let dollaState = null;
  // console.log("state exist:" + stateExist);
  // if (stateExist) {
  //   // @ts-ignore
  //   dollaState = await program.account.dollaState.fetch(statePda);
  //   return dollaState.nextOrderId;
  // }
  // @ts-ignore
  const dollaState = await program.account.dollaState.fetch(statePda);
  return dollaState?.nextOrderId || 0;
  // return 0;
}

export async function accountExists(
  publicKey: anchor.web3.PublicKey,
  connection: anchor.web3.Connection
) {
  try {
    const accountInfo = await connection.getAccountInfo(publicKey);
    return accountInfo !== null;
  } catch (error) {
    console.error("Error fetching account info:", error);
    return false;
  }
}

export async function getPool(
  program: anchor.Program,
  provider: anchor.AnchorProvider,
  state: any,
  nextId: anchor.BN
) {
  const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("dolla_pool"),
      state.toBuffer(),
      nextId.toArrayLike(Buffer, "be", 4)
    ],
    program.programId
  );

  // // query pool info
  const stateExist = await accountExists(pda, provider.connection);
  let pool = null;
  if (stateExist) {
    // @ts-ignore
    pool = await program.account.poolState.fetch(pda);
  }

  return { pda: pda, bump: bump, pool: pool };
}

export async function getAccountsInfo(pairs: string[][]): Promise<any[]> {
  const accounts = pairs.map((pair) =>
    getAssociatedTokenAddressSync(
      new PublicKey(pair[0]),
      new PublicKey(pair[1]),
      true // Allow off-curve addresses for PDAs
    )
  );
  const response = await axios.post(import.meta.env.VITE_SOLANA_RPC_URL, {
    jsonrpc: "2.0",
    id: 1,
    method: "getMultipleAccounts",
    params: [
      accounts,
      {
        encoding: "base64",
        commitment: "finalized"
      }
    ]
  });

  const accountsInfo = accounts.map((account, i) => {
    if (response.data?.result?.value[i]) {
      return {
        address: account.toString()
      };
    }

    return {
      address: account.toString(),
      instruction: createAssociatedTokenAccountInstruction(
        new PublicKey(import.meta.env.VITE_SOLANA_OPERATOR),
        account,
        new PublicKey(pairs[i][1]),
        new PublicKey(pairs[i][0])
      )
    };
  });

  return accountsInfo;
}

export async function getAssociatedTokenAddress(
  mint: any,
  owner: any,
  provider: any
): Promise<{ address: PublicKey; instruction: any; account: any } | null> {
  const connection = provider.connection;
  if (!connection) {
    return null;
  }

  // Check if owner is a PDA (off-curve address)
  // For PDAs, we need to allow off-curve addresses
  // We'll use a safer approach by always allowing off-curve addresses
  // since PDAs are commonly used as token account owners in Solana programs
  const isOffCurve = true;

  const associatedToken = getAssociatedTokenAddressSync(
    mint,
    owner,
    isOffCurve // Allow off-curve addresses for PDAs
  );

  let account: any = null;
  let instruction = null;
  try {
    account = await getAccount(connection, associatedToken);
  } catch (error: unknown) {
    if (
      error instanceof TokenAccountNotFoundError ||
      error instanceof TokenInvalidAccountOwnerError
    ) {
      try {
        instruction = createAssociatedTokenAccountInstruction(
          provider.publicKey!,
          associatedToken,
          owner,
          mint
        );
      } catch (e) {
        console.log(e);
      }
    }
  }

  return {
    address: associatedToken,
    instruction: instruction,
    account
  };
}

export function getWrapToSolIx(user: any, wsolAccount: any, amount: anchor.BN) {
  return [
    SystemProgram.transfer({
      fromPubkey: user.publicKey,
      toPubkey: wsolAccount.address,
      lamports: amount
    }),
    createSyncNativeInstruction(wsolAccount.address, TOKEN_PROGRAM_ID)
  ];
}

export async function getBuyState(
  program: anchor.Program,
  provider: anchor.AnchorProvider,
  poolState: anchor.web3.PublicKey,
  user: anchor.web3.PublicKey
) {
  const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("dolla_buyer_state"), poolState.toBuffer(), user.toBuffer()],
    program.programId
  );

  // query pool info
  const stateExist = await accountExists(pda, provider.connection);
  let buyerState = null;

  if (stateExist) {
    // @ts-ignore
    buyerState = await program.account.buyerState.fetch(pda);
  }

  return { pda: pda, bump: bump, buyerState: buyerState };
}

export async function loadSbProgram(
  provider: anchor.Provider
): Promise<anchor.Program> {
  const sbProgramId = await sb.getProgramId(provider.connection);
  console.log("sbProgramId:" + sbProgramId.toString());
  const sbIdl = await anchor.Program.fetchIdl(sbProgramId, provider);
  // console.log("sbIdl:" + JSON.stringify(sbIdl.types));
  const sbProgram = new anchor.Program(sbIdl!, provider);
  return sbProgram;
}

export function getRandomnessAccount(payer: any) {
  // In browser environment, we can't access secretKey
  // Use alternative methods to generate deterministic randomness account

  // Method 1: Use public key + timestamp + random salt
  const timestamp = Date.now().toString();
  const randomSalt = Math.random().toString(36).substring(2, 15);
  const message = payer + timestamp + randomSalt;

  // Method 2: Use public key + fixed seed (more deterministic)
  // const message = (payer.address || payer.publicKey?.toString() || "default") + "Dolla-V3";

  const seed = createHash("sha256").update(message).digest().slice(0, 32);
  const keypair = Keypair.fromSeed(seed);

  console.log("Generated randomness account:", keypair.publicKey.toString());
  return keypair;
}

export function setupQueue() {
  return new PublicKey(
    import.meta.env.VITE_SOLANA_CLUSTER_NAME === "devnet"
      ? "EYiAmGSdsQTuCw413V5BzaruWuCCSDgTPtBGvLkXHbe7"
      : "A43DyUGA7s8eXPxqEjJY6EBu1KKbNgfxF8h17VAHn13w"
  );
}

export async function getBidGasFee(
  program: anchor.Program,
  state: anchor.web3.PublicKey,
  tokenMint: anchor.web3.PublicKey
) {
  // @ts-ignore
  const dollaState = await program.account.dollaState.fetch(state);
  const allGasFee = dollaState.quoteBidGasFees;
  const allQuoteTokens = dollaState.quoteTokens;
  for (let i = 0; i < allQuoteTokens.length; i++) {
    if (tokenMint.toString() == allQuoteTokens[i]) {
      return new anchor.BN(allGasFee[i]);
    }
  }
  return new anchor.BN(0);
}

export async function getSolanaBalance(
  connection: any,
  walletAddress: string
): Promise<number> {
  try {
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("Error getting SOL balance:", error);
    return 0;
  }
}

export async function getTokenBalance(
  connection: any,
  walletAddress: string,
  tokenMint: string,
  decimals: number
): Promise<number> {
  try {
    const walletPublicKey = new PublicKey(walletAddress);
    const mintPublicKey = new PublicKey(tokenMint);
    const tokenAccount = getAssociatedTokenAddressSync(
      mintPublicKey,
      walletPublicKey
    );

    const accountInfo = await getAccount(connection, tokenAccount);
    return Number(accountInfo.amount) / Math.pow(10, decimals);
  } catch (error) {
    return 0;
  }
}

export async function wrapTxWithBugetFee(transaction: any) {
  const defaultPriorityFee = 300000;
  const multiplier = 10;
  let priorityFee = defaultPriorityFee;
  if (import.meta.env.VITE_SOLANA_CLUSTER_NAME === "mainnet-beta") {
    try {
      const res = await fetch(import.meta.env.VITE_SOLANA_RPC_URL, {
        method: "POST",
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "1",
          method: "getPriorityFeeEstimate",
          params: [
            {
              transaction: bs58.encode(
                transaction.serialize({ verifySignatures: false })
              ),
              options: { priorityLevel: "High" }
            }
          ]
        })
      }).then((res) => res.json());

      priorityFee = new Big(res?.result?.priorityFeeEstimate || 0)
        .mul(multiplier)
        .round(0)
        .toNumber();

      console.log("priorityFee:", priorityFee);

      priorityFee = Math.min(
        priorityFee ?? defaultPriorityFee,
        defaultPriorityFee
      );
    } catch (error) {
      console.error("get priority fee error:", error);
    }
  }
  const priorityFeeInstruction = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: priorityFee
  });

  const computeUnitLimitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
    units: 500000
  });

  return [priorityFeeInstruction, computeUnitLimitInstruction];
}
