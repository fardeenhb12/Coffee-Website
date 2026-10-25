# Aroma Coffee Co. ☕

> An artisanal specialty coffee roastery and tasting room experience in Banani, Dhaka. Single-origin micro-lots, tactile packaging, and consecrated craft.

![Aroma Coffee Co. Preview](assets/images/og-image.jpg)

---

## Overview

**Aroma Coffee Co.** is a single-page marketing website and interactive tasting room experience. Designed with warm editorial minimalism and tactile artisanal luxury, it features:

- **Ambient Roastery Cinema**: Full-bleed background documentary video with captioned lightbox mode (`captions.vtt`).
- **Interactive Provisions Showcase**: Curated single-origin micro-lots with custom grind calibrations, direct numeric quantity steppers, and simulated cart dispatch.
- **Dimensional Layering & Micro-interactions**: Authentic half-peeled inspection seal badges, bidirectional scroll reveals, and spring-physics hover feedback.
- **Glassmorphic Navigation**: Scroll-linked sticky header with smooth shrink dynamics and accessible keyboard-trapped mobile drawer.
- **Simulated Cart Engine**: Composite item tracking (lot + grind variant), real-time free shipping progress bar, and staged in-drawer rider dispatch workflow.
- **100% Localized Asset Pipeline**: Zero external CDN image dependencies — all photography, packshots, stickers, and icons are stored locally.

---

## Tech Stack

Built without frameworks, bundlers, or runtime dependencies:

| Layer | Technology |
| :--- | :--- |
| **Markup** | Semantic HTML5 (Single-page architecture) |
| **Styling** | Handcrafted Vanilla CSS (Custom properties, CSS Grid, Flexbox) |
| **Interactions** | Vanilla ES2017+ JavaScript (Scoped architecture, no global pollution) |
| **Typography** | Literata (display serif) + IBM Plex Sans (humanist mechanics) |
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
│   └── main.js           # Interactive UI logic & simulated cart engine
├── assets/
│   ├── images/           # Local photography, packshots & seal badges
│   ├── favicon.ico       # Site favicon
│   └── CREDITS.md        # Image licensing and attribution
├── captions.vtt          # Documentary video subtitles
├── video.mp4             # Ambient background film loop
├── DESIGN.md             # Visual design system specifications
├── MOTION.md             # Normative motion & interaction spec (MOTION-001)
├── AGENTS.md             # Engineering documentation & architectural contracts
└── package.json          # Development scripts
```

---

## Accessibility & Performance

- **WCAG 2.2 AA / AAA Compliant**: Text contrast ratio up to 19.8:1, visible focus rings, explicit `<label>` bindings, and full keyboard focus traps on overlays.
- **Motion Parity**: Full `@media (prefers-reduced-motion: reduce)` support disables decorative animations and freezes video loops.
- **Touch Ergonomics**: All interactive steppers and buttons meet or exceed the 44×44px touch target standard.

---

## License

MIT © [fardeenhb12](https://github.com/fardeenhb12)
