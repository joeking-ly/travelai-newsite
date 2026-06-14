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

  /* ── Reveal on scroll ───────────────────────────────────────────── */
  var revealEls = [].slice.call(document.querySelectorAll('.reveal, .reveal-img'));

  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  // Stagger siblings that share a [data-stagger] parent.
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    var step = parseInt(group.getAttribute('data-stagger'), 10) || 90;
    var kids = group.querySelectorAll('.reveal, .reveal-img');
    for (var i = 0; i < kids.length; i++) {
      if (!kids[i].style.getPropertyValue('--d')) {
        kids[i].style.setProperty('--d', (i * step) + 'ms');
      }
    }
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealEls.forEach(function (el) { io.observe(el); });

  /* Safety: anything still hidden after load that's already in view */
  window.addEventListener('load', function () {
    revealEls.forEach(function (el) {
      if (el.classList.contains('in')) return;
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
    });
  });
})();
