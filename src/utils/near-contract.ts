import { providers } from "near-api-js";
import nearChainConfig from "@/config/near";

const CONTRACT_ID = nearChainConfig.contractAddress;
const NODE_URL = nearChainConfig.nodeUrl;

const provider = new providers.JsonRpcProvider({ url: NODE_URL });

async function callViewMethod(
  methodName: string,
  args: Record<string, unknown> = {}
) {
  try {
    const result = await provider.query({
      request_type: "call_function",
      finality: "final",
      account_id: CONTRACT_ID,
      method_name: methodName,
      args_base64: Buffer.from(JSON.stringify(args)).toString("base64")
    });

    // @ts-expect-error - NEAR RPC result type doesn't include result property
    return JSON.parse(Buffer.from(result.result).toString());
  } catch (error) {
    console.error(`Error calling ${methodName}:`, error);
    throw error;
  }
}

export async function getAccount(accountId: string) {
  return callViewMethod("get_account", { account_id: accountId });
}

export async function getAccountsCount() {
  return callViewMethod("get_accounts_count");
}

export async function listGames(fromIndex: number = 0, limit: number = 100) {
  return callViewMethod("list_games", { from_index: fromIndex, limit });
}

export async function getGame(gameId: number) {
  return callViewMethod("get_game", { game_id: gameId });
}

export async function getGameBetsByAccount(gameId: number, accountId: string) {
  return callViewMethod("get_game_bets_by_account", {
    game_id: gameId,
    account_id: accountId
  });
}

export async function getGameBets(
  gameId: number,
  fromIndex: number = 0,
  limit: number = 100
) {
  return callViewMethod("get_game_bets", {
    game_id: gameId,
    from_index: fromIndex,
    limit
  });
}

export function getContractId() {
  return CONTRACT_ID;
}

export function getNodeUrl() {
  return NODE_URL;
}
