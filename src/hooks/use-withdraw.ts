// Generic withdraw hook for NEAR integration
export default function useWithdraw() {
  return {
    withdrawing: false,
    onWithdraw: () => {}
  };
}