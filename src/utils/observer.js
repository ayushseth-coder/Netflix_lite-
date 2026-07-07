/**
 * Observer Utility - Infinite Scrolling
 * Uses the Intersection Observer API to detect when a sentinel element
 * (e.g., a loading spinner at the bottom of the page) enters the viewport.
 *
 * @param {HTMLElement} sentinel - The DOM element to observe.
 * @param {Function} onIntersect - Callback to execute when the sentinel enters the viewport.
 * @param {Object} options - Custom IntersectionObserver configurations.
 * @returns {IntersectionObserver} - The observer instance.
 */
export function createInfiniteScrollObserver(sentinel, onIntersect, options = {}) {
  const defaultOptions = {
    root: null,          // Defaults to browser viewport
    rootMargin: '200px', // Fetch page N+1 slightly before it becomes visible for smoother UX
    threshold: 0.1       // Trigger when 10% of the sentinel is visible
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // If the target element is intersecting the viewport, run the callback
      if (entry.isIntersecting) {
        onIntersect();
      }
    });
  }, mergedOptions);

  if (sentinel) {
    observer.observe(sentinel);
  }

  return observer;
}
