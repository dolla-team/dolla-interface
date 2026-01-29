import { useEffect, useMemo, useState } from "react";
import useTokenPrice from "@/hooks/use-token-price";
import { useDebounceFn } from "ahooks";
import useTrade from "./use-trade";
import Big from "big.js";
import { tokens } from "../config";
import { useAuth } from "@/contexts/auth";
import { BASE_TOKEN, QUOTE_TOKEN } from "@/config/btc";

export function useSwap(props?: any) {
  const { dapp } = props ?? {};
  const { updateNearAccount } = useAuth();

  const [inputCurrencyAmount, setInputCurrencyAmount] = useState("");
  const [outputCurrencyAmount, setOutputCurrencyAmount] = useState("");
  const [inputCurrency, setInputCurrency] = useState<any>(BASE_TOKEN);
  const [outputCurrency, setOutputCurrency] = useState<any>(QUOTE_TOKEN);
  const [displayCurrencySelect, setDisplayCurrencySelect] = useState(false);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState("");
  const [maxInputBalance, setMaxInputBalance] = useState("");
  const [maxOutputBalance, setMaxOutputBalance] = useState("");
  const [errorTips, setErrorTips] = useState("");
  const [updater, setUpdater] = useState(0);
  const [showDetail, setShowDetail] = useState(true);
  const [selectType, setSelectType] = useState<"in" | "out">("in");
  const [exactType, setExactType] = useState<"EXACT_INPUT" | "EXACT_OUTPUT">(
    "EXACT_INPUT"
  );

  const tokenIds = useMemo(() => {
    if (!inputCurrency && !outputCurrency) return [];
    let _tokenIds = [];
    if (inputCurrency) {
      _tokenIds.push({
        chain: "near",
        address: inputCurrency?.address
      });
    }
    if (outputCurrency) {
      _tokenIds.push({
        chain: "near",
        address: outputCurrency?.address
      });
    }
    return _tokenIds;
  }, [inputCurrency, outputCurrency]);

  const { prices, loading: pricesLoading } = useTokenPrice(tokenIds as any);

  const { loading, trade, onQuoter, onSwap } = useTrade({
    onSuccess: () => {
      setUpdater(Date.now());
      runQuoter();
      updateNearAccount();
    }
  });

  const { run: runQuoter } = useDebounceFn(
    (template?: string) => {
      onQuoter({
        inputCurrency,
        outputCurrency,
        inputCurrencyAmount,
        outputCurrencyAmount,
        exactType,
        template,
        onReset: () => {
          setInputCurrencyAmount('')
          setOutputCurrencyAmount('')
        },
      })
    },
    {
      wait: 500
    }
  );

  const onSelectToken = (token: any) => {
    let _inputCurrency: any = inputCurrency;
    let _outputCurrency: any = outputCurrency;

    if (selectType === "in") {
      _inputCurrency = token;
      if (token.address.toLowerCase() === outputCurrency?.address.toLowerCase())
        _outputCurrency = null;
    }
    if (selectType === "out") {
      _outputCurrency = token;
      if (token.address.toLowerCase() === inputCurrency?.address.toLowerCase())
        _inputCurrency = null;
    }

    setInputCurrency(_inputCurrency);
    setOutputCurrency(_outputCurrency);
    setDisplayCurrencySelect(false);
  };

  useEffect(() => {
    setInputCurrencyAmount("");
    setOutputCurrencyAmount("");
  }, [dapp]);

  useEffect(() => {
    if (!inputCurrency || !outputCurrency) {
      setErrorTips("Select a token");
      return;
    }
    if (Number(inputCurrencyAmount || 0) === 0) {
      setErrorTips('Enter an amount')
      setOutputCurrencyAmount('')
      return
    }
    if (Big(inputCurrencyAmount || 0).gt(maxInputBalance || 0)) {
      setErrorTips(`Insufficient ${inputCurrency?.symbol} Balance`);
    } else {
      setErrorTips("");
    }
    if (
      trade?.outputCurrencyAmount === outputCurrencyAmount &&
      trade?.inputCurrencyAmount === inputCurrencyAmount
    ) {
      return;
    }
    runQuoter();
  }, [
    inputCurrency,
    outputCurrency,
    inputCurrencyAmount,
    outputCurrencyAmount,
    maxInputBalance,
    maxOutputBalance
  ]);

  useEffect(() => {
    setOutputCurrencyAmount(trade?.outputCurrencyAmount || "");
    setInputCurrencyAmount(trade?.inputCurrencyAmount || "");
  }, [trade]);

  return {
    inputCurrencyAmount,
    setInputCurrencyAmount,
    outputCurrencyAmount,
    setOutputCurrencyAmount,
    inputCurrency,
    setInputCurrency,
    setOutputCurrency,
    onSelectToken,
    outputCurrency,
    displayCurrencySelect,
    setDisplayCurrencySelect,
    selectedTokenAddress,
    setSelectedTokenAddress,
    maxInputBalance,
    setMaxInputBalance,
    maxOutputBalance,
    setMaxOutputBalance,
    errorTips,
    setErrorTips,
    updater,
    setUpdater,
    showDetail,
    setShowDetail,
    selectType,
    setSelectType,
    exactType,
    setExactType,
    tokens,
    prices,
    pricesLoading,
    loading,
    trade,
    onQuoter,
    runQuoter,
    onSwap
  };
}
