// Generic token balance hook for NEAR integration
export default function useTokenBalance() {
  return {
    balance: "0",
    loading: false,
    refresh: () => {}
  };
}