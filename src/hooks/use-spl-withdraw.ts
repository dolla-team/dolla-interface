// Generic SPL withdraw hook for NEAR integration
export default function useSplWithonDraw() {
  return {
    withdrawing: false,
    onWithdraw: () => {}
  };
}