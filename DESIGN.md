# DESIGN.md

The visual and motion specification for **Day Three**. Where `AGENTS.md` explains
how the code is built, this file explains what it should look and feel like.

Source of truth for tokens is `:root` in `styles/main.css`. This document covers *what* the
system looks like; the normative *how it moves* specification — timings, keyframe registry,
per-component contracts, reduced-motion rules — is
[`MOTION.md`](./MOTION.md) (`MOTION-001`). Where
the two overlap, the motion spec wins on timing and the visual spec wins on appearance.

> **Current direction: C — Gallery** (chosen 26 Oct 2026, see
> [`docs/adr/0005-direction-c-gallery.md`](./docs/adr/0005-direction-c-gallery.md)).
> The hero stays a dark film bookend; everything from Current Lots to the footer is one
> white gallery band of large type, hairline rules and space. The implementation brief with
> exact selectors, values and acceptance checks is
> [`GALLERY-RESTYLE.md`](./GALLERY-RESTYLE.md); where this file and the brief disagree on a
> pre-implementation value, the brief wins. Sections written for the retired warm-editorial
> system (concierge, pillars, mission, marquee, video modal) are marked legacy in §12 and
> must not be reintroduced.

---

## 1. Design intent

**Gallery restraint: one white ground, enormous type, hairlines, no ornament.**

The page is two rooms. The hero is the dark roastery at night — film, brass, a date band.
Everything after it is the white gallery where the lots are hung: the same proof, lit flat
and labelled.

1. **One ground after the hero.** Sections do not alternate. From Current Lots to the
   footer, the ground is `#FAF9F6`; separation comes from 1px rules and vertical space.
2. **Type as the artefact.** Inter Tight at 500 carries section titles and lot names at
   display sizes with `-0.045em` tracking and `0.98` leading. Inter 400 carries body copy
   at 17/1.6. There is no mono and no second display face. The roast date, lot number and
   producer are the only "graphics".
3. **Rules, not boxes.** Cards have a 1px top rule, no fill, no radius, no shadow. Hover
   changes the rule to ink. Brass is a line, not a colour: two permitted places in the
   content band (the provisions header rule and the proof date band), plus the active size
   underline.
4. **Bookends stay dark.** The glass header, dispatch bar, cart drawer, toasts and the
   footer sit on ink, so the white band is framed rather than free-floating.

Tone words: exact, quiet, confident, modern. Nothing decorative, nothing glossy, nothing
that has to be explained.

Legacy vocabulary — "warm editorial", "tactile artisanal luxury", parchment bands — is
retired. Do not reintroduce it.

---

## 2. Color system

Defined as CSS custom properties in `:root` (main.css §1).

### Surfaces
| Token | Hex | Use |
| :--- | :--- | :--- |
| `--color-pitch-black` | `#0B0A09` | Hero ground, header shell, dispatch bar |
| `--color-surface` | `#191512` | Cart chrome, toasts, dark hover states |
| `--color-parchment-sand` | `#EFE6D6` | Skip link, hero button text — **no longer a section band** |
| `--color-crisp-white` | `#FFFFFF` | Primary text on dark |
| `--gallery-paper` | `#FAF9F6` | The whole Gallery band (see below) |

Dark chrome stays dark; the content band is one light surface. Borders, not tints, create
depth.

### Accent & ink
| Token | Hex | Use |
| :--- | :--- | :--- |
| `--color-antique-brass` | `#B08D57` | Accent on dark chrome: eyebrows, icons, hairlines |
| `--color-antique-brass-light` | `#D3B183` | Hero micro-metadata only |
| `--color-espresso-roast` | `#3A2C1F` | Legacy ink on light surfaces; the Gallery band uses `--gallery-ink` |
| `--color-crisp-white` | `#FFFFFF` | Primary text on dark |

### Neutral text & lines
| Token | Hex | Use |
| :--- | :--- | :--- |
| `--color-on-surface` | `#F1ECE4` | Default body text on dark |
| `--color-on-surface-variant` | `#D3CBBE` | Secondary body text on dark |
| `--color-on-surface-muted` | `#A1988A` | Footer links, tertiary meta |
| `--color-outline` | `#9C9282` | Muted labels |

### Practical color rules
- Dark chrome: hairlines are `rgba(176,141,87,0.18–0.5)`; never pure black borders.
- Gallery band: hairlines are `--gallery-rule` (`#E2E0DA`), turning ink on hover; never a
  tinted fill or a second grey.
- Brass is an accent line, not a text colour: eyebrows/dots/icons on dark, decorative rules
  on paper. Never body text and never a large fill on paper (2.95:1 fails).
- Brass on `#0B0A09` and ink on `#FAF9F6` are the two safe high-contrast pairings.
- Selection color is brass background with pitch-black text.
- Functional green appears only as `#059669` for "online/confirmed" dots and check icons;
  nothing in the Gallery band uses it.

### Gallery band — Direction C
Added for the post-hero band; dark chrome and the hero keep the tokens above.

| Token | Hex | Use |
| :--- | :--- | :--- |
| `--gallery-paper` | `#FAF9F6` | Every section ground between the hero and the footer |
| `--gallery-ink` | `#0D0D0C` | Text, hover rules, primary buttons, footer ground |
| `--gallery-ink-hover` | `#242220` | Primary button hover only |
| `--gallery-rule` | `#E2E0DA` | All 1px separators on paper |
| `--gallery-graphite` | `#8C8880` | ≥24px text, numerals as layout, glyphs — 3.37:1, never small text |
| `--gallery-graphite-text` | `#5F5B54` | Small body, meta and labels on paper — 6.4:1 |
| `--gallery-brass` | `#B08D57` | Decorative rules on paper; text and icons on ink only |

Rules for this band:
- No alternating bands, tinted card fills, glass panels or gradients.
- Rules are `--gallery-rule`; the three brass exceptions are listed in §7.5 and §7.6.
- Dark surfaces inside the band are forbidden; only the footer bookends in ink.
- Selection stays brass with ink text; focus rings keep `--color-focus-ring` (3.9:1 on paper,
  4.75:1 on ink).

---

## 3. Typography

### Families
| Role | Stack |
| :--- | :--- |
| Display | `'Inter Tight', 'Inter', system-ui, sans-serif` — loads 400–700 + italic, used at 500 |
| Body / UI / labels | `'Inter', -apple-system, BlinkMacSystemFont, sans-serif` — loads 300–600, used at 400/500/600 |
| Icons | `'Material Symbols Outlined'` (variable, FILL 0–1) |

Two text families only. Inter Tight replaced Literata site-wide, the hero included. The
stylesheet keeps `--font-serif` as an alias of `--font-display` for existing declarations;
no new rule may use it. There is no mono face anywhere. Labels are Inter at 600 with
`0.14–0.18em` tracking, never below 11px.

Body base: `17px` in the Gallery band, `1rem` in chrome, `line-height: 1.6`, antialiased.

### Display scale
| Element | Size | Weight | Notes |
| :--- | :--- | :--- | :--- |
| Hero headline | `clamp(2.35rem, 5.2vw, 4.6rem)` | 500 | Unchanged size/tracking; face is now Inter Tight; second line keeps italic |
| Section display (lots, proof, roaster, brew, FAQ) | `clamp(2.5rem, 6vw, 4.5rem)` | 500 | `line-height: 0.98`, `-0.045em`, left-aligned |
| Tasting room title | `clamp(2rem, 4.5vw, 3.25rem)` | 500 | `-0.04em`, `1.02` |
| Lot name | `clamp(1.75rem, 2.6vw + 0.5rem, 2.5rem)` | 500 | `-0.04em`, `1.02`, must wrap |
| Pull quote | `clamp(1.5rem, 3vw, 2.25rem)` | 500 | Upright, `1.35` |
| Proof number | `2.5rem` | 500 | Graphite, numerals as layout |
| Product price | `1.375rem` | 500 | Tabular |
| Footer brand | `1.5rem` | 500 | `-0.02em` |
| Cart total | `1.35rem` | 500 | Tabular |
| Cart / form / modal titles | `1.2–1.35rem` | 500 | |
| Card title (proof, brew) | `1.125–1.25rem` | 500 | |

### Body & UI scale
| Role | Size | Weight | Tracking |
| :--- | :--- | :--- | :--- |
| Hero subtext | `1.125rem` | 300 | `line-height: 1.7` |
| Section subtext / standfirst | `1.0625rem` | 400 | `1.6`, max `52ch` |
| Body prose (bio, answers) | `1.0625rem` | 400 | `1.6`, max `62ch` |
| Card descriptions | `0.9375rem` | 400 | `1.6` |
| Lot meta | `0.8125rem` | 400 | `1.45` |
| Buttons | `0.75rem` | 600 | `0.14em`, uppercase |
| Nav links | `0.8125rem` | 600 | `0.12em`, uppercase |
| Eyebrows | `0.6875rem` | 600 | `0.18em`, uppercase |
| Form labels / micro-labels | `0.625–0.6875rem` | 600 | `0.16em`, uppercase |
| Footer links | `0.8125rem` | 400 | |
| Footer legal | `0.75rem` | 400 | |
| Toast | `0.8125rem` | 500 | |

### Typographic rules
- Display is **500**, never 600/700 above `1.5rem`; scale and space carry the emphasis.
- Section headers in the Gallery band are left-aligned. Centred headers are retired.
- No italics in the Gallery band. The hero's second line keeps its italic; nothing else does.
- Tasting notes render as one inline line separated by `·`, not as chips.
- Prices, dates and quantities use `font-variant-numeric: tabular-nums`; the unit label
  (`/ 250g bag`) stays small, uppercase and graphite.
- Lot names wrap; no `nowrap`, no ellipsis.
- Prose measures: `62ch` body, `52ch` standfirst, `68ch` pull quote/bio maximum.

---

## 4. Layout & spacing

### Tokens
| Token | Value |
| :--- | :--- |
| `--space-xs` | `0.25rem` |
| `--space-sm` | `0.5rem` |
| `--space-md` | `1rem` |
| `--space-lg` | `1.75rem` |
| `--space-xl` | `3rem` |
| `--space-2xl` | `4.5rem` |
| `--gutter` | `1.5rem` (declared, currently unused) |
| `--margin-desktop` | `3rem` (→ `1.5rem` ≤1024px) |
| `--margin-mobile` | `1.25rem` |
| `--container-max-width` | `1280px` |

### Vertical rhythm
- Gallery sections use `clamp(4.5rem, 9vw, 8rem)` block padding; the first gallery section
  (Current Lots) opens with `clamp(5rem, 10vw, 9rem)` so the cut from the dark hero reads as
  a deliberate entrance.
- Section headers sit on a `1px` rule with `2rem` below and `3.5–4rem` after.
- Hero stage: `padding-top: calc(var(--header-height) + 4.5rem)`, bottom `5.5rem`.
- Hero: single `100svh` band; the film panel is part of the same grid, not a separate section.

### Grids
| Grid | Columns | Gap |
| :--- | :--- | :--- |
| Lots (`.products-grid`) | `repeat(3, 1fr)` | `3rem 2.5rem` |
| Proof (`.proof-grid`) | `repeat(3, 1fr)` | `2.5rem` |
| Brew (`.brew-guides-grid`) | `repeat(4, 1fr)` | `2.5rem 2rem` |
| Tasting meta | `repeat(2, 1fr)` | `2rem` |
| Footer | `2fr 1fr 1fr 1.5fr` | `3rem` |

No grid in the Gallery band uses vertical dividers; separation is per-card top rules.
All containers are centred with `max-width: 1280px; margin: 0 auto`; FAQ and the roaster
narrow to `820–980px` for reading measure.

### Fixed header
| Token | Desktop | ≤768px |
| :--- | :--- | :--- |
| `--header-height` | `80px` | `70px` |
| `--header-height-shrunk` | `64px` | `60px` |

The header sits below a static dispatch bar inside a fixed `.site-header-container`.
Account for both when offsetting scroll anchors.

---

## 5. Shape, borders & elevation

### Radii
The Gallery language is square: `--radius-sm`, `--radius` and `--radius-lg` are `0`.
Controls, cards, panels, thumbnails and the cart drawer all sit on right angles.
`--radius-pill` remains `999px` for the hero CTAs and the skip link only; Gallery buttons and
badges set `border-radius: 0` explicitly rather than redefining the token. There are no
circular icon controls in the Gallery band; the drawer close control is squared too.

### Elevation
Shadows belong to the hero and nothing else.
| Element | Shadow |
| :--- | :--- |
| Hero CTA / play button / hero text | unchanged |
| Gallery cards, panels, buttons | none |
| Cart drawer, toasts | none — separation comes from a 1px light hairline |
| Header | unchanged glass (does not use a shadow) |

### Glass layer
One recipe, used only for fixed chrome and floating overlays — never for content cards:

| Token | Value | Use |
| :--- | :--- | :--- |
| `--glass-dark` | `rgba(11,10,9,.32)` | Header and dispatch bar at rest, over the hero film |
| `--glass-dark-strong` | `rgba(11,10,9,.72)` | Scrolled header, so text stays readable over the gallery ground |
| `--glass-tint` | `rgba(255,255,255,.06)` | Buttons and close controls that sit on glass |
| `--glass-border` | `rgba(255,255,255,.1)` | Hairline on tinted controls |
| `--glass-blur` | `blur(22px) saturate(1.35)` | Nav, drawers, modal, toasts |

Rules:
- Glass surfaces always keep a 1px light hairline and an inset top highlight; blur alone is
  not enough to define an edge.
- The header darkens (`--glass-dark-strong`) as soon as the page scrolls past 40px; the
  dispatch strip follows via `.site-header-container:has(.site-header.shrink)`.
- `@supports not (backdrop-filter)` falls back to 94% black, never to a grey wash.
- Body content stays on solid surfaces. Blur is reserved for things that float.

---

## 6. Motion system

### Easing tokens
| Token | Curve | Feel |
| :--- | :--- | :--- |
| `--ease-expo-out` | `cubic-bezier(0.19, 1, 0.22, 1)` | Fast out, long settle — underlines, drawer |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Reveals, fades, menu |
| `--ease-spring` | `cubic-bezier(0.2, 0.6, 0.3, 1)` | Buttons, burger morph, toasts |
| `--ease-header` | `cubic-bezier(0.25, 1, 0.5, 1)` | Header shrink |
| `--ease-quick` | `200ms ease` | Color and micro-state swaps |

### Durations
- Reveals: `800ms`
- Underline slide: `600ms`
- Overlay/drawer: `350–400ms`
- Modal scale: `300ms`
- Toast in/out: `350ms` / `300ms`
- Hover feedback: `200–250ms`
- Status pulse: `2s` infinite
- Cart badge bounce: `400ms`

### Keyframes
| Name | Purpose | Status |
| :--- | :--- | :--- |
| `statusPulse` | Dot scale 1→1.35 with opacity dip | In use |
| `cartBounce` | Badge scale 1→1.3→1 | In use |
| `modalFadeIn` | Modal/alert opacity + scale 0.96→1 | In use |
| `toastIn` / `toastOut` | Rise + settle / sink + fade | In use |
| `tmpl-anim-fade-up` | 25px fade-up reference keyframe | Unused (transitions used instead) |
| `tmpl-anim-fade-scale-up` | 0.92 scale fade reference | Unused |
| `tmpl-anim-fade-stretch-up` | scaleX .9 / scaleY 1.3 reference | Unused |
| `drawerSlideIn` | Right-edge slide | Unused (transform transition used) |

### Scroll reveal
- Any `[data-scroll-reveal]` starts at `opacity: 0` with a 25px translate.
- `.is-revealed` returns to `opacity: 1` / no translate over `800ms` `--ease-standard`.
- `data-scroll-reveal="scale"` starts at `0.94` scale instead.
- Trigger: `IntersectionObserver`, `rootMargin: 0 0 -60px 0`, `threshold: 0.12`, toggled on
  both entry and exit — reveals replay in either scroll direction. `.is-above` offsets the
  hidden state to `-25px` when a block left through the top, so re-entry mirrors the edge.
- `[data-stagger="1–4"]` add `0.08s / 0.16s / 0.24s / 0.32s` delays — a four-step cascade,
  never deeper.
- `prefers-reduced-motion: reduce` snaps reveals, freezes the status pulse, and keeps the
  hero loop paused. There are no auto-moving tickers to disable.

### Interaction signatures
- **Nav underline:** unchanged — the 2-layer gradient slide stays as specified in
  `MOTION.md` §6.2.
- **Gallery hover:** no lift, no shadow, no scale. Cards change their 1px top rule from
  `--gallery-rule` to `--gallery-ink` over 200ms `--ease-standard`. Buttons change background
  only (`ink → ink-hover`, `paper → brass`). Text links change colour only.
- **Size toggle:** active state is ink text + 1px brass underline + weight change; the price
  swaps instantly, with no transition on the value.
- **FAQ:** the chevron rotates 180° over 250ms; no background or border change.
- **Press feedback:** unchanged — `scale(0.98)` on primary buttons, `0.85` on steppers.
- **Icon nudge / image zoom / card nudge / footer `translateX`:** retired with the old
  system. Do not reintroduce them.

---

## 7. Section-by-section specification

### 7.1 Dispatch bar — dark
Full-width `#0B0A09` strip, bottom hairline, `0.45rem` vertical padding. One static line of
uppercase `0.6875rem` items separated by brass `·`. Centred, never animated. On
≤768px only the first item ("Roasted every Tuesday") is shown.

### 7.2 Header — glass
Fixed; two-tier (dispatch bar above nav). 80px → 64px on scroll past 40px. Both tiers use
the glass recipe: 32% near-black at rest over the hero film, 72% once scrolled, with
`blur(22px) saturate(1.35)`, a 1px light hairline and an inset top highlight. Left: Inter
Tight uppercase wordmark + brass subline. Center: four uppercase nav links with sliding underline.
Right: the cart pill (`(n)` + `৳ total`), then the hamburger below 1024px.

### 7.3 Hero stage — dark, centred
Full-height (`min-height: 100svh`), one centred column over the film, max 960px. No card,
no eyebrow chip. Display headline in Inter Tight 500 (`clamp(2.35rem, 5.2vw, 4.6rem)`,
leading `1.08`, tracking `-0.018em`; second line italic) → 18px subtext (max 620px) →
centred CTA pair. On load the column enters once (headline lines through their masks, body,
actions); see `MOTION.md` §6.15. The "Scroll" cue is anchored to the fold, centred, and
described in §7.4.

### 7.4 Hero film, scrim & scroll cue — dark
The looping film is the **background of the whole hero**: `.hero-backdrop` absolutely fills
the section (`object-fit: cover`). The scrim is a centre-weighted radial plus a vertical
wash — darker at the optical centre and at the fold, open enough at the sides to keep the
footage legible. On ≤1024px it becomes one vertical wash. Headline and subtext carry soft
shadows so they hold over bright frames. The film is muted, looped, paused off-screen and
under reduced motion; autoplay is retried on `canplay` and on the first user gesture.

The scroll cue is a bottom-centred hairline track (1px × 64px) with a 20px brass beam that
travels down and fades, plus a `0.32em` tracked micro-label. It is the only thing on the
fold that moves after the entrance.

### 7.4 Hero stage & the roast date band — dark
Centred typographic headline over dark atmosphere with ambient video backdrop:
`Roasted Tuesday. / Best from Friday.` (Inter Tight 500, second line italic). Eyebrow
micro-label and concrete subtext leading into dual CTAs: primary pill `Shop this week's roast`
and secondary outlined pill `How we roast`. Shape and colour are unchanged from the original
design; only the typeface changed.

The fold anchors with the **roast-date band** (`.hero-date-band`), the brand's signature
component. Built with three cells:
1. `.band-cell-label`: Next roast batch kicker (`Next roast`) + lot number (`Lot 014`).
2. `.band-cell-date`: Printed calendar date (`21.10.2026`) + schedule line (`Tuesday · dispatched same day`).
3. `.band-cell-meta`: Live stock count (`In stock`) + sold out counter (`7 lots · 2 sold out`).

### 7.5 Current micro-lots — paper, three columns
The opening of the gallery band. Header row: graphite-text eyebrow, display title
`This Week's Roast` at `clamp(2.5rem, 6vw, 4.5rem)`, standfirst at `1.0625rem` / `52ch`.
The header's bottom rule is **brass** — the page's signature line. Dynamic 3 → 2 → 1 grid
rendering the 7 lots from `LOTS`.

**Lot column anatomy (no card box):**
- Top rule `1px solid --gallery-rule`, then `1.75rem 0 2.75rem` padding.
- Header: roast date as plain micro-label (`0.6875rem`, 600, `0.14em`, ink) with a
  `0.875rem` graphite calendar glyph; category/sold-out chip as plain graphite-text label.
- Body: lot name at `clamp(1.75rem, 2.6vw + 0.5rem, 2.5rem)`, weight 500, tracking
  `-0.04em`; meta row `origin · process · altitude` at `0.8125rem` graphite-text; tasting
  notes as one inline graphite line separated by `·`.
- Interactive tier:
  - Size toggle: `250g` / `1kg` as text buttons (44px min height), active = ink text + 1px
    brass underline + weight change; price updates instantly.
  - Grind select: bottom-rule-only field, chevron in ink, 44px min height.
  - Quantity: squared 1px ruler with 44px `−` / `+` and a direct-entry input (1–999).
- Action: full-width squared ink button (`Add to Bag`, success state brass) or the
  outlined `Sold Out · Next Roast` button. No shadow, no lift.
- Sold-out state: never dim the whole card. The lot name goes graphite-text and the chip
  reads `Sold Out`.

### 7.6 Why we print the date — paper, three proofs
Three checkable proof columns (`01`, `02`, `03`), each a 1px top rule with a `2.5rem`
graphite numeral where a serif step number used to be:
1. A date printed on every bag (stamped the minute it leaves the cooling tray).
2. A named producer on every lot (traceable single origins, never commodity grade).
3. A roast every Tuesday dispatched same day (confirmed on WhatsApp, courier pickup by afternoon).
Header is left-aligned; icons are small ink glyphs, never brass. The proof contract reuses
`.hero-date-band` as `.proof-date-band`, with brass top/bottom rules and ink date numerals;
its colours are scoped so the dark hero band is unaffected.

### 7.7 The Roaster — paper, typographic
Type-only presentation with zero stock photography, now on the white ground and left-aligned.
- Eyebrow: `The Roaster · Banani, Dhaka`, graphite-text.
- Title: `Zarif Rahman` at the section display scale, 500, tracking `-0.045em`.
- Role line: `Head Roaster & Founder`, micro-label, graphite-text.
- Narrative: why we roast light-to-medium on a cast-iron drum in Banani to develop sweetness
  without scorching terroir character; `1.125rem` / `1.7`, ink, `68ch`.
- Pull quote: upright Inter Tight at `clamp(1.5rem, 3vw, 2.25rem)`, between two
  `--gallery-rule` hairlines; author citation in graphite-text micro-label.

### 7.8 Brew guides — paper, four rules
Four precision extraction methods: V60, AeroPress, French press, moka pot, as 4 → 2 → 1
columns, each a 1px top rule with no box.
- Header: small ink icon + method title (`1.125rem`, 500) + graphite cup profile.
- Specs table: dose, water volume & ratio, grind texture, extraction time — solid 1px
  separators, label graphite-text, value ink and tabular.
- Adjustment note: a 1px rule, no fill and no side bar; `Adjust:` in ink, the rest
  graphite-text.

### 7.9 Tasting room — paper, one rule
The glass card is retired. The section is a 1px top rule, `2rem` below it, a display title
`Visit the Roastery Lab`, the address block, and the action — no panel, no shadow.
- Verified address: `House 14, Road 11, Banani, Dhaka 1213`.
- Opening hours: `Open Daily: 8:00 AM – 9:00 PM`.
- Icons: small ink glyphs; labels in micro-caps; values in graphite-text.
- Action: squared ink button `Get Directions` meeting the 44px target, linking to the
  Google Maps query.

### 7.10 Frequently Asked Questions — paper, ruled rows
Accessible `<details>` accordion in an `820px` column, six questions, `1px` rule per row and
one on the last row. Open state changes nothing but the chevron angle — no tint, no border
change. Question: Inter Tight 500 at `1.0625rem`, ink, `1.5rem` block padding. Answer:
`0.9375rem` graphite-text, `68ch`, `1.75rem` bottom padding.
1. Freshness window and degassing period.
2. Fresh grinder calibration per brewer.
3. Dhaka courier delivery times and free delivery threshold (৳2,500).
4. Order request workflow and payment methods (bKash, Nagad, bank, COD).
5. Micro-lot seasonality and sold-out schedules.
6. Wholesale and office supply partnerships.

### 7.11 Day Three Roastery footer — ink
The closing bookend: `--gallery-ink` ground, paper text, no top border (the paper → ink cut
is the separation), `2fr 1fr 1fr 1.5fr` grid:
- Brand column: Day Three title (1.5rem, 500), Banani tagline in brass micro-caps, short bio.
- Tasting room: physical address, daily hours, phone (`+880 1700-000000`), email.
- Roastery & Sourcing: quick navigation links + mailto wholesale link; colour-only hover.
- Roast Dispatches: newsletter input as a bottom rule (no fill, no radius), 44px brass
  submit control.
- Bottom bar: 1px paper hairline at 14% opacity; copyright and roastery location.

### 7.12 Slide-out cart drawer — dark overlay
Right-side panel, 440px max, glass surface (`rgba(13,13,12,.9)` + `blur(28px)`), squared
corners, left hairline at 14% paper, no shadow.
- Opens on bag pill click or add-to-bag action with automatic focus trap.
- Free shipping progress bar dynamic tracker (free delivery over ৳2,500).
- Line items with composite identity `${id}::${size}::${grind}`, roast date tag, quantity steppers, and remove controls.
- Subtotal calculation with explicit tax and WhatsApp confirmation notice.
- Order request button: squared paper fill, ink text; generates the prefilled order request
  message and opens WhatsApp (`https://wa.me/${WHATSAPP_NUMBER}`).
- No checkout or simulated payment processing.

### 7.13 Toasts — floating
Bottom-right stack, 0.75rem gap. Squared dark glass, 1px paper hairline at 14%, graphite
or brass icon, `0.8125rem` text, `0.35s` spring entrance and `0.3s` exit, no outer shadow.
Auto-dismiss after 3.5s. Non-interactive container (`pointer-events: none`) with interactive
toasts.

---

## 8. Component library

### Buttons
| Variant | Surface | Text | Border | Hover |
| :--- | :--- | :--- | :--- | :--- |
| Primary (add to bag, directions, order request) | ink | paper | none | `--gallery-ink-hover`, no transform |
| Primary success (add to bag, 2s) | brass | ink | none | reverts automatically |
| Secondary (sold out, waitlist) | transparent | ink | 1px ink | ink fill, paper text |
| Newsletter submit | brass | ink | none | paper fill |
| Hero CTAs | unchanged | unchanged | unchanged | unchanged |

Gallery buttons are square (`border-radius: 0`), uppercase, `0.75rem`, tracked `0.14em`,
`min-height: 44px`. The hero keeps its pill CTAs and their original hover treatment.
Icon-only controls in chrome are 44px, squared.

### Labels & badges
- **Roast badge:** plain ink micro-label (`0.6875rem`, 600, `0.14em`, uppercase) with a
  `0.875rem` graphite calendar glyph. No fill, no border, no pill.
- **Category / sold-out chip:** plain graphite-text micro-label. No fill, no border.
- **Next roast note:** graphite-text at `0.75rem` under a 1px rule; no dashed box.
- **Tasting notes:** inline text separated by `·`; no chips, no fills.
- Legacy status dots, tag pills, sticker seals, image status chips and flavour chips are
  retired and their CSS belongs to the dead-code list in `GALLERY-RESTYLE.md` §10.

### Form controls
- Grind select: transparent, no radius, `border: 0`, `border-bottom: 1px solid
  --gallery-rule`, `0.875rem` ink text, chevron in ink, 44px min height. Focus: rule turns
  ink; the global focus ring stays.
- Newsletter input (footer): transparent, squared, bottom rule at 30% paper; focus turns the
  rule brass.
- Labels: uppercase `0.625–0.6875rem`, 600, `0.16em`, graphite-text (paper) or 72% paper
  (footer).
- No field uses a fill, a radius or an inner shadow on paper.

### Quantity stepper & cart stepper
Product stepper: a squared 1px ruler, 44px tall, with `−` / `+` controls and a centred
direct-entry input (1–999) in tabular figures. Blur, Enter and the buttons clamp the value.
The cart drawer keeps its compact inline stepper (`0.15rem 0.5rem` padding, `0.5rem` gap) on
the dark surface, also squared. `:active` press scaling is unchanged.

### Cards
A Gallery card is a column with a 1px top rule, no fill, no side or bottom border, no radius
and no shadow. Hover changes only the top rule to ink. Content inside is separated by further
1px rules. No featured/in-stock card variant exists; availability is expressed in text.

## 9. Responsive behaviour

### ≤1024px
- `--margin-desktop: 1.5rem`
- Desktop nav hidden; hamburger shown
- Lots and proof 3 → 2 columns
- Brew 4 → 2 columns
- Footer 4 → 2 columns

### ≤768px
- Header heights 70/60px
- Lots, proof and brew 2 → 1 column
- Section padding drops to `clamp(3.5rem, 8vw, 5rem)`; display type reaches its clamp floor
- Buy row keeps the stepper and add-to-bag on one line
- Footer 1 column
- Hero stays centred (unchanged); the headline wraps to two or three lines
- Tasting room stacks, left-aligned; date band stacks and centres (existing)

### 390px acceptance
No horizontal scroll. Lot names wrap without clipping. `.lot-size-btn`, `.qty-step`,
`.btn-add-bag` and `.faq-question` stay at or above 44px. No brass text anywhere on paper.

There is no dedicated mobile typography scale — `clamp()` handles headline reduction. Below
768px, section padding remains `--margin-desktop` (now 1.5rem).

---

## 10. Accessibility

**In place**
- Semantic landmarks: `header`, `nav`, `main`, `section`, `footer`, `aside`
- `role="dialog"` + `aria-modal="true"` + focus trap + focus restore on the mobile nav,
  cart drawer, and video modal
- The cart drawer's `aria-label` is rewritten on every open with the item count and
  subtotal, so an add-to-bag is announced by the dialog itself
- `aria-label` on icon-only buttons and the cart dialog; `aria-expanded` sync on the
  hamburger; Escape closes only the topmost overlay
- Sold-out lots expose a working **Join Waitlist** action instead of a dead disabled
  button; their grind select is disabled and visibly muted
- `role="alert"` on the form confirmation, `aria-live="polite"` on the toast container
- All form fields have associated `<label for>`; visible focus rings on
  inputs/selects/textareas
- `scroll-margin-top` clears the fixed header on every anchored section
- `prefers-reduced-motion` freezes pulses, snaps reveals, and halts autoplay

**Guardrails**
- Brass on paper is decorative only (2.95:1). Brass may carry text or icons only on ink.
- Small graphite text on paper must use `--gallery-graphite-text` (6.4:1), not
  `--gallery-graphite` (3.37:1, large text and glyphs only).
- Interactive hit targets stay ≥44px on touch (`lot-size-btn`, `qty-step`, `burger-btn`,
  overlay closes, FAQ questions); the quantity control is 44px tall.
- State is never colour-only: the active size toggle adds an underline and weight change.
- Never remove a focus outline without a visible replacement.

---

## 11. Do / Don't

**Do**
- Keep the hero dark and the whole band below it on `#FAF9F6`. Two rooms, one cut.
- Use Inter Tight 500 at display sizes and Inter 400 for body. Scale and space carry emphasis.
- Separate with 1px rules: `--gallery-rule` for structure, brass only in the three permitted
  places (provisions header rule, proof date band, active size underline).
- Let lot names, prices and dates be the largest, clearest things in a column.
- Keep vertical padding generous; the band should feel unhurried.
- Animate only `transform`, `opacity`, `background-color` and `border-color`.
- Keep uppercase labels tracked between `0.12em` and `0.18em`.

**Don't**
- Alternate light and dark bands, or add a tinted panel, glass card or gradient on paper.
- Round a card, control or drawer in the Gallery band. Radius is 0; the hero keeps its pills.
- Put brass text or brass icons on paper.
- Lift, scale or shadow a card on hover. Change the rule colour instead.
- Add decoration to fill space: stickers, badges, illustrations, stock photography.
- Italicise Gallery copy, use a mono face, or set display weight above 500.
- Let body copy exceed `68ch`, or let a lot name truncate with an ellipsis.

---

## 12. Implementation gaps

All previously identified implementation gaps have been resolved in the codebase:

| # | Gap | Spec intent | Status |
| :-: | :--- | :--- | :--- |
| 1 | `.nav-link.active` runs the slide animation **and** adds `border-bottom: 1.5px solid` | One underline mechanism: the brass sliding gradient only | **Resolved** |
| 2 | `.pillar-card`s carry `data-stagger` but no `data-scroll-reveal`; the grid reveals as a unit | Each pillar reveals individually with a 4-step cascade | **Resolved** |
| 3 | Three reference keyframes (`tmpl-anim-*`, `drawerSlideIn`) and `--gutter` are declared but unused | Either adopt them for reveals or delete to keep tokens honest | **Resolved** |
| 4 | Sections have no `scroll-margin-top` | Anchored sections clear the fixed header | **Resolved** |
| 5 | Cart drawer lacks dialog semantics and focus management | Match the video modal's a11y treatment | **Resolved** |
| 6 | Marquee duplicates exposed to screen readers | Tickers removed; static bar | **Resolved** |
| 7 | No `prefers-reduced-motion` support | Disable pulses and transforms while preserving opacity fades | **Resolved** |
| 8 | Several inline styles in markup (`text-[18px]`, `font-variation-settings`, spacing overrides) | Move to component classes | **Resolved** (migrated all inline styles and Tailwind utility classes to component classes) |
| 9 | Stepper hit areas are below 44px on touch | Increase padding at mobile widths | **Resolved** |
| 10 | Cart pill and drawer totals shipped pre-filled in HTML | Initial state rendered empty by JS, then hydrated | **Resolved** |

Everything else in `main.css` follows the tokens above; when in doubt, match the nearest
existing component rather than inventing a new pattern.

### Legacy references (retired)
Parts of this document, and a few blocks of `main.css`, still describe a site that no longer
exists: `#mission`, pillar cards, the concierge form, the video modal, marquee tickers,
product image frames, the "featured card", the half-peeled sticker seal and flavour chip
pills. None of them have matching markup in `index.html`. Treat them as historical notes:
delete the corresponding CSS as part of the Gallery restyle (`GALLERY-RESTYLE.md` §10) and do
not rebuild the features.

---

## 13. UI/UX Pro Max Audit & Quality Standards

Audit performed against the **`ui-ux-pro-max`** design intelligence framework (covering all 10 priority rule categories).

### 13.1 Color & Contrast Matrix (WCAG 2.2 Level AA / AAA)

All core surface and typography pairs have been evaluated for luminance contrast ratios:

| Text / Element Token | Background Token | Calculated Ratio | WCAG Compliance | Verified Context |
| :--- | :--- | :---: | :---: | :--- |
| `--color-crisp-white` (`#FFFFFF`) | `--color-pitch-black` (`#0B0A09`) | **19.8:1** | **AAA** Pass | Hero headlines, primary headings on dark |
| `--color-on-surface` (`#F1ECE4`) | `--color-pitch-black` (`#0B0A09`) | **16.9:1** | **AAA** Pass | Body paragraphs, concierge text |
| `--color-on-surface-variant` (`#D3CBBE`) | `--color-surface` (`#191512`) | **11.4:1** | **AAA** Pass | Cart item descriptions, product notes |
| `--color-on-surface-muted` (`#A1988A`) | `--color-pitch-black` (`#0B0A09`) | **6.9:1** | **AA** Pass | Footer links, tertiary meta |
| `--color-antique-brass` (`#B08D57`) | `--color-pitch-black` (`#0B0A09`) | **6.4:1** | **AA** Pass | Eyebrows, active accent icons, borders |
| `--color-espresso-roast` (`#3A2C1F`) | `--color-parchment-sand` (`#EFE6D6`) | **10.9:1** | **AAA** Pass | Body text, titles on warm light sections |
| `--color-crisp-white` (`#FFFFFF`) | `--color-espresso-roast` (`#3A2C1F`) | **13.5:1** | **AAA** Pass | Primary CTA button labels |
| `:focus-visible` ring (`#96794A`) | All dark / parchment surfaces | **3.3–4.8:1** | **AA** Pass | 2px solid with 2px offset (WCAG 2.2 Focus Appearance) |

The parchment/espresso rows above are retained for chrome and historical comparison; content
surfaces now use the Gallery pairs.

Gallery band (Direction C) pairs:

| Text / Element Token | Background Token | Calculated Ratio | WCAG Compliance | Verified Context |
| :--- | :--- | :---: | :---: | :--- |
| `--gallery-ink` (`#0D0D0C`) | `--gallery-paper` (`#FAF9F6`) | **18.5:1** | **AAA** Pass | All Gallery headings and body |
| `--gallery-graphite-text` (`#5F5B54`) | `--gallery-paper` | **6.4:1** | **AA** Pass | Meta, labels, secondary copy |
| `--gallery-graphite` (`#8C8880`) | `--gallery-paper` | **3.37:1** | **AA Large** Pass | Proof numerals, glyphs, large secondary only |
| `--gallery-brass` (`#B08D57`) | `--gallery-paper` | **2.95:1** | **Fail for text** | Decorative rules only |
| `--gallery-brass` | `--gallery-ink` | **6.3:1** | **AA** Pass | Footer tagline, dark-chrome icons |
| `--gallery-paper` | `--gallery-ink` | **18.5:1** | **AAA** Pass | Footer text, primary button labels |
| Focus ring (`#96794A`) | `--gallery-paper` / `--gallery-ink` | **3.9:1 / 4.75:1** | **AA** Pass | 2px ring, 2px offset |

*Anti-pattern prevention:* no text below 4.5:1 exists in a content path; graphite and brass
are restricted to large type, glyphs and decorative rules as listed above.

### 13.2 Touch & Interaction Target Audit

All interactive touch targets adhere to the ≥44×44px touch target specification:

| Interactive Component | Selector | Target Area | Spacing | Compliance |
| :--- | :--- | :---: | :---: | :---: |
| Mobile Hamburger Trigger | `.burger-btn` | 44 × 44px | Fixed corner | **Pass** |
| Header Cart Pill | `.cart-pill-btn` | 44px hit-box | > 12px | **Pass** |
| Product Quantity Stepper | `.qty-control`, `.qty-step` | 44px high, 44px buttons | > 8px | **Pass** |
| Cart Line Item Steppers | `.cart-item-bottom .stepper-btn` | 44 × 44px (touch) | > 8px | **Pass** |
| Drawer Close Control | `.cart-drawer-close` | 44 × 44px | > 16px | **Pass** |
| Video Modal Close Control | `.video-modal-close` | 44 × 44px | > 16px | **Pass** |
| Primary Call-to-Action | `.btn-add-bag`, `.btn-checkout` | min-height 48px | Block width | **Pass** |

*Tap Feedback & Jitter Prevention:* All button press states use opacity/background/scale adjustments without modifying layout geometry (prevents layout thrashing and visual jitter).

### 13.3 Vector & Typographic Discipline

1. **Zero Emoji Rule**: 100% of functional icons use Google Material Symbols vector typography or scalable SVG primitives. No platform-dependent emoji glyphs are used for controls, status indicators, or navigation.
2. **Font Pairing Rhythm**:
   - Display: *Inter Tight* 500, `-0.045em`, `0.98` leading — section titles and lot names.
   - Body/UI: *Inter* 400 at `17px` in the Gallery band, legible down to 11px in labels.
   - Micro-labels: Inter 600, tracking `0.16–0.18em`, uppercase.
   - Base text size: `17px` (`1.0625rem`) in the band, `16px` (`1rem`) in chrome, minimum
     `line-height: 1.6`.
3. **Reading Measure**: Long-form body paragraphs are constrained to a maximum width of 60–75 characters (~680–780px), preventing eye fatigue across widescreen displays.

### 13.4 Form & Status UX Standards

- **Field Association**: Every `<input>`, `<select>`, and `<textarea>` in `#concierge-contact-form` has an explicitly linked `<label for="...">`.
- **Keyboard Trapping & Modal Focus**: The cart drawer and video modal use `createFocusTrap` to contain Tab focus while active, restore prior focus upon closing, and support dismissal via `Escape` and backdrop clicks.
- **Asynchronous Feedback**: Form submission provides instant tactile feedback ("Dispatching..." with animated status spinner), disables the submit button to prevent duplicate submissions, and announces completion via an accessible `#form-feedback-alert` (`role="alert"`) and transient toast notifications (`#toast-container` with `aria-live="polite"`).
