# 3D Cover Flow Product Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the coffee lots showcase (`#provisions-showcase`) into an interactive 3D Cover Flow Stage displaying the 7 vibrant packaging packshots in a 3D arc, with a dedicated active lot spec and order deck directly below on the tactile cream ground.

**Architecture:** Pure React 19 state engine managing `activeIndex`, `selectedSize`, and `quantity` with hardware-accelerated 3D CSS transforms (`perspective`, `rotateY`, `translateZ`, `scale`). All legacy markup IDs, text blocks, and accessibility contracts are maintained for strict parity.

**Tech Stack:** React 19, TypeScript, hand-written CSS in `src/styles/main.css`, Vite.

**Spec:** `docs/superpowers/specs/2026-11-02-coverflow-lots-design.md`

## Global Constraints
- Zero runtime dependencies beyond React and React DOM.
- Hand-written CSS in `src/styles/main.css`; update `FROZEN_CSS_SHA` in `scripts/check-parity.mjs` whenever the stylesheet changes.
- Ground stays on `--cream` (`#FAF8F5`) with paper texture grain (`--paper-grain`).
- Preserve all legacy IDs: `#provisions-showcase`, `#lots-grid`, `#lots-prev`, `#lots-next`, `#lots-indicator`.
- WCAG 2.2 touch targets ≥ 44px; visible focus rings; respect `prefers-reduced-motion`.

## Review Focus
1. Rapid clicking/swiping between lots does not cause layout jitter or clipping.
2. Size toggle dynamically recalculates unit price (`price250` vs `price1000`) and passes correct size to cart.
3. Mobile view (≤768px) keeps the active bag front-and-center without horizontal scrollbar on the page.
4. Screen readers and keyboard users can navigate all 7 lots via Tab and Arrow keys.
5. All 44 copy blocks and token classes pass `npm run check:strict`.

---

### Task 1: 3D Cover Flow & Active Lot Deck CSS Tokens & Styles

**Files:**
- Modify: `src/styles/main.css:620-800`
- Modify: `scripts/check-parity.mjs:44`

**Interfaces:**
- Produces: CSS classes for `.coverflow-stage`, `.coverflow-track`, `.coverflow-item`, `.coverflow-deck`, `.deck-meta-grid`, `.deck-actions-row`, etc.

- [ ] **Step 1: Write CSS definitions in `src/styles/main.css`**
  - Add 3D perspective stage (`perspective: 1200px; transform-style: preserve-3d;`).
  - Add item transform formulas for active and offset positions (`--offset`, `rotateY`, `translateZ`, `scale`, `opacity`).
  - Add Cover Flow navigation button and indicator styles.
  - Add Active Lot Deck layout (Fraunces serif headline, terroir subtitle, 3-column key-value ledger, analog flavor bars, size selector pills, and Add to Bag button).
  - Add responsive rules for tablet (≤1024px) and mobile (≤768px).
  - Add `prefers-reduced-motion` override (disables 3D rotation, uses flat transforms).

- [ ] **Step 2: Calculate new CSS hash and update `scripts/check-parity.mjs`**
  - Run `shasum -a 256 src/styles/main.css`.
  - Update `FROZEN_CSS_SHA` in `scripts/check-parity.mjs`.

- [ ] **Step 3: Verify CSS freeze check**
  Run: `node scripts/check-parity.mjs`
  Expected: `css frozen ok`.

- [ ] **Step 4: Commit**
  ```bash
  git add src/styles/main.css scripts/check-parity.mjs
  git commit -m "style: add 3D coverflow stage and active lot deck styles"
  ```

---

### Task 2: Implement Cover Flow Component & Active Lot Deck

**Files:**
- Modify: `src/components/sections/Lots.tsx`
- Modify: `src/components/lots/LotCard.tsx` (or refactor into Cover Flow item + Active Deck)

**Interfaces:**
- Consumes: `LOTS` from `src/data/lots.ts`, `useCart` from `src/context/CartContext.tsx`
- Produces: Interactive 3D Cover Flow carousel and synchronized order deck.

- [ ] **Step 1: Write state logic and interactions in `src/components/sections/Lots.tsx`**
  - Manage `activeIndex` (0 to 6, default 0 or 2).
  - Compute relative offset for each lot card: `offset = index - activeIndex`.
  - Wire click on any card to set `activeIndex`.
  - Wire prev/next arrow buttons and keyboard arrow listener (`ArrowLeft`/`ArrowRight`).
  - Wire touch/pointer swipe gestures.
  - Keep legacy `#lots-grid`, `#lots-prev`, `#lots-next`, `#lots-indicator` present in markup.

- [ ] **Step 2: Wire Active Lot Deck**
  - Display active lot name, origin, region, and tasting notes.
  - Render 3-column ledger: Process, Altitude, Roast Date.
  - Render analog stepped gauges for Sweetness, Acidity, Complexity.
  - Add size toggle (`250g` / `1kg`) adjusting displayed price.
  - Add quantity stepper `[-] 1 [+]` and **Add to Bag** CTA wired to `addItem` and `openCart()`.

- [ ] **Step 3: Run strict parity and build check**
  Run: `npm run check:strict && npm run build`
  Expected: 0 errors, all 44 copy blocks found, 0 unknown classes, 0 missing IDs.

- [ ] **Step 4: Commit**
  ```bash
  git add src/components/sections/Lots.tsx src/components/lots/
  git commit -m "feat: implement 3D coverflow carousel and active lot order deck"
  ```

---

### Task 3: Visual Verification & Polish Across Viewports

**Files:**
- Test / Verify: Screenshots at 1440px desktop, 834px tablet, and 390px mobile.

- [ ] **Step 1: Capture desktop 3D coverflow screenshot**
  - Verify centered active bag scaling, 3D perspective rotation on flanking bags, and deck alignment.

- [ ] **Step 2: Capture interaction state screenshot**
  - Switch active lot (e.g. to Uraga Natural or Las Nubes) and verify that packshot, flavor gauges, and notes update seamlessly.

- [ ] **Step 3: Verify test suite and strict parity**
  Run: `npm test && npm run check:strict && npm run build`
  Expected: All 8 unit tests pass, parity guard clean, build succeeds.

- [ ] **Step 4: Commit**
  ```bash
  git add -A
  git commit -m "chore: verify and finalize 3D coverflow product section"
  ```

