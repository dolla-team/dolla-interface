// Placeholder file - NEAR integration doesn't require EVM deposit reward functionality
export default function useDepositReward() {
  return {
    depositing: false,
    onDeposit: () => {}
  };
}