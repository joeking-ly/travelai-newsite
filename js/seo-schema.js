/**
 * Injects JSON-LD structured data from page meta (Organization, WebSite, WebPage, Article).
 */
(function () {
  'use strict';

  var SITE = 'https://www.travelai.com';
  var orgId = SITE + '/#organization';
  var websiteId = SITE + '/#website';

  function meta(name) {
    var el = document.querySelector('meta[name="' + name + '"]');
    return el ? el.getAttribute('content') : '';
  }

  function canonicalUrl() {
    var link = document.querySelector('link[rel="canonical"]');
    if (link && link.href) return link.href;
    var path = window.location.pathname.replace(/\/index\.html$/, '/');
    return SITE + path;
  }

  function inject(data) {
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  var pageUrl = canonicalUrl();
  var pageTitle = document.title || 'TravelAI';
  var pageDesc = meta('description') || 'TravelAI is The Travel Memory Company.';

  inject({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: 'TravelAI',
        alternateName: 'The Travel Memory Company',
        url: SITE + '/',
        logo: SITE + '/assets/travelai-logo-icon.svg',
        description: 'Portable travel memory for travelers, governed memory for enterprises, and agentic AI across 530+ travel brands.',
        sameAs: [
          'https://www.linkedin.com/company/travelai/',
          'https://x.com/travelai'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: SITE + '/',
        name: 'TravelAI',
        publisher: { '@id': orgId },
        inLanguage: 'en-US'
      },
      {
        '@type': 'WebPage',
        '@id': pageUrl + '#webpage',
        url: pageUrl,
        name: pageTitle,
        description: pageDesc,
        isPartOf: { '@id': websiteId },
        about: { '@id': orgId },
        inLanguage: 'en-US'
      }
    ]
  });

  var articleType = meta('article:type');
  var published = meta('article:published_time');
  if (articleType === 'BlogPosting' && published) {
    inject({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: pageTitle.replace(/\s*[—–-]\s*TravelAI.*$/i, '').trim(),
      description: pageDesc,
      datePublished: published,
      author: { '@type': 'Organization', name: 'TravelAI' },
      publisher: {
        '@type': 'Organization',
        name: 'TravelAI',
        logo: { '@type': 'ImageObject', url: SITE + '/assets/travelai-logo-icon.svg' }
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl + '#webpage' },
      inLanguage: 'en-US'
    });
  }
})();
