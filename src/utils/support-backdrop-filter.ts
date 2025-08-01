/**
 * Check if the browser supports backdrop-filter
 * @returns {boolean} Whether backdrop-filter is supported
 */
export function supportsBackdropFilter(): boolean {
  // Check if CSS.supports is available
  if (typeof CSS !== 'undefined' && CSS.supports) {
    return CSS.supports('backdrop-filter', 'blur(10px)');
  }
  
  // Fallback detection method: check if -webkit-backdrop-filter is supported
  if (typeof document !== 'undefined') {
    const testElement = document.createElement('div');
    testElement.style.setProperty('-webkit-backdrop-filter', 'blur(10px)');
    return testElement.style.getPropertyValue('-webkit-backdrop-filter') === 'blur(10px)';
  }
  
  // If detection is not possible, default to false for compatibility
  return false;
} 