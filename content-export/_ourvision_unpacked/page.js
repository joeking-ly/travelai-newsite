
    (function () {
      'use strict';
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      /* Nav shrink */
      var nav = document.querySelector('.cin-nav');
      function onNav() { nav.classList.toggle('is-shrunk', window.scrollY > 20); }
      window.addEventListener('scroll', onNav, { passive: true });
      onNav();

      /* Reveal on scroll */
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      document.querySelectorAll('.reveal').forEach(function (el) {
        var parent = el.closest('[data-stagger]');
        if (parent) {
          var kids = Array.prototype.slice.call(parent.querySelectorAll('.reveal'));
          el.style.setProperty('--d', (kids.indexOf(el) * parseInt(parent.dataset.stagger, 10)) + 'ms');
        }
        io.observe(el);
      });

      /* Friction list strike-through on scroll */
      var fio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); fio.unobserve(en.target); }
        });
      }, { threshold: 0.6 });
      document.querySelectorAll('.vsc-frictions .fx').forEach(function (li, i) {
        li.style.setProperty('--d', (i * 350) + 'ms');
        fio.observe(li);
      });

      /* Horizontal pillars (pinned) */
      var section = document.querySelector('.cin-pillars-section');
      var track = document.querySelector('.cin-pillars-track');
      var fill = document.querySelector('.cin-pillars-rail-fill');
      var count = document.querySelector('.cin-pillars-count');
      var panels = document.querySelectorAll('.cin-panel').length;

      /* 4 panels: extend the scroll length */
      section.querySelector('.cin-pillars-spacer').style.height = 'calc(1.6 * 400vh)';

      function progress() {
        var rect = section.getBoundingClientRect();
        var total = section.offsetHeight - window.innerHeight;
        if (total <= 0) return 0;
        return Math.min(1, Math.max(0, -rect.top / total));
      }
      function render() {
        var p = progress();
        track.style.transform = 'translate3d(' + (p * (panels - 1) * -100) + 'vw, 0, 0)';
        fill.style.width = (p * 100) + '%';
        var idx = Math.min(panels - 1, Math.round(p * (panels - 1)));
        count.textContent = '0' + (idx + 1) + ' / 0' + panels;
      }

      if (reduced) {
        section.querySelector('.cin-pillars-spacer').style.height = '0px';
        var sticky = section.querySelector('.cin-pillars-sticky');
        sticky.style.position = 'static';
        sticky.style.height = 'auto';
        track.style.flexDirection = 'column';
        document.querySelectorAll('.cin-panel').forEach(function (pn) { pn.style.height = 'auto'; pn.style.paddingTop = '60px'; });
      } else {
        window.addEventListener('scroll', function () { requestAnimationFrame(render); }, { passive: true });
        window.addEventListener('resize', render);
        render();

        var snapTimer = null;
        window.addEventListener('scroll', function () {
          clearTimeout(snapTimer);
          snapTimer = setTimeout(function () {
            var p = progress();
            if (p <= 0.001 || p >= 0.999) return;
            var nearest = Math.round(p * (panels - 1)) / (panels - 1);
            if (Math.abs(nearest - p) < 0.002) return;
            var total = section.offsetHeight - window.innerHeight;
            var top = section.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: top + nearest * total, behavior: 'smooth' });
          }, 320);
        }, { passive: true });
      }
    })();
  