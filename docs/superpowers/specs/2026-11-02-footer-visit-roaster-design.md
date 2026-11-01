# Footer, Visit, Roaster — design

Date: 2026-11-02
Status: approved (human partner delegated the remaining decisions)

## Intent

The three closing sections under-sell. The page argues well from the hero to the
FAQ, then lands on a Visit block with two facts, a testimonial that lost its
structure, and a footer whose newsletter stores nothing.

Two separate problems are in play:

1. **Regression.** The React port dropped markup `main.css` still styles:
   `.roaster-eyebrow`, `.roaster-role`, `.roaster-portrait-caption`,
   `.tasting-room-eyebrow`, and the `Location` / `Opening Hours` meta labels.
   The parity guard missed them because it only compares copy blocks of 30+
   characters, and every dropped string is shorter than that. Restoring them is
   a fidelity fix, not a redesign.
2. **No action.** Nothing in these three sections asks the visitor to do
   anything. The only conversion paths on the site are the cart and WhatsApp.

## Goals

- Restore the dropped hierarchy so each section uses the type and labels the
  stylesheet was written for.
- Give each section one real, honest action: Visit and Roastery → a prefilled
  WhatsApp enquiry; Footer → an order start.
- Give the footer a bookend: an oversized Fraunces line on the brick ground,
  clipped by the cream plate, mirroring the reference's composition.
- State freshness where it converts: a live `Open now` status in Visit, the next
  roast date in the footer.

## Non-goals

- No new sections, routes, dependencies or images.
- No rewriting of existing prose. Copy changes are additive only, except the
  removed newsletter block.
- No cart, checkout or payment behaviour changes.
- No fake affordances. If a visitor can click it, something real happens.

## Anti-goals

A footer that looks like a floating SaaS card with no ending. A testimonial that
becomes a wall of type. A "Reserve" button that does not actually open a
message to a human.

## Constraints

- `src/styles/main.css` is hash-frozen by `npm run check`. This change edits it
  deliberately: update `FROZEN_CSS_SHA` in the same commit, record the decision
  here and in `DESIGN.md` §7.7 / §7.9 / §7.11. `FIDELITY.md` §8 is the authority
  for this path, and forbids doing it quietly.
- Copy parity: removing the newsletter block trips `check:strict`, so its copy
  goes into `ALLOWED_COPY_GAPS` with a note in the report. Nothing else leaves.
- Address, hours, phone and email stay sourced from `SITE` and stay identical to
  the JSON-LD block in `index.html`.
- `SITE.whatsappNumber` is still the launch-blocker placeholder. The CTAs use it
  anyway, exactly as the cart does.
- WCAG 2.2: 44px targets, visible focus, the open/closed status is text, never
  colour alone.

## Approaches considered

**A — Reference-faithful plate.** Inset rounded footer plate, giant gradient
headline clipped behind it, brand + CTA left, link groups right.
**B — Register-literal.** Full-bleed footer, bookend from type alone.
**C — Polish only.** No structural change.

The human partner picked the reference's composition and asked which is right on
UX grounds. Recommendation given: **B in principle** — full width at 390px, no
decorative type spending the section's most valuable area, no contrast-by-
construction, and a ground change reads as an ending where a floating card reads
as "more below".

**That recommendation is now moot in its strongest detail.** Reading the real
stylesheet, `§12` and `§14` already render cream plates with `--panel` radius on
blue and brick grounds. The footer plate the reference shows *exists*. Moving it
to full-bleed would be a regression against the rest of the page, and the
"documented rule" I cited was `AGENTS.md` describing a design the CSS no longer
has. So the built result keeps the plate, and takes from B everything that still
applies: the bookend is real, high-contrast text on the band, the interior is
full width, and the type never fades below contrast.

## Decisions

### Roaster (`§10`)

- Restore eyebrow `The Roaster · Banani, Dhaka`, role `Head Roaster & Founder`,
  and the portrait caption the CSS already styles.
- Add a credentials row under the bio: `Roasted every Tuesday` ·
  `Cast-iron drum, Banani` · `Single-origin micro-lots`. No invented numbers.
- Add one secondary action under the quote: **Ask Zarif about this week's lot**,
  a prefilled WhatsApp enquiry. Secondary pill, not the primary brick fill —
  the section's job is trust, not checkout.

### Visit (`§12`)

- Restore the eyebrow and the `Location` / `Opening Hours` labels.
- Add a live status line beside the hours, computed in `Asia/Dhaka` from
  structured fields, not by parsing the prose: `Open now · closes 9:00 PM` or
  `Closed · opens 8:00 AM`. A dot plus text; the text carries the meaning.
- Two actions: **Get Directions** (primary, unchanged target) and **Reserve a
  tasting** (secondary, prefilled WhatsApp enquiry).

### Footer (`§14`)

- Bookend: one Fraunces line on the brick ground above the plate —
  `Roasted Tuesday. Best on Day Three.` — at `clamp(3.2rem, 8vw, 8rem)`, cream
  on brick, clipped by the plate's top edge. Real text at full contrast: no
  gradient fade, no `aria-hidden`.
- Interior keeps the four-column grid but rebalances: brand column gains the
  order action; the newsletter column becomes **Roast Dispatches** as a fact
  block — next roast date plus **Order on WhatsApp** — replacing the form that
  stored nothing and toasted a lie.
- Bottom bar unchanged in content.

## What is left to the builder

- Exact clamp values and gaps, within the tokens in `:root`.
- Whether the status line refreshes on a timer or on mount. Mount is enough; the
  page is not a kiosk.
- The wording of the WhatsApp enquiry prefill, kept in the house voice and free
  of payment claims.

## New and changed files

| File | Change |
| :--- | :--- |
| `src/components/sections/Roaster.tsx` | restore dropped markup, credentials row, enquiry CTA |
| `src/components/sections/Visit.tsx` | restore eyebrow/labels, status line, second action |
| `src/components/layout/Footer.tsx` | drop the fake form, bookend, dispatch fact block, order CTA |
| `src/config/site.ts` | structured opening hours + enquiry helpers |
| `src/lib/whatsapp.ts` | `buildEnquiryUrl(text)` |
| `src/hooks/useOpenStatus.ts` | `Asia/Dhaka` open/closed, live on mount |
| `src/styles/main.css` | new rules inside §10, §12, §14, §18 |
| `scripts/check-parity.mjs` | new frozen hash, one allowlisted removed block |
| `DESIGN.md`, `AGENTS.md` | §7.7 / §7.9 / §7.11 updated, band wording corrected |
