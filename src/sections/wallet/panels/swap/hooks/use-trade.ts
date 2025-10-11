import { useCallback, useRef, useState } from "react";
import useToast from "@/hooks/use-toast";
import { getNonce, getProvider, quote, viewMethod } from "@/hooks/near/util";
import { transactions } from "near-api-js";
import { PublicKey } from "near-api-js/lib/utils/key_pair";
import { functionCall } from "near-api-js/lib/transaction";
import { base_decode } from "near-api-js/lib/utils/serialize";
import { useSettingsStore } from "../stores/settings";
import dayjs from "dayjs";
import Big from "big.js";
import useGenerateKey from "@/hooks/near/use-generate-key";
import { useAuth } from "@/contexts/auth";
import useReport from "@/hooks/transaction/use-report";
import { NEAR_REFUND_ACCOUNT } from "@/config";

const THIRTY_TGAS = "300000000000000";

export default function useTrade({ onSuccess }: any) {
  const slippage: any = useSettingsStore((store: any) => store.slippage);
  const [loading, setLoading] = useState(false);
  const [trade, setTrade] = useState<any>();
  const toast = useToast();
  const lastestCachedKey = useRef("");
  const cachedTokens = useRef<any>(null);
  const prices = {};
  const { generateKeyPair } = useGenerateKey();
  const { address } = useAuth();
  const { report } = useReport();
  const { nearAccount } = useAuth();

  const onQuoter = useCallback(
    async ({ inputCurrency, outputCurrency, inputCurrencyAmount }: any) => {
      setTrade(null);
      if (!inputCurrency || !outputCurrency || !inputCurrencyAmount) {
        return;
      }

      lastestCachedKey.current = `${inputCurrency.address}-${outputCurrency.address}-${inputCurrencyAmount}`;

      try {
        setLoading(true);

        const { publicKey } = await generateKeyPair();

        const msg: any = {
          u: {
            Evm: address.replace(/^0x/, "").toLowerCase()
          },
          b: "Deposit",
          k: publicKey
        };

        const _amount = Big(inputCurrencyAmount)
          .mul(10 ** inputCurrency.decimals)
          .toFixed(0);

        const data = await quote({
          dry: false,
          swapType: "EXACT_INPUT",
          slippageTolerance: 50,
          originAsset: inputCurrency.assetId,
          depositType: "ORIGIN_CHAIN",
          destinationAsset: outputCurrency.assetId,
          amount: _amount,
          refundTo: NEAR_REFUND_ACCOUNT,
          refundType: "ORIGIN_CHAIN",
          recipient: import.meta.env.VITE_NEAR_ACCOUNT_ID,
          recipientType: "DESTINATION_CHAIN",
          deadline: dayjs().add(1, "hour").toISOString(),
          customRecipientMsg: JSON.stringify(msg)
        });

        if (!data) {
          throw new Error("No Data.");
        }

        if (
          `${inputCurrency.address}-${outputCurrency.address}-${inputCurrencyAmount}` !==
          lastestCachedKey.current
        ) {
          setLoading(false);
          return;
        }

        let priceImpact = Big(data.quote.amountInUsd)
          .minus(data.quote.amountOutUsd)
          .div(data.quote.amountInUsd)
          .mul(100);

        let priceImpactType = 0;

        if (Big(priceImpact).gt(100)) {
          priceImpact = Big(100);
        }
        if (
          Big(priceImpact || 0)
            .abs()
            .gt(1)
        ) {
          priceImpactType = 1;
        }
        if (
          Big(priceImpact || 0)
            .abs()
            .gt(2)
        ) {
          priceImpactType = 2;
        }

        // const gasUsd = Big(Number(result.gasUseEstimateUSD)).toFixed(18);
        const balance = inputCurrency.isBaseToken
          ? nearAccount?.prizeBalance
          : nearAccount?.balance;

        const trade = {
          inputCurrency,
          outputCurrency,
          inputCurrencyAmount,
          isMax: inputCurrencyAmount === balance,
          name: "Near Intents",
          noPair: false,
          amount: _amount,
          outputCurrencyAmount: data.quote.amountOutFormatted,
          routerStr: `${inputCurrency.symbol} -> ${outputCurrency.symbol}`,
          isGasEnough: true,
          priceImpact: priceImpact.toFixed(2),
          priceImpactType,
          gasUsd: 0,
          recipientAccount: data.quote.depositAddress
        };

        setTrade(trade);
        setLoading(false);
      } catch (err: any) {
        console.log(err);
        setTrade(null);
        setLoading(false);
        toast.info({
          title: err.message
        });
      }
    },
    [slippage, prices, cachedTokens]
  );

  const onSwap = useCallback(async () => {
    setLoading(true);
    let toastId = toast.loading({ title: "Swapping..." });
    try {
      const { publicKey, keyPairSigner } = await generateKeyPair();

      const provider = getProvider();
      const { header } = await provider.block({ finality: "final" });

      const _args: any = {
        token: { FT: trade.inputCurrency.address },
        recipient_account: trade.recipientAccount
      };

      if (!trade.isMax) {
        _args.amount = trade.amount;
      }

      const withdrawArgs = {
        withdraw_args: {
          ByAk: _args
        }
      };

      console.log("swapArgs:", JSON.stringify(withdrawArgs));
      const nonce = await getNonce(publicKey);
      const publicKeyObj = PublicKey.from(publicKey);

      const transaction = transactions.createTransaction(
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        publicKeyObj,
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        nonce,
        [
          functionCall("withdraw", withdrawArgs, BigInt(THIRTY_TGAS), BigInt(0))
        ],
        base_decode(header.hash)
      );

      const [, signedTransaction] = await keyPairSigner.signTransaction(
        transaction
      );
      console.log("signedTransaction:", signedTransaction);
      const result: any = await provider.sendTransaction(signedTransaction);
      toast.dismiss(toastId);
      report({
        address: trade.recipientAccount,
        type: "swap"
      });
      if (result.status.SuccessValue !== undefined) {
        console.log("Swap success:", result);
        toast.success({ title: "Swap success" });
        onSuccess?.();
      } else {
        console.log("Swap failed:", result);
        toast.fail({ title: "Swap failed" });
      }
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Swap failed!`
      });
      console.log(err);
      setLoading(false);
    }
  }, [trade]);

  return { loading, trade, onQuoter, onSwap };
}
