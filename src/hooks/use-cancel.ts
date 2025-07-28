// Generic cancel hook for NEAR integration
export default function useCancel() {
  return {
    canceling: false,
    onCancel: () => {}
  };
}