# Cart Drawer Refinements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every bag row removable with one press, make `+`/`−` accelerate while held, and make the empty-bag CTA actually scroll to the shop section.

**Architecture:** The cart reducer moves out of `CartContext.tsx` into `lib/cart.ts` so its 999 ceiling can be tested without a DOM. The hold gesture is split into a pure schedule (`lib/holdRepeat.ts`, tested) and a `useHoldRepeat` hook that owns the timers. `CartItemRow` consumes both; `CartDrawer` passes the already-existing `removeItem` down and fixes the scroll race.

**Tech Stack:** React 19, TypeScript strict, Vite 6, Node's built-in test runner with an esbuild TS transform (the pattern `scripts/hours.test.mjs` already uses). No new dependencies.

**Spec:** `docs/superpowers/specs/2026-11-02-cart-drawer-refinements-design.md`

## Global Constraints

- Runtime dependencies stay `react` + `react-dom`. Nothing new at runtime or in devDependencies.
- `src/styles/main.css` is edited **once**, deliberately: no existing selector is modified, only new blocks are appended in section 15, and `FROZEN_CSS_SHA` in `scripts/check-parity.mjs` is updated in the same commit with a dated comment.
- No new hex literal. Trash chrome uses `--line`, `--beige`, `--brown`, `--brick`.
- Touch targets ≥ 44px. Trash is `4.4rem`; the bag steppers widen from `3.4rem` to `4.4rem`.
- No superlative or "world-class"/"curated" copy. Toast text stays the existing `Item removed from bag`.
- `npm run build`, `npm run check:strict`, `npm test` must all pass before the branch is called done.

## Review Focus

- Holding `+` at the 999 ceiling: the quantity must stop, and the WhatsApp line must stay a sane number.
- Holding `−` through 1: the row leaves exactly once, one toast, and no timer fires after the row unmounts.
- A single tap, or Enter/Space on a focused stepper: exactly one step — the pointer step must not be doubled by the synthesized click.
- Touch long-press on a stepper: the drawer must not scroll, no text selection, no iOS callout.
- Removing the last row with the drawer open: empty state renders and the order button is disabled.

---

### Task 1: Move the cart reducer into `lib/cart.ts` and cap quantity at 999

**Files:**
- Modify: `src/lib/cart.ts` (append reducer, `MAX_QUANTITY`)
- Modify: `src/context/CartContext.tsx` (delete local reducer, import from lib)
- Create: `scripts/cart.test.mjs`
- Modify: `package.json:15` (`test` script)

**Interfaces:**
- Consumes: `cartKey(item)` already exported from `src/lib/cart.ts`.
- Produces:
  - `MAX_QUANTITY: number` — `999`
  - `type CartAction = { type: 'add'; item: CartItem } | { type: 'increment'; key: string } | { type: 'decrement'; key: string } | { type: 'remove'; key: string }`
  - `function cartReducer(items: CartItem[], action: CartAction): CartItem[]`
  - `CartContext` keeps exporting the same `useCart()` shape; nothing downstream changes.

- [ ] **Step 1: Write the failing test**

Create `scripts/cart.test.mjs`. Copy the `importTs` helper verbatim from `scripts/hours.test.mjs:10-16`.

```js
const { cartReducer, cartKey, MAX_QUANTITY } = await importTs('src/lib/cart.ts');

const bag = (over = {}) => ({
  id: 'uraga-natural',
  name: 'Uraga Natural',
  size: '250g',
  grind: 'whole bean',
  price: 1295,
  quantity: 1,
  ...over,
});

test('adding a new identity appends a row', () => {
  const next = cartReducer([], { type: 'add', item: bag() });
  assert.equal(next.length, 1);
  assert.equal(next[0].quantity, 1);
});

test('adding the same identity accumulates into one row', () => {
  const next = cartReducer([bag()], { type: 'add', item: bag({ quantity: 2 }) });
  assert.equal(next.length, 1);
  assert.equal(next[0].quantity, 3);
});

test('a different grind is a different row', () => {
  const next = cartReducer([bag()], { type: 'add', item: bag({ grind: 'V60 grind' }) });
  assert.equal(next.length, 2);
});

test('increment never passes the ceiling', () => {
  const full = bag({ quantity: MAX_QUANTITY });
  const next = cartReducer([full], { type: 'increment', key: cartKey(full) });
  assert.equal(next[0].quantity, MAX_QUANTITY);
});

test('add cannot push a row past the ceiling', () => {
  const near = bag({ quantity: 990 });
  const next = cartReducer([near], { type: 'add', item: bag({ quantity: 20 }) });
  assert.equal(next[0].quantity, MAX_QUANTITY);
});

test('decrement stops at one', () => {
  const two = bag({ quantity: 2 });
  const next = cartReducer([two], { type: 'decrement', key: cartKey(two) });
  assert.equal(next[0].quantity, 1);
});

test('decrement from one removes the row', () => {
  const next = cartReducer([bag()], { type: 'decrement', key: cartKey(bag()) });
  assert.deepEqual(next, []);
});

test('remove drops only the matching row', () => {
  const other = bag({ id: 'las-nubes', name: 'Las Nubes' });
  const next = cartReducer([bag(), other], { type: 'remove', key: cartKey(other) });
  assert.equal(next.length, 1);
  assert.equal(next[0].id, 'uraga-natural');
});

test('removing the only row leaves an empty bag', () => {
  assert.deepEqual(cartReducer([bag()], { type: 'remove', key: cartKey(bag()) }), []);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`
Expected: FAIL — `cartReducer` is not exported (currently lives in `CartContext.tsx`).

- [ ] **Step 3: Implement in `src/lib/cart.ts`**

Add `MAX_QUANTITY = 999` and make `clampQuantity` use it (`Math.min(MAX_QUANTITY, Math.max(1, parsed))`). Move the `CartAction` union and `cartReducer` out of `src/context/CartContext.tsx` unchanged except for the ceiling: `add` clamps a new row's quantity to 1–999 and an accumulated row to `Math.min(MAX_QUANTITY, item.quantity + action.item.quantity)`; `increment` clamps the same way. `decrement` and `remove` are copied verbatim. Move the reducer's doc comment with it.

In `CartContext.tsx`, delete the local union and reducer, import `cartReducer` and `type CartAction` from `../lib/cart`, and drop the now-unused `CartItem` type import if the file no longer references it.

- [ ] **Step 4: Make the test script run every test file**

`package.json`: replace `"test": "node --test scripts/hours.test.mjs"` with `"test": "node --test scripts/"`.

- [ ] **Step 5: Run the tests and the build**

Run: `npm test`
Expected: PASS — 8 new cart tests plus the 8 existing hours/enquiry tests.

Run: `npm run build`
Expected: `tsc -b` clean, Vite build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/lib/cart.ts src/context/CartContext.tsx scripts/cart.test.mjs package.json
git commit -m "refactor(cart): move reducer into lib and cap quantity at 999"
```

---

### Task 2: The hold schedule as a pure module

**Files:**
- Create: `src/lib/holdRepeat.ts`
- Create: `scripts/hold-repeat.test.mjs`

**Interfaces:**
- Produces: `HOLD_DELAY = 380`, `HOLD_INTERVAL = 130`, `HOLD_MIN_INTERVAL = 32`, `nextHoldInterval(current: number): number`.
- Consumed by Task 3.

- [ ] **Step 1: Write the failing test**

Create `scripts/hold-repeat.test.mjs`, same `importTs` helper as Task 1, then:

```js
const { HOLD_DELAY, HOLD_INTERVAL, HOLD_MIN_INTERVAL, nextHoldInterval } =
  await importTs('src/lib/holdRepeat.ts');

test('the pinned schedule', () => {
  assert.equal(HOLD_DELAY, 380);
  assert.equal(HOLD_INTERVAL, 130);
  assert.equal(HOLD_MIN_INTERVAL, 32);
});

test('the first repeat is shorter than the first interval', () => {
  assert.equal(nextHoldInterval(HOLD_INTERVAL), 117);
});

test('the interval only ever shrinks', () => {
  let ms = HOLD_INTERVAL;
  for (let i = 0; i < 40; i += 1) {
    const next = nextHoldInterval(ms);
    assert.ok(next <= ms, `${next} must not exceed ${ms}`);
    ms = next;
  }
});

test('a long hold converges on the floor and stops there', () => {
  let ms = HOLD_INTERVAL;
  for (let i = 0; i < 60; i += 1) ms = nextHoldInterval(ms);
  assert.equal(ms, HOLD_MIN_INTERVAL);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`
Expected: FAIL — `src/lib/holdRepeat.ts` does not exist.

- [ ] **Step 3: Implement `src/lib/holdRepeat.ts`**

```ts
/**
 * Acceleration curve for press-and-hold steppers.
 *
 * A hold steps once on press, waits `HOLD_DELAY`, then repeats every
 * `HOLD_INTERVAL` milliseconds, shortening by 10% each time until
 * `HOLD_MIN_INTERVAL`. Roughly: 20 steps in a second and a half, 120 in three.
 */
export const HOLD_DELAY = 380;
export const HOLD_INTERVAL = 130;
export const HOLD_MIN_INTERVAL = 32;

export function nextHoldInterval(current: number): number {
  return Math.max(HOLD_MIN_INTERVAL, Math.round(current * 0.9));
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test`
Expected: PASS — 4 new tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/holdRepeat.ts scripts/hold-repeat.test.mjs
git commit -m "feat(cart): add hold-repeat acceleration curve"
```

---

### Task 3: `useHoldRepeat` hook

**Files:**
- Create: `src/hooks/useHoldRepeat.ts`

**Interfaces:**
- Consumes: `HOLD_DELAY`, `HOLD_INTERVAL`, `nextHoldInterval` from `../lib/holdRepeat`.
- Produces: `useHoldRepeat(onStep: () => void): HoldRepeatHandlers` where

```ts
interface HoldRepeatHandlers {
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  onLostPointerCapture: () => void;
  onClick: (event: ReactMouseEvent<HTMLElement>) => void;
}
```

The handlers are spread onto a `<button>`. `onStep` is re-read from a ref each tick, so a re-render with a new closure never restarts the hold.

- [ ] **Step 1: Implement the hook**

```ts
import { useCallback, useEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HOLD_DELAY, HOLD_INTERVAL, nextHoldInterval } from '../lib/holdRepeat';

export interface HoldRepeatHandlers {
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  onLostPointerCapture: () => void;
  onClick: (event: ReactMouseEvent<HTMLElement>) => void;
}

/**
 * Press once to step, keep holding to accelerate.
 *
 * The first step happens on pointerdown so the press feels immediate; repeats
 * follow on a self-rescheduling timer whose interval shrinks every tick. The
 * click handler only answers keyboard activation (`event.detail === 0`),
 * because a pointer's synthesized click already stepped on pointerdown.
 */
export function useHoldRepeat(onStep: () => void): HoldRepeatHandlers {
  const stepRef = useRef(onStep);
  stepRef.current = onStep;

  const timer = useRef<number | null>(null);
  const interval = useRef(HOLD_INTERVAL);

  const stop = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    interval.current = HOLD_INTERVAL;
  }, []);

  const tick = useCallback(function schedule(delay: number) {
    timer.current = window.setTimeout(() => {
      stepRef.current();
      interval.current = nextHoldInterval(interval.current);
      schedule(interval.current);
    }, delay);
  }, []);

  useEffect(() => stop, [stop]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      stop();
      stepRef.current();
      tick(HOLD_DELAY);
    },
    [stop, tick]
  );

  const onClick = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    if (event.detail === 0) stepRef.current();
  }, []);

  return { onPointerDown, onPointerUp: stop, onPointerCancel: stop, onLostPointerCapture: stop, onClick };
}
```

- [ ] **Step 2: Type-check it**

Run: `npm run build`
Expected: clean. The file is not imported yet, so Vite may tree-shake it — `tsc -b` is what matters here.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useHoldRepeat.ts
git commit -m "feat(cart): add hold-repeat pointer hook"
```

---

### Task 4: Trash button, hold steppers, and the stylesheet delta

**Files:**
- Modify: `src/components/cart/CartItemRow.tsx` (props + bottom row)
- Modify: `src/components/cart/CartDrawer.tsx:169-179` (pass `onRemove`)
- Modify: `src/styles/main.css` (append to section 15, after `.stepper-val`)
- Modify: `scripts/check-parity.mjs:30-48` (dated comment + new hash)
- Modify: `AGENTS.md:150-157` (hook table) and `AGENTS.md` repo layout (`7 hooks` → `8 hooks`)

**Interfaces:**
- Consumes: `useHoldRepeat` (Task 3), `removeItem(key)` and `showToast(message, icon)` already in context.
- Produces: `CartItemRow` gains `onRemove: () => void`.

- [ ] **Step 1: Append the stylesheet blocks**

In section 15, directly after the `.stepper-val` rule and before `.cart-drawer-footer`:

```css
/* Remove control and hold-to-repeat steppers. New block, no selector above is
   touched: the price keeps its right edge with an auto margin and the trash
   takes 44px after it. */
.cart-item-bottom .cart-item-price { margin-left: auto; }

.cart-item-remove {
  flex: 0 0 auto;
  width: 4.4rem;
  height: 4.4rem;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  color: var(--brown);
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease,
    transform 0.15s ease;
}

.cart-item-remove:hover {
  background: var(--beige);
  border-color: var(--brick);
  color: var(--brick);
}

.cart-item-remove:active { transform: scale(0.92); }

/* A held finger on a stepper must step, not scroll the drawer. */
.cart-dec-btn,
.cart-inc-btn {
  width: 4.4rem;
  touch-action: none;
  user-select: none;
  -webkit-touch-callout: none;
}
```

- [ ] **Step 2: Update the freeze hash and record the decision**

Run: `shasum -a 256 src/styles/main.css`
Paste the digest into `FROZEN_CSS_SHA`, and add above it:

```js
 * Changed again on 2 November 2026: the bag drawer gained a per-row remove
 * control and hold-to-repeat steppers. New section-15 blocks only; no existing
 * selector edited. See `docs/superpowers/specs/2026-11-02-cart-drawer-refinements-design.md`.
```

- [ ] **Step 3: Wire the row**

In `CartItemRow.tsx`, add `onRemove: () => void` to the props interface, call `useHoldRepeat` twice (once for `onDecrement`, once for `onIncrement`), spread the handlers onto the two stepper buttons, and append the trash button after `.cart-item-price`:

```tsx
<button
  type="button"
  className="cart-item-remove"
  aria-label={`Remove ${item.name}, ${item.size}, ${item.grind} from bag`}
  onClick={onRemove}
>
  <span className="material-symbols-outlined icon-sm" aria-hidden="true">
    delete
  </span>
</button>
```

In `CartDrawer.tsx`, pull `removeItem` from `useCart()` and pass:

```tsx
onRemove={() => {
  removeItem(key);
  showToast('Item removed from bag', 'delete');
}}
```

- [ ] **Step 4: Update the docs**

`AGENTS.md` hooks table gains `| useHoldRepeat | press-and-hold auto-repeat with acceleration for the bag steppers |`, and the repo-layout line reads `8 hooks`.

- [ ] **Step 5: Verify the guard and the build**

Run: `npm run check`
Expected: `css frozen ok`, `class tokens … 0 unknown`. If a token is unknown, the class is missing from the CSS block in Step 1 — add it there, not to the parity allow-list.

Run: `npm run build`
Expected: clean.

- [ ] **Step 6: Manual pass, then commit**

`npm run dev`, open the drawer with two rows and confirm: the trash clears one row and toasts once; a single tap steps once; holding `+` accelerates to 50 in about a second and a half and stops at 999; holding `−` past 1 removes the row without a console error; on a touch emulator the drawer does not scroll while held.

```bash
git add src/components/cart/CartItemRow.tsx src/components/cart/CartDrawer.tsx src/styles/main.css scripts/check-parity.mjs AGENTS.md
git commit -m "feat(cart): remove rows with a trash button and add hold-to-repeat steppers"
```

---

### Task 5: Make the empty-bag CTA land on the shop section

**Files:**
- Modify: `src/components/cart/CartDrawer.tsx:70-76` (`handleExplore`)

**Interfaces:**
- Consumes: nothing new.
- Produces: no public API change.

- [ ] **Step 1: Replace the handler**

```tsx
function handleExplore() {
  closeCart();
  // Closing unlocks the body in a commit effect; wrapping and restoring the
  // frozen offset happens there. Scroll on a later frame or that restore undoes
  // the jump and the visitor lands wherever the page was.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.getElementById('provisions-showcase')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  });
}
```

- [ ] **Step 2: Verify by hand**

`npm run dev`, scroll to the footer, open the drawer, press "Shop This Week's Roast".
Expected: drawer closes and the page settles on the "This Week's Roast" heading — not on the hero, not back at the footer. Repeat from the hero.

- [ ] **Step 3: Run the full gate**

Run: `npm run build && npm run check:strict && npm test`
Expected: build clean, `All structural checks passed.`, every test green.

- [ ] **Step 4: Commit**

```bash
git add src/components/cart/CartDrawer.tsx
git commit -m "fix(cart): land the empty-bag CTA on the shop section"
```
