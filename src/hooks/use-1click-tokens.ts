import { use1clickTokensStore } from "@/stores/use-1click-tokens-store";
import { useEffect, useState } from "react";

export default function use1clickTokens() {
  const [tokens, setTokens] = useState<any[]>([]);
  const { tokens: storeTokens, setTokens: setStoreTokens } = use1clickTokensStore()

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch("https://1click.chaindefuser.com/v0/tokens");
        if (!response.ok) {
          return
        }
        const data = await response.json();

        setStoreTokens(data)

        setTokens(data);
      } catch (error) {
        console.error("get 1click tokens failed:", error);
        setTokens([]);
      }
    };

    if (storeTokens.length > 0) {
      setTokens(storeTokens);
      return;
    }

    fetchTokens()
  }, []);

  return { tokens };
}