import { useState } from "react";
import useConfig from "@/hooks/near/use-config";
import { useUser } from "@privy-io/react-auth";
import useAccount from "@/hooks/near/use-account";
import useGameAction from "@/hooks/near/use-game-action";
import useWithdraw from "@/hooks/near/use-withdraw";
import Button from "@/components/button";
import useBid from "@/hooks/near/use-bid";
import useMintNft from "@/views/nft-create/hooks/use-mint-nft";
import useCreateNft from "@/hooks/evm/use-create-nft";
import useApprove from "@/hooks/evm/use-approve";
import beraConfig from "@/config/bera";
import useToast from "@/hooks/use-toast";
import useWithdrawEvm from "@/hooks/evm/use-withdraw";

// Constants
const NFT_ADDRESS = "0x0ae4451B85A528b1Bc03D90F3Bc009962Fe737f7";
const NFT_ID = "5";
const BERA_SCAN_URL =
  "https://berascan.com/address/0x0ae4451b85a528b1bc03d90f3bc009962fe737f7#writeContract";

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

// NFT Operations Section Component
function NFTOperationsSection({
  nftNumber,
  approved,
  approve,
  approving,
  checking,
  creating,
  onCreateNft
}: {
  nftNumber: number;
  approved: boolean;
  approve: () => void;
  approving: boolean;
  checking: boolean;
  creating: boolean;
  onCreateNft: () => void;
}) {
  const handleMintNFT = () => {
    window.open(BERA_SCAN_URL, "_blank");
  };

  const handleApproveOrCreate = () => {
    if (approved) {
      onCreateNft();
    } else {
      approve();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">NFT Operations</h2>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Current NFT Balance:</span>
          <span className="font-semibold text-lg">{nftNumber}</span>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full h-10 !bg-purple-600 text-white rounded-lg transition-colors border border-purple-600"
            onClick={handleMintNFT}
          >
            Mint NFT (External)
          </Button>

          <Button
            className="w-full h-10 !bg-green-600 text-white rounded-lg transition-colors border border-green-600"
            onClick={handleApproveOrCreate}
            loading={creating || approving || checking}
            disabled={creating || approving || checking}
          >
            {approved ? "Create NFT Pool" : "Approve NFT"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Trading Operations Section Component
function TradingOperationsSection({
  withdraw,
  withdrawing,
  onBid,
  biding
}: {
  withdraw: (params: any) => void;
  withdrawing: boolean;
  onBid: (amount: number) => void;
  biding: boolean;
}) {
  const handleWithdraw = () => {
    withdraw({
      fromToken: {
        assetId:
          "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        address:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        decimals: 6
      },
      toToken: {
        assetId:
          "nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near"
      },
      account: "0x229E549c97C22b139b8C05fba770D94C086853d8",
      amount: "0.5"
    });
  };
  const { withdrawing: withdrawingEvm, onWithdraw: onWithdrawEvm } =
    useWithdrawEvm(() => {
      console.log("Withdraw success");
    });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Trading Operations
      </h2>

      <div className="grid grid-cols-1 gap-3">
        <Button
          className="w-full h-10 !bg-orange-600 text-white rounded-lg transition-colors border border-orange-600"
          loading={withdrawing}
          onClick={handleWithdraw}
          disabled={withdrawing}
        >
          Withdraw (0.5 USDC)
        </Button>

        <Button
          className="w-full h-10 !bg-yellow-600 text-white rounded-lg transition-colors border border-yellow-600"
          onClick={() => {
            onWithdrawEvm({
              type: "coin",
              amount: "1000000",
              address: "0x26591f0f2bbab1bb3cd457eE1dfd80EAE1474C6c",
              receiveAddress: "0x229E549c97C22b139b8C05fba770D94C086853d8"
            });
          }}
          loading={withdrawingEvm}
        >
          Withdraw Evm USDC
        </Button>

        <Button
          className="w-full h-10 !bg-red-600 text-white rounded-lg transition-colors border border-red-600"
          onClick={() => onBid(1)}
          loading={biding}
          disabled={biding}
        >
          Place Bid (1)
        </Button>
      </div>
    </div>
  );
}

// Account Info Section Component
function AccountInfoSection({
  account,
  config
}: {
  account: any;
  config: any;
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Account Information
      </h2>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Account Status:</span>
          <span
            className={`px-2 py-1 rounded text-xs ${
              account
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {account ? "Connected" : "Not Connected"}
          </span>
        </div>

        <Button
          className="w-full h-8 !bg-gray-600 text-white rounded text-sm border border-gray-600"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide" : "Show"} Details
        </Button>

        {showDetails && (
          <div className="mt-3 space-y-2">
            <div>
              <span className="text-xs text-gray-500">Account:</span>
              <pre className="text-xs bg-white p-2 rounded border overflow-auto">
                {JSON.stringify(account, null, 2)}
              </pre>
            </div>
            <div>
              <span className="text-xs text-gray-500">Config:</span>
              <pre className="text-xs bg-white p-2 rounded border overflow-auto">
                {JSON.stringify(config, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Demo() {
  const { user } = useUser();
  const { config } = useConfig();
  const { account } = useAccount(user?.wallet?.address || "");

  // Trading hooks
  const { withdraw, loading: withdrawing } = useWithdraw();
  const { onBid, biding } = useBid(
    0,
    () => console.log("bid success"),
    () => console.log("tx success"),
    () => console.log("tx fail")
  );

  // Game management hooks
  const { getAllGames, resumeGame, pauseGame, cancelGame } = useGameAction({
    gameId: "0"
  });

  // NFT hooks
  const { nftNumber } = useMintNft(NFT_ADDRESS);
  const { approve, approved, approving, checking } = useApprove({
    token: {
      address: NFT_ADDRESS,
      id: NFT_ID,
      type: "nft"
    },
    spender: beraConfig.bettingContractAddress,
    amount: "1"
  });
  const { creating, onCreate: onCreateNft } = useCreateNft({
    token: {
      address: NFT_ADDRESS,
      id: NFT_ID
    },
    onCreateSuccess: () => console.log("NFT pool created successfully")
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
          <AccountInfoSection account={account} config={config} />
          <NFTOperationsSection
            nftNumber={nftNumber}
            approved={approved}
            approve={approve}
            approving={approving}
            checking={checking}
            creating={creating}
            onCreateNft={onCreateNft}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GameManagementSection
            getAllGames={getAllGames}
            pauseGame={pauseGame}
            resumeGame={resumeGame}
            cancelGame={cancelGame}
          />
          <TradingOperationsSection
            withdraw={withdraw}
            withdrawing={withdrawing}
            onBid={onBid}
            biding={biding}
          />
        </div>
      </div>
    </div>
  );
}
