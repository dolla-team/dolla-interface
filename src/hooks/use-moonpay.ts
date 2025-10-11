import { useCallback, useEffect, useState } from "react";
import axiosInstance from "@/libs/axios";

const apiKey = 'pk_live_JBij4GiRoOcbQqunNzFkmb8v80z0DPK';
export default function useMoonpay({ address, amount, orderId }: { address: string, amount: number, orderId: string }) {
    const [moonpayUrl, setMoonpayUrl] = useState<string | null>(null);

    const getMoonpayUrl = useCallback(async () => {
        if (!address || amount <= 0 || !orderId) {
            setMoonpayUrl(null);
            return;
        }

        const query = `?apiKey=${apiKey}&currencyCode=usdc_sol&walletAddress=${encodeURIComponent(address)}&lockAmount=true&quoteCurrencyAmount=${amount}&redirectURL=${encodeURIComponent(window.location.origin + '/callback?type=moonpay&orderId=' + orderId)}`

        const signedData = await axiosInstance.post(
            "/api/v1/moonpay/signUrl",
            {
                'url': query
            }
        )

        if (signedData?.data?.code != 0) {
            setMoonpayUrl(null);
            return;
        }

        // console.log('onrampBuyUrl', onrampBuyUrl);
        const url = `https://buy.moonpay.io/${query}&signature=${encodeURIComponent(signedData.data.data.signature)}`;
        setMoonpayUrl(url);
    }, [address, amount, orderId])

    useEffect(() => {
        getMoonpayUrl();
    }, [address, amount]);

    return {
        getMoonpayUrl,
        moonpayUrl,
    }

}