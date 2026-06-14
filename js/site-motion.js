/**
 * Site-wide motion — scroll progress + reveal-on-scroll.
 * Homepage uses home-v2.js for the same primitives; this covers all other pages.
 */
(function () {
  'use strict';

  var isHome = document.body.classList.contains('page-home');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Scroll progress ── */
  var bar = document.querySelector('.scroll-progress');
  if (bar && !isHome) {
    var ticking = false;
    function updateBar() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? Math.min(h.scrollTop / max, 1) : 0;
      bar.style.setProperty('--p', p.toFixed(4));
      ticking = false;
    }
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateBar);
        }
      },
      { passive: true }
    );
    updateBar();
  }

  if (isHome) return;

  /* ── Auto-tag common elements for reveal (no HTML edits required) ── */
  var autoSelectors = [
    '.page-hero .hero-title',
    '.page-hero .hero-subtitle',
    '.hero .hero-title',
    '.hero .hero-subtitle',
    '.hero .hero-excerpt',
    '.hero .hero-ctas',
    '.hero .hero-actions',
    '.section .sec-title',
    '.types-title',
    '.types-grid .type-card',
    '.drives-head',
    '.drives-triptych-wrap',
    '.platform-journey-head',
    '#platform-journey .j-item',
    '.agentic-card',
    '.cta-section .cta-title',
    '.cta-section .cta-subtitle',
    '.cta-section .cta-actions',
    '.form-title',
    '.form-subtitle',
  ];

  autoSelectors.forEach(function (sel) {
    try {
      document.querySelectorAll(sel).forEach(function (el, i) {
        if (!el.classList.contains('reveal')) {
          el.classList.add('reveal');
          if (!el.style.getPropertyValue('--d')) {
            el.style.setProperty('--d', Math.min(i * 70, 420) + 'ms');
          }
        }
      });
    } catch (e) {
      /* invalid selector in older browsers — skip */
    }
  });

  var revealEls = [].slice.call(document.querySelectorAll('.reveal, .reveal-img'));
  if (!revealEls.length) return;

  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) {
      el.classList.add('in');
    });
    return;
  }

  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    var step = parseInt(group.getAttribute('data-stagger'), 10) || 90;
    var kids = group.querySelectorAll('.reveal, .reveal-img');
    for (var i = 0; i < kids.length; i++) {
      if (!kids[i].style.getPropertyValue('--d')) {
        kids[i].style.setProperty('--d', i * step + 'ms');
      }
    }
  });

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
  );

  revealEls.forEach(function (el) {
    io.observe(el);
  });

  window.addEventListener('load', function () {
    revealEls.forEach(function (el) {
      if (el.classList.contains('in')) return;
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
    });
  });
})();
