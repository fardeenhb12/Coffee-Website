# Day Three ☕

> Boutique specialty coffee roastery in Banani, Dhaka. Roasted every Tuesday, stamped with the roast date, and dispatched across Bangladesh.

![Day Three Preview](public/assets/images/og-image.jpg)

A single-page storefront for a Dhaka specialty roastery, built with React 19 + Vite. It sells
seven single-origin lots and blends in 250g and 1kg bags, collects the bag in a slide-out
drawer, and hands the order to WhatsApp as a prefilled message. A human confirms availability
and arranges payment. **Nothing on the site takes payment.**

---

## Quick start

```bash
npm install
npm run dev        # → http://localhost:3000
```

```bash
npm run build         # type-check + production build
npm run preview       # serve the production build
npm run check         # design parity guard
npm run check:strict  # same, but missing copy fails
```

Node 20+.

---

## Scripts

| Script | What it does |
| :--- | :--- |
| `dev` | Vite dev server on port 3000 |
| `build` | `tsc -b && vite build` |
| `preview` | Serve `dist/` on port 3000 |
| `check` | Verifies the stylesheet hash, class/ID/asset parity, and reports missing copy |
| `check:strict` | The same, but any missing copy fails the run |

`check` exists because the design is frozen. It reads `legacy/` and fails the moment the React
build drifts from it.

---

## Features

- **Freshness-first hero** — a dark film bookend with the current roast date band.
- **Seven-lot carousel** — 250g/1kg size toggles, four grind calibrations, live quantity
  steppers (1–999), sold-out states with the next roast date.
- **WhatsApp order request** — free-delivery progress bar (threshold ৳ 2,500) and a
  pre-composed message. No checkout, no payment, no account.
- **Proof, roaster, brew guides, FAQ** — three checkable freshness proofs, the head roaster's
  profile, four extraction recipes, six answers.
- **Direction C — Gallery** — dark hero above one warm-paper band of large Inter Tight type,
  hairline rules, no card chrome. Defined in [`GALLERY-RESTYLE.md`](./GALLERY-RESTYLE.md).
- **Accessible by default** — focus traps, Escape-to-dismiss overlay stack, reference-counted
  scroll lock, 44px targets, full `prefers-reduced-motion` parity.

---

## Structure

```
index.html            Vite entry: fonts, meta, JSON-LD, #root
src/
  main.tsx            entry — imports main.css once, sets body.is-loaded
  App.tsx             providers + section order
  styles/main.css     FROZEN design system (3,241 lines, 19 sections)
  config/site.ts      address, hours, phone, WhatsApp, free-delivery goal
  data/               lots, brew guides, FAQs
  types/              Lot, CartItem, BrewGuide, Faq
  lib/                cart maths, WhatsApp message, currency formatting
  context/            CartContext, ToastContext
  hooks/              scroll reveal, focus trap, scroll lock, overlay stack, hero video, carousel
  components/
    layout/           header, dispatch bar, mobile drawer, footer
    sections/         hero, lots, proof, roaster, brew guides, visit, faq
    lots/             LotCard
    cart/             CartDrawer, CartItemRow
public/               favicon, 13 images, hero loop video.mp4
scripts/              check-parity.mjs
legacy/               read-only reference from the pre-React build
```

---

## Documentation

| File | Read it for |
| :--- | :--- |
| [`MIGRATION.md`](./MIGRATION.md) | finishing the React conversion — work order, verification, definition of done |
| [`FIDELITY.md`](./FIDELITY.md) | what "the design must not change" means, concretely |
| [`SKILLS.md`](./SKILLS.md) | which agent skills to use, and which must not be allowed to redesign |
| [`AGENTS.md`](./AGENTS.md) | engineering context, structure, guardrails |
| [`DESIGN.md`](./DESIGN.md) | the visual system |
| [`MOTION.md`](./MOTION.md) | motion and interaction contracts |
| [`GLOSSARY.md`](./GLOSSARY.md) | the vocabulary — lot, bag, roast date, grind, order request |

---

## Migration status

The pre-React build is preserved in `legacy/` and is the reference for the four sections still
to port: **Why We Print the Date**, **The Roaster**, **Brew Guides**, **Dhaka Tasting Room**.
Everything else is ported and running.

`npm run check:strict` reports exactly which copy blocks are still missing.
