// Generic deposit reward hook for NEAR integration
export default function useDepositReward() {
  return {
    depositing: false,
    onDeposit: () => {}
  };
}