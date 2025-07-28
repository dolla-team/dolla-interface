// Placeholder file - NEAR integration doesn't require EVM token balance functionality
export default function useTokenBalance() {
  return {
    balance: "0",
    loading: false,
    refresh: () => {}
  };
}