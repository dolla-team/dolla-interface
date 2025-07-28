// Generic claim slash hook for NEAR integration
export default function useClaimSlash() {
  return {
    claiming: false,
    onClaim: () => {}
  };
}