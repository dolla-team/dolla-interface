// Placeholder file - NEAR integration doesn't require EVM gelatonetwork functionality
export default function useGelatonetwork() {
  return {
    executeTransaction: () => Promise.resolve(),
    switchNetwork: () => {}
  };
}