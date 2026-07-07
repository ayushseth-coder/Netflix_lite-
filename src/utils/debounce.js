/**
 * Debounce Utility
 * Delays the execution of the callback function until `delay` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
export function debounce(func, delay = 500) {
  let timeoutId;
  
  return function (...args) {
    const context = this;
    
    // Clear any pending timeouts
    clearTimeout(timeoutId);
    
    // Set a new timeout to execute the target function
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
