/**
 * Fade-up reveal on scroll for .reveal / .reveal-img blocks.
 * Auto-instruments common page patterns site-wide.
 * Respects prefers-reduced-motion. Supports [data-stagger] on parents.
 */
(function () {
  'use strict';

  var CARD_CLASSES = [
    'agentic-card', 'partner-item', 'mission-card', 'value-card', 'press-item',
    'doc-card', 'lab-card', 'tech-card', 'factor-card', 'surface-card',
    'product-card', 'type-card', 'testimonial-card'
  ];

  var SKIP_SELECTOR = [
    'footer', 'nav', '.universal-nav', '.footer-top', '.footer-bottom',
    '.social-links', '.share-buttons', '.nav-links', '.unav-links',
    '[data-no-reveal]', 'script', 'style', 'svg', 'button.share-btn'
  ].join(', ');

  function shouldSkip(el) {
    if (!el || el.nodeType !== 1) return true;
    if (el.classList.contains('reveal-img')) return true;
    if (el.closest(SKIP_SELECTOR)) return true;
    for (var i = 0; i < CARD_CLASSES.length; i++) {
      if (el.classList.contains(CARD_CLASSES[i])) return true;
    }
    return false;
  }

  function markReveal(el) {
    if (shouldSkip(el)) return false;
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
    return true;
  }

  function query(container, selector) {
    try {
      return container.matches && container.matches(selector)
        ? [container]
        : [].slice.call(container.querySelectorAll(selector));
    } catch (e) {
      return [];
    }
  }

  function instrumentGroup(container, itemSelectors, stagger) {
    if (!container || container.hasAttribute('data-no-reveal')) return;

    var marked = [];
    itemSelectors.forEach(function (sel) {
      query(container, sel).forEach(function (el) {
        if (markReveal(el)) marked.push(el);
      });
    });

    if (marked.length && stagger != null && !container.hasAttribute('data-stagger')) {
      container.setAttribute('data-stagger', String(stagger));
    }
  }

  function instrumentAutoReveal() {
    /* Heroes */
    document.querySelectorAll('section.page-hero, section.vision-hero').forEach(function (hero) {
      instrumentGroup(hero, [
        '.eyebrow', '.hero-title', '.hero-subtitle', '.hero-ctas', '.hero-actions'
      ], 90);
    });

    document.querySelectorAll('section.hero').forEach(function (hero) {
      if (hero.classList.contains('page-hero') || hero.classList.contains('vision-hero')) return;
      instrumentGroup(hero, [
        '.hero-inner > *',
        ':scope > .hero-title',
        ':scope > .hero-subtitle',
        '.hero-title', '.hero-subtitle', '.hero-excerpt', '.hero-meta', '.hero-tags', '.back-link', '.hero-date'
      ], 85);
    });

    /* Vision / editorial (manual reveals respected) */
    document.querySelectorAll('.vision-section-intro, .vision-editorial').forEach(function (block) {
      if (block.querySelector('.reveal')) return;
      instrumentGroup(block, [':scope > *'], 80);
    });

    document.querySelectorAll('.vision-papers').forEach(function (list) {
      instrumentGroup(list, [':scope > .vision-paper'], 100);
    });

    document.querySelectorAll('.vision-arc .inner').forEach(function (inner) {
      instrumentGroup(inner, ['.vision-stat-block'], 0);
    });

    /* Section headers inside .inner */
    document.querySelectorAll(
      '.section > .inner, .section > .types-inner, .section > .process-inner, .section > .value-inner'
    ).forEach(function (inner) {
      instrumentGroup(inner, [
        ':scope > .eyebrow',
        ':scope > .drives-head',
        ':scope > .drives-eyebrow',
        ':scope > .sec-title',
        ':scope > .sec-subtitle',
        ':scope > .sec-desc',
        ':scope > .overview-box',
        ':scope > .platform-journey-title',
        ':scope > .types-title',
        ':scope > .process-title',
        ':scope > .value-title',
        ':scope > .testimonials-title',
        ':scope > .form-title',
        ':scope > .agentic-title',
        ':scope > .agentic-subtitle',
        ':scope > .featured',
        ':scope > .company-info'
      ], 75);
    });

    document.querySelectorAll('.drives-head').forEach(function (head) {
      instrumentGroup(head, [':scope > *'], 70);
    });

    /* Section-level titles without .inner wrapper */
    document.querySelectorAll('.section').forEach(function (section) {
      instrumentGroup(section, [
        ':scope > .sec-title',
        ':scope > .sec-subtitle',
        ':scope > .value-title',
        ':scope > .types-title',
        ':scope > .process-title',
        ':scope > .testimonials-title'
      ], 75);
    });

    document.querySelectorAll('.types-section, .value-section, .process-section').forEach(function (section) {
      instrumentGroup(section, ['.types-title', '.value-title', '.process-title'], 0);
    });

    /* Homepage v2 feature bands */
    document.querySelectorAll(
      '.feature-content, .problem-inner, .core-header, .gmp-copy, .homefeature-header'
    ).forEach(function (block) {
      instrumentGroup(block, [
        '.eyebrow', '.feature-title', '.feature-desc', '.problem-title', '.problem-desc',
        '.core-title', '.core-lead', '.gmp-tag', '.btn-primary', '.homefeature-heading'
      ], 80);
    });

    document.querySelectorAll('.scale-section, .market-section, .partners-section .partners-copy').forEach(function (block) {
      instrumentGroup(block, [
        '.scale-title', '.market-title', '.market-lead', '.partners-title', '.partners-desc'
      ], 80);
    });

    document.querySelectorAll('.cta-section, .section.soft[style*="text-align:center"]').forEach(function (block) {
      instrumentGroup(block, ['.cta-title', '.cta-subtitle', '.cta-actions', '.hero-ctas'], 80);
    });

    /* Blog / article content */
    document.querySelectorAll('.article, .section .content').forEach(function (article) {
      instrumentGroup(article, ['h2', 'h3', 'h4', 'p', 'ul', 'ol', 'blockquote', '.article-img'], 55);
    });

    document.querySelectorAll('.verdict-inner, .share-inner').forEach(function (block) {
      instrumentGroup(block, [':scope > *:not(.share-buttons)'], 70);
    });

    document.querySelectorAll('.more-inner').forEach(function (block) {
      instrumentGroup(block, ['.more-title'], 0);
    });

    document.querySelectorAll('.featured').forEach(function (featured) {
      instrumentGroup(featured, [
        '.featured-label', '.featured-title', '.featured-tags', '.featured-excerpt',
        '.featured-meta', '.featured-cta'
      ], 80);
    });

    /* Card grids (story/blog listings) — not motion-reveal card types */
    document.querySelectorAll('.stories-grid, .blog-grid, .posts-grid').forEach(function (grid) {
      instrumentGroup(grid, [':scope > .story-card', ':scope > a.story-card', ':scope > .blog-card'], 90);
    });

    /* Case studies */
    document.querySelectorAll('.case-intro').forEach(function (intro) {
      instrumentGroup(intro, [
        '.case-eyebrow', '.case-title', '.case-tagline', '.case-intro-body', '.case-intro-head'
      ], 75);
    });

    document.querySelectorAll('.case-blocks').forEach(function (blocks) {
      instrumentGroup(blocks, [':scope > *'], 80);
    });

    document.querySelectorAll('.case-metric-block, .case-quote').forEach(function (el) {
      markReveal(el);
    });

    /* Network / bento */
    document.querySelectorAll('.net-eyebrow, .bento-head, .how-head, .tech-head, .transform-head').forEach(function (head) {
      instrumentGroup(head.parentElement || head, [
        '.net-eyebrow', '.bento-head', '.how-head', '.tech-head', '.transform-head',
        ':scope > h2', ':scope > p'
      ], 75);
    });

    document.querySelectorAll('.bento-grid, .cases-grid').forEach(function (grid) {
      instrumentGroup(grid, [':scope > .bento-card', ':scope > .case-card', ':scope > .case-study-card'], 90);
    });

    /* Contact, careers, offices */
    document.querySelectorAll('.contact-grid').forEach(function (grid) {
      instrumentGroup(grid, [':scope > .contact-card'], 90);
    });

    document.querySelectorAll('.form-section').forEach(function (form) {
      instrumentGroup(form, ['.form-title', '.form-subtitle'], 75);
    });

    document.querySelectorAll('.offices-title, .offices-head').forEach(function (el) {
      markReveal(el);
    });

    document.querySelectorAll('.offices-grid').forEach(function (grid) {
      instrumentGroup(grid, [':scope > .office-card'], 80);
    });

    document.querySelectorAll('.job-card, .role-card, .opening-card').forEach(function (el) {
      markReveal(el);
    });

    document.querySelectorAll('.jobs-grid, .roles-grid, .openings-grid').forEach(function (grid) {
      instrumentGroup(grid, [':scope > *'], 90);
    });
  }

  instrumentAutoReveal();

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = [].slice.call(document.querySelectorAll('.reveal, .reveal-img'));

  if (revealEls.length === 0) return;

  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    var step = parseInt(group.getAttribute('data-stagger'), 10) || 80;
    var kids = group.querySelectorAll('.reveal, .reveal-img');
    // Long grids (100+ blog cards) must not accumulate i*step forever —
    // items deep in the list waited 10+ seconds to appear after
    // scrolling into view. Cycle the delay per row instead. Short
    // groups (hero elements etc.) keep the full cascade.
    var cycle = kids.length > 12;
    for (var i = 0; i < kids.length; i++) {
      if (!kids[i].style.getPropertyValue('--d')) {
        var d = (cycle ? (i % 3) : i) * step;
        kids[i].style.setProperty('--d', d + 'ms');
      }
    }
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

  revealEls.forEach(function (el) { io.observe(el); });

  window.addEventListener('load', function () {
    revealEls.forEach(function (el) {
      if (el.classList.contains('in')) return;
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
        el.classList.add('in');
      }
    });
  });
})();
