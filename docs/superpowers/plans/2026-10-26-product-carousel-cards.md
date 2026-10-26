# Product Carousel & Card Containers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the 7-lot static grid in "This Week's Roast" into an animated, responsive 3-card carousel with defined, high-craft product cards and smooth navigation controls.

**Architecture:** CSS scroll-snap track with zero external dependencies, native momentum scrolling, hardware-accelerated transforms, and vanilla JS navigation controller with live slide indicator and disabled button states.

**Tech Stack:** Plain HTML5, Vanilla CSS3 (custom properties, flexbox, scroll-snap), Vanilla ES2017+ JavaScript.

**Spec:** User request: "can we show the products in a carousel wiith smooth animation? Make cards for each product. Currently that section is looking too cluttered"

## Global Constraints
- Zero runtime dependencies, zero build step, no npm modules.
- Maintain existing 250g / 1kg bag size toggles, grind calibration dropdown, and 1–999 quantity steppers.
- Maintain WhatsApp order request handoff and cart synchronization.
- Full WCAG 2.2 accessibility: touch targets >= 44px, keyboard navigable, aria attributes.
- Smooth reduced-motion fallback (`@media (prefers-reduced-motion: reduce)`).

## Review Focus
- Trackpad horizontal swipe and mobile touch dragging work seamlessly alongside Prev/Next buttons.
- Boundary conditions: Prev button disabled at slide 1; Next button disabled at the end.
- Resizing between desktop (3 cards), tablet (2 cards), and mobile (1 card) updates scroll positions cleanly.
- Adding items to the bag from any card updates the cart drawer without disturbing scroll position.
- Keyboard accessibility: Tab key moves focus sequentially through cards and controls.

---

### Task 1: Add Carousel Controls & Track Wrapper in Markup
**Files:**
- Modify: `index.html:204-220`

- [ ] Add `.carousel-controls` cluster inside `.provisions-header` with Prev button (`#lots-prev`), live page indicator (`#lots-indicator`), and Next button (`#lots-next`).
- [ ] Add `.lots-carousel-wrapper` around `<div class="products-grid" id="lots-grid">` with proper ARIA attributes (`aria-roledescription="carousel"`).

### Task 2: Implement Carousel Navigation & State in JavaScript
**Files:**
- Modify: `scripts/main.js`

- [ ] Add `initLotsCarousel()` function:
  - Query `#lots-prev`, `#lots-next`, `#lots-indicator`, and `#lots-grid`.
  - Calculate single-card scroll stride (`card.offsetWidth + gap`).
  - Wire smooth click scrolling on Prev and Next buttons (`scrollBy({ left: +/-stride, behavior: 'smooth' })`).
  - Listen to `scroll` on `#lots-grid` with `requestAnimationFrame` debouncing to calculate the active index (`Math.round(scrollLeft / stride) + 1`) and update `#lots-indicator` text.
  - Update `disabled` and `aria-disabled` states on Prev/Next buttons at bounds.
- [ ] Ensure `renderLots()` calls `initLotsCarousel()` after rendering.

### Task 3: Style Defined Product Cards & Animated Carousel Track in CSS
**Files:**
- Modify: `styles/main.css:1280-1420` and Section 18 media queries

- [ ] Style `.lots-carousel-wrapper` and `.products-grid` as a smooth horizontal scroll-snap track (`overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none;`).
- [ ] Style `.lot-card` as distinct, elevated cards:
  - Surface: `--color-crisp-white` background with subtle 1px border `rgba(11, 10, 9, 0.08)` and top brass accent hairline.
  - Padding: `2rem 1.75rem` internal whitespace for scannability.
  - Dimensions: `flex: 0 0 calc((100% - 2 * 1.75rem) / 3)` on desktop.
- [ ] Style `.carousel-controls`, `.carousel-nav-btn`, and `.carousel-indicator`.
- [ ] Add responsive breakpoints: 2 cards at `<= 1024px`, 1 card at `<= 768px` with peek edge.
- [ ] Support `prefers-reduced-motion: reduce`.

### Task 4: Visual Verification & Automated Checks
- [ ] Verify using headless Chrome CDP screenshots across 1440px, 1024px, 768px, and 390px.
- [ ] Run automated checks (`git diff --stat`, WCAG touch target check).
- [ ] Commit all changes with clean descriptive messages.
