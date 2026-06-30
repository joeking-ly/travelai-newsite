/* ═══════════════════════════════════════════════════════════════════
   HOME V2 — Motion layer
   Scroll-progress spectrum line + reveal-on-scroll for type/photos.
   Card grids keep using motion-reveal.js / core-stats.js (untouched).
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Scroll progress line ───────────────────────────────────────── */
  var bar = document.querySelector('.scroll-progress');
  if (bar) {
    var ticking = false;
    function updateBar() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? Math.min(h.scrollTop / max, 1) : 0;
      bar.style.setProperty('--p', p.toFixed(4));
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateBar); }
    }, { passive: true });
    updateBar();
  }

  /* ── Reveal on scroll: scroll-reveal.js (site-wide) ─────────────── */

  /* ── Core section: animated vector lines video ─────────────────── */
  var coreVideo = document.querySelector('.core-bg-video');
  if (coreVideo) {
    if (reduce) {
      coreVideo.classList.add('is-fallback');
    } else {
      coreVideo.addEventListener('error', function () {
        coreVideo.classList.add('is-fallback');
      });

      function tryPlayCoreVideo() {
        if (coreVideo.classList.contains('is-fallback')) return;
        var playPromise = coreVideo.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.catch(function () {
            /* Keep poster / first frame visible; do not hide the video layer */
          });
        }
      }

      if (coreVideo.readyState >= 2) {
        tryPlayCoreVideo();
      } else {
        coreVideo.addEventListener('loadeddata', tryPlayCoreVideo, { once: true });
      }

      document.addEventListener('visibilitychange', function () {
        if (!document.hidden) tryPlayCoreVideo();
      });
    }
  }

})();
