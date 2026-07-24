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

  function propertyMeta(property) {
    var el = document.querySelector('meta[property="' + property + '"]');
    return el ? el.getAttribute('content') : '';
  }

  function canonicalUrl() {
    var link = document.querySelector('link[rel="canonical"]');
    if (link && link.href) return link.href;
    // Canonical URLs are extension-less (clean URLs served via .htaccess)
    var path = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
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

  function siteUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return SITE + '/' + path.replace(/^(\.\.\/|\.\/|\/)+/, '');
  }

  function isoDate(value) {
    var match = (value || '').match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);
    if (!match) return value || '';
    var months = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    return match[3] + '-' + months[match[1].slice(0, 3)] + '-' + match[2].padStart(2, '0');
  }

  function backgroundImageUrl(el) {
    var match = el && el.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
    return match ? siteUrl(match[1]) : '';
  }

  function blogPosting(root, selectors) {
    var link = selectors.link === ':scope' ? root : root.querySelector(selectors.link);
    var title = root.querySelector(selectors.title);
    var excerpt = root.querySelector(selectors.excerpt);
    var author = root.querySelector(selectors.author);
    var date = root.querySelector(selectors.date);
    var image = root.querySelector(selectors.image);
    if (!link || !title) return null;

    var authorName = author ? author.textContent.trim() : 'TravelAI';
    var post = {
      '@type': 'BlogPosting',
      headline: title.textContent.trim(),
      url: siteUrl(link.getAttribute('href')),
      description: excerpt ? excerpt.textContent.trim() : '',
      author: {
        '@type': authorName === 'TravelAI Blog' ? 'Organization' : 'Person',
        name: authorName
      },
      publisher: { '@id': orgId }
    };
    var published = isoDate(date ? date.textContent.trim() : '');
    var imageUrl = backgroundImageUrl(image);
    if (published) post.datePublished = published;
    if (imageUrl) post.image = imageUrl;
    return post;
  }

  var webPage = {
    '@type': 'WebPage',
    '@id': pageUrl + '#webpage',
    url: pageUrl,
    name: pageTitle,
    description: pageDesc,
    isPartOf: { '@id': websiteId },
    about: { '@id': orgId },
    inLanguage: 'en-US'
  };

  if (document.body.classList.contains('page-insights')) {
    var posts = [];
    var featured = blogPosting(document, {
      link: '#blog-featured .featured-cta',
      title: '#blog-featured .featured-title',
      excerpt: '#blog-featured .featured-excerpt',
      author: '#blog-featured .author-name',
      date: '#blog-featured .author-date',
      image: '#blog-featured .featured-img'
    });
    if (featured) posts.push(featured);

    document.querySelectorAll('#blog-stories-grid .story-card').forEach(function (card) {
      var post = blogPosting(card, {
        link: ':scope',
        title: '.story-title',
        excerpt: '.story-excerpt',
        author: '.story-author',
        date: '.story-date',
        image: '.story-img'
      });
      if (post) posts.push(post);
    });

    webPage['@type'] = 'CollectionPage';
    webPage.mainEntity = {
      '@type': 'ItemList',
      name: 'TravelAI Insights',
      numberOfItems: posts.length,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      itemListElement: posts
    };
  }

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
        description: 'TravelAI™ is an AI-powered travel platform revolutionizing how travelers and agents plan, book, and experience trips through intelligent, structured data.',
        foundingDate: '2021',
        founders: [
          { '@type': 'Person', name: 'John Lyotier' },
          { '@type': 'Person', name: 'Chris Jensen' }
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'hello@travelai.com',
          contactType: 'Customer Service',
          areaServed: 'Worldwide',
          availableLanguage: ['English']
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: '11528 198 street',
          addressLocality: 'Pitt Meadows',
          addressRegion: 'BC',
          postalCode: 'V3Y 1N9',
          addressCountry: 'CA'
        },
        sameAs: [
          'https://www.facebook.com/TravelAIcom',
          'https://twitter.com/TravelAIcom',
          'https://www.instagram.com/TravelAIcom',
          'https://www.linkedin.com/company/travelai-com'
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
      webPage
    ]
  });

  var articleType = meta('article:type');
  if (articleType === 'BlogPosting' || document.body.classList.contains('page-blog')) {
    var headlineEl = document.querySelector('.page-blog .hero-title');
    var authorEl = document.querySelector('.page-blog .author-name');
    var detailsEl = document.querySelector('.page-blog .meta-details');
    var articleImageEl = document.querySelector('.page-blog .article-img');
    var details = detailsEl ? detailsEl.textContent.trim() : '';
    var dateMatch = details.match(/Published\s+(.+?)(?:\s*[•·]\s*|$)/i);
    var published = meta('article:published_time') || isoDate(dateMatch ? dateMatch[1] : '');
    var modified = meta('article:modified_time') || published;
    var headline = headlineEl
      ? headlineEl.textContent.trim()
      : pageTitle.replace(/\s*[—–-]\s*TravelAI.*$/i, '').trim();
    var authorName = authorEl ? authorEl.textContent.trim() : 'TravelAI';
    var articleImage = propertyMeta('og:image') || backgroundImageUrl(articleImageEl);

    inject({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': pageUrl + '#article',
      headline: headline,
      description: pageDesc,
      datePublished: published,
      dateModified: modified,
      author: {
        '@type': authorName === 'TravelAI Blog' ? 'Organization' : 'Person',
        name: authorName
      },
      publisher: { '@id': orgId },
      image: articleImage,
      mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl + '#webpage' },
      inLanguage: 'en-US'
    });
  }
})();
