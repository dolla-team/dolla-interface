import InputPanel from './input-panel'
import ResultPanel from './result-panel'
import { useAnalysisDataStore } from '@/stores/use-analysis-data'
import useAnalysis from '@/views/verify-email/use-analysis'
import SocialLinks from '@/views/verify-email/social-links'

export default function Mobile() {
  const analysisData = useAnalysisDataStore()
  const { isValid, xProfileUrl, handle, setXProfileUrl, onAnalyze } = useAnalysis()
  return (
    <div className="relative" id="verify-email-container">
      <div className="relative z-[2] bg-black h-screen">
        {analysisData.status === 'result' ? (
          <ResultPanel setXProfileUrl={setXProfileUrl} />
        ) : (
          <InputPanel
            xProfileUrl={xProfileUrl}
            setXProfileUrl={setXProfileUrl}
            isValid={isValid}
            onAnalyze={onAnalyze}
            data={analysisData}
          />
        )}
        <SocialLinks className="absolute bottom-[20px] w-full flex items-center justify-center gap-[50px]" />
      </div>
    </div>
  )
}
