# AGENTS.md

Engineering context for anyone — human or AI agent — working on the **Day Three** website.
Read this before touching code. For visual rules read `DESIGN.md`; for the React conversion read
`MIGRATION.md` and `FIDELITY.md`; for the skill playbook read `SKILLS.md`.

---

## 1. What this project is

A single-page marketing and ordering site for **Day Three**, a boutique specialty coffee
roastery in Banani, Dhaka, Bangladesh. It sells single-origin micro-lots and curated blends
direct to home brewers in 250g and 1kg bags.

The brand's core belief is **freshness honesty**: every bag is roasted on Tuesday in Banani,
stamped with its exact roast date, and dispatched the same day across Dhaka. Coffee reaches its
peak flavour starting on Friday (Day Three).

There is **no backend, no database, no authentication, and no payment integration**. Orders are
collected in a slide-out cart drawer with size (250g/1kg), grind method, and editable quantity
(1–999), and handed off to WhatsApp (`https://wa.me/${SITE.whatsappNumber}`) as a formatted
prefilled order request. A human roastery lead confirms bean availability and arranges payment
(bKash, Nagad, bank transfer, or cash on delivery). Nothing on the site claims a payment was
taken or processed.

> Remote repository: `https://github.com/fardeenhb12/Coffee-Website.git` on branch `main`.

---

## 2. Stack & quick start

| Item | Value |
| :--- | :--- |
| Build | Vite 6 |
| UI | React 19, function components, hooks only |
| Language | TypeScript, `strict`, no `any` |
| Styles | One hand-written stylesheet, `src/styles/main.css`, custom properties, Grid, Flexbox |
| State | `useState` / `useReducer` + two contexts. No Redux, no Zustand, no router |
| Fonts | Google Fonts via `<link>` in `index.html` (Fraunces display, Inclusive Sans body, DM Mono utility, Material Symbols) |
| Media | `public/assets/images/*`, hero loop `public/video.mp4` |
| Currency | BDT, rendered as `৳ 1,295` |
| Visual direction | **Little Amps register** — peach-framed dark hero, cream bands on hairlines, full-bleed brown/blue/brick bands |
| Runtime dependencies | `react`, `react-dom`. Nothing else. Ever. |

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # tsc -b && vite build
npm run check      # design parity guard — see MIGRATION.md
npm run check:strict
```

Node 20+ is required.

---

## 3. Repository layout

```
Coffee Website React/
├── AGENTS.md                       ← this file (authoritative engineering context)
├── MIGRATION.md                    ← the React conversion brief (read this to finish the port)
├── FIDELITY.md                     ← the parity contract: what "unchanged" means
├── SKILLS.md                       ← which agent skills to use, and how not to misuse them
├── DESIGN.md                       ← design system & visual specification
├── MOTION.md                       ← MOTION-001: normative motion & interaction spec
├── GALLERY-RESTYLE.md              ← Direction C implementation brief
├── BRAND.md                        ← brand strategy, voice, positioning
├── PAGE-SPEC.md                    ← information architecture & lot specs
├── GLOSSARY.md                     ← vocabulary & terminology constraints
├── MAGNIFIC-PROMPTS.md             ← prompt pack for the generated photography set
├── README.md
├── index.html                      ← Vite entry: fonts, meta, JSON-LD, #root
├── legacy/                         ← read-only reference for the conversion
│   ├── index.html                  ←   764 lines of original markup
│   └── main.js                     ←   956 lines of original behaviour
├── docs/
│   ├── adr/                        ← decision records (0005 = Direction C)
│   └── ASSET-CREDITS.md            ← provenance for the generated photography
├── public/
│   ├── assets/favicon.ico
│   ├── assets/images/              ← 13 images in use
│   └── video.mp4
├── scripts/check-parity.mjs        ← design parity guard
├── src/
│   ├── main.tsx                    ← entry; imports main.css once; sets body.is-loaded
│   ├── App.tsx                     ← providers + section order
│   ├── styles/main.css             ← FROZEN — 3,241 lines, 19 numbered sections
│   ├── config/site.ts              ← address, hours, phone, WhatsApp, free-delivery goal
│   ├── data/                       ← lots.ts, brewGuides.ts, faqs.ts
│   ├── types/index.ts              ← Lot, CartItem, BrewGuide, Faq, …
│   ├── lib/                        ← cart.ts, holdRepeat.ts, whatsapp.ts, format.ts
│   ├── context/                    ← CartContext.tsx, ToastContext.tsx
│   ├── hooks/                      ← 8 hooks (see §4)
│   └── components/
│       ├── layout/                 ← TopNoticeBar, SiteHeader, MobileNav, Footer
│       ├── sections/               ← Hero, Lots, Proof, Roaster, BrewGuides, Visit, Faq
│       ├── lots/LotCard.tsx
│       └── cart/                   ← CartDrawer, CartItemRow
└── package.json
```

---

## 4. How the code is organised

### `src/styles/main.css` — 19 numbered sections, frozen

1. Tokens & reset
2. Type & primitives
3. Skip link
4. Dispatch notice
5. Header & nav
6. Hero
7. Lots
8. Lot card
9. Proof
10. Roaster
11. Brew guides
12. Tasting room
13. FAQ
14. Footer
15. Cart drawer
16. Toasts
17. Mobile nav
18. Responsive
19. Reduced motion

**Register scoping:** the hero is a dark film inside a peach `#FEBF6F` frame. Below it the
ground is cream `--cream #FAF8F5` with paper grain, punctuated by three colour bands —
brown (roaster), blue (tasting room), brick (footer). Those bands are **full-bleed colour
carrying an inset cream plate** (`--panel` radius, `4.8rem`–`5.6rem` padding): the footer
and the tasting room both read as a plate on a ground, not as a flat painted band. The
footer opens with its bookend line above the plate. Cart and toasts are cream chrome
inside the drawer, brown for the toasts.

**This file is frozen.** Imported once in `main.tsx` and nowhere else. Do not split it into
modules, convert it to CSS-in-JS or Tailwind, or edit a selector. `npm run check` verifies the
hash. See `FIDELITY.md` §1.

### `src/components/sections/Faq.tsx` — the canonical component shape

Data-driven, no state, no handlers, legacy class names untouched, `data-scroll-reveal=""` on the
blocks that animate. New sections should look like it.

### `src/hooks/`

| Hook | Responsibility |
| :--- | :--- |
| `useScrollReveal` | one page-wide `IntersectionObserver`, mounted in `App`; also observes nodes added later via `MutationObserver` |
| `useHeaderScroll` | header shrink hysteresis (shrink past 40px, expand below 20px) |
| `useFocusTrap` | Tab/Shift+Tab wrap + focus restore. **Does not touch `inert`** — React owns that |
| `useScrollLock` | reference-counted `body.scroll-locked`, keyed by owner name |
| `useOverlayStack` | Escape dismisses the topmost layer only |
| `useHeroVideo` | ambient loop: in-view + visible tab + no reduced motion, with a first-gesture retry |
| `useLotsCarousel` | arrow buttons, `01 / 07` indicator, edge states; measures card stride from the DOM |
| `useHoldRepeat` | press-and-hold auto-repeat with acceleration for the bag steppers |
| `usePrefersReducedMotion` | live `matchMedia` subscription |

### `src/context/`

- **`CartProvider`** — `items`, `totalCount`, `subtotal`, `isOpen`, `addItem`, `increment`,
  `decrement`, `removeItem`, `openCart`, `closeCart`. A `useReducer`; the reducer is pure.
- **`ToastProvider`** — `showToast(message, icon)`, plus the single `#toast-container` viewport.

Provider order in `App.tsx` is toast → cart, because the cart drawer raises toasts.

---

## 5. State & data contracts

### `Lot` (`src/types/index.ts`, `src/data/lots.ts`)

```ts
{
  id: 'uraga-natural',
  name: 'Uraga Natural',
  category: 'Single',            // 'Blend' | 'Single' | 'Seasonal'
  origin: 'Guji, Ethiopia',
  region: 'Uraga, Guji Zone',
  process: 'Natural',
  altitude: '2,100 – 2,300 MASL',
  notes: ['Blueberry jam', 'Wildflower honey', 'Bergamot'],
  price250: 1295,
  price1000: 4100,
  roastDate: '21.10.2026',
  nextRoastDate: '28.10.2026',   // optional; only used when stock === false
  stock: true,
  image: '/assets/images/lot-uraga-natural.jpg'
}
```

### `CartItem`

```ts
{
  id: 'uraga-natural',
  name: 'Uraga Natural',
  size: '250g',                  // '250g' | '1kg'
  grind: 'whole bean',           // the <select> value, verbatim
  price: 1295,                   // unit price for the chosen size, frozen at add time
  quantity: 1
}
```

Composite row identity: `cartKey(item) = ${item.id}::${item.size}::${item.grind}`. Same key
accumulates quantity; any difference starts a new row.

### WhatsApp order request (`src/lib/whatsapp.ts`)

```
Hi Day Three — I'd like to order:

• Uraga Natural — 250g, whole bean — ×1 — ৳1,295
• Las Nubes — 1kg, French press grind — ×1 — ৳4,100

Subtotal: ৳5,395
Free delivery (over ৳2,500)
```

Target: `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`.
Line order, bullets, em dashes, `×` and the `৳`-without-space form are all load-bearing.

### `SITE` (`src/config/site.ts`)

Single source of truth for the address, opening hours, phone, email, maps URL, WhatsApp number
and the ৳2,500 free-delivery goal. **The Visit section, the footer and the JSON-LD block in
`index.html` must agree with it exactly.** That parity is a hard rule — see §6.

---

## 6. Guardrails

### Do

- Keep the site dependency-free beyond React and React DOM.
- Reuse CSS tokens from `:root`; every colour is one of cream, beige, brown, brick, mustard,
  peach, blue, or the `#E6DAD4` hairline. Never a new hex literal.
- Keep the hero dark inside its peach frame and every section below it on `--cream`, with brown,
  blue and brick as the only full-bleed bands.
- Use Fraunces 500 for display, Inclusive Sans 400 for body, DM Mono for every label, price and
  button. Mustard is never text on cream and never a button fill — it fails 4.5:1 both ways; use
  brick for eyebrows and brick/blue/peach for buttons.
- Separate content with 1px rules and space. Cards are columns with a top rule: no shadow,
  no hover lift, radius only on plates and imagery (`--panel`).
- Guard every DOM query with `if (el)` / optional chaining.
- Maintain exact address, phone, and opening-hours parity across Visit, Footer, and JSON-LD.
- Keep copy concrete, sensory, and restrained. State the roast date and producer on every lot.
- Preserve the exact DOM the CSS was written against — same wrappers, same sibling order, same
  class on the same node. `FIDELITY.md` §2 explains why this is not optional.
- Run `npm run build` and `npm run check` before claiming anything works.

### Don't

- Don't edit `src/styles/main.css`, split it, or add a second stylesheet. It is frozen.
- Don't add a wrapper `<div>`, remove one, or move a class. The stylesheet is not defensive.
- Don't claim online checkout, payment processing, or order confirmation on the web page.
- Don't use superlative fluff ("world-class", "curated", "artisanal", "Dhaka's foremost").
- Don't add stock imagery. Generated photography is allowed only as a documented concept set
  (tool, date and prompts in `docs/ASSET-CREDITS.md`), never as a claim of documentary fact, and
  never a synthetic portrait presented as a real, identifiable person.
- Don't add decoration to fill space in the Gallery band: stickers, badges, illustrations,
  tinted panels, gradients, glass cards. The only permitted marks are the paper grain and the
  single mug ring, both specified in `DESIGN.md` §5.5.
- Don't reintroduce Literata, IBM Plex Sans, a mono face, or the retired warm-editorial
  vocabulary in docs or code.
- Don't break WCAG 2.2 accessibility: touch targets ≥ 44px, visible focus rings on all controls.
- Don't add a dependency, a router, a component library or a CSS framework to solve a problem
  that a component and a hook already solve.

---

## 7. Migration status

The project was ported from a dependency-free HTML/CSS/JS build to React. `legacy/` holds the
original, read-only, as the reference for the last four sections.

| Section | Component | Status |
| :--- | :--- | :--- |
| Hero | `sections/Hero.tsx` | ported |
| Current Lots | `sections/Lots.tsx`, `lots/LotCard.tsx` | ported |
| Why We Print the Date | `sections/Proof.tsx` | ported |
| The Roaster | `sections/Roaster.tsx` | ported |
| Brew Guides | `sections/BrewGuides.tsx` | ported |
| Dhaka Tasting Room | `sections/Visit.tsx` | ported |
| FAQ | `sections/Faq.tsx` | ported (reference implementation) |
| Header / nav / footer / cart / toasts | `layout/`, `cart/`, `context/` | ported |

The migration is complete: all seven sections are ported and `npm run check:strict` is green.
`legacy/` stays as the read-only reference until it is retired deliberately.
