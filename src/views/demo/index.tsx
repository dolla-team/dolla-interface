import { useRef, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import useGameAction from "@/hooks/near/use-game-action";
import Button from "@/components/button";
import useToast from "@/hooks/use-toast";
import UserShareCard from "@/sections/share/user";
import { useDomToImage } from "@/sections/share/use-share";
import PoolShareCard from "@/sections/share/pool";

// Game Management Section Component
function GameManagementSection({
  getAllGames,
  pauseGame,
  resumeGame,
  cancelGame
}: {
  getAllGames: () => Promise<any>;
  pauseGame: () => Promise<any>;
  resumeGame: () => Promise<any>;
  cancelGame: () => Promise<any>;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const toast = useToast();

  const handleGameAction = async (
    action: () => Promise<any>,
    actionName: string
  ) => {
    try {
      setLoading(actionName);
      const result = await action();
      console.log(`${actionName} result:`, result);
      toast.success({ title: `${actionName} completed successfully` });
    } catch (error) {
      console.error(`${actionName} error:`, error);
      toast.fail({ title: `${actionName} failed` });
    } finally {
      setLoading(null);
    }
  };

  const gameActions = [
    { name: "Get All Games", action: getAllGames },
    { name: "Pause Game", action: pauseGame },
    { name: "Resume Game", action: resumeGame },
    { name: "Cancel Game", action: cancelGame }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Game Management</h2>
      <div className="grid grid-cols-2 gap-3">
        {gameActions.map(({ name, action }) => (
          <Button
            key={name}
            className="w-full h-10 !bg-blue-600 text-white rounded-lg transition-colors border border-blue-600"
            onClick={() => handleGameAction(action, name)}
            loading={loading === name}
            disabled={loading !== null}
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
}
// Export Wallet Section Component
function ExportWalletSection({ exportWallet }: { exportWallet: () => void }) {
  const [exporting, setExporting] = useState(false);
  const toast = useToast();

  const handleExportWallet = async () => {
    try {
      setExporting(true);
      await exportWallet();
      toast.success({ title: "Wallet export initiated" });
    } catch (error) {
      console.error("Export wallet error:", error);
      toast.fail({ title: "Failed to export wallet" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Export Wallet Demo
      </h2>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-3">
          Export your wallet's private key securely using Privy's built-in
          export functionality.
        </p>

        <Button
          className="w-full h-10 !bg-pink-600 text-white rounded-lg transition-colors border border-pink-600"
          onClick={handleExportWallet}
          loading={exporting}
          disabled={exporting}
        >
          {exporting ? "Exporting..." : "Export Wallet"}
        </Button>

        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-xs text-yellow-800">
            ⚠️ This will open a secure dialog to export your private key. Keep
            it safe and never share it with anyone.
          </p>
        </div>
      </div>
    </div>
  );
}

// Account Info Section Component
function ShareSection() {
  const cardRef = useRef<HTMLDivElement>(null);

  const { generateAndDownload, generateAndShare } = useDomToImage();

  // Handle image download
  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      await generateAndDownload(
        cardRef.current,
        `user-share-player-${Date.now()}`,
        {
          format: "png",
          quality: 1,
          pixelRatio: 2,
          backgroundColor: "#000000"
        }
      );
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed, please try again");
    }
  };

  // Handle image sharing
  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      await generateAndShare(
        cardRef.current,
        {
          format: "png",
          quality: 2,
          pixelRatio: 2,
          backgroundColor: "#000000"
        },
        {
          url: window.location.href
        }
      );
    } catch (error) {
      console.error("Share failed:", error);
      alert("Share failed, please try again");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Share</h2>
      <div>
        <UserShareCard type="player" cardRef={cardRef} />
        <PoolShareCard cardRef={cardRef} />
      </div>
      <div className="bg-gray-50 p-4 rounded-lg flex gap-[10px]">
        <Button
          className="w-full h-8 !bg-gray-600 text-white rounded text-sm border border-gray-600"
          onClick={handleDownload}
        >
          Download Image
        </Button>
        <Button
          className="w-full h-8 !bg-gray-600 text-white rounded text-sm border border-gray-600"
          onClick={handleShare}
        >
          Share on Twitter
        </Button>
      </div>
    </div>
  );
}

export default function Demo() {
  const { exportWallet } = usePrivy(); // Get exportWallet from usePrivy hook

  // Game management hooks
  const { getAllGames, resumeGame, pauseGame, cancelGame } = useGameAction({
    gameId: "0"
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Demo Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your blockchain operations and NFT interactions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ShareSection />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <ExportWalletSection exportWallet={exportWallet} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GameManagementSection
            getAllGames={getAllGames}
            pauseGame={pauseGame}
            resumeGame={resumeGame}
            cancelGame={cancelGame}
          />
        </div>
      </div>
    </div>
  );
}
