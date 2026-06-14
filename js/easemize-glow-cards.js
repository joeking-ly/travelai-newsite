/**
 * EaseMize GlowCard — vanilla port: inline styles + injected pseudos + inner blur layer.
 * Pointer is per-card (coords relative to each box) so each card has its own spotlight;
 * hue uses --base/--spread per card (sibling index → color rotation unless data-glow-color).
 * Load before universal-nav.js. Disables when prefers-reduced-motion.
 */
(function () {
  'use strict';
  if (typeof document === 'undefined' || !document.querySelectorAll) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SELECTOR = [
    '.agentic-card',
    '.mission-card',
    '.partner-item',
    '.value-card',
    '.press-item',
    '.doc-card',
    '.lab-card',
    '.tech-card',
    '.factor-card',
    '.surface-card',
    '.product-card',
    '.type-card',
    '.testimonial-card',
    '.exec-card',
    '.mgmt-card',
    '.award-card',
    '.story-card'
  ].join(',');

  var GLOW_COLORS = {
    blue: { base: 220, spread: 200 },
    purple: { base: 280, spread: 300 },
    green: { base: 120, spread: 200 },
    red: { base: 0, spread: 200 },
    orange: { base: 30, spread: 200 },
    cyan: { base: 195, spread: 220 }
  };

  var COLOR_ROTATION = ['red', 'blue', 'green', 'purple', 'orange', 'cyan'];

  function siblingElementIndex(el) {
    if (!el.parentNode) return 0;
    var i = 0;
    for (var c = el.parentNode.firstElementChild; c; c = c.nextElementSibling) {
      if (c === el) return i;
      i++;
    }
    return 0;
  }

  /** Distinct preset per card: explicit attr, else rotate by position among siblings. */
  function glowColorFor(el) {
    var preset = (el.getAttribute('data-glow-color') || '').toLowerCase();
    if (preset && GLOW_COLORS[preset]) return GLOW_COLORS[preset];
    var idx = siblingElementIndex(el);
    var key = COLOR_ROTATION[idx % COLOR_ROTATION.length];
    return GLOW_COLORS[key] || GLOW_COLORS.blue;
  }

  function isLightSurface(el) {
    if (el.classList.contains('doc-card')) return true;
    if (el.closest && el.closest('.feature-section-light')) return true;
    if (el.closest && el.closest('.section.white')) return true;
    return false;
  }

  /** PNG tool icons ship on solid #0A0A0F — card fill must match, section stays grey. */
  function isIconBackedCard(el) {
    return el.classList.contains('product-card') && el.closest && el.closest('#products');
  }

  function parseDim(val) {
    if (!val || typeof val !== 'string') return '';
    var v = val.trim();
    if (!v) return '';
    if (/^[\d.]+$/.test(v)) return v + 'px';
    return v;
  }

  function injectBeforeAfterStyles() {
    if (document.getElementById('easemize-glow-card-styles')) return;
    var style = document.createElement('style');
    style.id = 'easemize-glow-card-styles';
    style.textContent =
      '[data-glow]::before,' +
      '[data-glow]::after {' +
      'pointer-events:none;' +
      'content:"";' +
      'position:absolute;' +
      'inset:calc(var(--border-size) * -1);' +
      'border:var(--border-size) solid transparent;' +
      'border-radius:calc(var(--radius) * 1px);' +
      'background-attachment:scroll;' +
      'background-size:calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));' +
      'background-repeat:no-repeat;' +
      'background-position:50% 50%;' +
      '-webkit-mask:linear-gradient(transparent 0 0),linear-gradient(white 0 0);' +
      'mask:linear-gradient(transparent 0 0),linear-gradient(white 0 0);' +
      '-webkit-mask-clip:padding-box,border-box;' +
      'mask-clip:padding-box,border-box;' +
      '-webkit-mask-composite:source-in;' +
      'mask-composite:intersect;' +
      'z-index:0;' +
      '}' +
      '[data-glow]::before {' +
      'background-image:radial-gradient(' +
      'calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),' +
      'hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)),' +
      'transparent 100%' +
      ');' +
      'filter:brightness(2);' +
      '}' +
      '[data-glow]::after {' +
      'background-image:radial-gradient(' +
      'calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),' +
      'hsl(0 100% 100% / var(--border-light-opacity, 1)),' +
      'transparent 100%' +
      ');' +
      '}' +
      '[data-glow] [data-glow] {' +
      'position:absolute;' +
      'inset:0;' +
      'will-change:filter;' +
      'opacity:var(--outer, 1);' +
      'border-radius:calc(var(--radius) * 1px);' +
      'border-width:calc(var(--border-size) * 20);' +
      'filter:blur(calc(var(--border-size) * 10));' +
      'background:none;' +
      'pointer-events:none;' +
      'border:none;' +
      '}' +
      '[data-glow] > [data-glow]::before {' +
      'inset:-10px;' +
      'border-width:10px;' +
      '}' +
      '[data-glow] > *:not([data-glow]) {' +
      'position:relative;' +
      'z-index:1;' +
      '}' +
      '.easemize-glow-layer[data-glow]::before,' +
      '.easemize-glow-layer[data-glow]::after {' +
      'display:none !important;' +
      'content:none !important;' +
      '}';
    document.head.appendChild(style);
  }

  /**
   * Mirrors React getInlineStyles() — must be inline so it wins over .agentic-card etc.
   */
  function applyInlineBaseStyles(el, base, spread, light, iconBacked) {
    el.style.setProperty('--base', String(base));
    el.style.setProperty('--spread', String(spread));
    el.style.setProperty('--radius', '14');
    el.style.setProperty('--border', '3');
    el.style.setProperty(
      '--backdrop',
      iconBacked ? '#0A0A0F' : light ? 'hsl(0 0% 92% / 0.95)' : 'hsl(0 0% 60% / 0.12)'
    );
    el.style.setProperty('--backup-border', iconBacked ? 'rgba(255,255,255,0.1)' : 'var(--backdrop)');
    el.style.setProperty('--size', '200');
    el.style.setProperty('--outer', iconBacked ? '0' : '1');
    el.style.setProperty('--saturation', '100');
    el.style.setProperty('--lightness', light ? '55' : '70');
    el.style.setProperty('--bg-spot-opacity', iconBacked ? '0' : light ? '0.18' : '0.1');
    el.style.setProperty('--border-spot-opacity', '1');
    el.style.setProperty('--border-light-opacity', '1');
    el.style.setProperty('--border-size', 'calc(var(--border, 2) * 1px)');
    el.style.setProperty('--spotlight-size', 'calc(var(--size, 150) * 1px)');
    el.style.setProperty('--hue', 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))');
    el.style.position = 'relative';
    el.style.touchAction = 'none';
    el.style.backgroundSize = 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))';
    el.style.backgroundPosition = '0 0';
    el.style.backgroundAttachment = 'scroll';
    el.style.backgroundColor = iconBacked ? '#0A0A0F' : 'var(--backdrop, transparent)';
    el.style.border = iconBacked
      ? '1px solid rgba(255,255,255,0.1)'
      : 'var(--border-size) solid var(--backup-border)';
    el.style.backgroundImage = iconBacked
      ? 'none'
      : 'radial-gradient(' +
        'var(--spotlight-size) var(--spotlight-size) at ' +
        'calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px), ' +
        'hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), ' +
        'transparent' +
        ')';
  }

  function prependInnerGlowLayer(el) {
    if (el.querySelector(':scope > [data-glow].easemize-glow-layer')) return;
    var inner = document.createElement('div');
    inner.setAttribute('data-glow', '');
    inner.className = 'easemize-glow-layer';
    inner.setAttribute('aria-hidden', 'true');
    el.insertBefore(inner, el.firstChild);
  }

  function bind(el) {
    if (!el || el.getAttribute('data-spotlight') === 'off') return;
    if (el.classList.contains('easemize-glow')) return;
    el.classList.add('easemize-glow');
    el.setAttribute('data-glow', '');
    var c = glowColorFor(el);
    var light = isLightSurface(el);
    var iconBacked = isIconBackedCard(el);
    if (light) el.setAttribute('data-glow-light', '');
    if (iconBacked) el.classList.add('product-card--icon-backed');
    applyInlineBaseStyles(el, c.base, c.spread, light, iconBacked);
    var gw = parseDim(el.getAttribute('data-glow-width'));
    var gh = parseDim(el.getAttribute('data-glow-height'));
    if (gw) el.style.setProperty('width', gw);
    if (gh) el.style.setProperty('height', gh);
    var sz = (el.getAttribute('data-glow-size') || '').toLowerCase();
    if (sz === 'sm') {
      el.style.setProperty('--size', '160');
      el.style.setProperty('--radius', '12');
    } else if (sz === 'lg') {
      el.style.setProperty('--size', '280');
      el.style.setProperty('--radius', '18');
    }
    if (!iconBacked) prependInnerGlowLayer(el);
  }

  function setLocalPointer(el, clientX, clientY) {
    var rect = el.getBoundingClientRect();
    var rw = rect.width || 1;
    var rh = rect.height || 1;
    var lx = clientX - rect.left;
    var ly = clientY - rect.top;
    var inside = lx >= 0 && ly >= 0 && lx <= rw && ly <= rh;
    if (!inside) {
      lx = rw * 0.5;
      ly = rh * 0.5;
    }
    el.style.setProperty('--x', lx.toFixed(2));
    el.style.setProperty('--y', ly.toFixed(2));
    el.style.setProperty('--xp', (lx / rw).toFixed(4));
    el.style.setProperty('--yp', (ly / rh).toFixed(4));
  }

  function syncPointer(e) {
    var cx = e.clientX;
    var cy = e.clientY;
    document.querySelectorAll('.easemize-glow').forEach(function (el) {
      setLocalPointer(el, cx, cy);
    });
  }

  function seedPointer() {
    document.querySelectorAll('.easemize-glow').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var rw = rect.width || 1;
      var rh = rect.height || 1;
      var cx = rect.left + rw * 0.5;
      var cy = rect.top + rh * 0.5;
      setLocalPointer(el, cx, cy);
    });
  }

  function scan() {
    injectBeforeAfterStyles();
    document.querySelectorAll(SELECTOR).forEach(bind);
    seedPointer();
  }

  function init() {
    scan();
    document.addEventListener('pointermove', syncPointer, { passive: true });
    window.addEventListener(
      'resize',
      function () {
        seedPointer();
      },
      { passive: true }
    );
    requestAnimationFrame(function () {
      requestAnimationFrame(seedPointer);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
