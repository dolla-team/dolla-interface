import { useState } from "react";
import dayjs from "dayjs";
import { getProvider, quote, viewMethod, getNonce } from "./util";
import { transactions } from "near-api-js";
import useAccount from "./use-account";
import { PublicKey } from "near-api-js/lib/utils/key_pair";
import useGenerateKey from "./use-generate-key";
import { AccessKey, functionCall } from "near-api-js/lib/transaction";
import { base_decode } from "near-api-js/lib/utils/serialize";

const THIRTY_TGAS = "300000000000000";
export default function useGameAction({
    evmAddress,
    gameId,
}: {
    evmAddress: string;
    gameId?: string;
}) {
    const { account } = useAccount(evmAddress);
    const { publicKey, keyPairSigner } = useGenerateKey();
    const [loading, setLoading] = useState(false);
    const [createGameAddress, setCreateGameAddress] = useState<string | null>(null);
    async function createGame({
        swapType = "EXACT_INPUT",
        evmAddress,
        slippageTolerance = 50,
        originAsset,
        depositType = "ORIGIN_CHAIN",
        destinationAsset,
        amount,
        refundTo,
        refundType = "ORIGIN_CHAIN",
        recipientType = "DESTINATION_CHAIN",
        referral = "referral",
        quoteWaitingTimeMs = 3000,
    }: {
        swapType?: string;
        evmAddress: string;
        slippageTolerance?: number;
        originAsset: string;
        depositType?: string;
        destinationAsset: string;
        amount: string;
        refundTo: string;
        refundType?: string;
        recipientType?: string;
        referral?: string;
        quoteWaitingTimeMs?: number;
    }) {
        try {
            setLoading(true);
            const body = {
                dry: false,
                swapType,
                slippageTolerance,
                originAsset,
                depositType,
                destinationAsset,
                amount,
                refundTo,
                refundType,
                recipient: import.meta.env.VITE_NEAR_ACCOUNT_ID,
                recipientType,
                deadline: dayjs().add(1, 'hour').toISOString(),
                referral,
                quoteWaitingTimeMs,
                customRecipientMsg: JSON.stringify({
                    u: {
                        Evm: evmAddress.replace(/^0x/, "")
                    },
                    b: { Cg: ['10', '50000'] }
                })
            };

            const data = await quote(body)

            if (data) {
                setCreateGameAddress(data.quote.depositAddress)
                return data.quote.depositAddress
            } else {
                return null
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function pauseGame() {

        if (!keyPairSigner) {
            return;
        }

        try {
            setLoading(true);

            const provider = getProvider();
            const { header } = await provider.block({ finality: 'final' });

            const gameArgs = { "game_args": { "ByAk": { "game_id": Number(gameId) } } }

            const nonce = await getNonce(publicKey);

            const transaction = transactions.createTransaction(
                import.meta.env.VITE_NEAR_ACCOUNT_ID,
                PublicKey.from(publicKey),
                import.meta.env.VITE_NEAR_ACCOUNT_ID,
                nonce,
                [functionCall('pause_game', gameArgs, BigInt(THIRTY_TGAS), BigInt(0))],
                base_decode(header.hash)
            )

            console.log('transaction:', transaction);

            const [, signedTransaction] = await keyPairSigner.signTransaction(transaction);

            console.log('signedTransaction:', signedTransaction);

            const result: any = await provider.sendTransaction(signedTransaction);

            if (result.status.SuccessValue) {
                console.log('success:', result);
            } else {
                console.log('fail:', result);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function resumeGame() {
        if (!keyPairSigner) {
            return;
        }

        try {
            setLoading(true);

            const provider = getProvider();
            const { header } = await provider.block({ finality: 'final' });

            const gameArgs = { "game_args": { "ByAk": { "game_id": Number(gameId) } } };
            const nonce = await getNonce(publicKey);

            const transaction = transactions.createTransaction(
                import.meta.env.VITE_NEAR_ACCOUNT_ID,
                PublicKey.from(publicKey),
                import.meta.env.VITE_NEAR_ACCOUNT_ID,
                nonce,
                [functionCall('resume_game', gameArgs, BigInt(THIRTY_TGAS), BigInt(0))],
                base_decode(header.hash)
            );

            const [, signedTransaction] = await keyPairSigner.signTransaction(transaction);

            const result: any = await provider.sendTransaction(signedTransaction);

            if (result.status.SuccessValue) {
                console.log('success:', result);
            } else {
                console.log('fail:', result);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function cancelGame() {
        if (!keyPairSigner) {
            return;
        }

        try {
            setLoading(true);

            const provider = getProvider();
            const { header } = await provider.block({ finality: 'final' });

            const gameArgs = { "game_args": { "ByAk": { "game_id": Number(gameId) } } };
            const nonce = await getNonce(publicKey);
            const transaction = transactions.createTransaction(
                import.meta.env.VITE_NEAR_ACCOUNT_ID,
                PublicKey.from(publicKey),
                import.meta.env.VITE_NEAR_ACCOUNT_ID,
                nonce,
                [functionCall('cancel_game', gameArgs, BigInt(THIRTY_TGAS), BigInt(0))],
                base_decode(header.hash)
            );

            const [, signedTransaction] = await keyPairSigner.signTransaction(transaction);

            const result: any = await provider.sendTransaction(signedTransaction);


            if (result.status.SuccessValue) {
                console.log('success:', result);
            } else {
                console.log('fail:', result);
            }

            return result;

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function getAllGames() {
        const res = await viewMethod({
            method: "list_games",
            args: {},
        });


        return res;
    }


    return {
        createGame,
        pauseGame,
        resumeGame,
        cancelGame,
        getAllGames,
        loading,
        createGameAddress,
    };
}