import { useState } from "react";
import dayjs from "dayjs";
import useGenerateKey from "@/hooks/near/use-generate-key";
import { getUserId, quote } from "./util";
import useToast from "../use-toast";
import { useAuth } from "@/contexts/auth";

export default function useDeposit() {
  const [loading, setLoading] = useState(false);
  const { address, chainType } = useAuth();
  const [depositAddress, setDepositAddress] = useState<string | null>("");
  const { info } = useToast();
  const { generateKeyPair } = useGenerateKey();

  async function generateDepositAddress({
    swapType = "EXACT_INPUT",
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
    getFullQuote = false
  }: {
    swapType?: string;
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
    getFullQuote?: boolean;
  }) {
    try {
      const { publicKey, isRegistered } = await generateKeyPair(true);

      if (!isRegistered && !publicKey) {
        info({
          title: "Please login to deposit"
        });
        return;
      }

      setLoading(true);

      const msg: any = {
        u: getUserId(address, chainType),
        b: "Deposit",
        k: !!isRegistered ? "" : publicKey
      };

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
        deadline: dayjs().add(1, "hour").toISOString(),
        referral,
        quoteWaitingTimeMs,
        customRecipientMsg: JSON.stringify(msg)
      };

      const data = await quote(body);

      if (data) {
        setDepositAddress(data.quote.depositAddress);

        if (getFullQuote) {
          return data;
        }
        return data.quote.depositAddress;
      } else {
        setDepositAddress(null);
        return null;
      }
    } catch (error: any) {
      console.error(error);
      info({
        title: error.message
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    generateDepositAddress,
    depositAddress,
    loading
  };
}
