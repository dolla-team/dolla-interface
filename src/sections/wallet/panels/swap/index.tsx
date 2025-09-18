import Big from "big.js";
import ExchangeIcon from "./components/exchange-icon";
import TokenAmount from "./components/token-amount";
import { dapp } from "./config/dapp";
import { useSwap } from "./hooks";
import Result from "./components/result";
import Fees from "./components/fees";
import SubmitBtn from "./components/submit-button";
import { DEFAULT_CHAIN_ID } from "./config";
import TokenSelector from "./components/token-selector";
import chains from "@/config/chains";
import BackIcon from "../../back-icon";

export default function Swap(props?: any) {
  const { outputCurrencyReadonly = false, from, onBack } = props ?? {};

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
    chainId,
    selectedTokenAddress,
    tokens,
    account,
    addImportToken,
    onSelectToken
  } = useSwap({
    ...props,
    dapp
  });

  return (
    <div className="px-[20px] pt-[30px] text-white">
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
          prices={prices}
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
          prices={prices}
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
          chain={{
            chainId: DEFAULT_CHAIN_ID
          }}
          amount={inputCurrencyAmount}
          spender={trade?.routerAddress}
          errorTips={errorTips}
          token={inputCurrency}
          loading={loading}
          onClick={onSwap}
          disabled={trade?.noPair || !trade?.txn}
          onRefresh={() => {
            runQuoter(trade?.name);
          }}
          updater={`button-${updater}`}
        />
        {from === "marketplace" && (
          <div className="text-center  mt-[12px]">
            <a href="/bridge" className="underline text-[14px] text-[#3D405A]">
              Bridge Assets to Berachain
            </a>
          </div>
        )}
      </div>
      <TokenSelector
        display={displayCurrencySelect}
        chainIdNotSupport={chainId !== DEFAULT_CHAIN_ID}
        selectedTokenAddress={selectedTokenAddress}
        chainId={DEFAULT_CHAIN_ID}
        tokens={tokens}
        account={account}
        explor={chains[DEFAULT_CHAIN_ID].blockExplorers.default.url}
        onImport={addImportToken}
        onClose={() => {
          setDisplayCurrencySelect(false);
        }}
        onSelect={onSelectToken}
      />
    </div>
  );
}
