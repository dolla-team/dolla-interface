import { useCallback, useEffect, useState } from "react";
import { getOnrampBuyUrl } from '@coinbase/onchainkit/fund';
import axiosInstance from "@/libs/axios";

// const projectId = 'b88afaf3-113e-4ec4-80d0-0178256acc0a';

const projectId = 'fc6b7f9a-fff8-407f-bdda-0b8ede3ae84c'

export default function useCoinBase({ address, amount, orderId }: { address: string, amount: number, orderId: string }) {
    const [coinBaseUrl, setCoinBaseUrl] = useState<string | null>(null);



    const getCoinBaseUrl = useCallback(async () => {
        if (!address || amount <= 0 || !orderId) {
            setCoinBaseUrl(null);
            return;
        }

        const res = await axiosInstance.post(
            "/api/v1/coinbase/onramp/token",
            {
                addresses: [
                  {
                    address: "GgmubAjnikmpiizfvSjbqYT7eq2Wx1HkMx4rQBPF3rws",
                    blockchains: ["solana"]
                  }
                ],
                assets: ["USDC"]
              }
        )

        if (res?.data?.code != 0) {
            setCoinBaseUrl(null);
            return;
        }

        const onrampBuyUrl = getOnrampBuyUrl({
            sessionToken: res.data.data?.token || '',
            // projectId,
            // addresses: { [address]: ['solana'] },
            // assets: ['USDC'],
            presetFiatAmount: amount || 0,
            fiatCurrency: 'USD',
            redirectUrl: `${window.location.origin}/callback?type=coinbase&orderId=${orderId}`,
        });

        setCoinBaseUrl(onrampBuyUrl);
    }, [address, amount, orderId])

    useEffect(() => {
        getCoinBaseUrl();
    }, [address, amount]);

    return {
        getCoinBaseUrl,
        coinBaseUrl,
    }

}