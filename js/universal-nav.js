(function () {
  /* Safety net: ensure GTM loads even if a page omits site-tracking.js */
  if (!window.__travelaiGtmInstalled) {
    var trackingSrc = (function () {
      var pathname = window.location.pathname || '';
      var root = pathname.indexOf('/blogs/') !== -1 || pathname.indexOf('/stories/') !== -1 ? '../' : '';
      return root + 'js/site-tracking.js?v=1';
    })();
    var s = document.createElement('script');
    s.src = trackingSrc;
    s.async = false;
    (document.head || document.documentElement).appendChild(s);
  }

  var placeholder = document.getElementById('universal-nav-placeholder');
  if (!placeholder) return;

  var viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta && viewportMeta.content.indexOf('viewport-fit') === -1) {
    viewportMeta.content = viewportMeta.content.replace(/\s*$/, '') + ', viewport-fit=cover';
  }
  if (!document.querySelector('meta[name="theme-color"]')) {
    var themeColor = document.createElement('meta');
    themeColor.name = 'theme-color';
    themeColor.content = '#0A0A0F';
    document.head.appendChild(themeColor);
  }

  // Works with clean URLs (/about) and legacy .html paths alike
  var page = (window.location.pathname.split('/').pop() || '').toLowerCase().replace(/\.html$/, '');
  var pathname = window.location.pathname || '';
  var root = '';
  if (pathname.indexOf('/blogs/') !== -1 || pathname.indexOf('/stories/') !== -1) {
    root = '../';
  }
  var homeHref = root || '/';

  var navHtml =
    '<nav class="universal-nav" aria-label="Main navigation">' +
      '<a href="' + homeHref + '" class="unav-logo" aria-label="TravelAI">' +
        '<img src="' + root + 'assets/travelai-logo-icon.svg" alt="TravelAI" class="unav-logo-img" width="26" height="26">' +
        '<img src="' + root + 'assets/travelai-name.png" alt="" class="unav-logo-name" aria-hidden="true">' +
      '</a>' +
      '<ul class="unav-links">' +
        '<li><a href="' + root + 'our-vision" data-page="our-vision">Our Vision</a></li>' +
        '<li><a href="' + root + 'platform" data-page="platform">Platform</a></li>' +
        '<li><a href="' + root + 'network" data-page="network">Network</a></li>' +
        '<li><a href="' + root + 'about" data-page="about">About</a></li>' +
        '<li><a href="' + root + 'insights" data-page="insights">Insights</a></li>' +
        '<li><a href="' + root + 'contact" data-page="contact">Contact</a></li>' +
      '</ul>' +
      '<div class="unav-right">' +
        '<button type="button" class="unav-hamburger" aria-label="Open menu" aria-expanded="false">' +
          '<span class="unav-hamburger-bar"></span><span class="unav-hamburger-bar"></span><span class="unav-hamburger-bar"></span>' +
        '</button>' +
      '</div>' +
    '</nav>';

  placeholder.innerHTML = navHtml;

  function setActiveState(link) {
    var linkPage = (link.getAttribute('data-page') || '').toLowerCase();
    if (page === linkPage) {
      link.classList.add('active');
      return true;
    }
    return false;
  }
  var links = placeholder.querySelectorAll('.unav-links a[data-page]');
  for (var i = 0; i < links.length; i++) {
    if (setActiveState(links[i])) break;
  }

  if (page === 'why') {
    placeholder.querySelectorAll('a[data-page="our-vision"]').forEach(function (link) {
      link.classList.add('active');
    });
  }

  if (pathname.indexOf('/blogs/') !== -1 || page === 'blog-detail') {
    placeholder.querySelectorAll('a[data-page="insights"]').forEach(function (link) {
      link.classList.add('active');
    });
  }

  if (page === 'index' || page === 'homepage-new' || page === '') {
    var logo = placeholder.querySelector('.unav-logo');
    if (logo) logo.classList.add('active');
  }

  var nav = placeholder.querySelector('.universal-nav');
  var hamburger = placeholder.querySelector('.unav-hamburger');
  var menuLinks = placeholder.querySelector('.unav-links');

  function setMenuOpen(open) {
    if (!nav || !hamburger) return;
    nav.classList.toggle('unav-mobile-open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('unav-menu-open', open);
  }

  if (nav && hamburger && menuLinks) {
    hamburger.addEventListener('click', function () {
      setMenuOpen(!nav.classList.contains('unav-mobile-open'));
    });
    menuLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuOpen(false);
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenuOpen(false);
    });
    /* Tap on the dimmed page behind the drawer closes it */
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('unav-mobile-open')) return;
      if (!nav.contains(e.target)) setMenuOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) setMenuOpen(false);
    });
  }

  if (!document.querySelector('.skip-link')) {
    var skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#main-content';
    skip.textContent = 'Skip to main content';
    document.body.insertBefore(skip, document.body.firstChild);
  }

  if (!document.getElementById('main-content')) {
    var landmark = document.querySelector('section.hero, section.page-hero, main');
    if (landmark) landmark.id = 'main-content';
  }

  if (!document.querySelector('.scroll-progress')) {
    var progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    placeholder.insertAdjacentElement('afterend', progress);
  }

  var motionSrc = root + 'js/site-motion.js?v=1';
  if (!document.querySelector('script[src*="site-motion.js"]')) {
    var motion = document.createElement('script');
    motion.src = motionSrc;
    motion.defer = true;
    document.body.appendChild(motion);
  }

  if (!document.body.hasAttribute('data-skip-nav-shrink') && !window.__unavShrinkInit) {
    window.__unavShrinkInit = true;
    initNavShrink();
  }

  function initNavShrink() {
    var root = document.documentElement;
    var body = document.body;

    var desktop = {
      expanded: { h: 72, logo: 36, name: 26, gap: 36, pad: 48, link: 15 },
      compact: { h: 52, logo: 24, name: 17, gap: 22, pad: 32, link: 13 },
      distance: 160,
    };

    var mobile = {
      expanded: { h: 72, logo: 30, name: 22, gap: 0, pad: 20, link: 14 },
      compact: { h: 56, logo: 24, name: 0, pad: 16, link: 13 },
      distance: 100,
    };

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function navOffset() {
      return parseFloat(getComputedStyle(root).getPropertyValue('--nav-offset')) || 72;
    }

    function getConfig() {
      return window.innerWidth > 768 ? desktop : mobile;
    }

    function getScrollY() {
      return window.whLenis && typeof window.whLenis.scroll === 'number'
        ? window.whLenis.scroll
        : window.scrollY;
    }

    function applyNavState(from, to, t) {
      root.style.setProperty('--nav-h', lerp(from.h, to.h, t).toFixed(1) + 'px');
      body.style.setProperty('--nav-logo-h', lerp(from.logo, to.logo, t).toFixed(1) + 'px');
      body.style.setProperty('--nav-name-h', lerp(from.name, to.name, t).toFixed(1) + 'px');
      body.style.setProperty('--nav-link-gap', lerp(from.gap, to.gap, t).toFixed(1) + 'px');
      body.style.setProperty('--nav-pad-x', lerp(from.pad, to.pad, t).toFixed(1) + 'px');
      body.style.setProperty('--nav-link-size', lerp(from.link, to.link, t).toFixed(2) + 'px');
      body.style.setProperty('--nav-bg-alpha', lerp(0, 0.96, t).toFixed(3));
      body.classList.toggle('unav-scrolled', t > 0.06);
      body.classList.toggle('unav-is-compact', t > 0.82);
    }

    function updateLightNav() {
      if (body.classList.contains('unav-scrolled')) {
        body.classList.remove('unav-on-light');
        return;
      }

      var navBottom = navOffset();
      var lightSections = document.querySelectorAll(
        '.section.cream, .section.white, .wh-portfolio, #wh-traveler, .site-join, .nwc-light'
      );
      var onLight = false;

      for (var i = 0; i < lightSections.length; i++) {
        var rect = lightSections[i].getBoundingClientRect();
        if (rect.top <= navBottom + 2 && rect.bottom > navBottom) {
          onLight = true;
          break;
        }
      }

      body.classList.toggle('unav-on-light', onLight);
    }

    function updateNav() {
      var cfg = getConfig();
      var t = Math.min(1, Math.max(0, getScrollY() / cfg.distance));
      applyNavState(cfg.expanded, cfg.compact, t);
      updateLightNav();
    }

    function bindLenis() {
      if (!window.whLenis || window.whLenis._unavShrinkBound) return;
      window.whLenis._unavShrinkBound = true;
      window.whLenis.on('scroll', updateNav);
      updateNav();
    }

    applyNavState(desktop.expanded, desktop.expanded, 0);
    window.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav, { passive: true });
    updateNav();
    bindLenis();

    var lenisWatch = setInterval(function () {
      bindLenis();
      if (window.whLenis && window.whLenis._unavShrinkBound) clearInterval(lenisWatch);
    }, 200);
    setTimeout(function () {
      clearInterval(lenisWatch);
    }, 12000);

    var hero = document.querySelector('.wh-hero, section.hero, section.page-hero');
    if (hero && 'IntersectionObserver' in window) {
      var heroObserver = new IntersectionObserver(
        function (entries) {
          if (!entries[0].isIntersecting) {
            body.classList.add('unav-scrolled');
            body.style.setProperty('--nav-bg-alpha', '0.96');
          }
        },
        { threshold: 0, rootMargin: '-' + navOffset() + 'px 0px 0px 0px' }
      );
      heroObserver.observe(hero);
    }

    window.__unavUpdateNav = updateNav;
  }

  var footer = document.querySelector('footer');
  if (
    footer &&
    !document.querySelector('.site-join, .vision-join') &&
    !document.body.hasAttribute('data-skip-site-join')
  ) {
    var joinSection = document.createElement('section');
    joinSection.className = 'section white site-join';
    joinSection.setAttribute('aria-labelledby', 'site-join-heading');
    joinSection.innerHTML =
      '<div class="inner">' +
        '<div class="vision-section-intro">' +
          '<h2 class="vision-section-title on-light" id="site-join-heading">Join TravelAI in building the future of AI in Travel</h2>' +
          '<p class="vision-lead on-light">Whether you\'re a traveler, a partner, or someone who believes technology can make the world more connected, there\'s a place for you in the TravelAI story.</p>' +
        '</div>' +
        '<div class="hero-ctas vision-join-ctas">' +
          '<a href="' + root + 'contact" class="hero-cta on-light">Get in Touch</a>' +
          '<a href="' + root + 'careers" class="hero-cta secondary on-light">Join Our Team</a>' +
        '</div>' +
      '</div>';
    footer.parentNode.insertBefore(joinSection, footer);
    if (window.__unavUpdateNav) window.__unavUpdateNav();
  }

  // Partners, Case Studies, Careers & Travel Stories hidden for launch — strip links site-wide
  var hiddenPaths = ['partners', 'case-studies', 'careers', 'stories'];
  document.querySelectorAll('a[href]').forEach(function (link) {
    var href = (link.getAttribute('href') || '').toLowerCase().split('#')[0].split('?')[0].replace(/\.html$/, '');
    var isHidden = hiddenPaths.some(function (page) {
      return href === page || href.endsWith('/' + page) || href.endsWith('../' + page);
    });
    if (!isHidden) return;
    var li = link.closest('li');
    if (li) {
      li.remove();
    } else {
      link.remove();
    }
  });

  document.querySelectorAll('footer .footer-col').forEach(function (col) {
    var links = col.querySelectorAll('a[href]');
    if (!links.length) col.remove();
  });

  // Copyright year: always show the current year regardless of the static markup
  document.querySelectorAll('.footer-legal').forEach(function (legal) {
    legal.textContent = legal.textContent.replace(/©\s*\d{4}/, '© ' + new Date().getFullYear());
  });
})();
