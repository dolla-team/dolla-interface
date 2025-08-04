import { providers } from "near-api-js";
import nearChainConfig from "@/config/near";

const CONTRACT_ID = nearChainConfig.contractAddress;
const PRIZE_TOKEN = nearChainConfig.baseToken;
const BET_TOKEN = nearChainConfig.quoteToken;
const NODE_URL = nearChainConfig.nodeUrl;

const provider = new providers.JsonRpcProvider({ url: NODE_URL });

async function callContractView(
  contractId: string,
  methodName: string,
  args: Record<string, unknown> = {}
) {
  try {
    const result = await provider.query({
      request_type: "call_function",
      finality: "final",
      account_id: contractId,
      method_name: methodName,
      args_base64: Buffer.from(JSON.stringify(args)).toString("base64")
    });

    // @ts-expect-error - NEAR RPC result type doesn't include result property
    return JSON.parse(Buffer.from(result.result).toString());
  } catch (error) {
    console.error(`Error calling ${contractId}.${methodName}:`, error);
    throw error;
  }
}

export async function checkUserBetTokenStorage(accountId: string) {
  try {
    const balance = await callContractView(BET_TOKEN, "storage_balance_of", {
      account_id: accountId
    });
    return balance !== null;
  } catch {
    return false;
  }
}

export async function checkUserPrizeTokenStorage(accountId: string) {
  try {
    const balance = await callContractView(PRIZE_TOKEN, "storage_balance_of", {
      account_id: accountId
    });
    return balance !== null;
  } catch {
    return false;
  }
}

export async function checkUserStorageStatus(accountId: string) {
  const [betTokenRegistered, prizeTokenRegistered] = await Promise.all([
    checkUserBetTokenStorage(accountId),
    checkUserPrizeTokenStorage(accountId)
  ]);

  return {
    accountId,
    betTokenRegistered,
    prizeTokenRegistered,
    allRegistered: betTokenRegistered && prizeTokenRegistered,
    needsRegistration: !betTokenRegistered || !prizeTokenRegistered,
    registrationSteps: {
      betToken: !betTokenRegistered
        ? `near call ${BET_TOKEN} storage_deposit '{"account_id": "${accountId}", "registration_only": true}' --accountId=${accountId} --amount=0.01`
        : null,
      prizeToken: !prizeTokenRegistered
        ? `near call ${PRIZE_TOKEN} storage_deposit '{"account_id": "${accountId}", "registration_only": true}' --accountId=${accountId} --amount=0.01`
        : null
    }
  };
}

export async function getBtcDepositAddress(params: {
  nearAccountId: string;
  bidUnit: string;
  bep: string; // BTC Equivalent Prize
}) {
  return callContractView(CONTRACT_ID, "get_btc_deposit_address", {
    deposit_msg: {
      near_account_id: params.nearAccountId,
      game_params: {
        bid_unit: params.bidUnit,
        bep: params.bep
      }
    }
  });
}

export async function getPrizeSendingTxs(
  fromIndex: number = 0,
  limit: number = 100
) {
  return callContractView(CONTRACT_ID, "get_prize_sending_txs_paged", {
    from_index: fromIndex,
    limit
  });
}

export async function getUserAccount(accountId: string) {
  return callContractView(CONTRACT_ID, "get_account", {
    account_id: accountId
  });
}

export async function getUserGameBets(gameId: number, accountId: string) {
  return callContractView(CONTRACT_ID, "get_game_bets_by_account", {
    game_id: gameId,
    account_id: accountId
  });
}

export async function getUserBetTokenBalance(accountId: string) {
  try {
    return await callContractView(BET_TOKEN, "ft_balance_of", {
      account_id: accountId
    });
  } catch {
    return "0";
  }
}

/**
 * 获取用户的奖励代币余额
 */
export async function getUserPrizeTokenBalance(accountId: string) {
  try {
    return await callContractView(PRIZE_TOKEN, "ft_balance_of", {
      account_id: accountId
    });
  } catch {
    return "0";
  }
}

export function generateCreateGameCall(bidUnit: string, bep: string) {
  return {
    contractId: PRIZE_TOKEN,
    methodName: "ft_transfer_call",
    args: {
      receiver_id: CONTRACT_ID,
      amount: bep,
      msg: JSON.stringify({
        CreateGame: {
          bid_unit: bidUnit,
          bep: bep
        }
      })
    },
    attachedDeposit: "1", // 1 yoctoNEAR
    gas: "200000000000000" // 200 TGAS
  };
}

export function generateDepositCall(amount: string): {
  contractId: string;
  methodName: string;
  args: Record<string, unknown>;
  gas: string;
  deposit: string;
} {
  const config = getContractConfig();

  return {
    contractId: config.betToken,
    methodName: "ft_transfer_call",
    args: {
      receiver_id: config.mainContract,
      amount: amount,
      msg: JSON.stringify("Deposit")
    },
    gas: "200000000000000", // 200 TGAS
    deposit: "1" // 1 yoctoNEAR
  };
}

export function generatePlayGameCall(
  gameId: number,
  bets: number
): {
  contractId: string;
  methodName: string;
  args: Record<string, unknown>;
  gas: string;
  deposit: string;
} {
  const config = getContractConfig();

  return {
    contractId: config.mainContract,
    methodName: "play_game",
    args: {
      game_id: gameId,
      bets: bets
    },
    gas: "200000000000000", // 200 TGAS
    deposit: "0"
  };
}

export function generateClaimPrizeCall(gameId: number) {
  return {
    contractId: CONTRACT_ID,
    methodName: "claim_prize",
    args: {
      game_id: gameId
    },
    attachedDeposit: "0",
    gas: "200000000000000" // 200 TGAS
  };
}

export function generateClaimBtcPrizeCall(gameId: number, btcAddress: string) {
  return {
    contractId: CONTRACT_ID,
    methodName: "claim_prize",
    args: {
      game_id: gameId,
      btc_address: btcAddress
    },
    attachedDeposit: "0",
    gas: "200000000000000" // 200 TGAS
  };
}

export function generateStorageDepositCall(
  tokenContract: string,
  accountId: string
) {
  return {
    contractId: tokenContract,
    methodName: "storage_deposit",
    args: {
      account_id: accountId,
      registration_only: true
    },
    attachedDeposit: "10000000000000000000000", // 0.01 NEAR
    gas: "30000000000000" // 30 TGAS
  };
}

export function getContractConfig() {
  return {
    mainContract: CONTRACT_ID,
    betToken: BET_TOKEN,
    prizeToken: PRIZE_TOKEN,
    nodeUrl: NODE_URL
  };
}
