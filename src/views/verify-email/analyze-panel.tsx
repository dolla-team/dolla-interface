
import clsx from "clsx";
import AnalyzeInputPanel from "./analyze-input-panel";
import AnalyzeLoadingPanel from "./analyze-loading-panel";
import AnalyzeResultPanel from "./analyze-result-panel";
import useAnalysis from "./use-analysis";
import { useAnalysisDataStore } from "@/stores/use-analysis-data";

export default function AnalyzePanel({
  setIsBgSpread,
  onChangeHasAccount
}: any) {
  const analysisData = useAnalysisDataStore();
  const { isValid, xProfileUrl, handle, setXProfileUrl, onAnalyze } = useAnalysis();
  return (
    <div className={clsx("flex flex-col items-center", analysisData?.status !== "result" ? "pb-[100px] h-[500px]" : "pb-[60px] min-h-[600px] justify-center")}>
      {analysisData?.status === "input" && (
        <AnalyzeInputPanel
          xProfileUrl={xProfileUrl}
          setXProfileUrl={setXProfileUrl}
          isValid={isValid}
          onAnalyze={onAnalyze}
          setIsBgSpread={setIsBgSpread}
          onChangeHasAccount={onChangeHasAccount}
        />

      )}
      {analysisData?.status === "loading" && (
        <AnalyzeLoadingPanel handle={handle} onAnalyze={onAnalyze} />
      )}
      {analysisData?.status === "result" && (
        <AnalyzeResultPanel result={analysisData.result} handle={handle} reward={analysisData.reward} onBackToAnalyze={() => {
          analysisData.set({ status: "input", result: {}, reward: 0, handle: "" });
          setXProfileUrl("");
        }} />
      )}


    </div>
  );
}