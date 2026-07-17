(function () {
  'use strict';

  /* Reveal on scroll */
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
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

  /* Mark cards: tap-to-highlight on touch */
  var markCards = document.querySelectorAll('.vsc-mark-card');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (markCards.length && !finePointer) {
    markCards[0].classList.add('is-active');
  }

  if (markCards.length) {
    markCards.forEach(function (card) {
      card.addEventListener('click', function () {
        if (finePointer) return;
        markCards.forEach(function (c) {
          c.classList.remove('is-active');
        });
        card.classList.add('is-active');
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          markCards.forEach(function (c) {
            c.classList.remove('is-active');
          });
          card.classList.add('is-active');
        }
      });
    });
  }

  /* Vision papers: click tabs */
  function initPapersTabs() {
    var navItems = document.querySelectorAll('.vsc-papers-nav__item');
    var panels = document.querySelectorAll('.vsc-papers-panel');
    if (!navItems.length || !panels.length) return;

    function setActive(index) {
      navItems.forEach(function (item, i) {
        var active = i === index;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      panels.forEach(function (panel, i) {
        var active = i === index;
        panel.classList.toggle('is-active', active);
        panel.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
    }

    navItems.forEach(function (item, i) {
      item.addEventListener('click', function () {
        setActive(i);
      });
    });

    setActive(0);
  }

  window.addEventListener('load', function () {
    initPapersTabs();
  });
})();
