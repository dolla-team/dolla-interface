// Generic approve hook for NEAR integration
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