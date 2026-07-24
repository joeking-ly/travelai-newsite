/**
 * index.html — Lenis + GSAP (nav shrink, hero reveal, traveler drift, pillar tabs)
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lenis = null;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function updateScrollProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var y = lenis ? lenis.scroll : window.scrollY;
    bar.style.setProperty('--p', (max > 0 ? Math.min(y / max, 1) : 0).toFixed(4));
  }

  function initLenis() {
    if (prefersReduced || typeof Lenis === 'undefined') {
      window.addEventListener('scroll', updateScrollProgress, { passive: true });
      updateScrollProgress();
      return;
    }

    lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
    });

    lenis.on('scroll', function () {
      ScrollTrigger.update();
      updateScrollProgress();
    });

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    updateScrollProgress();
  }

  function initHeroReveal() {
    if (prefersReduced) return;

    var eyebrow = document.querySelector('.wh-hero__eyebrow');
    var lines = gsap.utils.toArray('.wh-hero__line');
    var lead = document.querySelector('.wh-hero__lead');
    var actions = document.querySelector('.wh-hero__actions');

    if (eyebrow) gsap.set(eyebrow, { y: 20, opacity: 0 });
    gsap.set(lines, { y: 56, opacity: 0 });
    if (lead) gsap.set(lead, { y: 24, opacity: 0 });
    if (actions) gsap.set(actions, { y: 16, opacity: 0 });

    var tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } });
    if (eyebrow) tl.to(eyebrow, { y: 0, opacity: 1, duration: 0.6 });
    tl.to(lines, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 }, eyebrow ? '-=0.35' : 0);
    if (lead) tl.to(lead, { y: 0, opacity: 1, duration: 0.7 }, '-=0.45');
    if (actions) tl.to(actions, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4');
  }

  /* Traveler portfolio: cursor parallax like creative-direction sample */
  function initTraveler() {
    var section = document.getElementById('wh-traveler');
    if (!section || prefersReduced) return;

    var stage = section.querySelector('.wh-traveler__stage');
    var tiles = section.querySelectorAll('.wh-traveler__tile');
    if (!stage || !tiles.length) return;

    stage.addEventListener('mousemove', function (e) {
      var bounds = stage.getBoundingClientRect();
      var x = (e.clientX - bounds.left) / bounds.width - 0.5;
      var y = (e.clientY - bounds.top) / bounds.height - 0.5;

      tiles.forEach(function (tile) {
        var speed = parseFloat(tile.getAttribute('data-speed') || '1');
        var hovered = tile.matches(':hover');
        var drift = hovered ? 0.35 : 1;
        tile.style.setProperty('--tile-tx', (x * 14 * speed * drift).toFixed(2) + 'px');
        tile.style.setProperty('--tile-ty', (y * 10 * speed * drift).toFixed(2) + 'px');
      });
    });

    stage.addEventListener('mouseleave', function () {
      tiles.forEach(function (tile) {
        tile.style.removeProperty('--tile-tx');
        tile.style.removeProperty('--tile-ty');
      });
    });
  }

  var TRIP_STORIES = {
    columbia: {
      location: 'Magdalena River, Colombia',
      image: 'assets/img/trips/trip-columbia.jpg',
      story:
        'On the banks of the Magdalena River, Colombia, I watched a rocket launch. Well not technically, but 5 minutes before this photo was taken, by the light of the setting sun, the Artemis II crew left Florida and set off on their journey to the moon.',
      name: 'John Lyotier',
      role: 'CEO & Co-Founder',
    },
    indonesia: {
      location: 'Poya Lisa, Indonesia',
      image: 'assets/img/trips/trip-poya.jpg',
      story:
        '23 nights on Poya Lisa, a tiny island off Sulawesi, Indonesia. No electricity, no running water, no internet, just the person I love most and a sunset that somehow beat the one before it, every single night. So much changes out there, and so little does.',
      name: 'John Tam',
      role: 'Platform Product Manager',
    },
    canada: {
      location: 'Hopewell Rocks, Canada',
      image: 'assets/img/trips/trip-hopefull.jpg',
      story:
        'Hopewell Rocks at low tide on the Bay of Fundy. Muddy, wet, busy, but very cool to finally experience. Arrived just below absolute low tide and wandered for over an hour, saw the tide slowly coming back in. Shared conversations with people from across North America.',
      name: 'Matt Hogan',
      role: 'Senior PPC Manager',
    },
    mtfuji: {
      location: 'Mt. Fuji, Japan',
      image: 'assets/img/trips/trip-mtfuji.jpg',
      story:
        'Mt. Fuji! Maybe I fell for the propaganda that seeing Mt. Fuji means you will definitely return to Japan. Anyway, it seems to be working because I keep coming back.',
      name: 'Lynette Dela Rosa',
      role: 'Content & Marketing',
    },
    echigo: {
      location: 'Echigo Yuzawa, Japan',
      image: 'assets/img/trips/trip-echigo.jpg',
      story:
        'Morning winter views from Echigo Yuzawa in Niigata Prefecture, surrounded by noodle restaurants, city hot springs and skiers with Tanigawa Mountain Range, the Makihata Range, and the Echigo Sanzan (Three Mountains of Echigo) as the background. As a first-timer with my family and friends, I had to make sure that I did everything from gondolas, ski lifts, my first ski run, soak at a public hot spring/bathhouse with the locals, and finishing the day with a hot bowl of ramen.',
      name: 'Roxette Rubio',
      role: 'Content Assistant',
    },
    sao: {
      location: 'São Miguel Islands, Portugal',
      image: 'assets/img/trips/trip-sao.jpg',
      story:
        'Visiting São Miguel Islands in 2017. I have to admit that I could not point out The Azores on the map prior to this vacation, but it is one of those destinations I know I will have to revisit one day. We were lucky enough to come during the off season for tourism and were able to enjoy entire hiking trails to ourselves which felt surreal against the grand backdrop of massive cliffs and beautiful vistas. Driving the winding roads in a Smart Car that barely fit our minimal luggage of course resulted in some mishaps, but the locals were incredibly kind and helpful and were a big part of what made the trip so special. On our last day we were able to catch some "fogos de artifício" at the port while drinking beer eating food from the street vendors, and it was the perfect send off for a truly special trip.',
      name: 'Shie Gabbai',
      role: 'Director, AI Experience',
    },
    pisa: {
      location: 'Pisa, Italy',
      image: 'assets/img/trips/trip-pisa.jpg',
      story:
        'A self-guided cycling trip took us on adventures from Pisa to Florence over six wonderful days rolling through and climbing the beautiful italian country-side.',
      name: 'Dan Godsell',
      role: 'Director, Governed Memory Platform',
    },
  };

  function initTripModal() {
    var modal = document.getElementById('wh-trip-modal');
    if (!modal) return;

    var backdrop = modal.querySelector('.wh-trip-modal__backdrop');
    var panel = modal.querySelector('.wh-trip-modal__panel');
    var img = document.getElementById('wh-trip-modal-img');
    var title = modal.querySelector('.wh-trip-modal__title');
    var story = modal.querySelector('.wh-trip-modal__story');
    var nameEl = modal.querySelector('.wh-trip-modal__name');
    var roleEl = modal.querySelector('.wh-trip-modal__role');
    var closeBtn = modal.querySelector('.wh-trip-modal__close');
    var tiles = document.querySelectorAll('.wh-traveler__tile[data-trip]');
    var closeEls = modal.querySelectorAll('[data-trip-close]');
    var isOpen = false;
    var activeTween = null;
    var lastTrigger = null;

    function populate(tripId) {
      var trip = TRIP_STORIES[tripId];
      if (!trip) return false;
      img.src = trip.image;
      img.alt = trip.location;
      title.textContent = trip.location;
      story.textContent = '\u201c' + trip.story + '\u201d';
      nameEl.textContent = trip.name;
      roleEl.textContent = trip.role;
      return true;
    }

    function setScrollLock(locked) {
      document.body.classList.toggle('wh-trip-modal-open', locked);
      if (window.whLenis) {
        if (locked) window.whLenis.stop();
        else window.whLenis.start();
      }
    }

    function openModal(tile, tripId) {
      if (isOpen || !populate(tripId)) return;
      isOpen = true;
      lastTrigger = tile;

      var tileRect = tile.getBoundingClientRect();
      var originX = tileRect.left + tileRect.width / 2 - window.innerWidth / 2;
      var originY = tileRect.top + tileRect.height / 2 - window.innerHeight / 2;

      modal.removeAttribute('hidden');
      setScrollLock(true);

      if (activeTween) activeTween.kill();
      gsap.killTweensOf([backdrop, panel, '.wh-trip-modal__body > *']);

      if (prefersReduced) {
        gsap.set(backdrop, { opacity: 1 });
        gsap.set(panel, { opacity: 1, x: 0, y: 0, scale: 1 });
        gsap.set('.wh-trip-modal__body > *', { opacity: 1, y: 0 });
        if (closeBtn) closeBtn.focus();
        return;
      }

      gsap.set(backdrop, { opacity: 0 });
      gsap.set(panel, { opacity: 0, x: originX, y: originY, scale: 0.18 });
      gsap.set('.wh-trip-modal__body > *', { opacity: 0, y: 18 });

      activeTween = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: function () {
          if (closeBtn) closeBtn.focus();
        },
      });

      activeTween
        .to(backdrop, { opacity: 1, duration: 0.32 }, 0)
        .to(panel, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.62 }, 0)
        .to('.wh-trip-modal__body > *', { opacity: 1, y: 0, duration: 0.4, stagger: 0.07 }, 0.28);
    }

    function closeModal() {
      if (!isOpen) return;
      isOpen = false;

      if (prefersReduced) {
        modal.setAttribute('hidden', '');
        setScrollLock(false);
        if (lastTrigger) lastTrigger.focus();
        return;
      }

      if (activeTween) activeTween.kill();

      activeTween = gsap.timeline({
        onComplete: function () {
          modal.setAttribute('hidden', '');
          setScrollLock(false);
          gsap.set(panel, { clearProps: 'all' });
          gsap.set(backdrop, { clearProps: 'all' });
          gsap.set('.wh-trip-modal__body > *', { clearProps: 'all' });
          if (lastTrigger) lastTrigger.focus();
        },
      });

      activeTween
        .to('.wh-trip-modal__body > *', { opacity: 0, y: 10, duration: 0.16, stagger: 0.03, ease: 'power2.in' }, 0)
        .to(panel, { opacity: 0, scale: 0.94, y: 24, duration: 0.28, ease: 'power2.in' }, 0.06)
        .to(backdrop, { opacity: 0, duration: 0.24, ease: 'power2.in' }, 0.1);
    }

    tiles.forEach(function (tile) {
      tile.addEventListener('click', function () {
        openModal(tile, tile.getAttribute('data-trip'));
      });
    });

    closeEls.forEach(function (el) {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeModal();
    });
  }

  /* Pillars: click tabs to switch cards */
  function initPillars() {
    var tabs = document.querySelectorAll('.wh-pillars__tab');
    var cards = document.querySelectorAll('.wh-pillars__card');
    if (!tabs.length || !cards.length) return;

    function setActive(index) {
      tabs.forEach(function (tab, i) {
        var active = i === index;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      cards.forEach(function (card, i) {
        var active = i === index;
        card.classList.toggle('is-active', active);
        card.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        setActive(i);
        /* Keep the tapped tab visible in the scrollable tab row on mobile */
        if (tab.scrollIntoView) {
          tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    });

    setActive(0);
  }

  initLenis();
  window.whLenis = lenis;

  window.addEventListener('load', function () {
    initHeroReveal();
    initTraveler();
    initTripModal();
    initPillars();
    ScrollTrigger.refresh();
  });
})();
