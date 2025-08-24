import Big from "big.js";
import { useCallback, useRef, useState } from "react";
import useToast from "@/hooks/use-toast";
import quoter from "@/sdks/smart-router";
import { useAccount } from "@/hooks/evm/use-account";
import { useSettingsStore } from "../stores/settings";
import useGelatonetwork from "@/hooks/evm/use-gelatonetwork";

export default function useTrade({ chainId, template, from, onSuccess }: any) {
  const slippage: any = useSettingsStore((store: any) => store.slippage);
  const [loading, setLoading] = useState(false);
  const [trade, setTrade] = useState<any>();
  const { account, provider } = useAccount();
  const toast = useToast();
  const lastestCachedKey = useRef("");
  const cachedTokens = useRef<any>(null);
  const prices = {};
  const { executeTransaction } = useGelatonetwork();

  const onQuoter = useCallback(
    async ({
      inputCurrency,
      outputCurrency,
      inputCurrencyAmount,
      template: _template
    }: any) => {
      setTrade(null);
      if (
        !inputCurrency ||
        !outputCurrency ||
        !inputCurrencyAmount ||
        !provider ||
        !account
      ) {
        return;
      }

      lastestCachedKey.current = `${inputCurrency.address}-${outputCurrency.address}-${inputCurrencyAmount}`;

      try {
        setLoading(true);

        const params: any = {
          inputCurrency,
          outputCurrency,
          inputAmount: inputCurrencyAmount,
          slippage: slippage / 100 || 0.005,
          account
        };

        if (typeof template === "string") {
          params.template = template;
        } else {
          params.templates = template;
        }

        const data = await quoter(params);

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

        const response = await fetch(
          `https://backend.kodiak.finance/quote?protocols=v2%2Cv3%2Cmixed&tokenInAddress=${
            inputCurrency.isNative ? "BERA" : inputCurrency.address
          }&tokenInChainId=80094&tokenOutAddress=${
            outputCurrency.address
          }&tokenOutChainId=80094&amount=${Big(inputCurrencyAmount)
            .mul(10 ** inputCurrency.decimals)
            .toString()}&type=exactIn&recipient=${account}&slippageTolerance=1&refCode=4`
        );
        const result = await response.json();

        let priceImpact = Big(result.priceImpact).mul(100);
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

        const gasUsd = Big(Number(result.gasUseEstimateUSD)).toFixed(18);

        const trade = {
          inputCurrency,
          outputCurrency,
          inputCurrencyAmount,
          name: "Kodiak",
          txn: {
            ...result.methodParameters,
            value: Number(result.methodParameters.value)
          },
          routerAddress: result.methodParameters.to,
          noPair: false,
          outputCurrencyAmount: result.quoteDecimals,
          routerStr: `${inputCurrency.symbol} -> ${outputCurrency.symbol}`,
          isGasEnough: true,
          priceImpact: priceImpact.toFixed(2),
          priceImpactType,
          gasUsd: gasUsd
        };

        setTrade(trade);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setTrade(null);
        setLoading(false);
      }
    },
    [account, provider, slippage, prices, cachedTokens]
  );

  const onSwap = useCallback(async () => {
    if (!provider) return;

    setLoading(true);
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      executeTransaction({
        calls: [trade.txn],
        onSuccess: (receipt: any) => {
          const { status, transactionHash } = receipt;
          toast.dismiss(toastId);
          setLoading(false);
          if (status === 1) {
            toast.success({
              title: `Swap Successful!`,
              tx: transactionHash,
              chainId
            });
            onSuccess?.({
              inputCurrency: trade.inputCurrency,
              outputCurrency: trade.outputCurrency,
              inputCurrencyAmount: trade.inputCurrencyAmount,
              outputCurrencyAmount: trade.outputCurrencyAmount,
              transactionHash: transactionHash,
              tradeFrom: trade.name
            });
          } else {
            toast.fail({ title: `Swap failed!` });
          }
        },
        onError: () => {
          setLoading(false);
          toast.dismiss(toastId);
          toast.fail({
            title: "Swap failed!"
          });
        }
      });
      // addAction({
      //   type: "Swap",
      //   inputCurrencyAmount: trade.inputCurrencyAmount,
      //   inputCurrency: trade.inputCurrency,
      //   outputCurrencyAmount: trade.outputCurrencyAmount,
      //   outputCurrency: trade.outputCurrency,
      //   template:
      //     wethAddress === trade.routerAddress ? "Wrap and Unwrap" : trade.name,
      //   status,
      //   transactionHash,
      //   add: 0,
      //   token_in_currency: trade.inputCurrency,
      //   token_out_currency: trade.outputCurrency
      // });
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
  }, [account, provider, trade]);

  return { loading, trade, onQuoter, onSwap };
}
