import { useState } from "react";
import dayjs from "dayjs";
import useGenerateKey from "@/hooks/near/use-generate-key";
import { quote } from "./util";
import useToast from "../use-toast";

export default function useDeposit() {
  const [loading, setLoading] = useState(false);
  const [depositAddress, setDepositAddress] = useState<string | null>("");
  const { fail } = useToast();
  const { generateKeyPair } = useGenerateKey();

  async function generateDepositAddress({
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
    getFullQuote = false
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
    getFullQuote?: boolean;
  }) {
    try {
      const { publicKey } = await generateKeyPair();
      if (!publicKey) {
        throw new Error("Public key not found");
      }
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
        deadline: dayjs().add(1, "hour").toISOString(),
        referral,
        quoteWaitingTimeMs,
        customRecipientMsg: JSON.stringify({
          u: {
            Evm: evmAddress.replace(/^0x/, "").toLowerCase()
          },
          b: "Deposit",
          k: publicKey
        })
      };

      const data = await quote(body);

      if (data) {
        console.log(data);
        setDepositAddress(data.quote.depositAddress);
        if (getFullQuote) {
          return data.quote;
        }
        return data.quote.depositAddress;
      } else {
        setDepositAddress(null);
        return null;
      }
    } catch (error: any) {
      console.error(error);
      fail({ title: error.toString() });
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
