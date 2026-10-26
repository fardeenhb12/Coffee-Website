# Day Three — Build Plan

You are completing a rebuild of a single-page site for **Day Three**, a boutique coffee
roastery in Dhaka. Work through the phases in order. Each phase ends with a review stop.

## Read these first, in this order

| Document | What it settles |
|---|---|
| `BRAND.md` | The customer, the brand's one claim, the voice, what the brand refuses |
| `PAGE-SPEC.md` | Section order, the seven lots, prices, the ordering flow |
| `GALLERY-RESTYLE.md` | **Current build brief.** Direction C values, selectors, phases, acceptance |
| `GLOSSARY.md` | The vocabulary: *bag*, *lot*, *roast date*, *order request*, *dispatch* |
| `docs/adr/0001`–`0005` | Five decisions and the trade-offs behind them (0005 = Direction C) |
| `MOTION.md` | Timing tokens, keyframe registry, reduced-motion contract |
| `AGENTS.md` | How the code is built, and the engineering guardrails |

Do not write code until you have read the first five.

## Precedence

`BUILD-PLAN.md` → `BRAND.md` → `PAGE-SPEC.md` → `GALLERY-RESTYLE.md` → `GLOSSARY.md` →
`docs/adr/` → `MOTION.md` → `AGENTS.md` → `DESIGN.md` → the existing code.

For visual values (colour, size, spacing, radius), `GALLERY-RESTYLE.md` wins over
`DESIGN.md`. For timing, `MOTION.md` wins over both. The existing code is the *previous*
brand; its structure tells you what was there, not what to keep.

## What already exists

**Design system — superseded by Direction C.** The previous system (Literata display,
IBM Plex Sans body, parchment bands, 9–22px radii, pill buttons, card fills) is retired.
The current one is Inter Tight + Inter, one white gallery band below a dark hero, 1px rules,
zero radii on paper, and a single brass rule per band. Keep the engineering constraints: one
19-section stylesheet, one script, a glass fixed header, no frameworks, no bundler, no
dependencies, no build step.

**Phase 1 is complete.** In `index.html` the following are already built and approved:

- Brand renamed to Day Three throughout the file.
- Dispatch bar reworded: roasted every Tuesday · order by 2 PM · free delivery over ৳2,500.
- Masthead: Day Three, "Dhaka · Specialty Roasters", bag pill, three-item nav.
- Hero, composition approved: eyebrow → "Roasted Tuesday. / Best from Friday." → subtext
  → two CTAs → full-width roast-date band (`.hero-date-band`).

Its CSS lives at the end of section 8 of `main.css`, with the responsive collapse in
section 18 and the reduced-motion snap in section 19. Reuse `.hero-date-band` and its
children wherever a roast date is displayed — it is the brand's signature component.

### Section map

| Current section | Action | Becomes |
|---|---|---|
| `.hero-stage-section` | **built** | §3 hero |
| `.pillars-section` | replace | §6 why we print the date |
| `.provisions-section` | rewrite | §5 lot grid |
| `.concierge-section` | remove from the page | a footer link to a wholesale enquiry |
| `.tasting-rooms-section` | keep, correct content | §9 visit |
| `.mission-editorial-section` | replace | §7 the roaster |
| `.video-modal-backdrop` | delete | — |
| cart drawer | keep, rewire the ending | order request |
| footer | rewrite | §11 |
| toast container | keep | — |

## Phases

### Phase 2 — The seven lots

Build §4 (*this week's roast*) and §5 (the lot grid), and change what the cart does at the
end.

Replace the three hardcoded product cards with one array and one renderer:

```js
const LOTS = [
  { id, name, category, origin, region, process, altitude, notes: [], price250, price1000, roastDate, stock: true|false, image }
];
```

| Name | Category | Origin | Process | 250g | 1kg |
|---|---|---|---|---|---|
| Dhaka Daily | Blend | Ethiopia + Brazil | — | ৳995 | ৳3,400 |
| Espresso No. 1 | Blend | Brazil + Colombia | — | ৳1,050 | ৳3,400 |
| Uraga Natural | Single | Guji, Ethiopia | Natural | ৳1,295 | ৳4,100 |
| Las Nubes | Single | Matagalpa, Nicaragua | Washed | ৳1,195 | ৳4,100 |
| El Bosque | Single | San Ignacio, Peru | Washed | ৳1,250 | ৳4,100 |
| Mogiana | Single | Mogiana, Brazil | Pulped natural | ৳1,195 | ৳4,100 |
| Worka Anaerobic | Seasonal | Worka, Ethiopia | Anaerobic | ৳1,750 | ৳5,200 |

Each card shows, in this order: roast date, lot name, origin · process · altitude, tasting
notes, 250g/1kg toggle, grind selector, add to bag. **At most one card may be sold out**,
and a sold-out card still shows its roast date and its next roast date.

Cart identity becomes `${id}::${size}::${grind}`. Quantity stays editable 1–999.

The cart's final step becomes an order request: build a prefilled message and open
`https://wa.me/${WHATSAPP_NUMBER}?text=…`. Nothing on the page may claim payment was
taken. Declare `WHATSAPP_NUMBER` once, at the top of `main.js`, marked as a launch
blocker.

Message format:

```
Hi Day Three — I'd like to order:

• Uraga Natural — 250g, V60 grind — ×1 — ৳1,295
• Las Nubes — 1kg, whole bean — ×1 — ৳4,100

Subtotal: ৳5,395
Free delivery (over ৳2,500)
```

Free delivery at **৳2,500**; drive the existing shipping bar from that constant.

**Done when:** seven cards render from one array; every card can be added at both sizes
and all four grinds; the drawer opens on add; the WhatsApp link contains every line, the
subtotal, and the delivery line; reloading empties the cart; nothing anywhere says
"checkout" or "payment received".

### Phase 3 — Proof and the roaster

Replace `.pillars-section` with §6: three checkable proofs, each one line — a date printed
on every bag, a named producer on every lot, a roast every Tuesday dispatched the same day.
Reuse `.hero-date-band` at least once.

Replace `.mission-editorial-section` with §7: the roaster as a named person, why they roast
the way they do, one pull quote. There is no photograph; build it as type.

**Done when:** no row of the old page remains — no "Kingdom Mission", no "100%
proceeds", no three-stat row, no "Dhaka's foremost". Every claim in these two sections is
visible elsewhere on the page.

### Phase 4 — Brew guides and FAQ

Build §8 and §9, and restore "Brew Guides" to the nav pointing at §8.

Four methods — V60, AeroPress, French press, moka pot — each with dose, water, grind, time,
and one sentence on what to change if it tastes thin or bitter. Add an FAQ of six
questions: freshness, grind, delivery time, payment, sold-out lots, wholesale.

**Done when:** every nav link lands where its label says. Brew Guides was removed from the
nav in phase 1 precisely because it pointed at a B2B form; it returns only because the
section now exists.

### Phase 5 — Visit and footer

Rewrite `.tasting-rooms-section` with a real address, real hours, and a map link to that
address rather than `maps.google.com`. Rewrite the footer: contact, wholesale enquiry,
newsletter, and no mission-proceeds line.

**Done when:** the address in the footer, in the visit section, and in the JSON-LD are
identical; the phone number appears once and is one a human answers; no `501(c)(3)`
reference survives.

### Phase 6 — Whole-page pass

Responsive at 1024, 768 and 390. Focus states on every interactive element. The existing
`createFocusTrap` covers the drawer and the mobile nav — reuse it. Tab order follows visual
order. Check the lot card at 390px with seven cards on screen.

**Done when:** no horizontal scroll at 320px; every target ≥44px; every date, price and
lot number is readable at 390px; `prefers-reduced-motion` leaves nothing invisible and no
animation running.

### Phase 7 — Documentation and dead code

Rewrite `AGENTS.md` to describe this site. Delete the CSS for removed sections, the video
modal, and the old product markup. Update `DESIGN.md` with the hero and lot-card anatomy.

**Done when:** a reader of `AGENTS.md` alone would describe the current site correctly;
`grep` for `Kingdom`, `Aroma`, `501(c)(3)`, `maps.google.com` and `1711-000000`
returns nothing.

### Phase 8 — Gallery restyle (complete)

Implement **Direction C — Gallery**, using `GALLERY-RESTYLE.md` as the build order. This is
a CSS-led restyle, not a rebuild: the DOM, the copy, the section order and `scripts/main.js`
do not change. One line of `index.html` changes (the Google Fonts `<link>`).

Scope in one sentence: the hero keeps its dark film composition and only changes typeface;
every section below it moves onto a single `#FAF9F6` ground with large Inter Tight headings,
1px rules instead of cards, zero radii, zero shadows, and a footer bookended in ink.

Work the eight phases inside `GALLERY-RESTYLE.md` §11, in order, committing each. Do not add
decoration to fill space; do not reintroduce a serif, a mono face, a card fill or a hover
lift; do not edit the cart engine.

**Done when:** every box in `GALLERY-RESTYLE.md` §12 passes at 390 / 768 / 1024 / 1440 px,
the greps in that section return the expected output, `git diff scripts/main.js` is empty,
and `DESIGN.md` matches the CSS.

## Rules for every phase

- **One claim, one place.** If the brand says a bag is dated, the date is on the card, in
  the cart, and in the WhatsApp message.
- **Verify before you write.** Every number, date and address on the page comes from the
  build data or the owner. Invented specifics are the failure mode this rebuild exists to
  fix.
- **Tokens only.** New colours come from `:root`, not from new hex values.
- **Guarded lookups.** `if (el)` around every DOM query — sections get removed and added.
- **IDs are a contract.** Renaming an `id` in HTML means updating `main.js` in the same edit.
- **Reuse the motion system.** New animation uses `MOTION.md` tokens and gets a
  reduced-motion counterpart.

## Placeholders that must not ship

| Placeholder | Where | Replace with |
|---|---|---|
| `21.10.2026`, `Lot 014` | hero date band | the real next roast date |
| "7 lots · 2 sold out" | hero date band | the live count |
| `WHATSAPP_NUMBER` | `main.js` | the number the owner answers |
| House 42, Road 11, Banani | footer, visit, JSON-LD | the real address |
| `+880 1711-000000` | footer, JSON-LD | the real number |
| `Dhaka Daily`, `Espresso No. 1`, `Mogiana`, `Worka Anaerobic` | lot grid | real stock, if the range differs |
| Any photograph | `assets/images/` | nothing — build type-led until real photos exist |

## Definition of done

The site is finished when a home brewer in Dhaka can, without leaving the page: learn the
roast date of the bag they are buying, see who grew it and how it was processed, choose a
grind for the brewer they own, understand what delivery costs, and reach a human on
WhatsApp with their order already written out — and when every date, price and address on
the page is one the owner can stand behind.
