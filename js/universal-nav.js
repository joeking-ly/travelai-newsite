(function () {
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

  var page = (window.location.pathname.split('/').pop() || '').toLowerCase() || 'index.html';
  var pathname = window.location.pathname || '';
  var root = '';
  if (pathname.indexOf('/blogs/') !== -1 || pathname.indexOf('/stories/') !== -1) {
    root = '../';
  }

  var navHtml =
    '<nav class="universal-nav" aria-label="Main navigation">' +
      '<a href="' + root + 'index.html" class="unav-logo" aria-label="TravelAI">' +
        '<img src="' + root + 'assets/travelai-logo-icon.svg" alt="TravelAI" class="unav-logo-img" width="26" height="26">' +
        '<img src="' + root + 'assets/travelai-name.png" alt="" class="unav-logo-name" aria-hidden="true">' +
      '</a>' +
      '<ul class="unav-links">' +
        '<li><a href="' + root + 'our-vision.html" data-page="our-vision.html">Our Vision</a></li>' +
        '<li><a href="' + root + 'platform.html" data-page="platform.html">Platform</a></li>' +
        '<li><a href="' + root + 'network.html" data-page="network.html">Network</a></li>' +
        '<li><a href="' + root + 'partners.html" data-page="partners.html">Partners</a></li>' +
        '<li><a href="' + root + 'case-studies.html" data-page="case-studies.html">Case Studies</a></li>' +
        '<li class="unav-sep" aria-hidden="true"></li>' +
        '<li><a href="' + root + 'resources.html" data-page="resources.html">Resources</a></li>' +
        '<li><a href="' + root + 'about.html" data-page="about.html">About</a></li>' +
        '<li><a href="' + root + 'insights.html" data-page="insights.html">Insights</a></li>' +
        '<li><a href="' + root + 'contact.html" data-page="contact.html">Contact</a></li>' +
        // '<// <li class="unav-mobile-cta"><a href="' + root + 'stories.html" class="unav-mobile-cta-link">Travel Stories <span aria-hidden="true">→</span></a></li>' +
      '</ul>' +
      '<div class="unav-tablet-menus">' +
        '<div class="unav-dropdown unav-what">' +
          '<button type="button" class="unav-dropdown-trigger" aria-expanded="false" aria-controls="unav-panel-what">What We Do <span class="unav-chevron" aria-hidden="true"></span></button>' +
          '<div class="unav-dropdown-panel" id="unav-panel-what">' +
            '<a href="' + root + 'our-vision.html" data-page="our-vision.html">Our Vision</a>' +
            '<a href="' + root + 'platform.html" data-page="platform.html">Platform</a>' +
            '<a href="' + root + 'network.html" data-page="network.html">Network</a>' +
            '<a href="' + root + 'partners.html" data-page="partners.html">Partners</a>' +
            '<a href="' + root + 'case-studies.html" data-page="case-studies.html">Case Studies</a>' +
          '</div>' +
        '</div>' +
        '<div class="unav-dropdown unav-who">' +
          '<button type="button" class="unav-dropdown-trigger" aria-expanded="false" aria-controls="unav-panel-who">Who We Are <span class="unav-chevron" aria-hidden="true"></span></button>' +
          '<div class="unav-dropdown-panel" id="unav-panel-who">' +
            '<a href="' + root + 'resources.html" data-page="resources.html">Resources</a>' +
            '<a href="' + root + 'about.html" data-page="about.html">About</a>' +
            '<a href="' + root + 'insights.html" data-page="insights.html">Insights</a>' +
            '<a href="' + root + 'contact.html" data-page="contact.html">Contact</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="unav-right">' +
        '<button type="button" class="unav-hamburger" aria-label="Open menu" aria-expanded="false">' +
          '<span class="unav-hamburger-bar"></span><span class="unav-hamburger-bar"></span><span class="unav-hamburger-bar"></span>' +
        '</button>' +
        // '<a href="' + root + 'stories.html" class="unav-cta">TRAVEL STORIES <span class="arrow" aria-hidden="true">→</span></a>' +
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
  placeholder.querySelectorAll('.unav-dropdown-panel a[data-page]').forEach(setActiveState);

  if (page === 'why.html') {
    placeholder.querySelectorAll('a[data-page="our-vision.html"]').forEach(function (link) {
      link.classList.add('active');
    });
  }

  if (page === 'index.html' || page === '' || page === 'index') {
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
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) setMenuOpen(false);
    });
  }

  var tabletTriggers = placeholder.querySelectorAll('.unav-dropdown-trigger');
  tabletTriggers.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var dropdown = btn.closest('.unav-dropdown');
      placeholder.querySelectorAll('.unav-dropdown').forEach(function (d) {
        if (d !== dropdown) {
          d.classList.remove('unav-dropdown-open');
          var t = d.querySelector('.unav-dropdown-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
      var isOpen = dropdown.classList.toggle('unav-dropdown-open');
      btn.setAttribute('aria-expanded', isOpen);
    });
  });
  placeholder.querySelectorAll('.unav-dropdown-panel a').forEach(function (link) {
    link.addEventListener('click', function () {
      placeholder.querySelectorAll('.unav-dropdown').forEach(function (d) {
        d.classList.remove('unav-dropdown-open');
        var t = d.querySelector('.unav-dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    });
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.unav-dropdown-open')) return;
    placeholder.querySelectorAll('.unav-dropdown-open').forEach(function (d) {
      d.classList.remove('unav-dropdown-open');
      var t = d.querySelector('.unav-dropdown-trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  });

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
          '<h2 class="vision-section-title on-light" id="site-join-heading">Join us in building the future of travel</h2>' +
          '<p class="vision-lead on-light">Whether you\'re a traveler, a partner, or someone who believes technology can make the world more connected, there\'s a place for you in the TravelAI story.</p>' +
        '</div>' +
        '<div class="hero-ctas vision-join-ctas">' +
          '<a href="' + root + 'partners.html" class="hero-cta on-light">Become a Partner</a>' +
          '<a href="' + root + 'careers.html" class="hero-cta secondary on-light">Join Our Team</a>' +
        '</div>' +
      '</div>';
    footer.parentNode.insertBefore(joinSection, footer);
  }
})();
