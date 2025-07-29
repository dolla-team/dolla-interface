import { useState } from "react";
import { useNearWallet } from "@/contexts/wallet/near";
import { getBtcDepositAddress } from "@/utils/near-game-actions";
import NearWalletButton from "@/components/button/near-wallet-button";
import Loading from "@/components/icons/loading";

interface BtcGameCreatorProps {
  className?: string;
}

interface Step1Data {
  bidUnit: string;
  bep: string; // BTC Equivalent Prize
  btcAddress?: string;
}

interface Step2Data {
  depositMsg: {
    near_account_id: string;
    game_params: {
      bid_unit: string;
      bep: string;
    };
  };
  txHex: string;
  vout: number;
  txBlockBlockhash: string;
  txIndex: number;
  merkleProof: string[];
}

export default function BtcGameCreator({ className }: BtcGameCreatorProps) {
  const { accountId } = useNearWallet();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1Data>({
    bidUnit: "1000000", // 1 USDC (6 decimals)
    bep: "1000000000"   // 1000 USDC worth BTC (6 decimals)
  });
  const [step2Data, setStep2Data] = useState<Step2Data>({
    depositMsg: {
      near_account_id: "",
      game_params: {
        bid_unit: "",
        bep: ""
      }
    },
    txHex: "",
    vout: 0,
    txBlockBlockhash: "",
    txIndex: 0,
    merkleProof: []
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Step 1: 获取 BTC 存款地址
  const handleStep1Submit = async () => {
    if (!accountId) {
      setError("请先连接 NEAR 钱包");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getBtcDepositAddress({
        nearAccountId: accountId,
        bidUnit: step1Data.bidUnit,
        bep: step1Data.bep
      });

      setResult(result);
             setStep1Data({ ...step1Data, btcAddress: JSON.stringify(result) });
      
      // 准备 Step 2 的数据
      setStep2Data({
        ...step2Data,
        depositMsg: {
          near_account_id: accountId,
          game_params: {
            bid_unit: step1Data.bidUnit,
            bep: step1Data.bep
          }
        }
      });

      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取 BTC 存款地址失败");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: 验证 BTC 存款
  const handleStep2Submit = async () => {
    if (!accountId) {
      setError("请先连接 NEAR 钱包");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 这里应该调用 NEAR 钱包来执行合约调用
      // 由于这是一个需要签名的交易，我们需要使用 NEAR 钱包选择器
      
      console.log("准备调用 verify_btc_deposit，参数：", {
        deposit_msg: step2Data.depositMsg,
        tx_hex: step2Data.txHex,
        vout: step2Data.vout,
        tx_block_blockhash: step2Data.txBlockBlockhash,
        tx_index: step2Data.txIndex,
        merkle_proof: step2Data.merkleProof
      });

      // 这里应该通过 NEAR 钱包执行交易
      // const result = await wallet.signAndSendTransaction({...});
      
      setError("注意：Step 2 需要通过 NEAR 钱包执行交易调用 verify_btc_deposit");
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "验证 BTC 存款失败");
    } finally {
      setLoading(false);
    }
  };

  // 重置到 Step 1
  const resetToStep1 = () => {
    setStep(1);
    setResult(null);
    setError(null);
    setStep1Data({
      bidUnit: "1000000",
      bep: "1000000000"
    });
  };

  if (!accountId) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <h2 className="text-xl font-semibold text-white mb-4">创建 BTC 奖励游戏</h2>
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
        <h2 className="text-xl font-semibold text-white">创建 BTC 奖励游戏</h2>
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
        </div>
      </div>

      <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500 rounded">
        <p className="text-blue-200 text-sm">
          <strong>当前账户:</strong> {accountId}
        </p>
      </div>

      {/* Step 1: 获取 BTC 存款地址 */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Step 1: 设置游戏参数并获取 BTC 存款地址</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                单次投注金额 (bid_unit)
              </label>
              <input
                type="text"
                value={step1Data.bidUnit}
                onChange={(e) => setStep1Data({ ...step1Data, bidUnit: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="1000000 (1 USDC)"
              />
              <p className="text-xs text-gray-400 mt-1">单位: 微USDC (6位小数)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                BTC 奖励等值 (bep)
              </label>
              <input
                type="text"
                value={step1Data.bep}
                onChange={(e) => setStep1Data({ ...step1Data, bep: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="1000000000 (1000 USDC)"
              />
              <p className="text-xs text-gray-400 mt-1">单位: 微USDC (6位小数)</p>
            </div>
          </div>

          <button
            onClick={handleStep1Submit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loading size={16} />}
            获取 BTC 存款地址
          </button>
        </div>
      )}

      {/* Step 2: 验证 BTC 存款 */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Step 2: 验证 BTC 存款</h3>
            <button
              onClick={resetToStep1}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              ← 返回 Step 1
            </button>
          </div>

          {step1Data.btcAddress && (
            <div className="p-4 bg-green-900/20 border border-green-500 rounded">
              <h4 className="text-green-300 font-medium mb-2">✅ BTC 存款地址已生成</h4>
                             <p className="text-green-200 text-sm font-mono break-all">
                 {step1Data.btcAddress || ""}
              </p>
              <p className="text-green-200 text-xs mt-2">
                请向此地址发送相应的 BTC，然后填写下方交易信息进行验证
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                交易哈希 (tx_hex)
              </label>
              <textarea
                value={step2Data.txHex}
                onChange={(e) => setStep2Data({ ...step2Data, txHex: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-20"
                placeholder="BTC 交易的完整十六进制数据"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  输出索引 (vout)
                </label>
                <input
                  type="number"
                  value={step2Data.vout}
                  onChange={(e) => setStep2Data({ ...step2Data, vout: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  交易索引 (tx_index)
                </label>
                <input
                  type="number"
                  value={step2Data.txIndex}
                  onChange={(e) => setStep2Data({ ...step2Data, txIndex: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                区块哈希 (tx_block_blockhash)
              </label>
              <input
                type="text"
                value={step2Data.txBlockBlockhash}
                onChange={(e) => setStep2Data({ ...step2Data, txBlockBlockhash: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="包含该交易的 BTC 区块哈希"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Merkle 证明 (merkle_proof)
              </label>
              <textarea
                value={step2Data.merkleProof.join('\n')}
                onChange={(e) => setStep2Data({ 
                  ...step2Data, 
                  merkleProof: e.target.value.split('\n').filter(line => line.trim()) 
                })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-20"
                placeholder="每行一个 Merkle 证明哈希"
              />
              <p className="text-xs text-gray-400 mt-1">每行输入一个哈希值</p>
            </div>
          </div>

          <button
            onClick={handleStep2Submit}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loading size={16} />}
            验证 BTC 存款并创建游戏
          </button>
        </div>
      )}

      {/* 错误显示 */}
      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* 结果显示 */}
      {result && step === 1 && (
                 <div className="mt-4 p-4 bg-gray-900 rounded">
           <h4 className="text-white font-medium mb-2">API 响应结果:</h4>
                      <pre className="text-green-300 text-sm overflow-x-auto">
             {JSON.stringify(result, null, 2)}
           </pre>
         </div>
      )}

      {/* 使用说明 */}
      <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500 rounded">
        <h4 className="text-yellow-300 font-medium mb-2">💡 使用说明</h4>
        <div className="text-yellow-200 text-sm space-y-1">
          <p><strong>Step 1:</strong> 设置游戏参数，获取 BTC 存款地址</p>
          <p><strong>Step 2:</strong> 向获取的地址发送 BTC，然后填写交易信息进行验证</p>
          <p><strong>注意:</strong> Step 2 需要通过链下中继器调用，当前为演示界面</p>
        </div>
      </div>
    </div>
  );
} 