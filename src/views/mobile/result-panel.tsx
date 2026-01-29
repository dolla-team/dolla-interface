import DollaEye from '@/components/dolla-eye'
import { useAnalysisDataStore } from '@/stores/use-analysis-data'
import {
  BackButton,
  NoVoucherPanel,
  PredictionsPanel,
  VoucherPanel,
} from '../verify-email/analyze-result-panel'

export default function ResultPanel({ setXProfileUrl }: any) {
  const analysisData = useAnalysisDataStore()
  const handleLogout = () => {
    analysisData.init()
    setXProfileUrl('')
  }
  return (
    <div className="pt-[20px] relative">
      <BackButton onClick={handleLogout} className="fixed top-[20px] left-[10px]" />
      <div className="flex justify-center">
        <DollaEye height={34} />
      </div>
      <div className="w-[calc(100%-20px)] mx-auto">
        <PredictionsPanel analysisData={analysisData} />
        {analysisData.reward > 0 ? (
          <VoucherPanel
            dei={analysisData.result.finalScore}
            rankInfo={analysisData.result.rankInfo}
            reward={analysisData.reward}
            isSameUser={true}
          />
        ) : (
          <NoVoucherPanel />
        )}
      </div>
    </div>
  )
}
