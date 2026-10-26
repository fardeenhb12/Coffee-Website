# Day Three ☕

> Boutique specialty coffee roastery in Banani, Dhaka. Roasted every Tuesday, stamped with the roast date, and dispatched across Bangladesh.

![Day Three Preview](assets/images/og-image.jpg)

---

## Overview

**Day Three** is a single-page marketing website and boutique roastery storefront. Designed around the core conviction that coffee's freshness is a measurable fact rather than an assertion, it features:

- **Next Roast Countdown & Stamped Roast Date**: Hero countdown banner leading directly to the current week's roast date, stamped on every bag.
- **Micro-Lot Provisions Showcase**: Seven specialty coffee lots with 250g and 1kg size toggles, 4 grind calibrations (Whole Bean, V60, Espresso, French Press), live quantity steppers, and real-time inventory badges.
- **WhatsApp Direct Dispatch**: Interactive bag drawer with free shipping progress bar (threshold ৳ 2,500) and one-click pre-composed WhatsApp order message generator handoff directly to the roastery.
- **Roastery & Proof Documentation**: Three verifiable proofs (date stamped on bag, named producer on lot, Tuesday roast dispatched same day) and roaster profile of Zarif Rahman.
- **Home Brew Guides & FAQ**: Step-by-step extraction parameters for V60, AeroPress, French Press, and Moka Pot, along with comprehensive local delivery, calibration, and ordering FAQs.
- **Banani Tasting Room & Dispatch**: Verified physical address at House 14, Road 11, Banani, Dhaka, opening hours, and direct Google Maps query pin.
- **100% Localized Asset Pipeline**: Zero external CDN image dependencies — all photography, packshots, stickers, and icons are stored locally.
- **Direction C — Gallery**: a dark, film-led hero bookend above a single warm-paper band of
  large Inter Tight type, hairline rules and no card chrome, with a subtle paper grain and one
  mug ring. Defined in [`GALLERY-RESTYLE.md`](./GALLERY-RESTYLE.md).

---

## Tech Stack

Built without frameworks, bundlers, or runtime dependencies:

| Layer | Technology |
| :--- | :--- |
| **Markup** | Semantic HTML5 (Single-page architecture) |
| **Styling** | Handcrafted Vanilla CSS (Custom properties, CSS Grid, Flexbox) |
| **Interactions** | Vanilla ES2017+ JavaScript (Scoped architecture, no global pollution) |
| **Typography** | Inter Tight (display) + Inter (body), Material Symbols for icons |
| **Icons** | Google Material Symbols Outlined |
| **Dependencies** | **0 runtime dependencies**, **0 build steps** |

---

## Quick Start

Run locally with any static web server:

```bash
# Clone the repository
git clone https://github.com/fardeenhb12/Coffee-Website.git
cd Coffee-Website

# Start local server (Node.js required)
npm run dev
```

Or open `index.html` directly in your browser.

---

## Project Structure

```
Coffee-Website/
├── index.html            # Main site markup
├── styles/
│   └── main.css          # Design tokens + all component styles (19 sections)
├── scripts/
│   └── main.js           # Interactive UI logic & client-side cart engine
├── assets/
│   ├── images/           # Local photography, packshots & seal badges
│   ├── favicon.ico       # Site favicon
│   └── CREDITS.md        # Image licensing and attribution
├── captions.vtt          # Video subtitles
├── video.mp4             # Ambient background film loop
├── DESIGN.md             # Visual design system specifications
├── GALLERY-RESTYLE.md    # Direction C build brief (authoritative visual instruction)
├── MAGNIFIC-PROMPTS.md   # Prompt pack for the generated photography set
├── MOTION.md             # Normative motion & interaction spec (MOTION-001)
├── AGENTS.md             # Engineering documentation & architectural contracts
├── BRAND.md              # Brand guide & voice principles
├── PAGE-SPEC.md          # Complete copy, section hierarchy & data contracts
├── MOODBOARD.md          # The three explored directions; C is chosen
├── docs/adr/             # Decision records (0005 = Direction C)
├── GLOSSARY.md           # Domain terminology & roastery glossary
└── package.json          # Development scripts
```

---

## Accessibility & Performance

- **WCAG 2.2 AA / AAA Compliant**: Text contrast up to 19.8:1 on dark chrome and 18.5:1 on the gallery ground, with brass restricted to decorative rules on paper; visible focus rings, explicit `<label>` bindings, and full keyboard focus traps on overlays.
- **Motion Parity**: Full `@media (prefers-reduced-motion: reduce)` support disables decorative animations and freezes video loops.
- **Touch Ergonomics**: All interactive steppers and buttons meet or exceed the 44×44px touch target standard.

---

## License

MIT © [fardeenhb12](https://github.com/fardeenhb12)
