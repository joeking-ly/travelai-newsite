/**
 * Site-wide nav shrink on scroll (homepage uses GSAP scrub in home-cinematic-scroll.js).
 */
(function () {
  'use strict';

  if (document.body.classList.contains('page-home-cinematic')) return;
  if (document.body.hasAttribute('data-skip-nav-shrink')) return;

  var root = document.documentElement;
  var body = document.body;

  var desktop = {
    expanded: { h: 72, logo: 36, name: 26, gap: 36, pad: 48, link: 15 },
    compact: { h: 52, logo: 24, name: 17, gap: 22, pad: 32, link: 13 },
    distance: 160,
  };

  var mobile = {
    expanded: { h: 56, logo: 30, name: 22, gap: 0, pad: 20, link: 14 },
    compact: { h: 48, logo: 24, name: 0, pad: 16, link: 13 },
    distance: 100,
  };

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function getConfig() {
    return window.innerWidth > 768 ? desktop : mobile;
  }

  function applyNavState(from, to, t) {
    root.style.setProperty('--nav-h', lerp(from.h, to.h, t).toFixed(1) + 'px');
    body.style.setProperty('--nav-logo-h', lerp(from.logo, to.logo, t).toFixed(1) + 'px');
    body.style.setProperty('--nav-name-h', lerp(from.name, to.name, t).toFixed(1) + 'px');
    body.style.setProperty('--nav-link-gap', lerp(from.gap, to.gap, t).toFixed(1) + 'px');
    body.style.setProperty('--nav-pad-x', lerp(from.pad, to.pad, t).toFixed(1) + 'px');
    body.style.setProperty('--nav-link-size', lerp(from.link, to.link, t).toFixed(2) + 'px');
    body.classList.toggle('unav-scrolled', t > 0.06);
    body.classList.toggle('unav-is-compact', t > 0.82);
  }

  function updateNav() {
    var cfg = getConfig();
    var t = Math.min(1, Math.max(0, window.scrollY / cfg.distance));
    applyNavState(cfg.expanded, cfg.compact, t);
  }

  applyNavState(desktop.expanded, desktop.expanded, 0);
  window.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav, { passive: true });
  updateNav();
})();
