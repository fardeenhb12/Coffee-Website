# Modern Rounded Component Refresh & Apple Micro-Interactions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize Day Three by eliminating all remaining sharp corners and flat divider lines, replacing them with a cohesive Apple-grade rounded card architecture, and adding tactile spring physics, active compression states, and smooth hover elevation micro-interactions across the site.

**Architecture:** Update `src/styles/main.css` and associated section components (`Proof.tsx`, `Faq.tsx`, `Roaster.tsx`, `LotCard.tsx`) to implement squircle cards, circular badge wells, pill tags, and GPU-composited CSS transforms (`scale(0.95)`, `translateY(-4px)`) driven by Apple spring bezier curves.

**Tech Stack:** React 19, TypeScript, CSS custom properties, cubic-bezier timing functions, Node 22 test runner.

**Spec:** `docs/superpowers/specs/2026-11-02-modern-rounded-micro-interactions-design.md`

## Global Constraints

- **CSS Discipline**: Keep single stylesheet `src/styles/main.css` imported in `main.tsx`. Update `FROZEN_CSS_SHA` in `scripts/check-parity.mjs` upon completion with full documentation.
- **Brand Palette**: Exclusively use existing color tokens (`--cream`, `--beige`, `--brown`, `--brick`, `--mustard`, `--peach`, `--blue`, `--line`). Never introduce un-tokenized raw hex codes.
- **Zero Runtime Dependencies**: No Framer Motion or UI libraries. All micro-interactions use pure CSS hardware-accelerated transforms.
- **Accessibility & Reduced Motion**: Touch targets ≥ 44px; `@media (prefers-reduced-motion: reduce)` bypasses scale/translation animations.
- **Strict Parity**: Pass `npm test` and `npm run check:strict`.

## Review Focus

1. **Focus Ring Visibility**: Ensure rounded cards and pill buttons maintain visible `:focus-visible` rings with proper contrast.
2. **Text Contrast on Inset Plates**: Verify brown typography maintains ≥ 7:1 AAA contrast on `--beige` cards.
3. **Mobile Viewport Overflow**: Ensure rounded card padding and shadow elevation do not cause horizontal scrolling at 320px–375px.
4. **Touch Target Sizing**: Ensure pill buttons and circular chevron targets meet the minimum 44×44px touch area on mobile devices.
5. **Reduced Motion Safety**: Verify that users with `prefers-reduced-motion: reduce` experience instantaneous, non-transform state changes without layout shift.

---

### Task 1: Motion Tokens & Apple Active States

**Files:**
- Modify: `src/styles/main.css:40-70` (tokens), `220-250` (buttons)
- Test: `npm test`

- [ ] **Step 1: Define Apple motion and radius tokens in `:root`**
  Add `--ease-apple-spring: cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-apple-bounce: cubic-bezier(0.34, 1.56, 0.64, 1)`, `--ease-apple-press: cubic-bezier(0.2, 0, 0, 1)`, `--radius-pill: 9999px`, and refined `--radius-card: 1.8rem`, `--radius-panel: 2.2rem`.

- [ ] **Step 2: Add tactile `:active` spring press states to buttons**
  Apply `:active { transform: scale(0.95); transition-duration: 120ms; }` to `.btn-primary`, `.btn-secondary-pill`, and navigation pill links with `will-change: transform`.

- [ ] **Step 3: Add reduced-motion guard for button scaling**
  Ensure `@media (prefers-reduced-motion: reduce)` resets transform on `:active` and `:hover`.

- [ ] **Step 4: Run unit tests**
  Run `npm test` to verify no regressions.

---

### Task 2: Proof Section Elevated Rounded Cards & Circular Badges

**Files:**
- Modify: `src/styles/main.css` (Section 9: lines 1629–1710)
- Modify: `src/components/sections/Proof.tsx`
- Test: `npm test`

- [ ] **Step 1: Transform `.proof-card` into an elevated rounded card**
  Remove `border-top: 1px solid var(--line)`.
  Add `background-color: var(--beige)`, `background-image: var(--paper-grain)`, `border-radius: var(--radius-panel)`, `border: 1px solid rgba(82, 44, 37, 0.12)`, `padding: 3.2rem 2.8rem`, `box-shadow: 0 4px 16px rgba(82, 44, 37, 0.03)`.

- [ ] **Step 2: Add circular badge treatment to `.proof-step`**
  Style `.proof-step` with `width: 4.8rem; height: 4.8rem; border-radius: 50%; background: rgba(192, 48, 1, 0.08); color: var(--brick); display: grid; place-items: center; font-size: 2.2rem`.

- [ ] **Step 3: Add Apple-style hover elevation micro-interaction**
  Add `.proof-card:hover { transform: translateY(-4px); box-shadow: 0 14px 32px rgba(82, 44, 37, 0.08); border-color: rgba(82, 44, 37, 0.28); }` using `--ease-apple-spring`.

- [ ] **Step 4: Run tests**
  Run `npm test` to verify structure and copy parity.

---

### Task 3: FAQ Section Grouped Rounded Plates & Spring Chevrons

**Files:**
- Modify: `src/styles/main.css` (Section 13: lines 2248–2280)
- Modify: `src/components/sections/Faq.tsx`
- Test: `npm test`

- [ ] **Step 1: Transform `.faq-item` into rounded card plates**
  Remove raw `border-bottom: 1px solid var(--line)`.
  Add `background: var(--beige)`, `border-radius: 1.6rem`, `border: 1px solid rgba(82, 44, 37, 0.12)`, `margin-bottom: 1.2rem`, `padding: 0.6rem 2.4rem`, `overflow: hidden`, and subtle transition.

- [ ] **Step 2: Add circular icon well and spring animation for `.faq-chevron`**
  Style `.faq-chevron` with `width: 3.6rem; height: 3.6rem; border-radius: 50%; background: rgba(82, 44, 37, 0.06); display: grid; place-items: center; transition: transform 280ms var(--ease-apple-bounce)`.
  When open, `.faq-item.is-open .faq-chevron { transform: rotate(180deg); background: rgba(82, 44, 37, 0.12); }`.

- [ ] **Step 3: Add subtle `:active` press compression to `.faq-question`**
  Add `:active { transform: scale(0.985); }` on the button trigger.

- [ ] **Step 4: Run tests**
  Run `npm test`.

---

### Task 4: Roaster Section Pill Credentials & Inset Quote Plate

**Files:**
- Modify: `src/styles/main.css` (Section 10: lines 1758–1860)
- Modify: `src/components/sections/Roaster.tsx`
- Test: `npm test`

- [ ] **Step 1: Transform `.roaster-credentials` items into pill tags**
  Remove raw border-top. Style `.roaster-credentials li` as tactile pills: `background: rgba(255, 249, 242, 0.12); border: 1px solid rgba(255, 249, 242, 0.22); border-radius: 9999px; padding: 0.8rem 1.8rem; font-size: 1.1rem`.

- [ ] **Step 2: Transform `.roaster-pull-quote` into an inset rounded quote plate**
  Remove raw border-top. Add `background: rgba(255, 249, 242, 0.08); border-radius: var(--radius-panel); border: 1px solid rgba(255, 249, 242, 0.16); padding: 2.8rem 3.2rem; margin: 2.4rem 0`.

- [ ] **Step 3: Add tactile spring bounce to `.roaster-enquiry`**
  Ensure the inquiry CTA button inherits `--ease-apple-spring` and active compression.

- [ ] **Step 4: Run tests**
  Run `npm test`.

---

### Task 5: Cart Drawer & Lot Steppers Apple Micro-Polish

**Files:**
- Modify: `src/styles/main.css` (Section 15: lines 2530–2750, Section 8: lines 1280–1360)
- Test: `npm test`

- [ ] **Step 1: Enclose cart items in rounded inset plates**
  Style `.cart-item-row` with `background: var(--beige); border-radius: 1.4rem; padding: 1.6rem; border: 1px solid rgba(82, 44, 37, 0.1); margin-bottom: 1.2rem`.

- [ ] **Step 2: Add tactile feedback to steppers and trash removal icon**
  Add `:active { transform: scale(0.90); }` with rapid 100ms rebound on stepper decrement/increment buttons and trash icon button.

- [ ] **Step 3: Enhance checkout CTA button with Apple capsule styling**
  Ensure the WhatsApp checkout CTA has `border-radius: 9999px`, elevated shadow, and tactile compression on click.

- [ ] **Step 4: Run tests**
  Run `npm test`.

---

### Task 6: Strict Parity Check, SHA Registration & Visual Verification

**Files:**
- Modify: `scripts/check-parity.mjs`
- Test: `npm run check:strict`, `npm run build`

- [ ] **Step 1: Compute and update new CSS SHA in `scripts/check-parity.mjs`**
  Calculate `sha256` of `src/styles/main.css`, update `FROZEN_CSS_SHA`, and document the modernization rationale in the comment header.

- [ ] **Step 2: Run strict parity and build verification**
  Run `npm run check:strict` and `npm run build` to ensure 100% compliance.

- [ ] **Step 3: Capture visual screenshots**
  Use headless Chrome to render desktop and mobile screenshots of Proof, FAQ, Roaster, and Lot Cards, verifying rounded geometry and layout fidelity.
