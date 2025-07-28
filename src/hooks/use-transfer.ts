// Generic transfer hook for NEAR integration
export default function useTransfer() {
  return {
    transferring: false,
    onTransfer: () => {}
  };
}