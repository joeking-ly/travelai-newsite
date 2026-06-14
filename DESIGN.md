# TravelAI — Design Direction

**Version:** 1.0 (derived from live site, May 2026)  
**Status:** Working reference for marketing site (`Travel AI Build`)

This document captures the brand, narrative, and visual system currently implemented across the TravelAI marketing site. Use it when writing copy, designing new pages, or extending components.

---

## 1. Brand positioning

**Company name:** TravelAI  
**Category frame:** The Travel Memory Company  
**One-line:** Portable travel memory for travelers, governed memory for enterprises, agentic AI across a network of 530+ travel brands.

**Mission (2030):** Help one billion travelers by building the founding travel AI infrastructure — owned by the traveler, governed for the enterprise, open to all.

**Core tension we name:** Travel is deeply personal and context-rich, but every app and AI agent forgets you. We call this the *digital amnesia tax*.

**Product pillars:**

| Pillar | Audience | Message |
|--------|----------|---------|
| **Traveler.md** | Travelers | Portable, human-readable memory you own and grant to AI agents |
| **GMP (Governed Memory Platform)** | Enterprise (OTAs, TMCs) | Consent, audit, and replay for agentic travel at scale |
| **The Core / Network** | Proof & credibility | Live agentic network of 530+ brands — production, not whiteboard |

**Voice:** Confident, infrastructure-minded, human-first. We speak like builders who have shipped at scale — not like a generic AI startup or a legacy OTA.

**Avoid:** Vague “AI magic,” platform lock-in language, fear-mongering about AI, travel clichés (passports, suitcases as decoration).

---

## 2. Narrative arc (homepage)

The homepage tells a single story in this order:

1. **Hero** — Category claim: *The Travel Memory Company*
2. **Network marquee** — Social proof (530+ brand logos)
3. **Mission video** — Emotional anchor: travel is unforgettable
4. **The Problem** — Digital amnesia tax (dark, centered)
5. **Our Belief** — Memory belongs to the person (light feature)
6. **Traveler.md** — Portable memory (light feature, reversed layout)
7. **GMP** — Governed memory for enterprise (dark feature)
8. **Memory Network** — Better memories for all (light feature)
9. **The Core** — Proving ground + animated stats
10. **Scale engine** — Self-reinforcing growth narrative
11. **Market size** — TAM / online booking / serviceable market
12. **Featured content** — Insights & stories
13. **Partners** — Ecosystem + partner types
14. **Closing CTA** — Own your travel memory

New pages should fit this arc: **problem → belief → product → proof → market → action**.

---

## 3. Visual identity

### Logo

- **Mark:** Prism icon (`assets/travelai-logo-icon.svg`) — rainbow-faceted geometric mark
- **Wordmark:** `assets/travelai-name.png` beside prism in universal nav
- **Horizontal lockup:** `assets/White Logo Horizontal Transparent.svg` (footer, press)
- **Minimum clear space:** Height of prism on all sides
- **On dark:** White wordmark + prism glow on hover
- **Do not:** Stretch, recolor the prism to flat single-color, place on busy photography without dim overlay

### Signature element: The Spectrum

The full rainbow gradient is the brand’s distinguishing visual device. It represents the breadth of travel — destinations, people, contexts — unified by memory.

```css
--spectrum: linear-gradient(90deg,
  #FF6B6B 0%, #FFA500 14%, #FFD700 28%, #32CD32 42%,
  #00CED1 57%, #4169E1 71%, #9370DB 85%, #FF1493 100%);
```

**Where to use spectrum:**
- Hero keyword spans (`Travel Memory`, `unforgettable`, `better`)
- Nav load animation (rainbow line sweep under bar)
- Stat numbers (each stat gets a paired gradient, not full spectrum)
- Accent moments — sparingly; never as a full-page background fill

**Spectrum text pattern:**
- `background: var(--spectrum)` + `background-clip: text` + transparent fill
- Optional: `animation: spectrum-shift 6s linear infinite` on key hero words
- **Never** combine gradient text with dark `text-shadow` or `drop-shadow` — it muddies the color

---

## 4. Color system

### Dark palette (primary — most marketing pages)

| Token | Hex | Use |
|-------|-----|-----|
| `--black-deep` | `#0A0A0F` | Page background, nav, hero backdrop |
| `--black-soft` | `#1A1A1A` | Alternate dark sections, cards |
| `--black` | `#000000` | Problem section, pure black bands |
| `--white` | `#FFFFFF` | Headlines on dark, primary buttons |
| `--glass-border` | `rgba(255,255,255,0.1)` | Card borders, dividers |

**Body text on dark:** `rgba(255,255,255,0.7)` — never pure white for paragraphs.

### Light palette (homepage feature alternation)

| Token | Hex | Use |
|-------|-----|-----|
| `--white` | `#FFFFFF` | Light section backgrounds |
| `--gray-dark` | `#2A2A2A` | Body text on light |
| `--gray-mid` | `#666666` | Secondary text, nav links (legacy) |
| `--cream` | `#FAF7F0` | Warm accent surfaces (sparingly) |

### Spectrum stops (individual use)

| Token | Hex | Typical pairing |
|-------|-----|-----------------|
| `--red` → `--orange` | Stat 1, warm accents |
| `--blue` → `--cyan` | Stat 2, tech/trust |
| `--green` → `--cyan` | Stat 3, growth |
| `--purple` → `--pink` | Stat 4, network/community |

### Section rhythm

Alternate **dark → light → dark** on the homepage feature blocks. Centered dark bands (Problem, Core, Market, CTA) break up the two-column features.

---

## 5. Typography

**Font:** [Inter Tight](https://fonts.google.com/specimen/Inter+Tight) — weights 400–900  
**Why:** Geometric, tight tracking, reads modern and technical without feeling cold.

**Implementation:** `css/typography.css` (imported by `css/site.css`) defines fluid type tokens and maps legacy class names site-wide. A cascade block at the end of `site.css` ensures tokens win over older fixed `clamp()` rules.

| Token | Approx. range | Use |
|-------|---------------|-----|
| `--text-display` | 48–72px | Hero titles (`.hero-title`) |
| `--text-h2` / `--text-h2-lg` | 20–44px | Section titles, `h2`, `.sec-title`, `.feature-title`, etc. |
| `--text-h3` | 20–26px | Card headings (`.scale-card-title`, `.case-title`) |
| `--text-lead` | 17–19px | Subtitles and lead copy |
| `--text-body` | 15–16px | Body copy |
| `--text-small` | 13–14px | Eyebrows, labels |
| `--text-stat` | 40–56px | Stat values |

| Role | Weight | Tracking | Notes |
|------|--------|----------|-------|
| Hero title | 600 | −0.03em | White; one spectrum span |
| Section title | 600 | −0.03em | Max-width ~820px when centered |
| Feature title | 600 | −0.02em | Left-aligned in grid |
| Lead / subtitle | 400 | normal | Line-height 1.75 |
| Body | 400 | normal | Line-height 1.6 |
| Eyebrow | 600 | 0.12em | **UPPERCASE** — use `.eyebrow.on-dark` or `.eyebrow.on-light` |
| Stat value | 700 | −0.03em | Gradient fill |
| Button | 600 | normal | Pill shape |

**Eyebrow convention:** Small caps label above section titles — e.g. `THE PROBLEM`, `OUR BELIEF`, `PORTABLE MEMORY · TRAVELER.MD`. Use middot (·) to separate concept pairs.

**Spacing tokens:** `--section-y`, `--section-x`, `--stack-sm` through `--stack-xl` control section padding and vertical rhythm between headings and body copy.

**Site-wide elevation:** Inner pages use `css/site-design.css` for cream light bands, spectrum eyebrow ticks, card shadows, wave CTA backgrounds, and scroll-triggered reveals via `js/site-motion.js`.

**Mobile:** Fluid type tokens scale automatically. `site-design.css` and `home-v2.css` include breakpoints at 768px and 480px — stacked CTAs (min 48px touch targets), single-column grids, reduced section padding, and hidden homepage scroll cue on small screens.

---

## 6. Layout & spacing

- **Max content width:** 1200px (features, grids); 820–900px (centered narrative blocks)
- **Section padding:** `var(--section-y) var(--section-x)` via `typography.css` (≈72–120px vertical; 20–48px horizontal)
- **Grid gap:** 80px (feature two-column); 32–48px (stat/card grids)
- **Page gutters:** 48px desktop; 24px tablet/mobile

**Feature section grid:** 50/50 text + visual. Alternate with `.feature-inner.reverse` for visual left / text right.

**Centered sections:** Problem, Core, Market, CTA — single column, `text-align: center`.

---

## 7. Components

### Navigation (`css/universal-nav.css`)

- Fixed dark bar, 72px height, `#0A0A0F` background
- Prism + wordmark left; links center; CTA right
- Rainbow line sweep animation on load (once)
- Logo glow pulse on hover

### Buttons

| Class | Appearance | Use |
|-------|------------|-----|
| `.btn-primary` | White fill, black text, pill | Primary action on dark |
| `.btn-secondary` / `.btn-outline-white` | Transparent, white border | Secondary on dark |
| `.btn-white` | White fill on black CTA band | Closing section |
| `.btn-hero-outline` | Dark fill `#33303D`, white text | Hero secondary |

All buttons: `border-radius: 100px`, hover lift `translateY(-2px)` + soft shadow. **Use `<a>` tags, not `<button>`, for navigation CTAs.**

### Stat block (`.core-section`)

Four-up grid with gradient numbers and descriptive labels (not short labels). Numbers animate count-up on scroll via `js/core-stats.js`.

### Market cards (`.market-card`)

Three-up dark glass cards: large gradient value, white label, muted descriptor.

### Partner list (`.partner-item`)

Checkbox icon + title + description in stacked rows with subtle top-edge glow.

### Cards (general)

- Background: `rgba(255,255,255,0.03)`
- Border: `1px solid rgba(255,255,255,0.1)`
- Radius: 16px
- Hover: slight lift, brighter background

---

## 8. Motion & interaction

**Principles:** Motion supports comprehension — reveal on scroll, count-up for proof, spectrum drift for brand energy. Never decorative-only loops that distract from copy.

| Pattern | Implementation | Reduced motion |
|---------|----------------|----------------|
| Card reveal | Motion.js via `js/motion-reveal.js` | Opacity 1, no transform |
| Stat count-up | `js/core-stats.js` + IntersectionObserver | Show final values immediately |
| Spectrum shift | CSS `@keyframes spectrum-shift` | Static gradient |
| Nav line sweep | CSS, runs once on load | Can remain |
| Hero optical | `js/hero-optical-engine.js` | Static fallback class |
| Network marquee | CSS infinite scroll | `animation: none` |

Always honor `prefers-reduced-motion: reduce`.

---

## 9. Imagery & media

- **Hero:** Abstract optical / conic gradient atmosphere — not stock travel photography
- **Mission:** Inline video with fullscreen lightbox expand
- **Feature visuals:** Placeholder panels today; future: product UI, diagrammatic memory flows, not generic beach photos
- **Network bar:** Monochrome / muted partner logos in marquee
- **Photography tone (when used):** Real travelers, editorial quality, diverse, never cheesy “pointing at map” stock

---

## 10. Page modes

| Context | Body class | Background | Nav |
|---------|------------|------------|-----|
| Homepage | `.page-home` | White body with dark hero/sections mixed | Universal dark nav |
| Inner pages | default | `--black-deep` | Universal dark nav |
| Light feature blocks | within homepage | `#FFFFFF` sections | Same nav |

Inner pages use compact heroes (`body:not(.page-home) section.hero`) — shorter padding, no full-viewport optical engine.

---

## 11. Copy guidelines

**Headlines:** Short, declarative, often two-beat (problem + twist). One spectrum-highlight word max per headline.

**Subs:** 2–3 sentences max in feature blocks; up to 4 for closing CTA. Plain language; define acronyms once (OTA, TMC, GMP).

**CTAs:** Verb-first, specific — “Meet traveler.md”, “Read the vision”, “For the enterprise” — not “Learn more” or “Click here”.

**Numbers:** Lead with proof stats in Core section; market size in TAM section. Use `M+`, `B+`, `$` prefixes consistently.

---

## 12. Do / Don't

### Do
- Lead with memory, ownership, and governance — not generic “AI-powered travel”
- Alternate dark and light sections for rhythm
- Use spectrum on one focal word per section
- Link all CTAs to real pages
- Keep eyebrows uppercase and consistent

### Don't
- Flatten the rainbow to a single brand color
- Put dark shadows on gradient text
- Use buttons that don't navigate anywhere
- Mix legacy `nav` styles with `universal-nav` on the same page
- Add travel clip-art, globe icons, or airplane motifs unless purposeful

---

## 13. Source files (implementation map)

| Concern | File |
|---------|------|
| Design tokens & components | `css/site.css` |
| Fluid typography & spacing | `css/typography.css` (imported by `site.css`) |
| Site-wide design elevation | `css/site-design.css` (inner pages, imported by `site.css`) |
| Scroll progress & reveals | `js/site-motion.js` (loaded via `universal-nav.js`) |
| Homepage v2 polish | `css/home-v2.css`, `js/home-v2.js` (source: `Claude Design/`) |
| Photo placeholders (homepage) | `js/image-slot.js` |
| Navigation | `css/universal-nav.css`, `js/universal-nav.js` |
| Scroll reveals | `css/motion-reveal.css`, `js/motion-reveal.js`, `.reveal` in `typography.css` |
| Stat animation | `js/core-stats.js` |
| Hero atmosphere | `js/hero-optical-engine.js` |
| Homepage structure | `index.html` (synced from `homepage-new.html`) |
| Section prototypes (not live) | `network-redesign.html`, `drives-section.html`, `journey-section.html` |
| Press / brand assets | `resources.html`, `assets/` |

---

## 14. Open items / future work

- [ ] Link Brand Guidelines download on `resources.html` to a real PDF
- [ ] Replace feature-section visual placeholders with product diagrams
- [ ] Consolidate duplicate minified CSS blocks in `site.css` (technical debt)
- [ ] Dedicated whitepaper URL for closing CTA (currently `why.html`)
- [ ] Figma / component library sync if design moves to shared system

---

*This doc reflects the site as built. Update it when brand, copy, or tokens change materially.*
