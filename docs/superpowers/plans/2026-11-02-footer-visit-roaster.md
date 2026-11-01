# Footer, Visit, Roaster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the hierarchy the React port dropped in the Roaster and Visit sections, give each of the three closing sections one real action, and finish the page with a full-contrast footer bookend.

**Architecture:** All logic is pure and lives in `src/lib/`. `useOpenStatus` is a thin `useState` wrapper over `getOpenStatus(now, hours)` computed in `Asia/Dhaka`. WhatsApp CTAs reuse `buildWhatsAppUrl`'s shape through a new `buildEnquiryUrl(text)`. CSS changes go inside the existing `§10`, `§12`, `§14` and `§18` blocks so the responsive overrides keep their cascade position. The frozen hash is updated once, at the end, deliberately.

**Tech Stack:** React 19, TypeScript strict, Vite 6, hand-written CSS, `node:test` (built in, no dependency).

**Spec:** `docs/superpowers/specs/2026-11-02-footer-visit-roaster-design.md`

## Global Constraints

- Runtime dependencies stay `react` and `react-dom`. No Tailwind, no shadcn, no component library.
- Colours come only from `:root` tokens: `--cream #FAF8F5`, `--beige #F4EFEA`, `--brown #522C25`, `--brick #C03001`, `--mustard #C46500`, `--peach #FEBF6F`, `--blue #89B4CA`, `--line #E8E0DA`. No new hex literal.
- Every clickable thing is at least 44px and has a visible `:focus-visible` ring (already global).
- Copy is additive except the removed newsletter block. Never claim payment, checkout or confirmation.
- `SITE.address`, `SITE.hours`, `SITE.phone`, `SITE.email` stay the single source and stay byte-identical to the JSON-LD in `index.html`.
- `npm run build` and `npm run check:strict` must both pass before any completion claim.
- No `any`. No hooks inside section components except the ones named below.

## Review Focus

- **Visitor's clock is not Dhaka's.** The open/closed status must be computed in `Asia/Dhaka`; a visitor in London at 19:00 UTC must not see "Open now" when Banani is shut.
- **Open exactly on the boundary.** 08:00 local reads open, 21:00 local reads closed. An off-by-one minute is the most likely status bug.
- **Cart with items, then a footer CTA.** The footer order CTA must open a WhatsApp message, not the empty drawer, when the visitor has never added a bar.
- **Newsletter removal and the parity guard.** Deleting copy that `check:strict` compares must land in the same commit as the allowlist entry, or the build fails on someone else's machine.
- **Placeholder WhatsApp number.** `SITE.whatsappNumber` is `8801700000000`, still a launch blocker; every new CTA must route through `SITE` so the number is fixed in one place.

---

### Task 1: Structured opening hours and the open/closed predicate

**Files:**
- Modify: `src/config/site.ts` (add `hoursDetail`)
- Create: `src/lib/hours.ts`
- Create: `scripts/hours.test.mjs`
- Modify: `package.json` (add `test` script)

**Interfaces:**
- Produces: `type OpeningHours = { opensAt: number; closesAt: number; timeZone: string }`, `SITE.hoursDetail: OpeningHours`, `getOpenStatus(now: Date, hours: OpeningHours): { open: boolean; label: string }`, `formatClockHour(hour24: number): string`.

- [ ] **Step 1: Write the failing test** in `scripts/hours.test.mjs`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getOpenStatus } from '../src/lib/hours.ts';

const HOURS = { opensAt: 8, closesAt: 21, timeZone: 'Asia/Dhaka' };
const at = (iso) => getOpenStatus(new Date(iso), HOURS);

test('opens at the boundary hour', () => {
  assert.equal(at('2026-11-02T02:00:00Z').open, true); // 08:00 Dhaka
});

test('closes at the boundary hour', () => {
  assert.equal(at('2026-11-02T15:00:00Z').open, false); // 21:00 Dhaka
});

test('midday is open, late night is closed', () => {
  assert.equal(at('2026-11-02T10:00:00Z').open, true); // 16:00 Dhaka
  assert.equal(at('2026-11-02T19:30:00Z').open, false); // 01:30 Dhaka
});

test('label reads the next boundary', () => {
  assert.equal(at('2026-11-02T10:00:00Z').label, 'Open now · closes 9:00 PM');
  assert.equal(at('2026-11-02T19:30:00Z').label, 'Closed · opens 8:00 AM');
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `node --test scripts/hours.test.mjs`
Expected: `ERR_MODULE_NOT_FOUND` for `src/lib/hours.ts`.

- [ ] **Step 3: Implement** `src/lib/hours.ts` with `Intl.DateTimeFormat(..., { timeZone, hour: '2-digit', minute: '2-digit', hour12: false })` to read the local hour and minute, comparing `hour + minute / 60` against the two bounds; `formatClockHour` returns `8:00 AM` / `9:00 PM` from a 24-hour integer. Add `hoursDetail: { opensAt: 8, closesAt: 21, timeZone: 'Asia/Dhaka' }` to `SITE`, leaving `hours` untouched.

- [ ] **Step 4: Add `"test": "node --test scripts/hours.test.mjs"` and run it**

Run: `npm test`
Expected: 4 passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/hours.ts src/config/site.ts scripts/hours.test.mjs package.json
git commit -m "feat(site): structured hours and Dhaka-correct open status"
```

---

### Task 2: Enquiry CTA helper and `useOpenStatus`

**Files:**
- Modify: `src/lib/whatsapp.ts`
- Create: `src/hooks/useOpenStatus.ts`

**Interfaces:**
- Consumes: `SITE.whatsappNumber`, `getOpenStatus`, `SITE.hoursDetail`.
- Produces: `buildEnquiryUrl(text: string): string`, `useOpenStatus(): { open: boolean; label: string }`.

- [ ] **Step 1: Write the failing test** — append to `scripts/hours.test.mjs`

```js
import { buildEnquiryUrl } from '../src/lib/whatsapp.ts';

test('enquiry URL targets the SITE number and encodes the message', () => {
  assert.equal(
    buildEnquiryUrl('Hi Day Three — table for two?'),
    `https://wa.me/8801700000000?text=${encodeURIComponent('Hi Day Three — table for two?')}`
  );
});
```

- [ ] **Step 2: Run and watch it fail** — `npm test`, expected `buildEnquiryUrl is not a function`.

- [ ] **Step 3: Implement**

```ts
export function buildEnquiryUrl(text: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
```

`useOpenStatus` calls `useState(() => getOpenStatus(new Date(), SITE.hoursDetail))` and re-computes once on mount via `useEffect`, so a page left open across closing time still corrects itself on the next visit. No interval.

- [ ] **Step 4: Run `npm test`, then `npm run build`**

Expected: tests pass, `tsc -b` clean.

- [ ] **Step 5: Commit**

```bash
git add src/lib/whatsapp.ts src/hooks/useOpenStatus.ts scripts/hours.test.mjs
git commit -m "feat: enquiry URL helper and useOpenStatus hook"
```

---

### Task 3: Roaster — restore dropped markup, add credentials and one action

**Files:**
- Modify: `src/components/sections/Roaster.tsx`

**Interfaces:**
- Consumes: `buildEnquiryUrl` from Task 2.

- [ ] **Step 1: Restore** the eyebrow (`The Roaster · Banani, Dhaka`), the `.roaster-role` span inside `.roaster-headline`, and the `.roaster-portrait-caption` figcaption with `Head Roaster & Founder` / `Banani, Dhaka`, exactly as `legacy/index.html:324–340`.

- [ ] **Step 2: Add** a `.roaster-credentials` row after `.roaster-bio` — three `<span>`s: `Roasted every Tuesday`, `Cast-iron drum, Banani`, `Single-origin micro-lots`.

- [ ] **Step 3: Add** an enquiry link after the blockquote inside `.roaster-body`: `className="btn-secondary-pill roaster-enquiry"`, `href={buildEnquiryUrl("Hi Day Three — I'd like to ask Zarif about this week's lot.")}`, `target="_blank"`, `rel="noopener noreferrer"`, label `Ask Zarif about this week's lot`.

- [ ] **Step 4: Verify** `npm run check` → class tokens 0 unknown; `npm run build` clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Roaster.tsx
git commit -m "feat(roaster): restore portrait hierarchy, credentials, enquiry CTA"
```

---

### Task 4: Visit — restore labels, live status, second action

**Files:**
- Modify: `src/components/sections/Visit.tsx`

**Interfaces:**
- Consumes: `useOpenStatus`, `buildEnquiryUrl`, `SITE`.

- [ ] **Step 1:** Restore `.tasting-room-eyebrow` (`Tasting Room · Banani, Dhaka`) and the two `<strong>` labels `Location` and `Opening Hours`, matching `legacy/index.html` line-for-line structure inside `.tasting-meta-item`.

- [ ] **Step 2:** Add a status line inside the hours item, under the value:

```tsx
<span className="tasting-status" data-open={status.open}>
  <span className="tasting-status-dot" aria-hidden="true" />
  {status.label}
</span>
```

- [ ] **Step 3:** Add a second action in `.tasting-room-actions`: `Reserve a tasting` → `buildEnquiryUrl("Hi Day Three — I'd like to reserve a tasting flight at the Banani tasting room.")`, `className="btn-secondary-pill"`.

- [ ] **Step 4: Verify** `npm run build`, `npm run check`; tab through both actions and confirm two visible focus rings.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Visit.tsx
git commit -m "feat(visit): live open status, restored labels, tasting reservation CTA"
```

---

### Task 5: Footer — bookend, dispatch facts, order CTA, no fake form

**Files:**
- Modify: `src/components/layout/Footer.tsx`
- Modify: `scripts/check-parity.mjs` (`ALLOWED_COPY_GAPS`)

**Interfaces:**
- Consumes: `buildEnquiryUrl`, `SITE`.

- [ ] **Step 1:** Delete the `useState` email state, `handleSubscribe`, the `<form>`, and the `useToast` import — the footer no longer raises toasts. Keep `footer-main-grid`, both link columns, and `footer-bottom-bar` copy untouched.

- [ ] **Step 2:** Add the bookend as the first child of `.site-footer`, before `.footer-container`:

```tsx
<p className="footer-bookend" aria-hidden="false">Roasted Tuesday. Best on Day Three.</p>
```

- [ ] **Step 3:** Replace the fourth column with a dispatch fact block: heading `Roast Dispatches`, `.footer-next-roast` reading `Next roast · Tuesday 3 November`, and the primary action `Order on WhatsApp` → `buildEnquiryUrl("Hi Day Three — I'd like to order from this week's roast.")` with `className="btn-order-request footer-order-cta"`.

- [ ] **Step 4:** Add `'Receive our weekly Tuesday roast schedule and seasonal lot releases:'` to `ALLOWED_COPY_GAPS` with a one-line comment saying it was removed with the dead newsletter, then run `npm run check:strict` and confirm `copy blocks 43 legacy, 0 missing`.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Footer.tsx scripts/check-parity.mjs
git commit -m "feat(footer): bookend line, dispatch facts, real order CTA"
```

---

### Task 6: CSS — bookend, credentials, status, and responsive rules

**Files:**
- Modify: `src/styles/main.css` inside §10 (after `.roaster-strip figcaption`), §12 (after `.tasting-room-actions`), §14 (after `.footer-bottom-bar`), §18.

- [ ] **Step 1:** §10 — `.roaster-credentials` (flex wrap, `gap: 2.4rem`, top hairline at `rgba(255,249,242,.25)`, mono micro-size, `.6` opacity), `.roaster-enquiry` (`align-self: flex-start`, `margin-top: 2.4rem`).

- [ ] **Step 2:** §12 — `.tasting-status` (inline-flex, `gap: .8rem`, mono `1.05rem`, `.75` opacity), `.tasting-status-dot` (`8px` circle, `background: var(--brown)` when `[data-open="true"]`, `var(--brick)` otherwise), `.tasting-room-actions` gains `flex-direction: column; gap: 1.2rem; align-items: stretch`.

- [ ] **Step 3:** §14 — `.site-footer` becomes the brick ground with the bookend above the plate: `display: grid; gap: 4rem`, and `.footer-bookend` is Fraunces at `clamp(3.2rem, 8vw, 8rem)`, `line-height: .92`, `letter-spacing: -.05em`, `color: var(--cream)`, `max-width: 1600px`, `margin: 0 auto`, `padding: 0 var(--gutter)`, `text-wrap: balance`. No gradient, no `aria-hidden`, no clipping tricks — it sits above the plate at full contrast.

- [ ] **Step 4:** §18 at `≤768px` — `.footer-bookend` drops to `clamp(2.4rem, 11vw, 3.6rem)`, `.tasting-room-actions` buttons go full width, `.roaster-credentials` stacks to two columns.

- [ ] **Step 5: Verify at four widths** (390 / 768 / 1024 / 1440): no horizontal scroll, bookend not clipped, both Visit buttons reachable, status dot not the only signal.

- [ ] **Step 6: Commit**

```bash
git add src/styles/main.css
git commit -m "style: bookend, credentials row, open status, responsive"
```

---

### Task 7: Deliberate hash update and docs

**Files:**
- Modify: `scripts/check-parity.mjs` (`FROZEN_CSS_SHA`)
- Modify: `DESIGN.md` §7.7, §7.9, §7.11
- Modify: `AGENTS.md` §4 band sentence

- [ ] **Step 1:** Run `npm run check`, copy the actual sha256 into `FROZEN_CSS_SHA`, and extend the comment with the date and reason.
- [ ] **Step 2:** Rewrite §7.7, §7.9, §7.11 of `DESIGN.md` to describe what is built: credentials row, live status, bookend, dispatch fact block, no newsletter form.
- [ ] **Step 3:** Correct the `AGENTS.md` line that calls brown/blue/brick "full-bleed bands" — they carry inset cream plates.
- [ ] **Step 4: Verify** `npm run build`, `npm run check:strict`, `npm test` all pass.
- [ ] **Step 5: Commit**

```bash
git add scripts/check-parity.mjs DESIGN.md AGENTS.md
git commit -m "docs: record the closing-sections design change and re-freeze the CSS"
```
