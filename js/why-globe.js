/**
 * Why page — interactive globe + custom country picker.
 * Expects globe.gl UMD on window (see script tag in why.html); bare ESM would not resolve `three` in browsers.
 */
const GlobeFactory = typeof globalThis !== 'undefined' ? globalThis.Globe : undefined;

const GLOBE_SURFACE_GREY =
  'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg';

const GEOJSON_URL =
  'https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson';

const DOT_GREY = 'rgba(190, 194, 204, 0.72)';
const SCENE_BG = '#14151a';

/** Shown on first paint — auto zoom; user can change via picker. */
const DEFAULT_COUNTRY_ISO = 'DZ';

/** Lower = closer camera (idle uses ~2.28). */
const FOCUS_ALTITUDE = 0.92;

const COUNTRIES = [
  { iso: 'DZ', name: 'Algeria', lat: 28.2, lng: 2.6, population: 45e6, tripsYear: 95e6, hotels: 1_400, str: 52_000 },
  { iso: 'US', name: 'United States', lat: 37.1, lng: -97.5, population: 334e6, tripsYear: 2.3e9, hotels: 55_000, str: 2_500_000 },
  { iso: 'GB', name: 'United Kingdom', lat: 54.0, lng: -2.5, population: 67e6, tripsYear: 320e6, hotels: 12_000, str: 890_000 },
  { iso: 'CA', name: 'Canada', lat: 56.0, lng: -96.0, population: 39e6, tripsYear: 210e6, hotels: 9_500, str: 420_000 },
  { iso: 'AU', name: 'Australia', lat: -24.5, lng: 134.0, population: 26e6, tripsYear: 180e6, hotels: 7_200, str: 310_000 },
  { iso: 'DE', name: 'Germany', lat: 51.0, lng: 10.5, population: 84e6, tripsYear: 380e6, hotels: 14_500, str: 620_000 },
  { iso: 'FR', name: 'France', lat: 46.5, lng: 2.5, population: 68e6, tripsYear: 340e6, hotels: 18_000, str: 1_100_000 },
  { iso: 'ES', name: 'Spain', lat: 40.0, lng: -3.7, population: 48e6, tripsYear: 290e6, hotels: 17_000, str: 950_000 },
  { iso: 'IT', name: 'Italy', lat: 43.0, lng: 12.5, population: 59e6, tripsYear: 260e6, hotels: 32_000, str: 800_000 },
  { iso: 'JP', name: 'Japan', lat: 36.5, lng: 138.5, population: 124e6, tripsYear: 180e6, hotels: 52_000, str: 280_000 },
  { iso: 'MX', name: 'Mexico', lat: 23.6, lng: -102.5, population: 128e6, tripsYear: 420e6, hotels: 25_000, str: 540_000 },
  { iso: 'BR', name: 'Brazil', lat: -14.2, lng: -51.9, population: 216e6, tripsYear: 310e6, hotels: 11_000, str: 380_000 },
  { iso: 'IN', name: 'India', lat: 22.0, lng: 79.0, population: 1420e6, tripsYear: 2.1e9, hotels: 48_000, str: 1_200_000 },
  { iso: 'CN', name: 'China', lat: 35.0, lng: 104.0, population: 1410e6, tripsYear: 6.0e9, hotels: 38_000, str: 1_800_000 },
  { iso: 'TH', name: 'Thailand', lat: 15.0, lng: 101.0, population: 72e6, tripsYear: 220e6, hotels: 14_000, str: 410_000 },
  { iso: 'AE', name: 'United Arab Emirates', lat: 24.0, lng: 54.0, population: 10e6, tripsYear: 85e6, hotels: 1_100, str: 95_000 },
  { iso: 'NZ', name: 'New Zealand', lat: -41.5, lng: 172.0, population: 5.2e6, tripsYear: 48e6, hotels: 2_800, str: 72_000 },
  { iso: 'PT', name: 'Portugal', lat: 39.5, lng: -8.0, population: 10.5e6, tripsYear: 95e6, hotels: 4_200, str: 210_000 },
  { iso: 'NL', name: 'Netherlands', lat: 52.2, lng: 5.3, population: 17.8e6, tripsYear: 110e6, hotels: 3_100, str: 180_000 },
  { iso: 'GR', name: 'Greece', lat: 39.0, lng: 22.0, population: 10.4e6, tripsYear: 88e6, hotels: 10_500, str: 340_000 },
  { iso: 'TR', name: 'Turkey', lat: 39.0, lng: 35.0, population: 85e6, tripsYear: 190e6, hotels: 13_000, str: 310_000 },
];

function randomRainbowHsla() {
  const h = Math.floor(Math.random() * 360);
  return `hsla(${h}, 90%, 58%, 0.96)`;
}

function fmtCompact(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(n >= 10e9 ? 0 : 1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 10e6 ? 0 : 1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(n >= 10e3 ? 0 : 1) + 'K';
  return String(Math.round(n));
}

const ADM0_A3_TO_ISO2 = {
  DZA: 'DZ',
  USA: 'US',
  GBR: 'GB',
  CAN: 'CA',
  AUS: 'AU',
  DEU: 'DE',
  FRA: 'FR',
  ESP: 'ES',
  ITA: 'IT',
  JPN: 'JP',
  MEX: 'MX',
  BRA: 'BR',
  IND: 'IN',
  CHN: 'CN',
  THA: 'TH',
  ARE: 'AE',
  NZL: 'NZ',
  PRT: 'PT',
  NLD: 'NL',
  GRC: 'GR',
  TUR: 'TR',
};

function featureIso(f) {
  const p = f.properties || {};
  let a2 = p.ISO_A2 || p.iso_a2;
  if (a2 && a2 !== '-99') return String(a2).toUpperCase();
  a2 = p.WB_A2 || p.wb_a2;
  if (a2 && a2 !== '-99') return String(a2).toUpperCase();
  const a3 = String(p.ADM0_A3 || p.adm0_a3 || '')
    .trim()
    .toUpperCase();
  return ADM0_A3_TO_ISO2[a3] || '';
}

function updateStats(iso) {
  const c = COUNTRIES.find((x) => x.iso === iso);
  const nameEl = document.getElementById('why-globe-country-name');
  const popEl = document.getElementById('why-stat-pop');
  const tripsEl = document.getElementById('why-stat-trips');
  const hotelsEl = document.getElementById('why-stat-hotels');
  const strEl = document.getElementById('why-stat-str');
  const triggerLabel = document.getElementById('why-country-trigger-label');
  if (!c || !nameEl) return;
  nameEl.textContent = c.name;
  if (triggerLabel) triggerLabel.textContent = c.name;
  if (popEl) popEl.textContent = fmtCompact(c.population);
  if (tripsEl) tripsEl.textContent = fmtCompact(c.tripsYear) + ' / yr';
  if (hotelsEl) hotelsEl.textContent = fmtCompact(c.hotels);
  if (strEl) strEl.textContent = fmtCompact(c.str);
}

function updateListSelection(iso) {
  document.querySelectorAll('.why-country-option').forEach((btn) => {
    const match = iso != null && btn.dataset.iso === iso;
    btn.classList.toggle('is-selected', match);
    btn.setAttribute('aria-selected', match ? 'true' : 'false');
  });
}

function initWhyGlobe() {
  const root = document.getElementById('why-globe-explorer');
  const mount = document.getElementById('why-globe-mount');
  const globeParent = document.getElementById('why-globe-parent');
  const picker = document.getElementById('why-country-picker');
  const backdrop = document.getElementById('why-country-backdrop');
  const trigger = document.getElementById('why-country-trigger');
  const panel = document.getElementById('why-country-panel');
  const listEl = document.getElementById('why-country-list');
  const search = document.getElementById('why-country-search');
  if (!root || !mount || !picker || !backdrop || !trigger || !panel || !listEl) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let globe;
  let selectedIso = null;
  let highlightColor = '#ffffff';
  let polygons = [];

  const idlePov = { lat: 10, lng: 15, altitude: 2.28 };

  function applyHighlight() {
    if (!globe) return;
    const sel = selectedIso;
    const accent = highlightColor;
    globe
      .hexPolygonColor((d) => {
        if (sel == null) return DOT_GREY;
        return featureIso(d) === sel ? accent : DOT_GREY;
      })
      .hexPolygonAltitude((d) => {
        if (sel == null) return 0.005;
        return featureIso(d) === sel ? 0.024 : 0.006;
      });
  }

  function focusCountry(iso, animate) {
    const c = COUNTRIES.find((x) => x.iso === iso);
    if (!c || !globe) return;
    highlightColor = randomRainbowHsla();
    const ms = animate && !reduceMotion ? 1400 : 0;
    /* Lower altitude = closer zoom (idle ~2.28). */
    globe.pointOfView({ lat: c.lat, lng: c.lng, altitude: FOCUS_ALTITUDE }, ms);
    selectedIso = iso;
    applyHighlight();
    updateStats(iso);
    updateListSelection(iso);
    globeParent?.classList.add('is-active');
    document.getElementById('why-globe-stats-card')?.removeAttribute('aria-hidden');
  }

  function setPickerOpen(open) {
    picker.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      panel.removeAttribute('hidden');
      backdrop.removeAttribute('hidden');
      requestAnimationFrame(() => search?.focus());
    } else {
      panel.setAttribute('hidden', '');
      backdrop.setAttribute('hidden', '');
      search.value = '';
      filterList('');
      trigger.focus();
    }
  }

  function filterList(q) {
    const needle = q.trim().toLowerCase();
    listEl.querySelectorAll('.why-country-option').forEach((btn) => {
      const name = (btn.dataset.name || '').toLowerCase();
      const show = !needle || name.includes(needle);
      const li = btn.closest('li');
      if (li) li.hidden = !show;
    });
  }

  /* Country dropdown: runs even if WebGL / globe library fails. */
  COUNTRIES.slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((c) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'none');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'why-country-option';
      btn.setAttribute('role', 'option');
      btn.dataset.iso = c.iso;
      btn.dataset.name = c.name;
      btn.setAttribute('aria-selected', 'false');
      const marker = document.createElement('span');
      marker.className = 'why-country-option-marker';
      marker.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.textContent = c.name;
      btn.append(marker, label);
      btn.addEventListener('click', () => {
        if (globe) {
          focusCountry(c.iso, true);
        } else {
          selectedIso = c.iso;
          highlightColor = randomRainbowHsla();
          updateStats(c.iso);
          updateListSelection(c.iso);
          globeParent?.classList.add('is-active');
          document.getElementById('why-globe-stats-card')?.removeAttribute('aria-hidden');
        }
        setPickerOpen(false);
      });
      li.appendChild(btn);
      listEl.appendChild(li);
    });
  updateListSelection(DEFAULT_COUNTRY_ISO);
  updateStats(DEFAULT_COUNTRY_ISO);
  globeParent?.classList.add('is-active');
  document.getElementById('why-globe-stats-card')?.removeAttribute('aria-hidden');

  search?.addEventListener('input', () => filterList(search.value));

  trigger.addEventListener('click', () => {
    setPickerOpen(!picker.classList.contains('is-open'));
  });

  backdrop.addEventListener('click', () => setPickerOpen(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && picker.classList.contains('is-open')) {
      e.preventDefault();
      setPickerOpen(false);
    }
  });

  function resize() {
    if (!globe) return;
    const w = mount.clientWidth || 600;
    const h = Math.max(320, mount.clientHeight || Math.round(w * 0.65));
    globe.width(w).height(h);
  }

  const wanted = new Set(COUNTRIES.map((c) => c.iso));

  if (typeof GlobeFactory !== 'function') {
    mount.innerHTML =
      '<p class="why-globe-fallback" style="padding:24px;color:rgba(255,255,255,0.65);text-align:center;font-size:14px;max-width:28rem;margin:0 auto;">3D globe library did not load. Check your network connection, disable strict blockers, and refresh. The country list above still works for reference.</p>';
    updateStats(DEFAULT_COUNTRY_ISO);
    globeParent?.classList.add('is-active');
    document.getElementById('why-globe-stats-card')?.removeAttribute('aria-hidden');
    return;
  }

  fetch(GEOJSON_URL)
    .then((r) => r.json())
    .then((data) => {
      polygons = (data.features || []).filter((f) => wanted.has(featureIso(f)));
    })
    .catch(() => {
      polygons = [];
    })
    .finally(() => {
      const w = mount.clientWidth || 600;
      const h = Math.max(320, mount.clientHeight || Math.round(w * 0.65));
      /* Lower H3 resolution = fewer, larger tessellation cells → bigger, sparser dots. */
      const hexResolution = 2;
      const hexTransitionMs = reduceMotion ? 0 : 400;

      try {
        globe = GlobeFactory()(mount)
          .globeImageUrl(GLOBE_SURFACE_GREY)
          .backgroundColor(SCENE_BG)
          .showGraticules(false)
          .showAtmosphere(true)
          .atmosphereColor('rgba(210, 215, 230, 0.06)')
          .atmosphereAltitude(0.11)
          .hexPolygonsData(polygons)
          .hexPolygonResolution(hexResolution)
          .hexPolygonMargin(0.58)
          .hexPolygonUseDots(true)
          .hexPolygonDotResolution(10)
          .hexPolygonsTransitionDuration(hexTransitionMs)
          .hexPolygonLabel((d) => {
            const p = d.properties || {};
            return p.NAME || p.ADMIN || p.name || '';
          })
          .onHexPolygonClick((polygon) => {
            if (!polygon) return;
            const iso = featureIso(polygon);
            if (!iso || !COUNTRIES.some((x) => x.iso === iso)) return;
            setPickerOpen(false);
            focusCountry(iso, true);
          });

        globe.pointOfView({ lat: idlePov.lat, lng: idlePov.lng, altitude: idlePov.altitude }, 0);
        applyHighlight();
        globe.width(w).height(h);

        try {
          const ctl =
            globe.controls && typeof globe.controls === 'function'
              ? globe.controls()
              : globe.controls;
          if (ctl && 'enableZoom' in ctl) ctl.enableZoom = false;
        } catch (e) {}

        window.addEventListener('resize', resize);
        resize();

        requestAnimationFrame(function () {
          focusCountry(DEFAULT_COUNTRY_ISO, !reduceMotion);
        });
      } catch (e) {
        mount.innerHTML =
          '<p class="why-globe-fallback" style="padding:24px;color:rgba(255,255,255,0.65);text-align:center;font-size:14px;">Interactive globe could not start in this browser. Try another browser or update WebGL drivers.</p>';
        updateStats(DEFAULT_COUNTRY_ISO);
        globeParent?.classList.add('is-active');
        document.getElementById('why-globe-stats-card')?.removeAttribute('aria-hidden');
      }
    });
}

let whyGlobeBootOnce = false;
function bootWhyGlobe() {
  if (whyGlobeBootOnce || !document.getElementById('why-globe-explorer')) return;
  whyGlobeBootOnce = true;
  initWhyGlobe();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(bootWhyGlobe), { once: true });
} else {
  requestAnimationFrame(bootWhyGlobe);
}
