// Generic claim funds hook for NEAR integration
export default function useClaimFunds() {
  return {
    claiming: false,
    onClaim: () => {}
  };
}