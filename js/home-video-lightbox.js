/**
 * Homepage hero — open brand film in fullscreen YouTube lightbox.
 * Video: https://youtu.be/ZcdCg_eG48k
 */
(function () {
  'use strict';

  var hero = document.querySelector('.wh-hero');
  var videoId = (hero && hero.getAttribute('data-youtube-id')) || 'ZcdCg_eG48k';
  var bgEmbedBase = 'https://www.youtube-nocookie.com/embed/' + videoId;
  var modalEmbedBase = 'https://www.youtube.com/embed/' + videoId;

  function bgEmbedSrc() {
    var params = [
      'autoplay=1',
      'mute=1',
      'loop=1',
      'playlist=' + videoId,
      'controls=0',
      'rel=0',
      'modestbranding=1',
      'playsinline=1',
      'cc_load_policy=0',
      'disablekb=1',
      'fs=0',
      'iv_load_policy=3',
      'enablejsapi=0',
    ];
    if (window.location.origin && window.location.origin !== 'null') {
      params.push('origin=' + encodeURIComponent(window.location.origin));
    }
    return bgEmbedBase + '?' + params.join('&');
  }

  var INLINE_SRC = bgEmbedSrc();
  var LIGHTBOX_SRC =
    modalEmbedBase + '?autoplay=1&rel=0&modestbranding=1&playsinline=1&cc_load_policy=0';

  var inlineIframe = document.getElementById('home-hero-inline-player');
  var playBtn = document.getElementById('home-hero-video-play');
  var lightbox = document.getElementById('home-video-lightbox');
  var closeBtn = document.getElementById('home-video-close');
  var lightboxHost = document.getElementById('home-video-player');

  if (!inlineIframe || !playBtn || !lightbox || !closeBtn || !lightboxHost) return;

  function startBackgroundVideo() {
    if (inlineIframe.getAttribute('data-started') === '1') return;
    inlineIframe.setAttribute('data-started', '1');
    inlineIframe.src = INLINE_SRC;
  }

  if (document.readyState === 'complete') {
    startBackgroundVideo();
  } else {
    window.addEventListener('load', startBackgroundVideo, { once: true });
  }

  var lastFocus = null;
  var closeDone = false;
  var closeTimer = null;

  function pauseInline() {
    inlineIframe.src = 'about:blank';
  }

  function resumeInline() {
    inlineIframe.src = INLINE_SRC;
  }

  function pauseScroll() {
    document.body.style.overflow = 'hidden';
    if (window.whLenis && typeof window.whLenis.stop === 'function') {
      window.whLenis.stop();
    }
  }

  function resumeScroll() {
    document.body.style.overflow = '';
    if (window.whLenis && typeof window.whLenis.start === 'function') {
      window.whLenis.start();
    }
  }

  function mountLightboxPlayer() {
    lightboxHost.innerHTML = '';
    var iframe = document.createElement('iframe');
    iframe.className = 'home-lightbox-embed';
    iframe.src = LIGHTBOX_SRC;
    iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    );
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    iframe.title = 'TravelAI brand film';
    lightboxHost.appendChild(iframe);
  }

  function destroyLightboxPlayer() {
    lightboxHost.innerHTML = '';
  }

  function openLightbox() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    pauseInline();
    closeDone = false;
    lastFocus = document.activeElement;
    lightbox.removeAttribute('hidden');
    pauseScroll();
    requestAnimationFrame(function () {
      lightbox.classList.add('is-open');
      closeBtn.focus();
      mountLightboxPlayer();
    });
  }

  function finishClose() {
    if (closeDone) return;
    closeDone = true;
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    lightbox.removeEventListener('transitionend', onEnd);
    lightbox.setAttribute('hidden', '');
    destroyLightboxPlayer();
    resumeScroll();
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    lastFocus = null;
    resumeInline();
  }

  function onEnd(e) {
    if (e.target !== lightbox || e.propertyName !== 'opacity') return;
    finishClose();
  }

  function closeLightbox() {
    if (!lightbox.classList.contains('is-open')) return;
    destroyLightboxPlayer();
    lightbox.classList.remove('is-open');
    lightbox.addEventListener('transitionend', onEnd);
    closeTimer = setTimeout(finishClose, 400);
  }

  playBtn.addEventListener('click', openLightbox);
  closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
    }
  });
})();
