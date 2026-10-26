# Adopt Direction C (Gallery) for the site

**Status**: accepted — 26 October 2026

The site had been built on a warm-editorial system: Literata serif, IBM Plex Sans, alternating
near-black and parchment bands, card fills, pills and 9–22px radii. Reviewed against the
category, that system made the same claim as every café site in Dhaka — warmth — while the
brand's actual proof is administrative: a roast date, a lot number, a producer. Three
directions were drafted (`moodboard.html`, `MOODBOARD.md`); A was recommended in that review.

We are adopting **Direction C — Gallery**, and its type pairing, site-wide. The hero keeps its
dark film composition as a bookend; everything from Current Lots to the footer moves onto one
`#F8F5EF` ground of large Inter Tight headings, Inter body copy, 1px rules, zero radii and no
shadows. Brass is demoted from an accent colour to a decorative line. The footer becomes an
ink plate so the page opens and closes dark.

**Considered options**: **A — Batch Sheet** — the strongest argument on paper, because it
makes the roast date the layout; rejected because its dense data rows read as an operations
dashboard rather than a storefront, and its small-type rows are the riskiest thing on the page
at 390px. **B — Terrace** — the safest and the most crowded aesthetic in coffee; without
photography it leans entirely on copy. **C — Gallery** — chosen; its cost is coldness and a
resemblance to premium DTC brands, countered with the date, lot and producer rather than with
ornament.

Two consequences are deliberate rather than incidental:

1. **Inter Tight replaces Literata everywhere**, including the hero. Keeping the serif above
   the fold and the grotesque below was tried on paper and read as two sites stapled together.
   The hero's composition, film and motion are unchanged; only the face changes.
2. **The restyle is CSS-led.** `index.html` changes by one `<link>`; `scripts/main.js` does
   not change at all. The cart, size toggles, quantity clamping and WhatsApp handoff are
   already verified and are out of scope.

The build order, exact tokens, selector-level rules and acceptance checks live in
`GALLERY-RESTYLE.md`. The risk this ADR accepts: if the CSS and that brief drift apart, the
document becomes fiction — so the last phase of the brief is syncing `DESIGN.md` to the code.
