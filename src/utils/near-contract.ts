import { providers } from "near-api-js";
import nearChainConfig from "@/config/near";

// NEAR 合约地址和 RPC 配置
const CONTRACT_ID = nearChainConfig.contractAddress;
const NODE_URL = nearChainConfig.nodeUrl;

// 创建 NEAR provider
const provider = new providers.JsonRpcProvider({ url: NODE_URL });

/**
 * 调用 NEAR 合约的 view 方法
 */
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

/**
 * 获取账户信息
 */
export async function getAccount(accountId: string) {
  return callViewMethod("get_account", { account_id: accountId });
}

/**
 * 获取账户总数
 */
export async function getAccountsCount() {
  return callViewMethod("get_accounts_count");
}

/**
 * 获取游戏列表
 */
export async function listGames(fromIndex: number = 0, limit: number = 100) {
  return callViewMethod("list_games", { from_index: fromIndex, limit });
}

/**
 * 获取单个游戏信息
 */
export async function getGame(gameId: number) {
  return callViewMethod("get_game", { game_id: gameId });
}

/**
 * 获取指定账户在游戏中的投注
 */
export async function getGameBetsByAccount(gameId: number, accountId: string) {
  return callViewMethod("get_game_bets_by_account", {
    game_id: gameId,
    account_id: accountId
  });
}

/**
 * 获取游戏的所有投注
 */
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

/**
 * 获取当前合约地址
 */
export function getContractId() {
  return CONTRACT_ID;
}

/**
 * 获取当前 RPC URL
 */
export function getNodeUrl() {
  return NODE_URL;
}
