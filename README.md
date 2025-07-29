# Dolla Interface

## 功能页面

### 🛠️ 工具集合页面
访问：http://localhost:3000/tools

**综合导航页面，包含所有工具的介绍和快速访问链接**

### NEAR 合约测试页面
访问：http://localhost:3000/near-test

### BTC 奖励游戏创建工具
访问：http://localhost:3000/btc-creator

**功能特点：**
- **智能钱包检测** - 自动检测 NEAR 钱包连接状态
- **两步式流程** - Step 1: 获取 BTC 存款地址，Step 2: 验证 BTC 存款
- **参数输入界面** - 提供直观的表单输入游戏参数
- **实时状态反馈** - 显示操作进度和结果

**使用流程：**
1. 连接 NEAR 钱包（如未连接会自动引导）
2. 设置游戏参数（投注金额、BTC 奖励等值）
3. 获取 BTC 存款地址
4. 向地址发送 BTC 后填写交易信息进行验证

### 玩家存款下注工具
访问：http://localhost:3000/player-betting

**功能特点：**
- **三步式流程** - Step 1: 查看账户信息，Step 2: 存款代币，Step 3: 下注游戏
- **智能合约交互** - 直接通过 NEAR 钱包执行区块链交易
- **实时交易状态** - 显示交易进度和结果反馈
- **参数自定义** - 支持自定义存款金额、游戏ID和下注数量

**使用流程：**
1. 连接 NEAR 钱包（如未连接会自动引导）
2. 查看您在游戏合约中的账户状态
3. **重要**: 检查并完成存储注册（首次使用必需）
4. 存入 USDC 代币到游戏合约
5. 选择游戏并执行下注操作

**常见问题解决：**

如果遇到 `"The account xxx is not registered"` 错误，说明您的账户还未在代币合约上注册存储。请按以下步骤解决：

1. 在玩家下注工具中点击 "查看账户信息"
2. 系统会自动检查存储注册状态
3. 如未注册，点击 "💡 获取存储注册命令" 按钮
4. 复制显示的命令到终端执行
5. 注册完成后重新检查状态

**手动注册命令示例：**
```bash
# 注册投注代币存储
near call usdcc.fakes.testnet storage_deposit '{"account_id": "你的账户.testnet", "registration_only": true}' --accountId=你的账户.testnet --amount=0.01

# 注册奖励代币存储  
near call wbtc.fakes.testnet storage_deposit '{"account_id": "你的账户.testnet", "registration_only": true}' --accountId=你的账户.testnet --amount=0.01
```

## NEAR 合约测试功能

### 功能说明
测试页面包含以下 NEAR 合约方法的测试：

1. **getAccountsCount** - 获取账户总数
2. **listGames** - 获取游戏列表  
3. **getAccount** - 获取指定账户信息
4. **getGame** - 获取单个游戏信息
5. **getGameBetsByAccount** - 获取指定账户在游戏中的投注
6. **getGameBets** - 获取游戏的所有投注

### 合约信息
- **合约地址**: demo2.nsam.testnet
- **网络**: NEAR Testnet
- **RPC URL**: https://rpc.testnet.near.org

### 使用方法
1. 启动开发服务器：`npm run dev`
2. 访问测试页面：http://localhost:3000/near-test
3. 修改测试参数（账户ID、游戏ID）
4. 点击"重新测试"按钮查看结果

### 环境变量配置
确保 `.env` 文件包含以下配置：
```
VITE_NEAR_CONTRACT_ADDRESS=demo2.nsam.testnet
VITE_NEAR_NETWORK_ID=testnet
VITE_NEAR_NODE_URL=https://rpc.testnet.near.org
```
