import InputPanel from './input-panel'
import ResultPanel from './result-panel'
import { useAnalysisDataStore } from '@/stores/use-analysis-data'
import useAnalysis from '@/views/verify-email/use-analysis'


export default function Mobile() {
  const analysisData = useAnalysisDataStore()
  const { isValid, xProfileUrl, handle, setXProfileUrl, onAnalyze } = useAnalysis()
  return (
    <div className="relative overflow-y-auto overflow-x-hidden" id="verify-email-container">
      <div className="relative z-[2] bg-black h-full">
        {analysisData.status === 'result' ? (
          <ResultPanel setXProfileUrl={setXProfileUrl} />
        ) : (
          <InputPanel
            xProfileUrl={xProfileUrl}
            setXProfileUrl={setXProfileUrl}
            isValid={isValid}
            onAnalyze={onAnalyze}
            data={analysisData}
            handle={handle}
          />
        )}
      </div>
    </div>
  )
}
