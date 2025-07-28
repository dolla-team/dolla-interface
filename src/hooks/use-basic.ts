// Generic basic hook for NEAR integration
export default function useBasic() {
  return {
    data: null,
    loading: false,
    refresh: () => {}
  };
}