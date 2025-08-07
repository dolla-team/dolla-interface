import Loading from "@/components/icons/loading";
import { useNearWallet } from "@/contexts/wallet/near";
import { useState } from "react";
import axiosInstance from "@/libs/axios";
import V2Button from "@/components/button/v2";

export default function CreatePanel() {
  const { accountId } = useNearWallet();
  const [valueAmount, setValueAmount] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  // Step 1: 获取 BTC 存款地址
  const handleStep1Submit = async () => {
    if (!accountId) {
      setError("请先连接 NEAR 钱包");
      return;
    }
    if (!valueAmount) {
      setError("请输入单次投注金额");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await axiosInstance.get(
        `/apibtc/v1/btc/depositAddr?nearAccount=${accountId}&btcValue=${valueAmount}`
      );
      setResult(result.data.result_data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取 BTC 存款地址失败");
    } finally {
      setLoading(false);
    }
  };

  // 重置到 Step 1
  const resetToStep1 = () => {
    setResult(null);
    setError(null);
    setValueAmount("");
  };

  return (
    <div className="w-[400px] bg-gray-800 rounded-lg py-6 px-4">
      <div className="mb-4 p-3 bg-blue-900/20 border border-[#FFC42F] rounded">
        <p className="text-blue-200 text-sm">
          <strong>当前账户:</strong> {accountId}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">获取 BTC 存款地址</h3>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            单次投注金额 (当前btc的市价，比如1btc，输入114000)
          </label>
          <input
            type="text"
            value={valueAmount}
            onChange={(e) => setValueAmount(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            placeholder="114000 (1 BTC)"
          />
          <p className="text-xs text-gray-400 mt-1">正整数</p>
        </div>

        {/* 结果显示 */}
        {result ? (
          <>
            <div className="mt-4 rounded">
              <h4 className="text-white font-medium mb-2">BTC 存款地址:</h4>
              <pre className="text-green-300 text-sm overflow-x-auto">
                {result}
              </pre>
            </div>
            <V2Button onClick={resetToStep1} type="default" className="w-full">
              重置
            </V2Button>
          </>
        ) : (
          <V2Button
            onClick={handleStep1Submit}
            disabled={loading}
            className="w-full"
          >
            {loading && <Loading size={16} />}
            获取 BTC 存款地址
          </V2Button>
        )}
      </div>

      {/* 错误显示 */}
      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded">
          <p className="text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
}
