import DollaEye from '@/components/dolla-eye'
import { useAnalysisDataStore } from '@/stores/use-analysis-data'
import {
  BackButton,
  NoVoucherPanel,
  PredictionsPanel,
  VoucherPanel,
} from '../verify-email/analyze-result-panel'
import SocialLinks from '@/views/verify-email/social-links'

export default function ResultPanel({ setXProfileUrl }: any) {
  const analysisData = useAnalysisDataStore()
  const handleLogout = () => {
    analysisData.init()
    setXProfileUrl('')
  }
  return (
    <div className="pt-[20px] pb-[20px] relative overflow-y-auto h-screen">
      <BackButton onClick={handleLogout} className="fixed z-[5] top-[20px] left-[10px]" />
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
      <SocialLinks className="w-full mt-[20px] flex items-center justify-center gap-[50px]" />
    </div>
  )
}
