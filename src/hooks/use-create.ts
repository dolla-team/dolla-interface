// Generic create hook for NEAR integration
export default function useCreate() {
  return {
    creating: false,
    onCreate: () => {}
  };
}