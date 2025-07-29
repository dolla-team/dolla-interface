import { Link } from "react-router-dom";

export default function ToolsPage() {
  return (
    <div className="h-screen bg-black text-white overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 pb-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">NEAR 游戏工具集</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* NEAR 合约测试 */}
          <Link
            to="/near-test"
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">
                NEAR 合约测试
              </h3>
            </div>
            <p className="text-gray-300 mb-4">
              测试 NEAR 智能合约的各种视图方法和用户存储状态检查
            </p>
            <div className="text-sm text-gray-400">
              <p>• 合约方法调用测试</p>
              <p>• 账户信息查询</p>
              <p>• 游戏数据获取</p>
              <p>• 存储状态检查</p>
            </div>
          </Link>

          {/* BTC 游戏创建 */}
          <Link
            to="/btc-creator"
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-xl">₿</span>
              </div>
              <h3 className="text-xl font-semibold group-hover:text-orange-400 transition-colors">
                BTC 奖励游戏创建
              </h3>
            </div>
            <p className="text-gray-300 mb-4">
              创建以 BTC 为奖励的游戏，支持 BTC 存款地址生成和验证
            </p>
            <div className="text-sm text-gray-400">
              <p>• BTC 存款地址生成</p>
              <p>• 游戏参数设置</p>
              <p>• BTC 存款验证</p>
              <p>• 智能钱包集成</p>
            </div>
          </Link>

          {/* 玩家下注 */}
          <Link
            to="/player-betting"
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-xl">🎲</span>
              </div>
              <h3 className="text-xl font-semibold group-hover:text-green-400 transition-colors">
                玩家存款下注
              </h3>
            </div>
            <p className="text-gray-300 mb-4">
              玩家参与游戏的完整流程：账户查看、代币存款、游戏下注
            </p>
            <div className="text-sm text-gray-400">
              <p>• 账户状态查询</p>
              <p>• USDC 代币存款</p>
              <p>• 游戏下注操作</p>
              <p>• 交易状态跟踪</p>
            </div>
          </Link>
        </div>

        {/* 快速开始 */}
        <div className="mt-16 bg-gray-900 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">🚀 快速开始</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-400">游戏创建者</h3>
              <ol className="text-gray-300 space-y-2 text-sm">
                <li>1. 使用 <strong>NEAR 合约测试</strong> 熟悉合约接口</li>
                <li>2. 通过 <strong>BTC 游戏创建</strong> 设置新游戏</li>
                <li>3. 获取 BTC 存款地址并验证存款</li>
                <li>4. 游戏创建完成，等待玩家参与</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-400">游戏玩家</h3>
              <ol className="text-gray-300 space-y-2 text-sm">
                <li>1. 连接 NEAR 钱包到应用</li>
                <li>2. 使用 <strong>玩家下注工具</strong> 查看账户</li>
                <li>3. 存入 USDC 代币到游戏合约</li>
                <li>4. 选择游戏并执行下注操作</li>
              </ol>
            </div>
          </div>
        </div>

        {/* 环境要求 */}
        <div className="mt-12 bg-yellow-900/20 border border-yellow-500 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-yellow-300">⚙️ 环境要求</h3>
          <div className="text-yellow-200 text-sm space-y-2">
            <p>• <strong>NEAR 钱包:</strong> 支持 MyNearWallet、Meteor Wallet、Here Wallet 等</p>
            <p>• <strong>网络:</strong> NEAR 测试网 (testnet)</p>
            <p>• <strong>代币:</strong> 需要 USDC 测试代币进行存款和下注</p>
            <p>• <strong>存储:</strong> 首次使用需要进行代币存储注册</p>
          </div>
        </div>

        {/* 技术架构 */}
        <div className="mt-12 bg-gray-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">🔧 技术架构</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-blue-400 mb-2">前端技术</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• React + TypeScript</li>
                <li>• Vite 构建工具</li>
                <li>• Tailwind CSS</li>
                <li>• React Router</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-400 mb-2">区块链集成</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• NEAR API JS</li>
                <li>• Wallet Selector</li>
                <li>• 智能合约调用</li>
                <li>• 交易状态管理</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-orange-400 mb-2">游戏功能</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• BTC 地址生成</li>
                <li>• 代币存取管理</li>
                <li>• 游戏状态跟踪</li>
                <li>• 奖励分配系统</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 