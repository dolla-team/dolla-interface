import { useCallback, useEffect, useState } from "react";
import { getOnrampBuyUrl } from "@coinbase/onchainkit/fund";
import axiosInstance from "@/libs/axios";
import useDeposit from "./near/use-deposit";
import { useAuth } from '@/contexts/wallet'
import Big from "big.js";
import { EVM_REFUND_ACCOUNT } from "@/config";

// const projectId = 'b88afaf3-113e-4ec4-80d0-0178256acc0a';

// const projectId = 'fc6b7f9a-fff8-407f-bdda-0b8ede3ae84c'

export default function useCoinBase({
  amount,
  orderId,
  minAmount
}: {
  amount: number;
  orderId: string;
  minAmount: number;
}) {
  const [loading, setLoading] = useState(false);
  const [coinBaseUrl, setCoinBaseUrl] = useState<string | null>(null);
  const { generateDepositAddress } = useDeposit();
  const { address } = useAuth();

  const getCoinBaseUrl = useCallback(async () => {
    if (!address || amount < minAmount || !orderId || !address) {
      setCoinBaseUrl(null);
      return;
    }

    try {
      setLoading(true);

      // Arbitrum usdc
      const depositAddress = await generateDepositAddress({
        originAsset:
          "nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near",
        destinationAsset:
          "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        amount: new Big(amount).mul(1e6).toString(),
        slippageTolerance: 50,
        refundTo: EVM_REFUND_ACCOUNT
      });

      if (!depositAddress) {
        setCoinBaseUrl(null);
        setLoading(false);
        return;
      }

      const res = await axiosInstance.post("/api/v1/coinbase/onramp/token", {
        addresses: [
          {
            address: depositAddress,
            blockchains: ["arbitrum"]
          }
        ],
        assets: ["USDC"]
      });

      if (res?.data?.code != 0) {
        setCoinBaseUrl(null);
        return;
      }

      const onrampBuyUrl = getOnrampBuyUrl({
        sessionToken: res.data.data?.token || "",
        // projectId,
        // addresses: { [address]: ['solana'] },
        // assets: ['USDC'],
        presetFiatAmount: new Big(amount).mul(1.1).toNumber() || 0,
        fiatCurrency: "USD",
        redirectUrl: `${window.location.origin}/callback?type=coinbase&orderId=${orderId}`
      });

      setCoinBaseUrl(onrampBuyUrl);
    } catch (error) {
      setLoading(false);
      setCoinBaseUrl(null);
    } finally {
      setLoading(false);
    }
  }, [address, amount, orderId]);

  useEffect(() => {
    getCoinBaseUrl();
  }, [address, amount]);

  return {
    getCoinBaseUrl,
    loading,
    coinBaseUrl
  };
}
