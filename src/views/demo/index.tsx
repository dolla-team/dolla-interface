import useConfig from "@/hooks/near/use-config";
import useDeposit from "@/hooks/near/use-deposit";
import { useUser } from "@privy-io/react-auth";
import useAccount from "@/hooks/near/use-account";
import useGameAction from "@/hooks/near/use-game-action";
import useGenerateKey from "@/hooks/near/use-generate-key";
import useClaim from "@/hooks/near/use-claim";

export default function Demo() {
  const { generateDepositAddress, loading, depositAddress } = useDeposit();
  const { user } = useUser();
  const { config } = useConfig();
  const { updateAk, publicKey, createKeyPair, saveKeyPair } = useGenerateKey();
  const { account } = useAccount(user?.wallet?.address || "");

  const {
    createGame,
    createGameAddress,
    getAllGames,
    resumeGame,
    pauseGame,
    cancelGame
  } = useGameAction({
    gameId: "2"
  });

  const { claim } = useClaim({
    evmAddress: user?.wallet?.address || ""
  });

  return (
    <div>
      <div>accountId: {JSON.stringify(account)}</div>
      <div>config: {JSON.stringify(config)}</div>
      <div>depositAddress: {depositAddress}</div>
      <button
        className="border border-red-500"
        onClick={async () => {
          const result = await generateDepositAddress({
            // https://1click.chaindefuser.com/v0/tokens
            originAsset:
              "nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near",
            destinationAsset:
              "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
            amount: "100000",
            evmAddress: user?.wallet?.address || "",
            slippageTolerance: 50,
            refundTo: "0x229E549c97C22b139b8C05fba770D94C086853d8"
          });
        }}
      >
        Fetch Quote
      </button>

      <div>createGameAddress: {createGameAddress}</div>

      <div>
        <button
          className="border border-red-500"
          onClick={async () => {
            const result = await createGame({
              evmAddress: user?.wallet?.address || "",
              originAsset:
                "nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near",
              destinationAsset:
                "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
              amount: "100000",
              refundTo: "0x86cdCd7fA9F3B24D68CbDD9170C3662036BDC2ef",
              price: 1
            });
            console.log("result:", result);
          }}
        >
          Create Game
        </button>
      </div>

      <div>
        <button
          className="border border-red-500"
          onClick={async () => {
            const result = await getAllGames();
            console.log("result:", result);
          }}
        >
          Get All Games
        </button>
      </div>

      <div>
        <button
          className="border border-red-500"
          onClick={async () => {
            const result = await pauseGame();
            console.log("result:", result);
          }}
        >
          Pause Game
        </button>
      </div>

      <div>
        <button
          className="border border-red-500"
          onClick={async () => {
            const result = await resumeGame();
            console.log("result:", result);
          }}
        >
          Resume Game
        </button>
      </div>

      <div>
        <button
          className="border border-red-500"
          onClick={async () => {
            const result = await cancelGame();
            console.log("result:", result);
          }}
        >
          Cancel Game
        </button>
      </div>

      <div>
        <button
          className="border border-red-500"
          onClick={async () => {
            const result = await claim({
              gameId: "2",
              evmAddress: user?.wallet?.address || "",
              originAsset:
                "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
              destinationAsset:
                "nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near",
              amount: "89998",
              refundTo: import.meta.env.VITE_NEAR_ACCOUNT_ID
            });
            console.log("result:", result);
          }}
        >
          claim
        </button>
      </div>

      <div>
        <button
          className="border border-red-500"
          onClick={async () => {
            const { publicKey, keyPairSigner, privateKey } = createKeyPair();
            const result = await updateAk({
              evmAddress: user?.wallet?.address || "",
              publicKey: publicKey,
              nonce: account?.nonce
            });

            if (result) {
              saveKeyPair(publicKey, keyPairSigner, privateKey);
            }
          }}
        >
          Update Ak
        </button>
      </div>
    </div>
  );
}
