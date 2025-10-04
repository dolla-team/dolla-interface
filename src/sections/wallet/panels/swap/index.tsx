import Big from "big.js";
import ExchangeIcon from "./components/exchange-icon";
import TokenAmount from "./components/token-amount";
import { useSwap } from "./hooks";
import Result from "./components/result";
import Fees from "./components/fees";
import SubmitBtn from "./components/submit-button";
import TokenSelector from "./components/token-selector";
import BackIcon from "../../back-icon";
import { useMemo } from "react";

export default function Swap(props?: any) {
  const { outputCurrencyReadonly = false, onBack } = props ?? {};

  const {
    inputCurrency,
    inputCurrencyAmount,
    prices,
    setSelectType,
    setDisplayCurrencySelect,
    setSelectedTokenAddress,
    setMaxInputBalance,
    setInputCurrencyAmount,
    updater,
    loading,
    outputCurrency,
    setInputCurrency,
    setOutputCurrency,
    setOutputCurrencyAmount,
    runQuoter,
    outputCurrencyAmount,
    trade,
    setShowDetail,
    showDetail,
    errorTips,
    onSwap,
    displayCurrencySelect,
    selectedTokenAddress,
    tokens,
    account,
    onSelectToken
  } = useSwap({
    ...props
  });

  const tokenPrices = useMemo(() => {
    return prices?.reduce((acc: any, price: any) => {
      acc[price.address] = price.last_price;
      return acc;
    }, {});
  }, [prices]);

  return (
    <div className="px-[20px] pt-[30px]">
      <div
        className="flex items-center gap-[18px] text-[16px] cursor-pointer button"
        onClick={onBack}
      >
        <BackIcon />
        <div className="text-black">Swap</div>
      </div>
      <div className="pt-[20px]">
        <TokenAmount
          type="in"
          currency={inputCurrency}
          amount={inputCurrencyAmount}
          prices={tokenPrices}
          account
          onCurrencySelectOpen={() => {
            setDisplayCurrencySelect(true);
            setSelectType("in");
            setSelectedTokenAddress(inputCurrency?.address);
          }}
          onUpdateCurrencyBalance={(balance: any) => {
            setMaxInputBalance(balance);
          }}
          onAmountChange={(val: any) => {
            setInputCurrencyAmount(val);
          }}
          updater={`in-${updater}`}
        />
        <ExchangeIcon
          onClick={() => {
            if (loading || outputCurrencyReadonly) return;
            const [_inputCurrency, _outputCurrency] = [
              outputCurrency,
              inputCurrency
            ];
            setInputCurrency(_inputCurrency);
            setOutputCurrency(_outputCurrency);
            setOutputCurrencyAmount("");
            if (Big(inputCurrencyAmount || 0).gt(0)) runQuoter();
          }}
        />
        <TokenAmount
          type="out"
          currency={outputCurrency}
          amount={outputCurrencyAmount}
          disabled
          prices={tokenPrices}
          account
          outputCurrencyReadonly={outputCurrencyReadonly}
          onCurrencySelectOpen={() => {
            if (outputCurrencyReadonly) return;
            setDisplayCurrencySelect(true);
            setSelectType("out");
            setSelectedTokenAddress(outputCurrency?.address);
          }}
          updater={`out-${updater}`}
        />
        {!!(trade && inputCurrency && outputCurrency) && (
          <>
            <Result
              inputCurrency={inputCurrency}
              outputCurrency={outputCurrency}
              inputCurrencyAmount={inputCurrencyAmount}
              outputCurrencyAmount={outputCurrencyAmount}
              priceImpactType={trade?.priceImpactType}
              onClose={() => {
                setShowDetail(!showDetail);
              }}
            />
            <Fees
              priceImpactType={trade?.priceImpactType}
              priceImpact={trade?.priceImpact}
              gasUsd={trade?.gasUsd}
              routerStr={trade?.routerStr}
              outputCurrencyAmount={outputCurrencyAmount}
              show={showDetail}
              name={trade?.name}
            />
          </>
        )}

        <SubmitBtn
          amount={inputCurrencyAmount}
          spender={trade?.routerAddress}
          errorTips={errorTips}
          token={inputCurrency}
          loading={loading}
          onClick={onSwap}
          disabled={trade?.noPair}
          onRefresh={() => {
            runQuoter(trade?.name);
          }}
          updater={`button-${updater}`}
        />
      </div>
      <TokenSelector
        display={displayCurrencySelect}
        selectedTokenAddress={selectedTokenAddress}
        tokens={tokens}
        account={account}
        onClose={() => {
          setDisplayCurrencySelect(false);
        }}
        onSelect={onSelectToken}
      />
    </div>
  );
}
