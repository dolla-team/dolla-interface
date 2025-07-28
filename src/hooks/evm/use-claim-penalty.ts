// Placeholder file - NEAR integration doesn't require EVM claim penalty functionality
export default function useClaimPenalty() {
  return {
    claiming: false,
    onClaim: () => {}
  };
}