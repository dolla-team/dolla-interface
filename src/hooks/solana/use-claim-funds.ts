// Placeholder file - NEAR integration doesn't require EVM claim funds functionality
export default function useClaimFunds() {
  return {
    claiming: false,
    onClaim: () => {}
  };
}