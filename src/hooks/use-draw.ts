// Generic draw hook for NEAR integration
export default function useDraw() {
  return {
    drawing: false,
    onDraw: () => {}
  };
}