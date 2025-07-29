import BtcGameCreator from "@/components/btc-game-creator";

export default function BtcCreatorPage() {
  return (
    <div className="min-h-screen h-screen bg-black text-white overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">BTC 奖励游戏创建工具</h1>
          <p className="text-gray-300">
            通过两个简单步骤创建 BTC 奖励游戏：获取存款地址 → 验证 BTC 存款
          </p>
        </div>
        
        <BtcGameCreator />
      </div>
    </div>
  );
} 