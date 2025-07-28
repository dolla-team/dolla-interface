// Placeholder file - NEAR integration doesn't require EVM approve functionality
export default function useApprove() {
  return {
    approved: true,
    approve: () => {},
    approving: false,
    checking: false,
    allowance: 0,
    checkApproved: () => {}
  };
}