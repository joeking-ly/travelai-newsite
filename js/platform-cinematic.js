/**
 * Platform page — scroll reveals
 */
(function () {
  'use strict';

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    var parent = el.closest('[data-stagger]');
    if (parent) {
      var kids = Array.prototype.slice.call(parent.querySelectorAll('.reveal'));
      el.style.setProperty('--d', kids.indexOf(el) * parseInt(parent.dataset.stagger, 10) + 'ms');
    }
    io.observe(el);
  });
})();
