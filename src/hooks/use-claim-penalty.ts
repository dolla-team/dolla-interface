// Generic claim penalty hook for NEAR integration
export default function useClaimPenalty() {
  return {
    claiming: false,
    onClaim: () => {}
  };
}