// Generic gelatonetwork hook for NEAR integration
export default function useGelatonetwork() {
  return {
    executeTransaction: () => Promise.resolve(),
    switchNetwork: () => {}
  };
}