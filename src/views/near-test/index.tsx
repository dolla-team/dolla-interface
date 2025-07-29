import { useState, useEffect } from "react";
import {
  getAccount,
  getAccountsCount,
  listGames,
  getGame,
  getGameBetsByAccount,
  getGameBets,
  getContractId,
  getNodeUrl
} from "@/utils/near-contract";
import {
  checkUserStorageStatus,
  getUserBetTokenBalance,
  getUserPrizeTokenBalance,
  generateStorageDepositCall,
  getContractConfig
} from "@/utils/near-game-actions";
import { useNearWallet } from "@/contexts/wallet/near";
import Loading from "@/components/icons/loading";

interface TestResult {
  method: string;
  status: "loading" | "success" | "error";
  data?: unknown;
  error?: string;
  params?: string;
}

export default function NearTestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [testAccountId, setTestAccountId] = useState("u1.testnet");
  const [testGameId, setTestGameId] = useState(0);
  const { accountId } = useNearWallet();

  // 更新单个测试结果
  const updateResult = (method: string, update: Partial<TestResult>) => {
    setResults(prev => 
      prev.map(result => 
        result.method === method 
          ? { ...result, ...update }
          : result
      )
    );
  };

  // 执行单个测试
  const executeTest = async (method: string, testFn: () => Promise<unknown>, params?: string) => {
    updateResult(method, { status: "loading", error: undefined });
    
    try {
      const data = await testFn();
      updateResult(method, { status: "success", data, params });
    } catch (error) {
      updateResult(method, { 
        status: "error", 
        error: error instanceof Error ? error.message : String(error),
        params
      });
    }
  };

  // 初始化测试列表
  useEffect(() => {
    const initialResults: TestResult[] = [
      { method: "getAccountsCount", status: "loading" },
      { method: "listGames", status: "loading" },
      { method: "getAccount", status: "loading" },
      { method: "getGame", status: "loading" },
      { method: "getGameBetsByAccount", status: "loading" },
      { method: "getGameBets", status: "loading" },
      { method: "checkUserStorageStatus", status: "loading" },
      { method: "getUserBetTokenBalance", status: "loading" },
      { method: "getUserPrizeTokenBalance", status: "loading" },
    ];
    setResults(initialResults);
  }, []);

  // 执行所有测试
  const runAllTests = async () => {
    console.log("Running all NEAR contract tests...");
    
    // 1. 获取账户总数
    await executeTest("getAccountsCount", () => getAccountsCount());

    // 2. 获取游戏列表
    await executeTest("listGames", () => listGames(0, 10), "from_index: 0, limit: 10");

    // 3. 获取指定账户信息
    await executeTest("getAccount", () => getAccount(testAccountId), `account_id: ${testAccountId}`);

    // 4. 获取游戏信息
    await executeTest("getGame", () => getGame(testGameId), `game_id: ${testGameId}`);

    // 5. 获取账户在游戏中的投注
    await executeTest("getGameBetsByAccount", () => getGameBetsByAccount(testGameId, testAccountId), 
      `game_id: ${testGameId}, account_id: ${testAccountId}`);

    // 6. 获取游戏的所有投注
    await executeTest("getGameBets", () => getGameBets(testGameId, 0, 10), 
      `game_id: ${testGameId}, from_index: 0, limit: 10`);

    // 7. 检查用户存储注册状态
    if (testAccountId) {
      await executeTest("checkUserStorageStatus", () => checkUserStorageStatus(testAccountId), 
        `account: ${testAccountId}`);

      // 8. 获取用户投注代币余额
      await executeTest("getUserBetTokenBalance", () => getUserBetTokenBalance(testAccountId), 
        `account: ${testAccountId}, token: ${getContractConfig().betToken}`);

      // 9. 获取用户奖励代币余额
      await executeTest("getUserPrizeTokenBalance", () => getUserPrizeTokenBalance(testAccountId), 
        `account: ${testAccountId}, token: ${getContractConfig().prizeToken}`);
    }
  };

  // 页面加载时自动运行测试
  useEffect(() => {
    if (results.length > 0) {
      runAllTests();
    }
  }, [results.length, testAccountId, testGameId]);

  // 渲染结果项
  const renderResult = (result: TestResult) => {
    const { method, status, data, error, params } = result;
    
    return (
      <div key={method} className="border border-gray-600 rounded-lg p-4 bg-gray-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">{method}</h3>
          <div className="flex items-center gap-2">
            {status === "loading" && <Loading size={16} />}
            {status === "success" && <span className="text-green-400">✓</span>}
            {status === "error" && <span className="text-red-400">✗</span>}
          </div>
        </div>
        
        {params && (
          <div className="text-sm text-gray-400 mb-2">
            参数: {params}
          </div>
        )}
        
        {status === "success" && (
          <pre className="bg-gray-900 p-3 rounded text-sm text-green-300 overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
        
        {status === "error" && (
          <div className="bg-red-900/20 border border-red-500 p-3 rounded text-sm text-red-300">
            错误: {error}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen h-screen bg-black text-white overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 pb-20">
        {/* 头部信息 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">NEAR 合约方法测试</h1>
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">合约地址:</span> 
                <span className="text-blue-300 ml-2">{getContractId()}</span>
              </div>
              <div>
                <span className="text-gray-400">RPC URL:</span> 
                <span className="text-blue-300 ml-2">{getNodeUrl()}</span>
              </div>
              <div>
                <span className="text-gray-400">当前钱包账户:</span> 
                <span className="text-green-300 ml-2">{accountId || "未连接"}</span>
              </div>
              <div>
                <span className="text-gray-400">投注代币:</span> 
                <span className="text-blue-300 ml-2">{getContractConfig().betToken}</span>
              </div>
              <div>
                <span className="text-gray-400">奖励代币:</span> 
                <span className="text-blue-300 ml-2">{getContractConfig().prizeToken}</span>
              </div>
            </div>
            
            {/* 存储注册提示 */}
            {testAccountId && (
              <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500 rounded">
                <h4 className="text-yellow-300 font-semibold mb-2">💡 用户存储注册检查</h4>
                <p className="text-sm text-yellow-200">
                  每个用户在使用代币前需要先注册存储。查看下方测试结果中的 "checkUserStorageStatus" 来了解当前状态。
                </p>
                <div className="mt-2 text-xs text-yellow-300">
                  注册命令示例: {generateStorageDepositCall(getContractConfig().betToken, testAccountId).contractId}
                </div>
              </div>
            )}
          </div>
          
          {/* 测试参数设置 */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">测试参数设置</h2>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">测试账户ID</label>
                <input
                  type="text"
                  value={testAccountId}
                  onChange={(e) => setTestAccountId(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  placeholder="例如: u1.testnet"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">测试游戏ID</label>
                <input
                  type="number"
                  value={testGameId}
                  onChange={(e) => setTestGameId(Number(e.target.value))}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  placeholder="例如: 0"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={runAllTests}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm transition-colors"
                >
                  重新测试
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 测试结果 */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">测试结果</h2>
          <div className="grid gap-6">
            {results.map(renderResult)}
          </div>
        </div>
      </div>
    </div>
  );
} 