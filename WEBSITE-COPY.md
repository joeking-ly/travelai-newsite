# TravelAI — Full Website Copy

**Last synced from live site:** July 2026  
**Purpose:** Review and rewrite all marketing messaging in one place. Edit this file first, then apply changes back to the HTML.

---

## How to use this document

1. **Read top to bottom** — the homepage narrative arc is the spine; other pages extend it.
2. **Mark your edits inline** or replace copy under each section.
3. **Keep factual claims** (stats, product names, legal disclaimers) unless you flag them as outdated.
4. **CTAs** are marked with `[CTA]`.
5. **Gradient / italic emphasis** is noted as *(gradient)* or *(italic)* where it appears on the site.

### Your editorial notes *(fill in)*

| Question | Your answer |
|----------|-------------|
| What should a visitor understand in 5 seconds? | |
| Who is the primary audience right now? (traveler / partner / investor / press) | |
| What feels off about the current messaging? | |
| One sentence we'd want every page to reinforce: | |
| Tone shift needed? (more human / more enterprise / simpler / bolder) | |

---

## Brand reference

| Item | Current framing |
|------|-----------------|
| **Company name** | TravelAI |
| **Category** | The Travel Memory Company |
| **One-line** | Portable travel memory for travelers, governed memory for enterprises, agentic AI across 530+ travel brands |
| **Core tension** | The *digital amnesia tax* — every app and AI agent forgets you |
| **Product pillars** | Traveler.md (travelers) · GMP / Governed Memory Platform (enterprise) · The Core / Network (proof) |
| **2030 mission** | Help one billion travelers by building the founding travel AI infrastructure — owned by the traveler, governed for the enterprise, open to all |
| **Voice (target)** | Confident, infrastructure-minded, human-first — builders who ship at scale |
| **Avoid** | Generic AI hype, lock-in language, fear-mongering, travel clichés (passports, suitcases) |

### Stats in use *(verify before changing)*

| Stat | Where it appears |
|------|------------------|
| **530+** travel brands | Homepage, network, partners, meta |
| **470+** travel brands | Platform, about metrics, partners section on homepage, careers, resources |
| **50M+** travelers helped yearly | Homepage core stats, partners |
| **$630M+** gross booking value | Homepage, partners |
| **2,500+** bookings daily | Homepage, partners |
| **19.5M+** supply listings | Platform, scale engine |
| **1B** travelers by 2030 | About, our-vision |
| **100** FTE | Careers, resources (removed from about Recognition section) |

> **Copy issue:** Brand count bounces between **470+** and **530+** across pages. Pick one number and align everywhere.

---

## Global elements

### Navigation (`js/universal-nav.js`)

**Primary links**
- Our Vision
- Platform
- Network
- Partners
- Case Studies
- About
- Insights
- Contact

**Tablet dropdowns**
- *What We Do:* Our Vision · Platform · Network · Partners · Case Studies
- *Who We Are:* About · Insights · Contact

**Accessibility**
- Skip to main content

*(Resources and Travel Stories nav links are commented out in code.)*

---

### Site-wide pre-footer CTA *(injected on most pages)*

**Headline:** Join us in building the future of travel

**Body:** Whether you're a traveler, a partner, or someone who believes technology can make the world more connected, there's a place for you in the TravelAI story.

**[CTA]** Become a Partner  
**[CTA]** Join Our Team

---

### Footer *(all main pages)*

**Tagline:** Making travel better through AI personalization.

**Product:** Platform · Network · Case Studies · Partners  
**Company:** Our Vision · About Us · Careers · Contact  
**Content:** Insights · Travel Stories  
**Legal:** Privacy Policy · Terms of Service  

**Copyright:** © 2026 TravelAI. All rights reserved.

---

# Homepage (`index.html`)

**URL:** `/`  
**Title:** TravelAI – The Travel Memory Company | Travel Personalization in the Age of AI  
**Meta description:** TravelAI is The Travel Memory Company – portable travel memory for travelers, governed memory for enterprises, while applying agentic AI across a network of 530+ travel brands.

---

## Hero

**Headline:** The Travel Memory Company.

**Subhead:** Travel runs on context that today lives everywhere and belongs nowhere. We make it portable for travelers, governed for enterprises, and useful for every travel AI agent in between. This is the age of AI in Travel.

**[CTA]** What We're Building  
**[CTA]** Partner With Us  

**Scroll cue:** Scroll

---

## Travel Network marquee

**Label:** Travel Network

**Brand names (ticker):** OwnerDirect · CASAI · Better Trips · RBO · Varoom · Smartours · SSR · CBN · STAP · Bach · FVR · ALO · Exec · HTL · MLFR · ORAI · FMDE · VC · BV · HVI · AT · PET · PKT

---

## Mission video

**Headline:** Travel is *(gradient)* unforgettable.* It connects people, creates lasting memories, and fuels the world's economy. In a world of digital and artificial, travel is permanent and real.

---

## The Problem

**Eyebrow:** The Problem

**Headline:** Personalized travel runs on memory.  
Yet every app and AI agent forgets you.

**Body:** You explain yourself once per service, forever — the loyalty number, the seat preference, the allergy, the no-red-eyes-with-the-kids. Each platform keeps a sliver of you. None of them share. We call it the digital amnesia tax, and every traveler pays it.

---

## Our Belief

**Eyebrow:** Our Belief

**Headline:** Every travel journey starts with a person, not a platform.

**Body:** So the memory should belong to the person. We're building a portable, governed memory layer for the travel industry. This is context the traveler owns and can carry between every AI agent, app, and service they choose.

**[CTA]** Read the vision  

**Photo chip:** Every journey is personal

---

## Portable Memory · Traveler.md

**Eyebrow:** Portable Memory · Traveler.md

**Headline:** One file. Yours. It travels with you.

**Body:** Traveler.md is a portable, human-readable profile of who you are as a traveler — your preferences, your constraints, the trips that matter. Built to be read by AI agents like Claude, with your permission. You grant access, see what's used, and revoke it anytime.

**[CTA]** Meet traveler.md  

**Badge:** traveler.md

---

## Governed Memory · For the Enterprise

**Eyebrow:** Governed Memory · For the Enterprise

**Headline:** Built for the agentic age — and governed for it.

**Body:** The TravelAI Governed Memory Platform gives OTAs, TMCs, and enterprise travel programs the consent, audit, and replay machinery to put AI to work in travel with confidence — every interaction traceable, every decision defensible.

**Tagline:** Now in early development.

**[CTA]** For the enterprise

---

## Better Memories for All

**Eyebrow:** Better Memories for All

**Headline:** A memory network that compounds.

**Body:** We're applying our tech across our proprietary network of travel brands. That's 530+ sites and counting! Every traveler strengthens the format. Every AI agent strengthens it back. Enterprise deployments feed the network; the network makes every trip more personal. It's the flywheel that built email, OAuth, and the open web – now for travel memory.

---

## The Core · Our Proving Ground

**Eyebrow:** The Core · Our Proving Ground

**Headline:** Proven where it's hardest: at scale, in production.

**Lead:** We didn't start from a whiteboard. We run a live agentic network of 530+ travel brands and other complementary technologies. Together, these constitute the base we're building the memory layer on top of, and the origin story behind it all.

| Stat | Label |
|------|-------|
| **50M+** | Travelers helped yearly, each demonstrating high-intent demand |
| **530+** | Active Travel Brands, creating helpful travel content at scale |
| **$630M+** | Gross Booking Value annually via sustainable growth and partnerships |
| **2500+** | Travel Bookings Daily, generating learning signals across the network |

---

## Scale engine

**Headline:** A self-reinforcing engine  
powering accelerating scale

**Hub label:** Compounds

### Content
**Title:** Gen AI + 19.5M Discovery  
**Body:** Generative AI creates helpful content at scale across 530+ brands and 40 languages.

### Travelers
**Title:** Millions Travelers, Billion+ Quality Data  
**Body:** High intent demand via online marketing, organic search, and LLM discovery channels.

### Data
**Title:** Optimizing for Life of Traveler  
**Body:** Nearly 1,000 transactions per day generate learning signals across the network.

### Economics
**Title:** Manage Economics Data to Revenue  
**Body:** Sustainable growth through intelligent monetization and partner relationships.

---

## Market size

**Headline:** The world's largest vertical.  
Ready for AI.

**Lead:** Travel is the biggest consumer category on earth, and the one with the most context to remember.

| Value | Label | Description |
|-------|-------|-------------|
| **$1.7T** | Total Addressable Market | Global travel & tourism industry size |
| **$341B** | Online Booking Market | Digital travel bookings worldwide |
| **$110B** | Serviceable Market | AI-enabled travel discovery |

---

## Latest insights *(homepage cards)*

**Eyebrow:** From the TravelAI Network  
**Headline:** Latest insights.  
**Subhead:** Our newest perspectives on AI, travel, and the agentic network from the TravelAI team.

**Card 1:** Agentic AI in Travel: From Conversation to Action — Joshua Viner · May 19, 2026  
**Card 2:** TravelAI Names Shie Gabbai, Brianna MacNeil to Lead Agentic Travel — Joshua Viner · May 1, 2026

---

## Partners *(homepage section)*

**Headline:** Better travel starts with *(gradient)* better* partners.

**Body:** We give the travel ecosystem – suppliers, hotels, OTAs, and AI platforms – a neutral, governed memory layer to build on. Partners read and contribute to traveler memory with permission, so everyone starts from the same source of truth.

**[CTA]** Become a Partner

**Accommodation Providers** — Connect with high-intent travelers matched to your properties through AI-powered personalization.

**Travel Brands** — Join 470+ brands powered by our unified AI platform to drive growth and optimize performance.

**Technology Partners** — Integrate with our agentic network through SVTP protocol for portable traveler intelligence.

---

# About (`about.html`)

**URL:** `/about.html`  
**Title:** About TravelAI — Our Mission & Team  
**Meta description:** Meet the team building The Travel Memory Company — portable memory for travelers, governed memory for enterprises, and AI across 530+ travel brands.

> **Note:** Title/meta still say "team" — may need updating to match travel-stories section.

---

## Hero

**Headline:** We're building the *(gradient)* future* of travel intelligence

**Subhead:** A team of builders, operators, and dreamers focused on making travel more personal, more efficient, and more human through AI.

---

## What drives us forward

**Eyebrow:** Our foundation  
**Headline:** What drives us forward

### Our Belief
**Headline:** Travel makes the *world better.*  
**Body:** It connects people, creates lasting memories, and fuels economic opportunity. That belief is the reason TravelAI exists.

### Our Vision
**Headline:** The leading *AI ecosystem* by 2030.  
**Body:** To be the leading personalization ecosystem for the travel vertical — ushering in the Age of AI for one billion travelers.

### Our Mission
**Headline:** Better travel through *AI personalization.*  
**Body:** Empowering travelers with the right information, at the right moment, for the right journey — every time.

| Stat | Label |
|------|-------|
| 470+ | Travel Brands |
| 1B | Travelers by 2030 |
| #1 | AI Personalization Layer |

---

## The principles that guide us

**Headline:** The principles that guide us

| Principle | Copy |
|-----------|------|
| **Traveler First** | Every decision starts with the traveler. We build for real people with real preferences, not for algorithms or profit maximization. |
| **Privacy by Design** | Trust is earned through transparency and respect. We build privacy into every layer — travelers own their data, and we're the stewards. |
| **Move Fast, Learn Faster** | The AI landscape changes weekly. We ship, test, learn, and iterate at speed. Improvements compound across 470+ brands automatically. |
| **Win-Win Partnerships** | Great ecosystems are built on mutual value. We succeed when our partners succeed through incremental business and shared insights. |
| **Responsible Growth** | We're committed to making travel better not just for travelers, but for communities, cultures, and the planet. |
| **Agentic Future** | We're building for the agentic age where AI agents and humans collaborate seamlessly to create better outcomes together. |

---

## Stories from our own travels

**Headline:** Stories from our own travels

**Subhead:** We build travel technology because we can't stop traveling ourselves. These are the trips our team keeps coming back to — told by the people who took them.

| Location | Story | Name | Title |
|----------|-------|------|-------|
| Milos, Greece *(featured)* | "Sailing the Greek islands with my family — nothing beats the wind, the water, and watching the kids discover a new cove every day. We still talk about the sunset in Milos." | John Lyotier | CEO & Director |
| Tokyo, Japan | "Tokyo in autumn. The contrast between ancient temples and neon streets, plus the food and the discipline of the city, left a lasting impression. I go back whenever I can." | Rakib Islam | CTO & Director |
| Scottish Highlands | "A road trip through the Scottish Highlands. Empty roads, misty lochs, and a different whisky distillery every evening. It's the trip I recommend to anyone who needs to reset." | Simon Jones | CFO |
| Iceland | "Iceland — the otherworldly landscapes, the silence, and the sense that you're at the edge of something. Reykjavik and the Golden Circle still feel like a different planet." | Sabbir Ahmed | Chief Architect |
| Kyoto, Japan | "Kyoto during cherry blossom season. The combination of tradition, calm, and that brief burst of pink taught me to travel for the moment, not just the place." | Jennifer Thornton | Director of People & Culture |
| Patagonia, Chile | "Patagonia. Raw, remote, and humbling. Torres del Paine and the sense of being at the end of the world — I'd do it again in a heartbeat." | Josh Viner | Corp Dev & Partnerships |
| The Dolomites, Italy | "A week in the Dolomites — hiking by day, Italian food by night. The scale of the mountains and the simplicity of the villages made it unforgettable." | Joe Deobald | Growth Marketing Manager |

---

# Our Vision (`our-vision.html`)

**URL:** `/our-vision.html`  
**Title:** Our Vision — TravelAI | The Travel Memory Company  
**Meta description:** How TravelAI is building the founding memory layer for travel — told through the vision papers that set our direction, from the Factory of the Future to the Third Voice to Traveler.md.

---

## Hero

**Eyebrow:** Our Vision  
**Headline:** One vision, written down as we *(gradient)* go.*  
**Subhead:** We've been building toward the same future for years: travel that knows you, works for you, and remembers you without taking you away from the trip itself. Along the way we've written down what we see coming, at the moment we saw it. Each paper below is a marker in time. Read together, they trace a single line: build the engine, understand the shift, and give the traveler the memory that makes it all personal.

**[CTA]** Explore the Platform  
**[CTA]** Partner With Us

---

## The thesis

**Eyebrow:** The thesis  
**Headline:** Travel is becoming agentic, and the layer that lasts is memory.

**Body:** AI agents are about to mediate how people plan, book, and manage travel. That much is no longer in question. The open question is what those agents read, who holds it, and whose interests it serves. We believe the answer is a portable memory layer that travelers own, and that the company best positioned to build it is one already operating at scale across the real travel economy.

That's us. We run a live network of 530+ travel brands. The network is two things at once: distribution that reaches millions of high intent travelers, and a proving ground where we apply AI to real bookings, in production, every day. The brands are how we learn what actually makes travel better. The memory layer is how we make that learning belong to the traveler.

---

## The vision papers

**Eyebrow:** The vision papers  
**Headline:** Moments in time  
**Subhead:** A series of moments in time, each capturing where we stood and where we were headed. The direction has held; the picture keeps getting sharper.

### Paper 01 — Building Our Factory of the Future
**Meta:** October 2024 · Painted Picture · *The engine*  
**Body:** Before there was a memory layer, there had to be a machine that could learn. This paper describes the operating philosophy behind TravelAI: a virtual factory that builds the thing that builds the thing. Automate the 80% of work that every business shares, so our people, and now our agents, can pour themselves into the 20% that's ours alone. Break big things into small things and hand the repeatable ones to agents that never sleep. The point was never automation for its own sake. It was to build an engine efficient enough to make travel better for a billion people, and human enough to keep its soul.  
**Pull quote:** "Our job, and humanity's job, is to infuse the soul into the machine."

### Paper 02 — The Third Voice
**Meta:** February 2025 · The AI Power Shift · *The shift*  
**Body:** If the factory was about how we build, the Third Voice is about what's changing in the market we build for. Travel has always been a two sided marketplace: travelers and suppliers. AI introduces a third participant: agents that don't just assist, but decide, negotiate, and act. We argued that whoever holds this Third Voice will shape the customer experience for the next decade, and that it should be aligned to the same goal travelers and suppliers already share: booking better travel. The real question isn't who will own it. It's whether it serves travelers, not the incumbents.  
**Pull quote:** "Soon, you won't just search for travel. Travel will come to you."  
**[CTA]** Read the paper

### Paper 03 — Traveler.md
**Meta:** The portable memory layer · *The traveler*  
**Body:** Capable agents are here. But every one of them is an amnesiac. Each conversation starts from zero, each preference explained again. We call it the amnesia tax, and every traveler pays it. This paper makes the case for the missing layer: a portable, human readable memory the traveler owns and grants to any agent, app, or service they choose. Traveler.md is who you are. Trip.md is what you're planning. The connected trip isn't a journey assembled inside one platform. It's a trip that stays connected to the person, so every service starts from the same memory and gives it back better.  
**Pull quote:** "We believe a traveler's memory should travel with them."  
**[CTA]** Read the paper

---

## The bigger vision

**Headline:** Help one billion travelers by building the founding travel AI infrastructure, owned by the traveler, governed for the enterprise, and open to all.

**Subhead:** Three papers, one arc. The factory taught us how to operate AI at scale across real travel brands. The Third Voice told us where the market was going. Traveler.md is what we give the traveler so the agentic age works in their favor, not at their expense. The agent layer will be competitive and fast moving. The memory layer underneath should be cooperative, stable, and the traveler's. That's the layer we're building.

**Stat:** 1 Billion — Travelers by 2030

---

## Why we acquired Sonder

**Eyebrow:** Why we acquired Sonder  
**Headline:** The name is the thesis.

**Body (summary):** *Sonder* — the realization that every passing stranger has an inner life as vivid as your own. We acquired the brand (not the operating company) to express our thesis: every traveler's tastes, history, and memories are singular and worth carrying trip to trip. Sonder relaunches at Sonder.com as a curated guide to the world's best urban stays. Traveler.md is in public beta; over time Sonder becomes the flagship showcase for memory-led personalization.

**Disclaimer:** TravelAI is a separate company. We acquired only the Sonder brand and domains after the operating company's closure — no leases, properties, staff, or liabilities assumed.

**[CTA]** Visit Sonder.com

---

## Where this is going

**Eyebrow:** Where this is going

**Body:** Today, travel is a logistics job with a vacation hidden inside it. We think that's backwards. When your memory is portable and the agents around you can read it, the friction collapses: the rebooking, the visa form, the preference explained for the hundredth time. You get the hours back. Not the abstract hours of "saved time." The real ones, the ones where you sit down somewhere unfamiliar and remember why you came.

We're at the beginning. The foundation is small on purpose, and we're building it in the open, with hard problems named, not hidden. We are The Travel Memory Company, and we're excited for what's up next.

---

# Platform (`platform.html`)

**URL:** `/platform.html`  
**Title:** Platform | TravelAI Technology | One Engine for Agentic Travel  
**Meta description:** A self improving platform that powers 470+ travel brands with AI driven personalization, autonomous optimization, and privacy first intelligence.

---

## Hero

**Headline:** AI that *(gradient)* learns*, personalizes, and scales.

**Subhead:** A self improving platform that powers 470+ travel brands with AI driven personalization, autonomous optimization, and privacy first intelligence.

**[CTA]** Explore the Platform  
**[CTA]** The Agentic Network

---

## Unified platform

**Eyebrow:** Unified platform  
**Headline:** One engine. Every surface.

**Body:** TravelAI's platform is a single, unified engine that adapts to every surface, channel, and agent. We meet travelers where they are: web, chat, voice, messaging, partner sites, or Slack. The same AI powered core delivers personalized experiences across all touchpoints.

Built for the agentic age, our platform combines generative AI, machine learning, and proprietary optimization to create content at scale, drive high intent demand, and deliver measurable results for partners.

---

## Reach & distribution

**Eyebrow:** Reach & distribution  
**Headline:** Meet travelers anywhere they are.  
**Subhead:** One intelligent engine. Every touchpoint. 470+ travel brands powered by the same engine.

| Touchpoint | Headline | Description |
|------------|----------|-------------|
| Any Website | Any Website | TravelAI runs across a network of 470+ travel brand websites, delivering intelligent, contextual assistance from the moment a traveler lands. |
| Any Device | Any Device | A fully responsive experience that adapts to every screen — desktop to mobile at the gate. |
| Any Platform | Any Platform | From OTA marketplaces to white label distribution partners — every channel becomes an intelligent touchpoint. |
| Any Interface | Any Interface | Chat widgets, voice assistants, internal tools including Trip Desk for Slack — one engine everywhere travelers need answers. |

---

## The tools

**Eyebrow:** The tools  
**Headline:** The tools that power the network.  
**Subhead:** From autonomous site generation to AI powered optimization, our platform automates what used to take teams weeks or months.

| Product | Description |
|---------|-------------|
| **Presto** | Agentic site builder that launches travel brands in days, not months. |
| **Trip.bot** | Conversational AI for travelers — "Web of One" to "Web of None" agentic trip orchestration. |
| **TAM Engine** | Traveler Action Models — portable, privacy first preference vectors. |
| **Ad Management** | AI powered traffic acquisition with cancellation prediction. Guaranteed positive ROAS. |
| **Self-Healing Content** | Content that adapts to performance signals automatically. |
| **Domain System** | Intelligent domain management and brand portfolio optimization. |
| **SVTP Protocol** | Shared Vector Travel Protocol for consent based context sharing. |
| **Travel Community** | Closed network travel clubs and referral networks. |
| **Bot Army** | Autonomous AI agents that build, test, market, and improve products. |

---

## Growth engine

**Eyebrow:** The growth engine  
**Headline:** The growth engine.  
**Subhead:** Our self reinforcing loop drives compounding growth. Every interaction makes the system smarter.

| Label | Stat | Description |
|-------|------|-------------|
| Content | 19.5M+ | Supply listings across 40 languages |
| Travelers | Millions | High intent demand via marketing, search, LLM discovery |
| Data | Nearly 1,000 | Transactions per day generating learning signals |

---

## The stack

**Eyebrow:** The stack  
**Headline:** Built for scale, optimized for speed.

- **Layer 1 — AI & Agents:** LLM Integration, Generative AI, ML Models, TAM Engine, Agentic Bots, SVTP Protocol
- **Layer 2 — Platform Core:** Presto Builder, Content Management, SEO Engine, Personalization, Analytics, Attribution
- **Layer 3 — Distribution:** Traffic Acquisition, Partner APIs, Deep Links, Affiliate Network, Supply Integration
- **Layer 4 — Infrastructure:** Cloud Native, Auto Scaling, CDN, Security, Privacy by Design, Compliance

---

## Product roadmap

**Eyebrow:** Product roadmap  
**Headline:** Scale, integrate, distribute.  
**Subhead:** Three phases: scale the platform, integrate new verticals, then distribute intelligence across the network.

**Phase 1 — Scale (2025):** Presto Platform, Trip.bot "Web of One", Agentic Builder, Ad Management, Domain Management, TAM Development

**Phase 2 — Integrate (2026):** Trip.bot "Connected Trip", SVTP/TAM Validation, Agent-to-Agent API, Hotel/DMO Data, Activities + Tours, Multi-Day & Cruise Supply

**Phase 3 — Distribute (2027):** Trip.bot "Web of None", Data Exchange Network, Referral Network, Travel Community Partners, Closed Network Travel Club, Self-Healing Content

---

# Network (`network.html`)

**URL:** `/network.html`  
**Title:** The Agentic Network — TravelAI | Portable Traveler Memory  
**Meta description:** A self learning travel network connecting travelers, AI agents, and supply, built on portable privacy first traveler memory (TAM) and consent based context sharing (SVTP).

---

## Hero

**Headline:** The future of travel is *(gradient)* connected*

**Subhead:** A self learning distribution network for agentic, cross partner travel: portable, privacy first traveler memory that gives every participant context, with consent, and measurable value in return.

**[CTA]** How It Works

---

## How it works

**Eyebrow:** How It Works  
**Headline:** Three participants. One shared objective.  
**Subhead:** The network connects travelers, AI agents, and supply providers around a single goal: making the purchase and consumption of travel better for everyone involved.

**Participants:** Travelers · AI Agents · Supply (accommodation, activities, experiences)

**Metcalfe's Law:** It follows Metcalfe's Law: value compounds as participants join. Every new brand, traveler, or supply partner makes the network more valuable for all the others. **V ∝ N²**

---

## The technology

**Eyebrow:** The Technology  
**Headline:** Two models. One portable context.  
**Subhead:** Patent pending architecture: Traveler Action Model (TAM) + Shared Vector Travel Protocol (SVTP).

### Traveler Action Model (TAM)
A compact, pseudonymous memory of a traveler's preferences. Built from passive, active, analyzed, and enriched signals. Never PII.

### Shared Vector Travel Protocol (SVTP)
The standard way to exchange traveler memory between partners. Consent based sharing lets the receiving site personalize without ever seeing PII.

### Vector Enrichment
The traveler's memory updates continuously with new signals. Each update refreshes the TAM.

### Network-Scale Learning Engine
Autonomous learning infrastructure across 530+ brands. Cohort and causal models identify what drives conversion and satisfaction at scale.

---

## The transformation

**Eyebrow:** The Transformation  
**Headline:** From cold start to *(gradient)* warm start*

**Today — Fragmented & Forgotten:** Travelers get generic first landing experiences because high intent signals are siloed, lost, or impossible to share safely.

**Tomorrow — Connected & Personalized:** New front doors remember preferences and generate personalized results on arrival. Partner context flows with consent, privately.

---

## The mechanism

**Eyebrow:** The Mechanism  
**Headline:** Everything becomes a vector  
**Subhead:** Portable traveler context rests on vectorization — closeness means similarity.

**Steps:** Raw Signal → Embedding Model → TAM Vector → Match & Rank

---

## What makes an agentic network work

| Factor | Description |
|--------|-------------|
| Speed & Scale | Context flows at the speed of thought |
| Clear Attribution | Partners see what's working — ROI built into every handoff |
| Network Learning | Every interaction improves the whole network |
| Outcome Optimization | Optimizes for satisfaction and ROI, not vanity metrics |
| Frictionless Integration | High intent demand without operational complexity |
| Trust in Agents | Transparency, consent, predictable outcomes |

---

# Partners (`partners.html`)

**URL:** `/partners.html`  
**Title:** Partners — Join the TravelAI Network  
**Meta description:** Partner with TravelAI to read and contribute to governed traveler memory — for suppliers, hotels, OTAs, and AI platforms building on a shared source of truth.

---

## Hero

**Eyebrow:** Partnerships  
**Headline:** Better travel starts with *(gradient)* better* partners.

**Subhead:** Join a network of 530+ travel brands powered by applied AI. Whether you're a travel brand, OTA, accommodation provider, or technology partner, there's a place for you in the TravelAI ecosystem.

**[CTA]** Become a Partner  
**[CTA]** Learn More

---

## Partner types

**Headline:** Four ways to partner with TravelAI.

### 01 — Travel Brands & Publishers
Join 530+ high performing travel brands. Our AI monetization engine optimizes your traffic and grows revenue per session.

### 02 — Accommodation Providers
Reach high intent, pre qualified travelers across niche brands built around specific interests and buying personas.

### 03 — Technology & AI Partners
Integrate with the Shared Vector Travel Protocol — the context layer behind agentic, cross partner travel.

### 04 — Investors & Acquirers
We're actively exploring strategic partnerships and investment.

---

## The TravelAI Advantage

**Headline:** Why partners choose TravelAI.

| Stat | Label |
|------|-------|
| 530+ | Travel brands across the network |
| 50M+ | Annual high intent travelers ready to book |
| $630M+ | Gross booking value across the network |
| ~20% | Cart value lift through AI powered personalization |
| 2500+ | Bookings a day across the network |
| 100% | ROI focused: measurable results and clear attribution |

---

## How partnership works

| Step | Title | Description |
|------|-------|-------------|
| 1 | Initial Conversation | Discovery call — no commitment required |
| 2 | Technical Integration | Our team handles setup — minimal engineering lift |
| 3 | Pilot & Optimization | Validate against KPIs with full transparency |
| 4 | Scale & Grow Together | Continuous optimization and shared roadmap |

---

## Trusted brands

**Headline:** Trusted by leading travel brands.

**Testimonials:** *(All four are placeholders — "replace with approved quote")*

---

## Partnership form

**Headline:** Ready to partner?  
**Lead:** Tell us about your business and let's explore how we can grow together.

**Fields:** Full Name · Email · Company · Partnership Type · Message  
**Partnership types:** Travel Brand / Publisher · Accommodation Provider · Technology / AI Partner · Investor / Acquirer  
**[CTA]** Submit Partnership Inquiry

---

# Case Studies (`case-studies.html`)

**URL:** `/case-studies.html`  
**Title:** Case Studies — TravelAI Success Stories

---

## Hero

**Headline:** Real results. Real brands.

**Subhead:** See how TravelAI's AI-powered platform transforms legacy travel brands into high-growth, profitable businesses in weeks not years.

---

## OwnerDirect.com

**Tagline:** Reviving a 40-year vacation rental brand through AI-driven acquisition and AI-powered scale.

**Key results:** $3.1M+ GBV · 1 Week to launch · 2 Months to payback

**Takeaway:** 40-year old brand re-activated in days. Seven figure volume in 30 days. Entirely organic, profitable growth from day one.

---

## CASAI.com

**Tagline:** Resurrecting a $50M brand from a $30k entry price.

**Key results:** $45M GBV in 20 months · 46k+ transactions · $790k non-paid traffic value

**Takeaway:** Legacy domain authority + AI infrastructure = immediate value. Brand launched in under 14 days.

---

# Contact (`contact.html`)

**URL:** `/contact.html`  
**Title:** Contact TravelAI — Get in Touch

---

## Hero

**Headline:** Let's talk about the future of travel

**Subhead:** Whether you're a potential partner, investor, or just curious about what we're building — we'd love to hear from you.

---

## Contact cards

| Type | Email |
|------|-------|
| General Inquiries | hello@travelai.com |
| Partnerships | partnerships@travelai.com |
| Press & Media | press@travelai.com |
| Careers | View open roles → |

---

## Form

**Headline:** Send us a message  
**Fields:** Full Name · Email · Company · Subject · Message  
**[CTA]** Send Message

---

## Offices

**Vancouver** — Headquarters · Executive & Leadership Team  
**Dhaka** — Engineering Hub · Engineering & Product Development

---

## FAQ

- How do I become a TravelAI partner?
- What types of partnerships does TravelAI offer?
- Is TravelAI hiring?
- Where is TravelAI based?
- How can I learn more about TravelAI's technology?

---

# Careers (`careers.html`)

**URL:** `/careers.html`  
**Title:** Careers — Join TravelAI

---

## Hero

**Headline:** Want to join us?

**Subhead:** We're always looking for talented people who share our passion for making travel better through AI. Check out our open positions or get in touch.

---

## Open roles

| Role | Location |
|------|----------|
| Senior Software Engineer | Vancouver or Dhaka |
| Product Manager | Vancouver |
| Data Scientist | Vancouver or Dhaka |
| Growth Lead | Vancouver |
| Senior UX Designer | Vancouver |

*(Full job descriptions on page — each includes What you'll do / What we're looking for + Apply CTA)*

---

# Insights (`insights.html`)

**URL:** `/insights.html`  
**Title:** Insights — TravelAI Insights & Updates

---

## Hero

**Headline:** The future of travel intelligence

**Subhead:** Perspectives on AI, personalization, and the evolution of travel from the team building the industry's most advanced travel agentic network.

---

## Featured post

**Title:** Agentic AI in Travel: From Conversation to Action  
**Excerpt:** When AI in travel first hit the mainstream, it mostly looked like a chatbot. A search box with a friendlier face…  
**Author:** Joshua Viner · May 19, 2026

---

## Filters

All · Company · Inspiration · Industry · Community Contributions · Podcast

---

## Blog index

50+ posts listed on page (Company news, industry analysis, podcasts, vision papers). Full post copy lives in individual `blogs/*.html` files — not duplicated here.

**Recent titles include:**
- TravelAI Names Shie Gabbai, Brianna MacNeil to Lead Agentic Travel
- PhocusWire CEO Spotlight: John Lyotier
- TravelAI Surpasses 1 Million Bookings
- TravelAI Acquires OwnerDirect.com
- The AI Power Shift: Why the Third Voice Will Control the Future of Travel
- New Brand and New Website: Why We've Re-Launched as TravelAI

---

# Travel Stories (`stories.html`)

**URL:** `/stories.html`  
**Title:** Travel Stories — Real Travelers, Real Experiences

---

## Hero

**Headline:** Real travelers. Real experiences.

**Subhead:** Authentic stories from our creator community — sharing their journeys, discoveries, and travel insights powered by TravelAI.

---

## Featured story

**Title:** Finding Hidden Gems in Portugal's Douro Valley  
**Author:** Sarah Kim · 2 days ago

---

## Story cards

- 24 Hours in Tokyo: A First-Timer's Guide — Marcus Johnson
- The Secret Beaches of Sardinia You've Never Heard Of — Elena Costa
- How AI Helped Me Plan the Perfect Family Road Trip — David Park
- Solo Female Travel in Morocco: What I Wish I Knew — Ava Rodriguez
- Eating My Way Through Vietnam's Street Food Scene — Lucas Chen
- The Ultimate Iceland Ring Road Itinerary — Nina Taylor

**[CTA]** Load More Stories

---

# Resources (`resources.html`)

**URL:** `/resources.html`  
**Title:** Resources — TravelAI Press Kit & Documentation

---

## Hero

**Headline:** Everything you need to know about TravelAI

**Subhead:** Press materials, media coverage, documentation, and our latest experiments in AI-powered travel technology.

---

## Sections

- **Press Kit** — Logo Pack · Brand Guidelines · Team Photos
- **Company Information** — Founded 2018 · Vancouver HQ · 100 FTE · 100% founder-funded
- **In the News** — TechCrunch, Skift, Phocuswire, VentureBeat, Deloitte *(sample headlines on page)*
- **Documentation** — Getting Started · Technical Docs · For Partners · Use Cases · Privacy & Security · Support
- **FAQ** — What is TravelAI? · TAM · SVTP · Partnership · Differentiation · Hiring
- **Labs & Innovation** — Trip Desk for Slack · Predictive Demand Signals · Dynamic Creative Generator · Agent-to-Agent API

---

# Redirects & legacy

**Why (`why.html`):** Redirects to Our Vision — body copy: "This page has moved. Continue to Our Vision"

---

# Legal *(headlines only)*

Full legal text in HTML — edit there directly.

| Page | Title |
|------|-------|
| `privacy.html` | Privacy Policy |
| `terms.html` | Terms of Service |

---

## Messaging audit — issues to fix

| Issue | Detail |
|-------|--------|
| **470 vs 530 brands** | Inconsistent across homepage, platform, about, partners, resources |
| **About meta/title** | Still says "Meet the team" — page now shows travel stories |
| **Footer tagline** | "Making travel better through AI personalization" — doesn't mention memory category |
| **Partner testimonials** | All placeholders on partners page |
| **Homepage closing CTA** | No dedicated closing CTA section — relies on injected site-join block |
| **Resources press stats** | Some figures differ from homepage (e.g. $456M vs $630M GBV) |
| **Category clarity** | "Travel Memory Company" is strong in hero but diluted in product/platform pages |

---

## Suggested rewrite priority

1. **Homepage hero + problem** — first 10 seconds; category claim must land instantly
2. **One-line + footer tagline** — align everything to the same frame
3. **About hero** — currently generic "future of travel intelligence"
4. **Platform hero** — reads like a feature list, not a memory/infrastructure story
5. **Partners page** — replace placeholder testimonials; sharpen value props per partner type
6. **Stats alignment** — pick canonical numbers and update all pages

---

*End of document. Edit freely — this file is not deployed to the live site.*
