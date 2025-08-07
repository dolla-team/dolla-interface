import NearWalletButton from "@/components/button/near-wallet-button";
import { useNearWallet } from "@/contexts/wallet/near";
import CreatePanel from "./create-panel";
import HistoryPanel from "./history-panel";

interface BtcGameCreatorProps {
  className?: string;
}

export default function BtcGameCreator({ className }: BtcGameCreatorProps) {
  const { accountId } = useNearWallet();

  if (!accountId) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <h2 className="text-xl font-semibold text-white mb-4">
          创建 BTC 奖励游戏
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-300 mb-4">请先连接 NEAR 钱包以继续</p>
          <NearWalletButton />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-[10px] ${className}`}>
      <CreatePanel />
      <HistoryPanel />
    </div>
  );
}
