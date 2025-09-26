import { useEffect } from "react";
import { viewMethod } from "./util";
import { useContractConfigStore } from "@/stores/use-contract-config";

export default function useContractConfig() {
  const contractConfigStore = useContractConfigStore();
  const getConfig = async () => {
    try {
      const res = await viewMethod({ method: "get_config", args: {} });

      contractConfigStore.set({
        config: {
          ...res,
          cancel_penalty_rate: res.cancel_penalty_rate / 1e4,
          odds_offset: res.odds_offset / 1e6,
          play_game_fee: res.play_game_fee / 1e6,
          resume_game_fee: res.resume_game_fee / 1e6,
          change_ak_fee: res.change_ak_fee / 1e6
        }
      });
      window.oddOffset = res.odds_offset / 1e6;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getConfig();
  }, []);
}
