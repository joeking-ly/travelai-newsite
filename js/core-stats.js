/**
 * Core section stats: slide-in reveal + count-up (no external deps).
 */
(function () {
  'use strict';

  var section = document.querySelector('.core-section');
  if (!section) return;

  var valueEls = section.querySelectorAll('.stat-value[data-count]');
  var itemEls = section.querySelectorAll('.stat-item');
  if (!valueEls.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function finalText(el) {
    var target = Number(el.dataset.count);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var value = el.dataset.comma === 'true'
      ? Math.round(target).toLocaleString('en-US')
      : String(Math.round(target));
    return prefix + value + suffix;
  }

  function revealItems() {
    itemEls.forEach(function (item, i) {
      if (reduced) {
        item.classList.add('is-visible');
        return;
      }
      item.style.transitionDelay = (i * 90) + 'ms';
      item.classList.add('is-visible');
    });
  }

  function animateEl(el, delay) {
    var target = Number(el.dataset.count);
    if (reduced || !Number.isFinite(target)) {
      el.textContent = finalText(el);
      return;
    }

    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var useComma = el.dataset.comma === 'true';
    var duration = 1800;
    var startAt = performance.now() + (delay || 0);

    function frame(now) {
      if (now < startAt) {
        requestAnimationFrame(frame);
        return;
      }
      var t = Math.min((now - startAt) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      var rounded = Math.round(target * eased);
      var value = useComma ? rounded.toLocaleString('en-US') : String(rounded);
      el.textContent = prefix + value + suffix;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = finalText(el);
    }

    el.textContent = prefix + '0' + suffix;
    requestAnimationFrame(frame);
  }

  function play() {
    revealItems();
    valueEls.forEach(function (el, i) {
      animateEl(el, 200 + i * 100);
    });
  }

  var played = false;
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || played) return;
        played = true;
        play();
        observer.disconnect();
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -20px 0px' }
  );

  observer.observe(section);

  /* Fallback if observer never fires (e.g. section already in view on load) */
  window.addEventListener('load', function () {
    if (played) return;
    var rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      played = true;
      play();
      observer.disconnect();
    }
  });
})();
