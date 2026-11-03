# Moodboard — Day Three

Produced by running `MOODBOARD SKILL.md` against this project. Visual preview:
`moodboard.html`.

> **Decision — 26 Oct 2026: Direction C — Gallery is chosen.**
> The recommendation at the foot of this file (A) is kept as the historical record of the
> review; it is no longer the plan. C's type pairing (Inter Tight + Inter) is adopted
> site-wide, including the hero, and its layout system applies from the first section after
> the hero to the footer. See `docs/adr/0005-direction-c-gallery.md` for the reasoning and
> `GALLERY-RESTYLE.md` for the build brief.

## Inputs

| | |
|---|---|
| **Project** | Single-page site for a boutique Dhaka roastery selling dated single-origin bags to home brewers |
| **Audience** | 28–40, Gulshan/Banani/Dhanmondi, owns a V60/AeroPress, already buys specialty beans |
| **The claim** | Every bag shows its roast date. Freshness is the brand. |
| **Constraint** | No photography exists, and none will be invented. The design must stand on type, numerals, rules and colour. |
| **Adjectives** | Precise. Warm. Documentary. Quietly premium. |
| **Don'ts** | Chalkboard café clichés · latte-art stock photos · script "artisanal" serifs · dark-green-and-gold luxury · coffee-bean illustrations · cream-on-brown "warm coffee brand" wallpaper |

## The design problem

Every coffee site in Dhaka looks like a café: warm brown, a serif, a latte photo. Ours has
no photos and a claim that is *administrative* — a date, a lot number, a producer, a
process. So the design should not imitate a café. It should look like the roastery's own
paperwork: batch tickets, roast logs, lot cards. That is the only visual language where
"the date is printed" is a design decision rather than a badge.

Three directions below, ordered from biggest change to smallest.

---

## Direction A — Batch Sheet

**Intent.** The page is a batch ticket. Dates, lot numbers and producer names are the
largest things on the screen because they are the proof. Dense, exact, and warmer than it
sounds thanks to paper stock and brass.

| Swatch | Hex | Role |
|---|---|---|
| Paper | `#EFE7D9` | Background |
| Ink | `#12100D` | Text |
| Rule | `#CBBFA8` | Hairlines, dividers |
| Brass | `#B08D57` | Accent, dates, links |
| Oxblood | `#8A3B2E` | Sold out, meta, warnings |

**Type.** Display `Archivo` 700, `-0.03em` tracking. Body `Inter` 400. **Data
`IBM Plex Mono` 500 with tabular numerals** — this is the personality of the direction.

**Motifs.** Hairline rules at 1px, dotted leaders between label and value, boxed label
blocks, stamped date, tabular prices, no shadows and no rounded corners.

**What it proves.** The freshness claim is literally the typography. A visitor reads
"ROASTED 21.10" before they read a marketing sentence.

**Risk.** Dense small type must not become illegible on mobile — every data row collapses
to two lines at 390px.

---

## Direction B — Terrace

**Intent.** Warm, local, editorial. Closest to the current site: keeps the serif, pushes
the colour warmer and more confident. Reads as a Dhaka brand rather than a Scandinavian one.

| Swatch | Hex | Role |
|---|---|---|
| Ivory | `#F6EFE4` | Background |
| Ink | `#241A14` | Text |
| Terracotta | `#B0523A` | Primary accent |
| Indigo | `#22314A` | Secondary |
| Turmeric | `#C68B2C` | Highlight |

**Type.** Display `Literata` (already loaded) at 300/italic for accents. Body `IBM Plex
Sans` (already loaded). No new families.

**Motifs.** Generous leading, large pull quotes, block colour fields, soft 2px radii.

**What it proves.** Nothing in particular — it's a mood, not an argument. It relies on the
copy to carry the claim.

**Risk.** This is the most crowded aesthetic in coffee. Without photography it can read as
a template with better taste.

---

## Direction C — Gallery

**Intent.** Radical restraint. Enormous type, hairline rules, white space, no accent colour
except one brass line. The lot name *is* the design.

| Swatch | Hex | Role |
|---|---|---|
| White | `#FAF9F6` | Background |
| Ink | `#0D0D0C` | Text |
| Graphite | `#8C8880` | Secondary text |
| Brass | `#B08D57` | Single hairline accent |

**Type.** `Inter Tight` 500 at 72–96px, `-0.04em`. Body `Inter` 400 at 17/1.6. No mono.

**Motifs.** 1px rules, enormous negative space, numbers as layout, nothing decorative.

**What it proves.** Craft through restraint — confidence rather than evidence.

**Risk.** Cold, and visually similar to any premium DTC brand. Loses the "roastery" texture
entirely.

---

## Search script

Run these to collect the 8–12 references before committing.

**Dribbble** — `editorial coffee packaging` · `monospace label system` · `type-driven
landing page` · `batch ticket design`. Filter: web, typography.

**Behance** — `specialty coffee brand identity` · `roastery visual identity` · `editorial
packaging typography`. Filter: branding, packaging.

**Pinterest** — `roast log layout` · `batch ticket design` · `coffee bag label typography` ·
`swiss editorial grid`. Filter: neutral/paper palette, no photography.

**Awwwards** — `typography-driven` · `editorial` · `minimal ecommerce`.

## Anchor references (8–12)

| # | Reference | Direction | Why it's in |
|:-:|---|---|---|
| 1 | [Coffee Collective](https://coffeecollective.dk/) | A | Product as hero, one call to action, plain speech. Proves you can sell a bag with no lifestyle imagery. |
| 2 | [Onibus](https://onibuscoffee.com/) | A | Ranked lists and hairline rules turn catalogue data into layout. Closest thing to "batch sheet" done well. |
| 3 | [Klim Type Foundry](https://klim.co.nz/) | A | Specimen pages where numerals and label systems carry the whole design. Steal the discipline, not the look. |
| 4 | [Tim Wendelboe](https://timwendelboe.no/) | A / C | Extreme restraint; the coffee name does the work. The benchmark for "no decoration". |
| 5 | [Common Man Coffee Roasters](https://commonmancoffeeroasters.com/) | B | Warm editorial pacing and a value-chain diagram that earns its space. |
| 6 | [Blue Bottle](https://bluebottlecoffee.com/) | B | Spacing and restraint inside a warm palette — the safe version of Direction B. |
| 7 | [Aesop](https://www.aesop.com/) | B / C | Typographic calm and rhythm, non-coffee but the best spacing reference available. |
| 8 | [Koppi](https://koppi.se/) | C | Clean product grid, no noise, premium through omission. |
| 9 | [Kinfolk](https://www.kinfolk.com/) | B | Editorial pacing and column measure for the story sections. |
| 10 | [North End](https://www.northendcoffee.com/) | — | The local baseline, and the thing to *not* look like: thin, undefended, no point of view. |

## Recommendation (historical — superseded 26 Oct 2026)

**Direction A.** It is the only one where the brand's claim is also the visual system:
if the date is the product, the date should be the largest thing on the page. B is the safe
choice and the most crowded; C is the most elegant and the least ownable. A is riskier to
execute at mobile sizes and that risk is worth it.

Keep from the current design: the paper palette, brass, and the motion tokens. Change:
display serif → grotesque plus mono, decorative spacing → rules and data rows.

If chosen, the palette becomes new `:root` tokens in `styles/main.css` and `DESIGN.md` gets
a direction section. That is a deliberate replacement of the current token values, not an
addition alongside them.

**What was actually chosen:** C. A's batch-sheet density was judged too close to
paperwork for a storefront; C's grotesque pairing read as cleaner and more modern, and
keeping the hero as a dark film bookend preserved the atmosphere A would have flattened.
C's stated risk — coldness, and looking like any premium DTC brand — is countered with the
roast date, lot number and producer, never with ornament.
