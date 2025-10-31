import useWalletStore from "@/stores/use-wallet";
import { useMemo } from "react";
import BackIcon from "../../back-icon";
import { formatNumber } from "@/utils/format/number";
import { useDebounce } from "ahooks";
import Big from "big.js";
import Button from "@/components/button";
import { useContractConfigStore } from "@/stores/use-contract-config";
import { BASE_TOKEN } from "@/config/btc";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import ChainSelector from "./chain-selector";
import WarningIcon from "../deposit/warning-icon";
import { chainConfig } from "../../chain-config";
import {
  isValidAddress,
  getAddressValidationError
} from "@/utils/validate-address";

export default function WithdrawInput({
  chain,
  amount,
  amountUSD,
  setAmount,
  balance,
  setChain,
  receiveAddress,
  setReceiveAddress,
  quoteData,
  networkFee,
  loading
}: any) {
  const walletStore = useWalletStore();

  const debouncedAmount = useDebounce(amount, { wait: 1000 });

  const config = useContractConfigStore((state) => state.config);

  const errorTips = useMemo(() => {
    if (!debouncedAmount) {
      return "Please enter an amount";
    }

    if (!receiveAddress) {
      return "Please enter a receive address";
    }

    if (!chain) {
      return "Please select a network";
    }

    // Validate address format based on selected chain
    if (receiveAddress && chain?.blockchain) {
      const isValid = isValidAddress(receiveAddress, chain.blockchain);
      if (!isValid) {
        return getAddressValidationError(receiveAddress, chain.blockchain);
      }
    }

    if (Big(debouncedAmount || 0).gt(Big(balance || 0))) {
      return "Insufficient Balance";
    }

    if (debouncedAmount && config) {
      let minDepositAmount = 0;
      const _config_tokens = walletStore.selectedToken?.isBaseToken
        ? config.legal_prize_ft_tokens
        : config.legal_bet_tokens;
      for (const token in _config_tokens) {
        const tokenObj = JSON.parse(token);
        if (
          tokenObj &&
          walletStore.selectedToken?.address
            .toUpperCase()
            .includes(tokenObj.FT?.toUpperCase())
        ) {
          minDepositAmount =
            Number(config.legal_bet_tokens[token]) /
            10 ** walletStore.selectedToken.decimals;
          break;
        }
      }

      if (Number(debouncedAmount) < minDepositAmount) {
        return `Minimum withdraw amount is ${minDepositAmount} ${walletStore.selectedToken.symbol}`;
      }
    }
    return "";
  }, [debouncedAmount, walletStore.selectedToken, chain, receiveAddress]);

  return (
    <div className="px-[16px]">
      <div
        className="flex items-center gap-[8px] text-[16px] cursor-pointer button"
        onClick={() => {
          if (walletStore.from === "token") {
            walletStore.set({ panelType: "token" });
          } else {
            walletStore.set({ withdrawPanelType: "token-selector" });
          }
          setChain(null);
          setReceiveAddress("");
          setAmount("");
        }}
      >
        <BackIcon />
        <div className="text-black text-[14px]">
          Withdraw {walletStore.selectedToken.symbol}
        </div>
      </div>
      <>
        <div className="flex items-center gap-[8px] mt-[30px]">
          <span className="text-[14px] font-[500]">Receive Address</span>
          <ReceiveAddressInfo />
        </div>
        <input
          className={`w-full h-[40px] rounded-[10px] border bg-white leading-[40px] px-[12px] text-[12px] mt-[6px] ${
            receiveAddress &&
            chain?.blockchain &&
            !isValidAddress(receiveAddress, chain.blockchain)
              ? "border-[#FF399F]"
              : "border-[#8A87AA4D]"
          }`}
          value={receiveAddress}
          onChange={(e) => {
            setReceiveAddress(e.target.value);
          }}
          placeholder="Address"
        />
      </>
      <>
        <div className="flex items-center gap-[8px] mt-[30px]">
          <span className="text-[14px] font-[500]">Select Network</span>
          <SelectNetworkInfo />
        </div>
        <div className="mt-[6px]">
          <ChainSelector selectedChain={chain} onSelect={setChain} />
        </div>
      </>
      <>
        <div className="flex items-center justify-between mt-[30px]">
          <div className="flex items-center gap-[8px]">
            <span className="text-[14px] font-[500]">Amount</span>
          </div>
        </div>
        <input
          className="w-full h-[40px] rounded-[10px] border border-[#8A87AA4D] bg-white leading-[40px] px-[12px] text-[12px] mt-[6px]"
          value={amount}
          onChange={(e) => {
            const value = e.target.value;
            // Only allow numbers and decimal point
            const numericValue = value.replace(/[^0-9.]/g, "");
            // Prevent multiple decimal points
            const parts = numericValue.split(".");
            const validValue =
              parts.length > 2
                ? parts[0] + "." + parts.slice(1).join("")
                : numericValue;
            setAmount(validValue);
          }}
          placeholder="Minimum 0"
        />
        <div className="flex items-center justify-between text-[12px] text-[#8A87AA] mt-[6px]">
          <div>≈ ${formatNumber(amountUSD, 2, true)}</div>
          <div className="flex items-center gap-[8px]">
            <span>
              Bal.{" "}
              {formatNumber(
                balance,
                walletStore.selectedToken?.address === BASE_TOKEN.address
                  ? 6
                  : 2,
                true
              )}
            </span>
            <button
              onClick={() => {
                if (balance) setAmount(balance || 0);
              }}
              className="button text-[#DD9000] text-[12px] h-[28px] rounded-[14px]"
            >
              Max
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-[12px] text-[#8A87AA]">
          <div>Max withdraw</div>
          <div>
            {formatNumber(walletStore.selectedToken.maxDepositAmount, 0, true)}
          </div>
        </div>
      </>
      <div className="absolute bottom-[20px] left-[0px] px-[16px]">
        {!!quoteData && (
          <>
            <div className="text-center text-[#8A87AA] text-[12px]">
              Receive Amount
            </div>
            <div className="text-center text-black font-[500] text-[16px] mt-[6px]">
              {formatNumber(
                quoteData?.amountOutFormatted || 0,
                walletStore.selectedToken?.isBaseToken ? 6 : 2,
                true
              )}{" "}
              {walletStore.selectedToken?.symbol}
            </div>
            <div className="text-center text-[#8A87AA] text-[12px] mt-[6px]">
              Network fee{" "}
              {formatNumber(
                networkFee,
                walletStore.selectedToken?.isBaseToken ? 6 : 2,
                true
              )}{" "}
              {walletStore.selectedToken?.symbol}
            </div>
          </>
        )}
        <div className="mt-[6px] py-[10px] px-[6px] text-[12px] flex gap-[8px] leading-[14px] text-black font-[300] bg-[#FFC42F]/10 rounded-[12px]">
          <WarningIcon />
          <div>
            Ensure this address supports{" "}
            {chainConfig[chain?.blockchain]?.name || chain?.blockchain} network
            deposits. Sending to another network may result in loss of funds.
          </div>
        </div>
        <Button
          disabled={!amount || !!errorTips || loading}
          className="w-full h-[50px] !bg-[black] !text-white mt-[10px]"
          onClick={() => {
            walletStore.set({ withdrawPanelType: "withdraw-confirm" });
          }}
          loading={loading}
        >
          {errorTips ? errorTips : "Withdraw"}
        </Button>
      </div>
    </div>
  );
}

const ReceiveAddressInfo = () => {
  return (
    <Popover
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.TopLeft}
      content={
        <div className="w-[360px] text-[#5E6B7D] text-[12px] font-[300] p-[10px] bg-white rounded-[10px] border border-[#E4E4E4]">
          This is the address where your withdrawal will be sent. Double-check
          that your destination wallet supports the selected network.
        </div>
      }
    >
      <button className="relative transition-opacity button">
        <InfoIcon />
      </button>
    </Popover>
  );
};

const SelectNetworkInfo = () => {
  return (
    <Popover
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.TopLeft}
      content={
        <div className="w-[360px] text-[#5E6B7D] text-[12px] font-[300] p-[10px] bg-white rounded-[10px] border border-[#E4E4E4]">
          Please make sure that the currency is charged and withdrawn on the
          same network, otherwise the currency withdrawal cannot be successful.
          The different effects of the network are the rate, the minimum amount
          of money withdrawn and the transfer time.
        </div>
      }
    >
      <button className="relative transition-opacity button">
        <InfoIcon />
      </button>
    </Popover>
  );
};

const InfoIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
    >
      <path
        d="M6.5 13C2.91037 13 0 10.0896 0 6.5C0 2.91037 2.91037 0 6.5 0C10.0896 0 13 2.91037 13 6.5C13 10.0896 10.0896 13 6.5 13ZM6.5 11.9167C9.49162 11.9167 11.9167 9.49162 11.9167 6.5C11.9167 3.50838 9.49162 1.08333 6.5 1.08333C3.50838 1.08333 1.08333 3.50838 1.08333 6.5C1.08333 9.49162 3.50838 11.9167 6.5 11.9167ZM5.95833 5.95833C5.95833 5.81467 6.0154 5.6769 6.11698 5.57532C6.21857 5.47373 6.35634 5.41667 6.5 5.41667C6.64366 5.41667 6.78143 5.47373 6.88302 5.57532C6.9846 5.6769 7.04167 5.81467 7.04167 5.95833V9.75C7.04167 9.89366 6.9846 10.0314 6.88302 10.133C6.78143 10.2346 6.64366 10.2917 6.5 10.2917C6.35634 10.2917 6.21857 10.2346 6.11698 10.133C6.0154 10.0314 5.95833 9.89366 5.95833 9.75V5.95833ZM6.44583 4.225C6.24471 4.225 6.05183 4.1451 5.90961 4.00289C5.7674 3.86067 5.6875 3.66779 5.6875 3.46667C5.6875 3.26554 5.7674 3.07266 5.90961 2.93044C6.05183 2.78823 6.24471 2.70833 6.44583 2.70833C6.64696 2.70833 6.83984 2.78823 6.98206 2.93044C7.12427 3.07266 7.20417 3.26554 7.20417 3.46667C7.20417 3.66779 7.12427 3.86067 6.98206 4.00289C6.83984 4.1451 6.64696 4.225 6.44583 4.225Z"
        fill="#8A87AA"
      />
    </svg>
  );
};
