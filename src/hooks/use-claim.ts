// Generic claim hook for NEAR integration
export default function useClaim() {
  return {
    claiming: false,
    onClaim: () => {}
  };
}