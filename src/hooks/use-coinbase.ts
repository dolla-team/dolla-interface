import { useCallback, useEffect, useState } from "react";
import { getOnrampBuyUrl } from '@coinbase/onchainkit/fund';

// const projectId = 'b88afaf3-113e-4ec4-80d0-0178256acc0a';

const projectId = 'fc6b7f9a-fff8-407f-bdda-0b8ede3ae84c'

export default function useCoinBase({ address, amount, orderId }: { address: string, amount: number, orderId: string }) {
    const [coinBaseUrl, setCoinBaseUrl] = useState<string | null>(null);

    const getCoinBaseUrl = useCallback(() => {
        if (!address || amount <= 0 || !orderId) {
            setCoinBaseUrl(null);
            return;
        }

        const onrampBuyUrl = getOnrampBuyUrl({
            projectId,
            addresses: { [address]: ['solana'] },
            assets: ['USDC'],
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