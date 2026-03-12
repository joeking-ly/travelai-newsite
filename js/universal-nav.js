(function () {
  var placeholder = document.getElementById('universal-nav-placeholder');
  if (!placeholder) return;

  var page = (window.location.pathname.split('/').pop() || '').toLowerCase() || 'index.html';
  var pathname = window.location.pathname || '';
  var root = (pathname.indexOf('/blog') === 0 || pathname.indexOf('/blogs/') !== -1 || pathname.indexOf('/insights') === 0) ? '/' : '';

  var navHtml =
    '<nav class="universal-nav" aria-label="Main navigation">' +
      '<a href="' + root + 'index.html" class="unav-logo">' +
        '<img src="' + root + 'assets/travelai-logo-icon.svg" alt="TravelAI" class="unav-logo-img">' +
      '</a>' +
      '<ul class="unav-links">' +
        '<li><a href="' + root + 'why.html" data-page="why.html">Why</a></li>' +
        '<li><a href="' + root + 'platform.html" data-page="platform.html">Platform</a></li>' +
        '<li><a href="' + root + 'network.html" data-page="network.html">Network</a></li>' +
        '<li><a href="' + root + 'partners.html" data-page="partners.html">Partners</a></li>' +
        '<li><a href="' + root + 'case-studies.html" data-page="case-studies.html">Case Studies</a></li>' +
        '<li class="unav-sep" aria-hidden="true"></li>' +
        '<li><a href="' + root + 'resources.html" data-page="resources.html">Resources</a></li>' +
        '<li><a href="' + root + 'about.html" data-page="about.html">About</a></li>' +
        '<li><a href="' + root + 'insights.html" data-page="insights.html">Insights</a></li>' +
        '<li><a href="' + root + 'contact.html" data-page="contact.html">Contact</a></li>' +
      '</ul>' +
      '<div class="unav-tablet-menus">' +
        '<div class="unav-dropdown unav-what">' +
          '<button type="button" class="unav-dropdown-trigger" aria-expanded="false" aria-controls="unav-panel-what">What We Do <span class="unav-chevron" aria-hidden="true"></span></button>' +
          '<div class="unav-dropdown-panel" id="unav-panel-what">' +
            '<a href="' + root + 'why.html" data-page="why.html">Why</a>' +
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
        '<a href="' + root + 'stories.html" class="unav-cta">TRAVEL STORIES <span class="arrow" aria-hidden="true">→</span></a>' +
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

  if (page === 'index.html' || page === '' || page === 'index') {
    var logo = placeholder.querySelector('.unav-logo');
    if (logo) logo.classList.add('active');
  }

  var nav = placeholder.querySelector('.universal-nav');
  var hamburger = placeholder.querySelector('.unav-hamburger');
  var menuLinks = placeholder.querySelector('.unav-links');
  if (nav && hamburger && menuLinks) {
    hamburger.addEventListener('click', function () {
      var open = nav.classList.toggle('unav-mobile-open');
      hamburger.setAttribute('aria-expanded', open);
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    menuLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('unav-mobile-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
      });
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
})();
