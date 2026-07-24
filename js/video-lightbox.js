/**
 * Generic YouTube lightbox for any page.
 * Usage: add data-video-lightbox="VIDEO_ID" to a link or button.
 * Keeps the href as a no-JS fallback. Reuses .home-video-* styles from site.css.
 */
(function () {
  'use strict';

  var triggers = document.querySelectorAll('[data-video-lightbox]');
  if (!triggers.length) return;

  var lightbox = null;
  var host = null;
  var closeBtn = null;
  var lastFocus = null;
  var closeTimer = null;
  var closeDone = false;

  function buildLightbox() {
    if (lightbox) return;
    lightbox = document.createElement('div');
    lightbox.className = 'home-video-lightbox';
    lightbox.setAttribute('hidden', '');
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Watch video');
    lightbox.innerHTML =
      '<div class="home-video-modal">' +
      '<button type="button" class="home-video-close" aria-label="Close video"><span aria-hidden="true">&times;</span></button>' +
      '<div class="home-video-frame-wrap" aria-live="polite"></div>' +
      '</div>';
    document.body.appendChild(lightbox);
    host = lightbox.querySelector('.home-video-frame-wrap');
    closeBtn = lightbox.querySelector('.home-video-close');

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
  }

  function mountPlayer(videoId) {
    host.innerHTML = '';
    var iframe = document.createElement('iframe');
    iframe.className = 'home-lightbox-embed';
    iframe.src =
      'https://www.youtube.com/embed/' +
      videoId +
      '?autoplay=1&rel=0&modestbranding=1&playsinline=1&cc_load_policy=0';
    iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    );
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    iframe.title = 'TravelAI video';
    host.appendChild(iframe);
  }

  function pauseScroll() {
    document.body.style.overflow = 'hidden';
    if (window.whLenis && typeof window.whLenis.stop === 'function') window.whLenis.stop();
  }

  function resumeScroll() {
    document.body.style.overflow = '';
    if (window.whLenis && typeof window.whLenis.start === 'function') window.whLenis.start();
  }

  function openLightbox(videoId) {
    buildLightbox();
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    closeDone = false;
    lastFocus = document.activeElement;
    lightbox.removeAttribute('hidden');
    pauseScroll();
    requestAnimationFrame(function () {
      lightbox.classList.add('is-open');
      closeBtn.focus();
      mountPlayer(videoId);
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
    host.innerHTML = '';
    resumeScroll();
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    lastFocus = null;
  }

  function onEnd(e) {
    if (e.target !== lightbox || e.propertyName !== 'opacity') return;
    finishClose();
  }

  function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    host.innerHTML = '';
    lightbox.classList.remove('is-open');
    lightbox.addEventListener('transitionend', onEnd);
    closeTimer = setTimeout(finishClose, 400);
  }

  function extractVideoId(trigger) {
    var explicit = trigger.getAttribute('data-video-lightbox');
    if (explicit) return explicit;
    var href = trigger.getAttribute('href') || '';
    var m = href.match(/(?:youtu\.be\/|[?&]v=|\/embed\/)([\w-]{6,})/);
    return m ? m[1] : null;
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      var id = extractVideoId(trigger);
      if (!id) return;
      e.preventDefault();
      openLightbox(id);
    });
  });
})();
