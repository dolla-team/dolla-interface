import dayjs from "dayjs";
import { providers } from "near-api-js";

export async function quote(body: any) {
    const url = "https://1click.chaindefuser.com/v0/quote";
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(body)
    });

    if (res.ok) {
        const data = await res.json();
        return data;
    }

    return null;
}

export function getProvider() {
    console.log('VITE_NEAR_RPC_URL:', import.meta.env.VITE_NEAR_RPC_URL);
    return new providers.JsonRpcProvider({ url: import.meta.env.VITE_NEAR_RPC_URL });
}

export async function viewMethod({ method, args = {} }: {
    method: string,
    args: any
}) {
    const provider = getProvider()
    const res: any = await provider.query({
        request_type: "call_function",
        account_id: import.meta.env.VITE_NEAR_ACCOUNT_ID,
        method_name: method,
        args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
        finality: "optimistic",
    });

    return JSON.parse(Buffer.from(res.result).toString());
};

export async function getNonce(publicKey: string) {
    const provider = getProvider();
    const accessKey: any = await provider.query({
        request_type: "view_access_key",
        finality: "final",
        account_id: import.meta.env.VITE_NEAR_ACCOUNT_ID,
        public_key: publicKey,
    });

    return BigInt(accessKey.nonce) + 1n;
}