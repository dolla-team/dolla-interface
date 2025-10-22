import { useState, useCallback, useEffect } from "react";
import { calculate, threshold, initWasm } from "@/libs/random/index";
import { viewMethod } from "@/hooks/near/util";

// Hook for querying NEAR blockchain hash information
export default function useProvablyFair(txHash: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [verifyData, setVerifyData] = useState<any | null>(null);
  const [verifing, setVerifing] = useState(false);
  /**
   * Main function to query hash information and extract provably fair data
   * @param txHash - Transaction hash to query
   * @returns Promise<ProvablyFairData | null>
   */
  const queryHashInfo = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Query transaction by hash using NearBlocks API
      const apiUrl = "https://api.nearblocks.io/v2/txns";
      const response = await fetch(`${apiUrl}/${txHash}`);
      const apiData = await response.json();
      if (!apiData.txns?.length) {
        throw new Error("Transaction not found in API response");
      }

      const transaction = apiData.txns[0];

      const playGameLog = transaction.outcomes.logs[0].split("EVENT_JSON:")[1];
      const parsedPlayGameLog = parseHashPayload(playGameLog).data[0];

      const processedPlayGameLog =
        transaction.receipts[1].outcome.logs[0].split("EVENT_JSON:")[1];
      const parsedProcessedPlayGameLog =
        parseHashPayload(processedPlayGameLog).data[0];

      const resultLog =
        transaction.receipts[1].outcome.logs[1].split("EVENT_JSON:")[1];
      const parsedResultLog = parseHashPayload(resultLog).data[0];

      setData({
        block_height: parsedPlayGameLog?.block_height,
        block_time: parsedPlayGameLog?.block_timestamp_ms,
        user_seed: parsedPlayGameLog?.random_seed,
        tee_seed: parsedPlayGameLog?.random_number,
        bid_count: parsedProcessedPlayGameLog?.bid_count,
        pool_id: parsedProcessedPlayGameLog?.pool_id,
        play_log: parsedPlayGameLog, // Raw logs from RPC
        result_log: parsedResultLog
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to query hash information";
      setError(errorMessage);
      console.error("Hash query error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [txHash]);

  const onVerfiy = async () => {
    if (!data?.result_log) {
      return;
    }

    // Safe compare using BigInt; if parse fails, mark as null
    let isWinner: boolean | null = null;
    try {
      isWinner =
        BigInt(data.result_log.random_number) <=
        BigInt(data.result_log.threshold);
    } catch {
      isWinner = null;
    }

    setVerifyData({
      randomNumber: data.result_log.random_number,
      threshold: data.result_log.threshold,
      isWinner
    });
    return;

    try {
      setVerifing(true);
      const _log = data.play_log;
      const pool_id = data.pool_id;

      const poolDetail = await viewMethod({
        method: "get_game",
        args: {
          game_id: pool_id
        }
      });
      await initWasm();
      // Use browser-random wrapper for stable WASM loading
      // 1) Calculate random number (string)
      const randomStr = await calculate(JSON.stringify(_log));

      // 2) Calculate threshold (example constants: bid_unit=5, odds_bep=1000)
      const thresholdStr = await threshold(
        data.bid_count,
        1e6,
        poolDetail.odds_bep
      );

      // Safe compare using BigInt; if parse fails, mark as null
      let isWinner: boolean | null = null;
      try {
        isWinner = BigInt(randomStr) <= BigInt(thresholdStr);
      } catch {
        isWinner = null;
      }

      setVerifyData({
        randomNumber: randomStr,
        threshold: thresholdStr,
        isWinner
      });
    } catch (err: any) {
      const message = err instanceof Error ? err.message : "Verify failed";
      setError(message);
      console.error("onVerfiy error", err);
    } finally {
      setVerifing(false);
    }
  };

  /**
   * Clear current data and error state
   */
  const clearData = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (txHash) {
      queryHashInfo();
    }
  }, [txHash]);

  return {
    // State
    loading,
    error,
    data,
    verifyData,
    verifing,

    // Actions
    queryHashInfo,
    onVerfiy,
    clearData
  };
}

function parseHashPayload(input: string) {
  let s = (input ?? "").trim();

  try {
    const result = JSON.parse(s);
    return result;
  } catch (e) {
    console.log("Direct parse failed:", (e as Error).message);
  }

  try {
    const singleEscaped = s.replace(/\\"/g, '"');

    const result = JSON.parse(singleEscaped);

    return result;
  } catch (e) {
    console.log("Single escape parse failed:", (e as Error).message);
  }

  try {
    const firstParse = JSON.parse(s);
    if (typeof firstParse === "string") {
      const result = JSON.parse(firstParse);
      return result;
    }
    return firstParse;
  } catch (e) {
    console.log("Double parse failed:", (e as Error).message);
  }

  try {
    const urlDecoded = decodeURIComponent(s);
    const result = JSON.parse(urlDecoded);
    return result;
  } catch (e) {
    console.log("URL decode parse failed:", (e as Error).message);
  }

  try {
    let processed = s;

    processed = processed.replace(/\\"/g, '"');

    processed = processed.replace(/\\([{}\[\]":,])/g, "$1");
    const result = JSON.parse(processed);
    return result;
  } catch (e) {
    console.log("Multi-escape parse failed:", (e as Error).message);
  }

  try {
    let processed = s;
    let maxIterations = 5;
    let iteration = 0;

    while (iteration < maxIterations) {
      const before = processed;
      processed = processed.replace(/\\"/g, '"');
      if (before === processed) break;
      iteration++;
    }

    const result = JSON.parse(processed);
    return result;
  } catch (e) {
    console.log("Recursive parse failed:", (e as Error).message);
  }

  throw new Error(`Failed to parse JSON. Input: ${s.substring(0, 100)}...`);
}
