import { useEffect, useState } from "react";
import { viewMethod } from "./util";

export default function useConfig() {
    const [config, setConfig] = useState<any>(null);
    const getConfig = async () => {
        try {
            const res = await viewMethod({ method: "get_config", args: {} });
            setConfig(res);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getConfig();
    }, []);

    return {
        config
    }
}