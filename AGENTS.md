# AGENTS.md

Engineering context for anyone — human or AI agent — working on the **Day Three**
website. Read this before touching code. For visual rules, read `DESIGN.md`.

---

## 1. What this project is

A single-page, static marketing and ordering site for **Day Three**, a boutique specialty
coffee roastery in Banani, Dhaka, Bangladesh. It sells single-origin micro-lots and curated
blends direct to home brewers in 250g and 1kg bags.

The brand's core belief is **freshness honesty**: every bag is roasted on Tuesday in
Banani, stamped with its exact roast date, and dispatched the same day across Dhaka. Coffee
reaches its peak flavor starting on Friday (Day Three).

There is **no backend, no database, no authentication, and no payment integration**.
Orders are collected in a slide-out cart drawer with size (250g/1kg), grind method, and
editable quantity (1–999), and handed off to WhatsApp (`https://wa.me/${WHATSAPP_NUMBER}`)
as a formatted prefilled order request. A human roastery lead confirms bean availability
and arranges payment (bKash, Nagad, bank transfer, or cash on delivery).
Nothing on the site claims a payment was taken or processed.

> Remote repository: `https://github.com/fardeenhb12/Coffee-Website.git` on branch `main`.

---

## 2. Stack & quick start

| Item | Value |
| :--- | :--- |
| Markup | Plain HTML5, exactly one file (`index.html`) |
| Styles | Hand-written CSS (`styles/main.css`), custom properties, Grid, Flexbox |
| Scripts | Vanilla ES2017+ JS (`scripts/main.js`), zero modules, zero bundler |
| Dependencies | **None** (runtime or dev) |
| Build step | **None** |
| Fonts | Google Fonts via `<link>` (`Inter Tight` display, `Inter` body, `Material Symbols Outlined`) |
| Local Media | Hero poster, favicon and OG image in `assets/` (lot photography retained but unused), ambient background loop `video.mp4` |
| Currency | BDT, rendered as `৳ 1,295` |
| Visual direction | **C — Gallery** (dark hero bookend + one white band of type and rules). Brief: `GALLERY-RESTYLE.md` |

```bash
# from the project root
npm run dev        # → npx -y serve . -p 3000  (http://localhost:3000)
npm start          # identical
```

---

## 3. Repository layout

```
Coffee Website/
├── AGENTS.md                       ← this file (authoritative engineering context)
├── DESIGN.md                       ← design system & visual specification
├── GALLERY-RESTYLE.md              ← Direction C implementation brief (authoritative build order)
├── GEMINI-PROMPT.md                ← paste-ready prompt that hands the restyle to Gemini
├── BUILD-PLAN.md                   ← rebuild specification & phase guidelines
├── BRAND.md                        ← brand strategy, voice, positioning
├── PAGE-SPEC.md                    ← information architecture & lot specs
├── GLOSSARY.md                     ← vocabulary & terminology constraints
├── MOTION.md                       ← MOTION-001: normative motion & interaction spec
├── MOODBOARD.md                    ← the three explored directions; C is chosen
├── moodboard.html                  ← visual preview of A/B/C (review artefact, not shipped)
├── design-a.html                   ← earlier Direction A preview (review artefact, not shipped)
├── docs/
│   └── adr/                        ← decision records (0005 = Direction C)
├── index.html                      ← the entire site
├── styles/
│   └── main.css                    ← design tokens + 19 numbered sections
├── scripts/
│   └── main.js                     ← interactions, LOTS catalog, cart engine
├── video.mp4                       ← hero ambient background loop
├── package.json                    ← dev serve scripts
└── assets/                         ← favicon, hero poster, OG image; lot photography now unused
```

### Load order
1. `styles/main.css` via `<link>` in `<head>`.
2. Favicon and OpenGraph meta tags in `<head>`.
3. Body markup: glass header shell → mobile drawer → `<main>` (Hero → Current Lots → Why We Print The Date → The Roaster → Brew Guides → Visit → FAQ) → footer → cart drawer → toast container.
4. `scripts/main.js` at the end of `<body>`.

---

## 4. How the code is organised

### `styles/main.css` — 19 numbered sections
1. Design Tokens & CSS Custom Properties (`:root`)
2. Base & Reset
3. Keyframe Animations
4. Scroll Reveal Utilities (`[data-scroll-reveal]`, `.is-revealed`)
5. Top Dispatch Bar
6. Header & Navigation System (Glass header, shrink dynamics, sliding brass underlines)
7. Mobile Hamburger Button & Drawer
8. Theatrical Hero Stage (`#hero`, headline, `.hero-date-band`)
9. Why We Print the Date (`#why-date`, 3 checkable proofs, `.proof-date-band`)
10. Current Micro-Lots (`#provisions-showcase`, `#lots-grid`, gallery columns, size toggles)
11. The Roaster (`#roaster`, Zarif Rahman profile, pull quote, type-only)
12. Brew Guides (`#brew-guides`, V60, AeroPress, French press, moka pot)
13. Dhaka Tasting Room (`#visit`, House 14 Road 11 Banani, hours, direct map pin)
14. Frequently Asked Questions (`#faq`, 6 accordion items)
15. Day Three Roastery Footer
16. Slide-Out Shopping Cart Drawer
17. Toast Notification System
18. Responsive Media Queries (`max-width: 1024px`, `max-width: 768px`)
19. Reduced Motion (`@media (prefers-reduced-motion: reduce)`)

**Direction C scoping:** the Gallery treatment covers sections 9–14 (proof, lots, roaster,
brew, visit, FAQ) plus the ink footer (15). Section 8 (hero) keeps its dark composition and
sections 16–17 (cart drawer, toasts) stay dark chrome. Style changes for the band belong in
their own numbered section; do not scatter gallery overrides through the file. The exact
selector-level rules are in `GALLERY-RESTYLE.md` §5.

### `scripts/main.js` — All scoped in one `DOMContentLoaded` listener
- **0. Shared Utilities**: `scrollLocks` reference-counted lock, `createFocusTrap`, `overlayStack` (Escape key dismissal).
- **1. Toast Notification System**: `showToast(message, icon)`.
- **2. Sticky Header Scroll Observer**: `handleHeaderScroll()` shrinking past 40px scroll.
- **3. Scroll Reveal System**: Single `IntersectionObserver` revealing `[data-scroll-reveal]`.
- **4. Mobile Navigation Drawer**: `toggleMobileMenu(forceState)` with focus trap.
- **5. Cart Engine & Order Request**: `cartState`, composite key `cartKey(item)`, free delivery progress at ৳2,500, WhatsApp message builder.
- **6. Lot Catalog Engine**: `LOTS` array (7 lots), `renderLots()` with live size toggling (250g/1kg), grind calibration, 1–999 quantity steppers.
- **7. Ambient Hero Video Engine**: Autoplay with battery-saving offscreen pause and reduced-motion compliance.
- **8. Newsletter Form**: Toast feedback on subscription.

---

## 5. State & data contracts

### `LOTS` Catalog Schema
```js
{
  id: 'uraga-natural',
  name: 'Uraga Natural',
  category: 'Single Origin',
  origin: 'Guji, Ethiopia',
  region: 'Uraga Washing Station',
  process: 'Natural Process',
  altitude: '2,100 – 2,350 MASL',
  notes: ['Blueberry', 'Bergamot', 'Raw Sugar'],
  price250: 1295,
  price1000: 4100,
  roastDate: '21.10.2026',
  stock: true,
  image: 'assets/images/uraga-lot.webp'
}
```

### `cartState`
```js
{
  items: [
    {
      id: 'uraga-natural',
      name: 'Uraga Natural',
      origin: 'Guji, Ethiopia',
      size: '250g',
      grind: 'V60 / Pour Over',
      price: 1295,
      quantity: 1,
      image: 'assets/images/uraga-lot.webp',
      roastDate: '21.10.2026'
    }
  ],
  freeDeliveryGoal: 2500 // Free delivery threshold in BDT
}
```
Composite row identity: `cartKey(item) = ${item.id}::${item.size}::${item.grind}`.

### WhatsApp Handoff Message
```
Hi Day Three — I'd like to order:

• Uraga Natural — 250g, V60 / Pour Over — ×1 — ৳1,295
• Las Nubes — 1kg, Whole Bean — ×1 — ৳4,100

Subtotal: ৳5,395
Free delivery (order over ৳2,500)
```
Target URL: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`.

---

## 6. Guardrails

**Do**
- Keep the site dependency-free, framework-free, and build-free.
- Reuse CSS tokens from `:root` in `styles/main.css`; gallery values come from the
  `--gallery-*` set, never from a new hex literal.
- Keep the hero dark and every section below it on `--gallery-paper`. Direction C is a
  single white band, not an alternating rhythm.
- Use Inter Tight 500 for display, Inter 400 for body; brass is a rule, not a text colour,
  on paper. Small secondary text uses `--gallery-graphite-text`, never
  `--gallery-graphite`.
- Separate content with 1px rules and space. Cards are columns with a top rule: no fill,
  no radius, no shadow, no hover lift.
- Guard every DOM query with `if (el) { ... }`.
- Maintain exact address, phone, and opening hours parity across Visit, Footer, and JSON-LD schema.
- Keep copy concrete, sensory, and restrained. State the roast date and producer on every lot.

**Don't**
- Don't claim online checkout, payment processing, or order confirmation on the web page.
- Don't use superlative fluff ("world-class", "curated", "artisanal", "Dhaka's foremost").
- Don't add stock images or fake photos.
- Don't add decoration to fill space in the Gallery band: stickers, badges, illustrations,
  tinted panels, gradients, glass cards.
- Don't reintroduce Literata, IBM Plex Sans, a mono face, or the retired warm-editorial
  vocabulary in docs or code.
- Don't break WCAG 2.2 accessibility: ensure touch targets ≥ 44px and focus rings on all controls.
