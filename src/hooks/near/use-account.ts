import { useEffect, useState } from "react";
import { viewMethod } from "./util";

export default function useAccount(evmAddress: string) {
    const [account, setAccount] = useState<any | null>(null);

    useEffect(() => {
        if (!evmAddress) return;
        const getAccountId = async () => {
            try {
                const res = await viewMethod({ method: "get_account", args: { user_id: { Evm: evmAddress.replace(/^0x/, "") } } });
                console.log('res:', res);
                setAccount(res);
            } catch (error) {
                console.error(error);
            }
        }

        getAccountId();
    }, [evmAddress]);

    return {
        account
    }
}