import PlayerBetting from "@/components/player-betting";

export default function PlayerBettingPage() {
  return (
    <div className="min-h-screen h-screen bg-black text-white overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">玩家存款下注工具</h1>
          <p className="text-gray-300">
            通过三个简单步骤进行游戏：查看账户 → 存款代币 → 下注游戏
          </p>
        </div>
        
        <PlayerBetting />
      </div>
    </div>
  );
} 