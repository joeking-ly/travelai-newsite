/**
 * Shared horizontal pin-scroll easing: hold at start and end before scrubbing.
 * @param {number} raw - ScrollTrigger progress 0–1
 * @param {number} holdEach - Fraction reserved at start AND end (e.g. 100/520)
 */
function cinHorizontalProgress(raw, holdEach) {
  var span = 1 - holdEach * 2;
  if (span <= 0) return raw;
  if (raw <= holdEach) return 0;
  if (raw >= 1 - holdEach) return 1;
  return (raw - holdEach) / span;
}

/* ScrollTrigger stability guards.
   By default ScrollTrigger refreshes on visibilitychange and on every resize,
   including events fired while the tab is hidden — when the browser can report
   stale viewport dimensions. A refresh at that moment miscalculates pin-spacer
   heights and leaves huge blank gaps around pinned sections. Instead, refresh
   only when the tab is visible and the viewport size actually changed. */
(function () {
  if (typeof ScrollTrigger === 'undefined') return;

  ScrollTrigger.config({
    autoRefreshEvents: 'DOMContentLoaded,load',
    ignoreMobileResize: true
  });

  var lastW = window.innerWidth;
  var lastH = window.innerHeight;
  var timer = null;

  function refreshIfChanged() {
    if (document.hidden) return;
    if (window.innerWidth === lastW && window.innerHeight === lastH) return;
    lastW = window.innerWidth;
    lastH = window.innerHeight;
    ScrollTrigger.refresh();
  }

  window.addEventListener('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(refreshIfChanged, 200);
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) return;
    /* Wait two frames so the browser restores real dimensions first. */
    requestAnimationFrame(function () {
      requestAnimationFrame(refreshIfChanged);
    });
  });
})();
