# Cart drawer refinements — design

Date: 2026-11-02
Status: approved (human partner delegated the remaining decisions)

## Intent

Three friction points in the bag drawer, all reported from a real screen:

1. A row cannot be cleared. The only way out is pressing `−` until the row
   disappears, and nothing in the row says that will happen.
2. Bulk quantities are unscalable. Quantity is a static `<span>`; changing 50 to
   20 means thirty clicks on `−`.
3. The empty-state CTA lands on the hero. `handleExplore()` closes the drawer and
   calls `scrollIntoView` in the same tick, while `body.scroll-locked` still pins
   the document at its frozen offset; `unlockScroll()` then runs a frame later and
   calls `window.scrollTo(0, frozenAt)`, undoing the jump. It reads as "goes home".

`removeItem` already exists in `CartContext` and its reducer and is never wired to
anything. No context work is needed for (1).

## Goals

- Every row carries a trash button that clears that row in one click, raises the
  existing "Item removed from bag" toast, and has a 44×44 target.
- `+` and `−` auto-repeat while held, accelerating: the longer the hold, the
  faster the step. Reaching 50 from 1 or 20 from 50 is a single gesture.
- The empty-state CTA actually reaches `#provisions-showcase`.

## Non-goals

- No typed quantity field. The hold gesture replaces it; the span stays a span.
- No clear-all action in the header. Per-row is what was asked for; adding a
  second destructive control is a separate decision.
- No press-and-hold on the lot-card steppers. Those add to the bag, not to a
  basket, and a runaway hold there would submit a 999-bag order.
- No dependency, router, context shape change, or WhatsApp copy change.

## Approaches

### Remove control

**A — reuse an existing class.** Give the button `.cart-drawer-close` (44px
hairline circle, beige hover). Zero stylesheet change. Cost: it carries the close
button's hover, and `.cart-item-bottom` is `space-between`, so a third child walks
the price off the right edge.

**B — nine new lines in `main.css`.** A `.cart-item-remove` block: 44px circle,
hairline border, `--brown` icon, brick icon and border on hover/focus,
`scale(0.92)` on press, `margin-left: auto` to hold `stepper … price trash` in
order. The stylesheet is frozen and hash-checked, so this needs `FROZEN_CSS_SHA`
updated and a line in `DESIGN.md` — the path `scripts/check-parity.mjs` documents
for a deliberate design decision, not the drift path.

**Picked: B.** The trash and the drawer's `×` do opposite things; sharing the
close button's hover is the one place the register would lie. The delta is nine
lines in the section-15 block, no existing selector edited, guard still real.

### Bulk quantity

**Press-and-hold with acceleration** (picked, at your direction) — a first repeat
after a short delay, then a shrinking interval down to a floor, so the first
twenty steps are readable and a long hold crosses a hundred quickly.

**Typed input** (dropped) — precise, but it needs its own input block,
focus/selection handling, commit and revert semantics, and `.qty-input` cannot be
reused (`width: 100%` would swallow the row). The hold gesture covers the same
complaint with less surface.

**Risk, and the mitigation.** On touch, a held finger currently begins a drag and
the browser scrolls the list. The stepper buttons therefore get
`touch-action: none`, `user-select: none` and `-webkit-touch-callout: none`, the
repeat is driven by pointer events with `setPointerCapture`, and it stops on
pointerup, pointercancel, lost capture, window blur and unmount. Without that the
gesture is unusable on a phone, which is where it matters most.

### Empty-state CTA

`closeCart()`, then `requestAnimationFrame` before `scrollIntoView` — commit
effects (and so `unlockScroll`) run before the frame callback, and the scroll
survives. Target stays `#provisions-showcase`.

## Decisions

- Trash icon: Material Symbols `delete`, matching the icon the removal toast
  already shows. Not `close` — that reads as "dismiss the row" and duplicates the
  drawer's own `×`.
- Repeat timing: first repeat at 380ms, first interval 130ms, ×0.9 each step,
  floor 32ms. A click without a hold still performs exactly one step, so keyboard
  and single-tap behaviour is unchanged.
- Quantity clamps at 999 in the reducer for both `add` and `increment`, matching
  `clampQuantity` and stopping a runaway hold. `−` below 1 still drops the row, as
  it does today.
- Extraction: a `useHoldRepeat` hook beside the existing seven, returning pointer
  handlers and tearing its timers down on unmount. `AGENTS.md` §4 gains one row.
- The trash button sits after the price, at the end of `.cart-item-bottom`.
- Focus behaviour on the empty-state CTA is unchanged: the trap restores focus to
  the header bag button.

## Verification

`npm run build` and `npm run check` after `FROZEN_CSS_SHA` is updated, plus one
line in `DESIGN.md`. Manual pass at 1440px and 390px: click a trash, hold `+` from
1 to 50, hold `−` back to 20, hold `−` past 1 and watch the row leave, empty the
bag and press the CTA.

## Left to the builder

Nothing outstanding.
