import { useEffect, useState } from "react";
import { viewMethod } from "./util";

export default function useConfig() {
    const [config, setConfig] = useState<string | null>(null);

    useEffect(() => {
        const getConfig = async () => {
            try {
                const res = await viewMethod({ method: "get_config", args: {  } });
                console.log('res:', res);
                setConfig(res);
            } catch (error) {
                console.error(error);
            }
        }

        getConfig();
    }, []);

    return {
        config
    }
}