// Placeholder file - NEAR integration doesn't require EVM withdraw functionality
export default function useWithdraw() {
  return {
    withdrawing: false,
    onWithdraw: () => {}
  };
}