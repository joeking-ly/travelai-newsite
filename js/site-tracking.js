/**
 * TravelAI site tracking — Google Tag Manager
 * Container ID carried over from www.travelai.com: GTM-KL73FFND
 * Other tags (GA4, ads, etc.) are managed inside this GTM container.
 */
(function () {
  'use strict';

  var GTM_ID = 'GTM-KL73FFND';

  if (window.__travelaiGtmInstalled) return;
  window.__travelaiGtmInstalled = true;

  // Preconnect for faster tag load
  function addHint(rel, href) {
    if (document.querySelector('link[rel="' + rel + '"][href="' + href + '"]')) return;
    var link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (rel === 'preconnect') link.crossOrigin = '';
    document.head.appendChild(link);
  }
  if (document.head) {
    addHint('preconnect', 'https://www.googletagmanager.com');
    addHint('dns-prefetch', 'https://www.googletagmanager.com');
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });

  var firstScript = document.getElementsByTagName('script')[0];
  var gtmScript = document.createElement('script');
  gtmScript.async = true;
  gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(gtmScript, firstScript);
  } else if (document.head) {
    document.head.appendChild(gtmScript);
  }

  function injectNoscript() {
    if (document.getElementById('gtm-noscript')) return;
    if (!document.body) return;
    var noscript = document.createElement('noscript');
    noscript.id = 'gtm-noscript';
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.googletagmanager.com/ns.html?id=' + GTM_ID;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    iframe.title = 'Google Tag Manager';
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);
  }

  if (document.body) {
    injectNoscript();
  } else {
    document.addEventListener('DOMContentLoaded', injectNoscript);
  }
})();
