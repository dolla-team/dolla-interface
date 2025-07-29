import { useState } from "react";
import { useNearWallet } from "@/contexts/wallet/near";
import { 
  getUserAccount, 
  generateDepositCall, 
  generatePlayGameCall,
  getContractConfig 
} from "@/utils/near-game-actions";
import NearWalletButton from "@/components/button/near-wallet-button";
import Loading from "@/components/icons/loading";

interface PlayerBettingProps {
  className?: string;
}

interface BettingData {
  depositAmount: string;
  gameId: number;
  bets: number;
}

interface AccountInfo {
  account_id?: string;
  balance?: string;
  [key: string]: unknown;
}

export default function PlayerBetting({ className }: PlayerBettingProps) {
  const { accountId, selector } = useNearWallet();
  const [loading, setLoading] = useState(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [bettingData, setBettingData] = useState<BettingData>({
    depositAmount: "1000000000", // 1000 USDC (6 decimals)
    gameId: 0,
    bets: 1
  });
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [storageStatus, setStorageStatus] = useState<{
    betTokenRegistered: boolean;
    prizeTokenRegistered: boolean;
  } | null>(null);
  const [registering, setRegistering] = useState(false);

  // Step 1: 获取账户信息并检查存储注册状态
  const handleGetAccount = async () => {
    if (!accountId) {
      setError("请先连接 NEAR 钱包");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 获取账户信息
      const info = await getUserAccount(accountId);
      setAccountInfo(info);
      
      // 检查存储注册状态
      const { checkUserStorageStatus } = await import("@/utils/near-game-actions");
      const statusResult = await checkUserStorageStatus(accountId);
      setStorageStatus(statusResult);
      
      if (!statusResult.betTokenRegistered || !statusResult.prizeTokenRegistered) {
        setError(
          `⚠️ 存储注册状态检查:\n` +
          `• 投注代币 (USDC): ${statusResult.betTokenRegistered ? '✅ 已注册' : '❌ 未注册'}\n` +
          `• 奖励代币 (WBTC): ${statusResult.prizeTokenRegistered ? '✅ 已注册' : '❌ 未注册'}\n\n` +
          `请先完成存储注册后再进行存款操作。`
        );
      } else {
        setStep(2);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取账户信息失败");
    } finally {
      setLoading(false);
    }
  };

  // 存储注册功能
  const handleStorageRegistration = async () => {
    if (!accountId || !storageStatus) {
      setError("请先连接 NEAR 钱包并检查账户状态");
      return;
    }

    setRegistering(true);
    setError(null);

    try {
      // 显示手动注册命令
      const commands = [];
      
      if (!storageStatus.betTokenRegistered) {
        commands.push(`near call usdcc.fakes.testnet storage_deposit '{"account_id": "${accountId}", "registration_only": true}' --accountId=${accountId} --amount=0.01`);
      }
      
      if (!storageStatus.prizeTokenRegistered) {
        commands.push(`near call wbtc.fakes.testnet storage_deposit '{"account_id": "${accountId}", "registration_only": true}' --accountId=${accountId} --amount=0.01`);
      }

      if (commands.length > 0) {
        setError("🔧 请在终端中执行以下命令完成存储注册:\n\n" + commands.join("\n\n") + 
                 "\n\n注册完成后，请重新点击 '查看账户信息' 按钮检查状态。");
      } else {
        setError("✅ 存储已全部注册完成！");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "存储注册检查失败");
    } finally {
      setRegistering(false);
    }
  };

  // Step 2: 存款
  const handleDeposit = async () => {
    if (!accountId || !selector) {
      setError("请先连接 NEAR 钱包");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const wallet = await selector.wallet();
      const depositCall = generateDepositCall(bettingData.depositAmount);

      console.log("准备执行存款交易:", depositCall);

      const result = await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: depositCall.contractId,
        actions: [{
          type: "FunctionCall",
          params: {
            methodName: depositCall.methodName,
            args: depositCall.args,
            gas: depositCall.gas,
            deposit: depositCall.deposit
          }
        }]
      });

      console.log("存款交易结果:", result);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "存款操作失败");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: 下注游戏
  const handlePlayGame = async () => {
    if (!accountId || !selector) {
      setError("请先连接 NEAR 钱包");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const wallet = await selector.wallet();
      const playCall = generatePlayGameCall(bettingData.gameId, bettingData.bets);

      console.log("准备执行下注交易:", playCall);

      const result = await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: playCall.contractId,
        actions: [{
          type: "FunctionCall",
          params: {
            methodName: playCall.methodName,
            args: playCall.args,
            gas: playCall.gas,
            deposit: playCall.deposit
          }
        }]
      });

      console.log("下注交易结果:", result);
      setError("🎉 下注成功！交易已提交到区块链");
    } catch (err) {
      setError(err instanceof Error ? err.message : "下注操作失败");
    } finally {
      setLoading(false);
    }
  };

  // 重置到第一步
  const resetToStep1 = () => {
    setStep(1);
    setAccountInfo(null);
    setStorageStatus(null);
    setError(null);
  };

  const config = getContractConfig();

  if (!accountId) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <h2 className="text-xl font-semibold text-white mb-4">玩家存款下注</h2>
        <div className="text-center py-8">
          <p className="text-gray-300 mb-4">请先连接 NEAR 钱包以继续</p>
          <NearWalletButton />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">玩家存款下注</h2>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded text-sm ${
            step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
          }`}>
            Step 1
          </span>
          <span className={`px-3 py-1 rounded text-sm ${
            step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
          }`}>
            Step 2
          </span>
          <span className={`px-3 py-1 rounded text-sm ${
            step === 3 ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
          }`}>
            Step 3
          </span>
        </div>
      </div>

      <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500 rounded">
        <p className="text-blue-200 text-sm">
          <strong>当前账户:</strong> {accountId}
        </p>
      </div>

      {/* 合约信息 */}
      <div className="mb-4 p-3 bg-gray-900 rounded">
        <h4 className="text-white font-medium mb-2">合约信息</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <p><strong>主合约:</strong> {config.mainContract}</p>
          <p><strong>投注代币:</strong> {config.betToken}</p>
          <p><strong>奖励代币:</strong> {config.prizeToken}</p>
        </div>
      </div>

      {/* Step 1: 获取账户信息 */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Step 1: 查看账户信息</h3>
          <p className="text-gray-300 text-sm">
            首先查看您在游戏合约中的账户状态并检查存储注册状态
          </p>

          {storageStatus && (
            <div className="p-4 bg-gray-900 rounded">
              <h4 className="text-white font-medium mb-2">存储注册状态</h4>
              <div className="text-sm space-y-1">
                <p className={`${storageStatus.betTokenRegistered ? 'text-green-400' : 'text-red-400'}`}>
                  • 投注代币 (USDC): {storageStatus.betTokenRegistered ? '✅ 已注册' : '❌ 未注册'}
                </p>
                <p className={`${storageStatus.prizeTokenRegistered ? 'text-green-400' : 'text-red-400'}`}>
                  • 奖励代币 (WBTC): {storageStatus.prizeTokenRegistered ? '✅ 已注册' : '❌ 未注册'}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleGetAccount}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loading size={16} />}
              查看账户信息
            </button>

            {storageStatus && (!storageStatus.betTokenRegistered || !storageStatus.prizeTokenRegistered) && (
              <button
                onClick={handleStorageRegistration}
                disabled={registering}
                className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
              >
                {registering && <Loading size={16} />}
                💡 获取存储注册命令
              </button>
            )}

            {storageStatus && storageStatus.betTokenRegistered && storageStatus.prizeTokenRegistered && (
              <button
                onClick={() => setStep(2)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
              >
                ✅ 继续到存款步骤
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step 2: 存款 */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Step 2: 存款操作</h3>
            <button
              onClick={resetToStep1}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              ← 返回 Step 1
            </button>
          </div>

          {accountInfo && (
            <div className="p-4 bg-green-900/20 border border-green-500 rounded">
              <h4 className="text-green-300 font-medium mb-2">✅ 账户信息</h4>
              <pre className="text-green-200 text-sm overflow-x-auto">
                {JSON.stringify(accountInfo, null, 2)}
              </pre>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              存款金额 (amount)
            </label>
            <input
              type="text"
              value={bettingData.depositAmount}
              onChange={(e) => setBettingData({ ...bettingData, depositAmount: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="1000000000 (1000 USDC)"
            />
            <p className="text-xs text-gray-400 mt-1">单位: 微USDC (6位小数)</p>
          </div>

          <button
            onClick={handleDeposit}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loading size={16} />}
            执行存款交易
          </button>
        </div>
      )}

      {/* Step 3: 下注游戏 */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Step 3: 下注游戏</h3>
            <button
              onClick={resetToStep1}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              ← 重新开始
            </button>
          </div>

          <div className="p-4 bg-green-900/20 border border-green-500 rounded">
            <h4 className="text-green-300 font-medium mb-2">✅ 存款完成</h4>
            <p className="text-green-200 text-sm">
              存款金额: {bettingData.depositAmount} 微USDC
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                游戏 ID (game_id)
              </label>
              <input
                type="number"
                value={bettingData.gameId}
                onChange={(e) => setBettingData({ ...bettingData, gameId: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                下注数量 (bets)
              </label>
              <input
                type="number"
                value={bettingData.bets}
                onChange={(e) => setBettingData({ ...bettingData, bets: parseInt(e.target.value) || 1 })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="1"
              />
            </div>
          </div>

          <button
            onClick={handlePlayGame}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loading size={16} />}
            开始下注游戏
          </button>
        </div>
      )}

      {/* 错误/成功显示 */}
      {error && (
        <div className={`mt-4 p-4 rounded ${
          error.includes('🎉') 
            ? 'bg-green-900/20 border border-green-500' 
            : error.includes('🔧') || error.includes('⚠️')
              ? 'bg-yellow-900/20 border border-yellow-500'
              : 'bg-red-900/20 border border-red-500'
        }`}>
          <p className={
            error.includes('🎉') 
              ? 'text-green-300' 
              : error.includes('🔧') || error.includes('⚠️')
                ? 'text-yellow-300'
                : 'text-red-300'
          } style={{ whiteSpace: 'pre-line' }}>
            {error}
          </p>
        </div>
      )}

      {/* 使用说明 */}
      <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500 rounded">
        <h4 className="text-yellow-300 font-medium mb-2">💡 使用说明</h4>
        <div className="text-yellow-200 text-sm space-y-1">
          <p><strong>Step 1:</strong> 查看您在游戏合约中的账户信息</p>
          <p><strong>Step 2:</strong> 向合约存入投注代币 (USDC)</p>
          <p><strong>Step 3:</strong> 选择游戏并进行下注</p>
          <p><strong>注意:</strong> 每个步骤都需要 NEAR 钱包签名确认</p>
        </div>
      </div>
    </div>
  );
} 