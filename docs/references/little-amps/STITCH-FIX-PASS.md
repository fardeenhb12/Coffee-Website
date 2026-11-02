# Fix pass — closing the last 20% on `Day Three — Little Amps Register v2`

> **Status, 2 November 2026: Stitch could not be repaired.** `edit_screens` was called twice — once
> on the variant screen, once on the base screen — and both returned a confident summary while
> leaving the HTML, the screenshot and the screen-instance list byte-identical. The canvas is
> write-dead through MCP. This file is kept as the specification; the working implementation is
> `prototype/` next to it, built in code against the same eight passes.

**Agent:** read this whole file, then run the eight passes on
`projects/14627232441547135900` → screen `5e294dc12d67403bb9e790cb2558fe86`  (the "Accessible Buttons" revision — the one this audit measured)
(desktop) and `8b82d0fa800b4d65b5e9b94bfc73089d` (mobile).

**What is already correct — do not touch it.** Measured in the current export:

- Exactly the seven hexes, no other colour, no grey, no `#fff`, no `#000`
- `box-shadow: 0` occurrences, `linear-gradient: 0` occurrences
- Radii 8 / 4 / 2 px
- Fraunces + Inclusive Sans + DM Mono; `font-weight: 500` on all 11 headings; `-0.06em` display tracking

The design system is 1:1. Every remaining defect is **composition**, **content substitution** or
**component detail**. Re-theming, re-palette or "improving the typography" is out of scope and will
make it worse.

Two composition facts were missing from the first brief and are now in `DESIGN.md` §4.1: the hero is
a **peach `#FEBF6F` frame inset 15 px with a 22 px radius**, and the header is **four zones split by
full-height 1 px `#E6DAD4` rules**. Both are load-bearing.

---

## The one defect that matters

Every `<img>` in the current export points at `lh3.googleusercontent.com/aida-public/…`. There are
**3 unique images across 5 placements**, and the roastery photo is reused as both the hero and the
brown band's photo.

The real assets exist in this repo and none of them were used:

| Band | File | Current state |
| :--- | :--- | :--- |
| Hero | `public/assets/images/hero-roaster.jpg` (or poster of `public/video.mp4`) | AI roastery with a bearded man and a Blue Train vinyl record |
| Photo + lot split | `public/assets/images/roastery-pour.jpg` | AI "hands cupping coffee" |
| Lot grid | `lot-dhaka-daily.jpg`, `lot-espresso-no-1.jpg`, `lot-uraga-natural.jpg`, `lot-las-nubes.jpg` | 1 AI mockup, 3 bordered text placeholders |
| Brown band | `public/assets/images/founder-zarif.jpg` | the hero image, repeated |
| Blue band | `public/assets/images/roastery-drum.jpg` | no image at all |

---

## Execution order

Run the eight passes **one at a time**, each on the desktop screen, calling `edit_screens` with a single
named defect. Do not batch them. After each, download the screenshot and confirm the named defect
is gone before starting the next.

If `edit_screens` times out, poll `get_screen`; do not fire a duplicate.

---

### Pass 1 — Hero frame

> The hero is currently a photograph bleeding to all four viewport edges on a cream page. Rebuild
> its frame: the hero section's ground becomes peach `#FEBF6F`, with a uniform 15px inset on all
> sides. Inside that inset sits the video/photo at a 22px border radius — not 8px. Keep the cream
> wordmark top-left inside the frame. Everything else in the hero stays as it is.

**Passes when:** a peach border of equal width runs down the left, right and top of the hero, and
the media inside it has visibly rounder corners than the cards below.

---

### Pass 2 — Header zones

> Rebuild the header as four zones divided by thin vertical rules. Left to right: the wordmark
> (231px), the nav group `LOTS` `WHY TUESDAY` `TASTING ROOM` `BREW GUIDES` `FAQ` (595px), a
> `SEARCH` label zone (332px), and `CART ｜ 0` (211px). Draw a full-height 1px vertical rule in
> `#E6DAD4` between each zone, and keep the 1px `#E6DAD4` rule along the bottom. Nav labels stay
> DM Mono, uppercase, 14px, 0.7px letter-spacing, 12px padding.

**Passes when:** three vertical hairlines visibly divide the 69px header into four blocks.

---

### Pass 3 — Hero photograph

> Replace the hero photograph. Use the attached `hero-roaster.jpg` exactly as supplied: a real
> roastery interior in warm light. Keep the same crop height, keep the 22px border radius set in
> the previous pass, keep the cream wordmark "Day Three" in the top-left at its current size. The
> photograph must contain
> nothing that is not in the supplied file: no vinyl record, no turntable, no chalkboard menu
> lettering, no additional people. Do not regenerate or re-render the image.

**Passes when:** the hero is the supplied photo; no turntable or record appears anywhere.

---

### Pass 4 — Lot grid packshots

> In the four-column lot grid, put a real packshot in every card's media well. Use the four attached
> images in this order, left to right: `lot-dhaka-daily.jpg` (Dhaka Daily), `lot-espresso-no-1.jpg`
> (Espresso No. 1), `lot-uraga-natural.jpg` (Uraga Natural), `lot-las-nubes.jpg` (Las Nubes).
> Every media well keeps the beige `#F6EDE3` fill, the 8px radius and the same height across all
> four cards. Remove every bordered rectangle that contains the product name as text — there must be
> no text placeholders left in the grid.

**Passes when:** four distinct photographs sit in four wells of equal height, and the grid contains
zero boxes with a product name typed inside.

---

### Pass 5 — Card alignment

> In the lot grid, make the four cards align on every row. The notes line gets exactly one line of
> text in every card (truncate with an ellipsis where needed, never wrap). The gauge row, the roast
> meter row and the QUICK VIEW button must all start at the same vertical position in all four
> columns.

**Passes when:** a horizontal line drawn through any one card's roast meter crosses all four.

---

### Pass 6 — Card instruments

> Replace the pie-chart gauges in the lot cards with the reference's small dial gauges: a circle with
> a single arc indicator, 16px, 1.5px line weight, brown `#522C25`, with a 9px DM Mono uppercase
> label underneath reading SWEETNESS, ACIDITY, COMPLEXITY. Replace the three-segment rounded roast
> bar with a two-segment bar: a brown filled segment whose length encodes the level plus a short
> darker cap, square ends, no rounded corners. Put the roast name above the bar, not beside it.

**Passes when:** no circular pie charts remain, and each roast bar has exactly two segments with
square ends.

---

### Pass 7 — Blue tasting-room band

> Rebuild the dusty-blue `#89B4CA` tasting-room band as a two-column split, not centred text. Left
> column, 55%: the attached `roastery-drum.jpg` at 8px radius, full column height. Right column,
> 45%: left-aligned content — a cream serif heading "Tasting room in Banani.", the address and hours
> in brown inclusive sans, and one brown-filled "GET DIRECTIONS" button with square-ish 2px corners.
> Nothing centred. No feature chips, no icon row.

**Passes when:** the band has a photograph and its text is left-aligned.

---

### Pass 8 — Mobile companion

Only after passes 1–7 hold on desktop. Apply the same seven changes to the mobile screen, then confirm
one column, no horizontal scroll, media wells square-ish at full width.

---

## Verification — binary, not opinion

1. Download the HTML for the edited screen. **Grep it for `aida-public`.** Any hit means a generated
   image survived; that pass failed. The count must be **0**.
2. Count unique image URLs: must be **≥ 5** (hero, split, 4 packshots, brown band, blue band —
   the same file may legitimately appear once per band).
3. Re-run the token checks: seven hexes only, 0 shadows, 0 gradients, radii ⊆ {8, 4, 2}.
4. **Composition check, by eye against `reference-homepage-1440.jpg`:**
   - hero has a peach frame of equal width on left/right/top — sample the pixel, expect `#FEBF6F`
   - header shows three vertical hairlines dividing four zones
   - every colour band runs edge to edge; every photograph inside one is inset and rounded
5. Screenshot at 1440 and place it beside
   `docs/references/little-amps/reference-homepage-1440.jpg`.

Report: screen link, screenshot, exported HTML, the `aida-public` grep result, and any pass that did
not land — named, with what it produced instead.
