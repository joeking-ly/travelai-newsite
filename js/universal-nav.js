(function () {
  // TEMP: Site-wide (client-side) auth gate.
  // NOTE: This is not secure against determined users (static front-end only),
  // but it blocks casual browsing until you remove it later.
  try {
    var USERNAME = 'traveller';
    var PASSWORD = 'therethere';
    var STORAGE_KEY = 'tunerdepot_auth';

    var alreadyUnlocked = false;
    try {
      alreadyUnlocked = (localStorage.getItem(STORAGE_KEY) === '1');
    } catch (e) {
      alreadyUnlocked = false;
    }

    if (alreadyUnlocked) {
      document.documentElement.classList.add('auth-ok');
    } else {
      // Don’t inject if a page already has its own auth gate markup.
      if (!document.getElementById('auth-gate')) {
        // Inject styles once.
        if (!document.getElementById('auth-gate-style')) {
          var style = document.createElement('style');
          style.id = 'auth-gate-style';
          style.textContent =
            '.auth-gate{position:fixed;inset:0;z-index:3000;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(10,10,15,.86);backdrop-filter:blur(6px)}' +
            'html.auth-ok .auth-gate{display:none}' +
            '.auth-modal{width:100%;max-width:420px;background:#0A0A0F;border:1px solid rgba(255,255,255,.16);border-radius:18px;padding:22px;box-shadow:0 24px 80px rgba(0,0,0,.6);color:rgba(255,255,255,.92)}' +
            '.auth-title{font-weight:700;font-size:18px;margin-bottom:14px}' +
            '.auth-fields{display:flex;flex-direction:column;gap:12px}' +
            '.auth-field label{display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:rgba(255,255,255,.7)}' +
            '.auth-input{width:100%;padding:12px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#fff;font-family:inherit;font-size:14px;outline:none}' +
            '.auth-input:focus{border-color:rgba(255,255,255,.35);background:rgba(255,255,255,.08)}' +
            '.auth-error{color:#ffb4b4;font-size:13px;min-height:16px;margin-top:8px}' +
            '.auth-actions{display:flex;gap:12px;margin-top:16px}' +
            '.auth-btn{flex:1;padding:12px 16px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:#fff;color:#0A0A0F;font-weight:700;cursor:pointer;transition:transform .15s ease,box-shadow .15s ease,opacity .15s ease}' +
            '.auth-btn:hover{transform:translateY(-1px);box-shadow:0 10px 28px rgba(255,255,255,.15)}' +
            'body.auth-blocked{overflow:hidden}';
          document.head.appendChild(style);
        }

        var gate = document.createElement('div');
        gate.id = 'auth-gate';
        gate.className = 'auth-gate';
        gate.setAttribute('role', 'dialog');
        gate.setAttribute('aria-modal', 'true');
        gate.innerHTML =
          '<div class="auth-modal">' +
          '<div class="auth-title" id="auth-title">Sign in to view</div>' +
          '<div class="auth-fields">' +
          '<div class="auth-field">' +
          '<label for="auth-username">Username</label>' +
          '<input id="auth-username" class="auth-input" type="text" autocomplete="username" />' +
          '</div>' +
          '<div class="auth-field">' +
          '<label for="auth-password">Password</label>' +
          '<input id="auth-password" class="auth-input" type="password" autocomplete="current-password" />' +
          '</div>' +
          '</div>' +
          '<div class="auth-error" id="auth-error" aria-live="polite"></div>' +
          '<div class="auth-actions">' +
          '<button id="auth-submit" class="auth-btn" type="button">Enter</button>' +
          '</div>' +
          '</div>';
        document.body.appendChild(gate);
        document.body.classList.add('auth-blocked');

        var usernameEl = gate.querySelector('#auth-username');
        var passwordEl = gate.querySelector('#auth-password');
        var errorEl = gate.querySelector('#auth-error');
        var submitEl = gate.querySelector('#auth-submit');

        function unlock() {
          try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e2) {}
          document.documentElement.classList.add('auth-ok');
          gate.remove();
          document.body.classList.remove('auth-blocked');
        }

        function check() {
          if (!usernameEl || !passwordEl) return;
          var u = (usernameEl.value || '').trim();
          var p = (passwordEl.value || '').trim();
          if (u === USERNAME && p === PASSWORD) {
            if (errorEl) errorEl.textContent = '';
            unlock();
          } else if (errorEl) {
            errorEl.textContent = 'Incorrect username or password.';
            passwordEl.focus();
          }
        }

        if (usernameEl) usernameEl.focus();
        if (submitEl) submitEl.addEventListener('click', check);
        [usernameEl, passwordEl].forEach(function (el) {
          if (!el) return;
          el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') check();
          });
        });
      }
    }
  } catch (e) {
    // Fail open: don’t block the site if something unexpected happens.
  }

  // Existing navigation injection
  // (runs below even if auth gate is visible)
  var placeholder = document.getElementById('universal-nav-placeholder');
  if (!placeholder) return;

  var page = (window.location.pathname.split('/').pop() || '').toLowerCase() || 'index.html';
  var pathname = window.location.pathname || '';
  var root =
    pathname.indexOf('/blog') === 0 ||
    pathname.indexOf('/blogs/') !== -1 ||
    pathname.indexOf('/stories/') !== -1 ||
    pathname.indexOf('/insights') === 0
      ? '/'
      : '';

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
