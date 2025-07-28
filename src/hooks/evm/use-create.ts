// Placeholder file - NEAR integration doesn't require EVM create functionality
export default function useCreate() {
  return {
    creating: false,
    onCreate: () => {}
  };
}