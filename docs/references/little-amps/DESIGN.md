# Design System Inspired by Little Amps Coffee Roasters

> **Source:** <https://littleampscoffee.com/> — captured 1 November 2026 at a 1440 px viewport.
> **Method:** live DOM, compiled CSS, theme tokens and computed styles. Every hex, font size and
> measurement below was read from the running site, not estimated from a screenshot. Values marked
> "≈" are inferred from layout because no token exists.
>
> **Use:** this file is a reference specification. An agent (or Google Stitch) should be able to
> build a page in this register from this document alone. It describes the *reference*, not any
> other brand. See §13 for how to carry the skeleton across to a different roastery.

---

## 1. Visual Theme & Atmosphere

Little Amps reads as a **record shop that happens to roast coffee**. The canvas is warm paper
(`#FFF9F2`), the ink is a soft brown (`#522C25`), and the page is punctuated by three full-bleed
colour bands — brown, dusty blue, brick — that behave like album sleeves dropped between cream
spreads. Nothing is grey. Nothing is cool.

The personality comes from three things working together:

1. **A fat, tight, custom serif** for every heading ("Little Amps Serif"), set at weight 500,
   line-height 1.0, and an extreme `-0.1em` letter-spacing (at 41 px that is `-4.1px`). Words
   nearly touch. It reads like a 1970s grocery sign, not a fashion magazine.
2. **Hand-drawn mascots** — a coffee-drinking dude, a cyclist, a bird, a swan, a sun, gloved
   hands, a speech bubble — dropped in as small black line drawings next to type. They are never
   mascot *illustrations* on a plinth; they sit inline, at 120–200 px, often overlapping the end
   of a word.
3. **Photography doing the colour work.** Real shop interiors, a roaster in a plaid shirt, a hand
   holding a latte, beans in a drying bed, producers' portraits. Photos are full-bleed or large,
   8 px rounded, never tinted, never duotoned.

The layout is generous but not airy: the type is packed tight, the sections are tall, and every
product card carries a solid colour swatch (brick, mustard, blue or peach) on its one button —
so the grid itself looks like a rack of records.

**Key characteristics**

- Cream paper canvas; brown ink; **no neutral greys anywhere**
- Three full-bleed colour bands (brown → blue → brick) punctuating the cream body
- Custom serif at weight 500, `line-height: 1`, `letter-spacing: -0.1em`
- Humanist sans (Inclusive Sans) for all body copy at 16 px
- Monospace (Necto Mono) for prices, labels, buttons, badges, dates — always uppercase, `+0.05em`
- Inline colour emphasis: single words inside a brown headline switch to brick, blue or mustard
- One solid accent fill per card, cycling through the palette
- Line-art mascots, small, placed at the edges of type blocks
- 8 px radius on every image; 2–4 px on buttons and badges; **zero shadows**
- Light/dark scheme toggle in the header (dark = `#0A0A0A` canvas, `#E7E7E8` text)

**Page rhythm**

```
video hero (full-bleed, rounded)
→ blue marquee strip
→ cream header
→ cream statement band (huge serif, coloured words, mascot)
→ cream photo + product split ("Tasty Coffee and Chill Vibes.")
→ cream product grid (4-up, colour-coded buttons)
→ BROWN subscription band (full-bleed)
→ cream wholesale split
→ BLUE wholesale band (full-bleed)
→ cream merch carousel
→ cream community board (blog grid)
→ BRICK footer band with a cream panel inset
```

---

## 2. Colour Palette & Roles

The theme exposes these as `--la-*` custom properties in `custom.css`. Use the names.

### Core

| Token | Hex | Role |
| :--- | :--- | :--- |
| `--la-cream` | `#FFF9F2` | Default page canvas, card media panels, text on dark bands |
| `--la-beige` | `#F6EDE3` | Secondary warm surface: media wells, quiet panels, hover fills |
| `--la-brown` | `#522C25` | Primary ink **and** a full-bleed band colour. Text, subscription band |
| `--la-brick` | `#C03001` | Footer band; emphasis words; one of the card button colours |
| `--la-mustard` | `#C46500` | Emphasis words; card button colour; subscription accents |
| `--la-peach` | `#FEBF6F` | **Hero frame ground**; card button colour; soft highlight |
| `--la-blue` | `#89B4CA` | Announcement marquee, wholesale band, card button colour; emphasis words |

### Dark scheme

`data-scheme="dark"` swaps the canvas, not the accents:

| Token | Value | Role |
| :--- | :--- | :--- |
| background | `#0A0A0A` (also `#1E1E1E` for raised) | Dark canvas |
| foreground | `#E7E7E8` | Text |
| border | `#383639` | Hairlines |
| accents | unchanged | Brick / mustard / blue / peach keep their meaning |

### Measured contrast

| Pair | Ratio | Verdict |
| :--- | :--- | :--- |
| Brown `#522C25` on cream `#FFF9F2` | 11.50:1 | AAA |
| Brown on beige `#F6EDE3` | 10.39:1 | AAA |
| Cream on brown | 11.50:1 | AAA |
| Cream on brick `#C03001` | 5.48:1 | AA |
| Brown on blue `#89B4CA` | 5.41:1 | AA |
| Brown on peach `#FEBF6F` | 7.39:1 | AAA |
| Cream on mustard `#C46500` | **3.86:1** | **Fails** — mustard fills must take brown text |

### Rules

- **Never invent a fifth accent.** The palette is exactly these five plus cream/beige/brown.
- **No gradients.** Banding is flat colour, edge to edge.
- **No shadows, no glass, no blur.** Depth comes from photography and flat bands.
- One accent fill per component. A card gets one coloured button, not a coloured button plus a
  coloured badge plus a coloured border.
- Borders are 1 px `--la-brown` at 20–100% opacity. The grid uses `1px` dividers, not card strokes.
- The footer is the only place a colour band contains a *panel*: brick ground, cream rounded panel.

---

## 3. Typography Rules

### Families

| Role | Family | Notes |
| :--- | :--- | :--- |
| Display / headings | `"Little Amps"` | Proprietary serif, weight 500. Every `h1`–`h3`, `h5`, product name, blog title, cart item name. |
| Body | `"Inclusive Sans"` | 400. Paragraphs, lists, marquee, form text, nav-adjacent copy. |
| Mono / utility | `"Necto Mono"` | 400, uppercase. Prices, buttons, badges, origin lines, dates, gauge labels, tags. |
| Theme fallbacks (unused visually) | DM Sans, Roboto Condensed, Roboto Mono | Loaded by the Shopify theme; overridden by the three faces above. |

### Measured hierarchy (desktop, 1440 px)

| Role | Size | Weight | Line-height | Tracking | Case |
| :--- | ---: | ---: | ---: | ---: | :--- |
| `h1` (theme) | 49.8 px | 500 | 1.0 | `-4.98px` (`-0.1em`) | sentence |
| Statement / section heading | 41 px | 500 | 1.0 | `-4.1px` | sentence |
| `h2` (band heading) | 51 px | 500 | 0.8 | `-5.1px` | sentence |
| Card title (product name) | 20 px | 500 | 1.0 | `-2px` | Capitalised |
| Body | 16 px | 400 | 17.6 px (1.1) | normal | sentence |
| Long prose | 16 px | 400 | ≈1.35–1.5 | normal | sentence |
| Price / origin / notes | 13.7 px | 400 | 1.1 | `+0.69px` (`+0.05em`) mono | price as typed, origin UPPER |
| Button label | 13.6 px | 400 | 0.85 | `+0.68px` mono | UPPER |
| Badge | 12.4 px | 400 | 0.8 | `+0.62px` mono | UPPER |
| Marquee | 12 px | 400 | 1.1 | normal | as typed |
| Gauge labels | ≈9 px | 400 | 1.0 | `+0.06em` mono | UPPER |

### Principles

- **Tight is the brand.** Headings run at `-0.1em`; body line-height is 1.1 by default. Do not
  "fix" this into comfortable editorial spacing — the density is the look.
- **The serif is always 500.** Never bold, never black. Scale carries hierarchy.
- **Italics carry emphasis inside a sentence.** The statement band is one `h1` with `<em>` spans;
  each emphasised word also changes colour. Emphasis is *both* italic and coloured, never one alone.
- **Mono is for facts.** Anything a shopkeeper would write on a label — price, origin, altitude,
  roast level, date, button — is mono uppercase with slight positive tracking.
- **No uppercase serif.** Uppercase belongs to mono only.
- **Headlines are sentences, not titles.** "Tasty Coffee and Chill Vibes." keeps its full stop.
  "Got a Coffee Shop? Need Coffee in Bulk?" keeps both question marks.

---

## 4. Layout, Spacing & Grid

| Token | Value | Notes |
| :--- | :--- | :--- |
| Root font-size | `10px` | The entire theme is rem-based off this |
| Container | full width, `36px` gutters | Content spans the viewport (theme token caps at `1600px` on ultra-wide); no centred column |
| Section spacing | `160px` desktop / `50px` mobile | `--spaced-section` |
| Grid | 4-up at 1440, 2-up tablet, 1-up mobile | Product cards ≈288 px wide at 1440 |
| Card separators | `1px` vertical rules between columns | No card borders, no fills behind text |
| Hairline colour | `#E6DAD4` | Header zone dividers, header bottom rule — brown at ~10 % on cream, never the brown ink itself |
| Media radius | `8px` | Every image, video and media well — **except the hero video wrapper, which is `22px`** |
| Button radius | `2px` | Nearly square; the mono label does the work |
| Badge radius | `4px` | Small colour chips |
| Shadows | none | Anywhere |

**Section anatomy.** Each band is either cream (default) or a full-bleed colour. Inside a band,
content sits in a two-column split (≈50/50 or 60/40) or a 4-up grid, with generous vertical
padding and a single 1 px rule under the header row when the section has a heading.

**Rules**

- Colour bands are **full-bleed** and always span the viewport; the rounded photo/panel sits inset
  by the 36 px gutter, with an 8 px radius.
- Text does not sit on photography except for one statement ("Tasty Coffee and Chill Vibes.") and
  the footer's instagram strip.
- Never stack two colour bands back to back; a cream section always separates them.
- Keep 4-up grids honest: same media height, same title baseline, buttons aligned bottom.

### 4.1 Composition checks — the things tokens cannot catch

A page can use the exact palette, faces and radii and still not look like the reference. These five
geometric facts carry most of the resemblance, and each has been got wrong at least once:

1. **The hero is framed, not bled.** Peach ground, 15 px inset, 22 px radius. A full-bleed dark
   video on cream is a different design.
2. **The header is segmented.** Four zones, full-height 1 px `#E6DAD4` vertical rules. A flat bar
   with one nav row is a different design.
3. **Band edges alternate on purpose.** Colour bands bleed edge to edge; media inside them is inset
   by the 36 px gutter and rounded. Never a rounded colour band, never a bleeding photograph on a
   cream band without its own frame.
4. **One idea per band.** If a band needs two headings to describe it, it is two bands.
5. **Type sits flush-left in bands.** The only centred things on the page are the notice strip and
   the footer legal line.

---

## 5. Section-by-Section Specification

### 5.1 Hero — video inside a peach frame

Measured, 1440 px viewport:

- The hero **section ground is peach `--la-peach` `#FEBF6F`**, with a uniform **15 px inset** all
  round. The peach reads as a picture frame, not as a band.
- Inside it, a cream wrapper (`--la-cream`) holding the `<video>` (muted, autoplay, loop, 720p) at
  **22 px radius** — the one element on the site whose radius is not 8 px. Video is 1410 × 720;
  the whole hero is 750 px tall.
- Overlaid top-left: the wordmark lockup as one SVG (`hero-little-amps.svg`, 600×242) — "Little
  Amps / Coffee" on two lines in the display serif, plus a line-art box-of-amps mark to its right.
  Peach on the dark footage. No headline text, no subhead, no buttons, no scroll cue.
- The film itself: hands working the cooling tray of a drum roaster, warm amber, slow motion. It is
  the only place the site goes dark.
- No scrim gradient. The footage is dark enough on its own.

### 5.2 Announcement marquee

- Full-bleed strip, **32 px tall**, `--la-blue` ground, brown text at 12 px.
- One message, one line, sentence case:
  `save 15 % off amps gear with discount code "FIFTEEN" through Sunday`
- Sits directly under the hero and above the header. Static on the reference — no marquee
  animation, no close button. It reads as a shop notice, not a promo ticker.

### 5.3 Header — four zones divided by hairlines

- 69 px tall, transparent over the cream page, **1 px bottom rule in `#E6DAD4`** (a warm pale pink,
  not the brown ink — it is brown at roughly 10 % on cream).
- The bar is **segmented into four zones by full-height 1 px vertical rules in the same
  `#E6DAD4`**. This segmentation is the header's whole character; without it the header reads as a
  generic nav bar.

  | Zone | Width at 1440 | Content |
  | :--- | ---: | :--- |
  | Wordmark | 231 px | the hand-lettered outline logotype `little amps coffee` |
  | Menu | 595 px | `SHOP ⌄`, `ABOUT ⌄`, `WHOLESALE`, `COMMUNITY BOARD`, `CONTACT` |
  | Middle | 332 px | `SEARCH` |
  | Right | 211 px | `ACCOUNT ⌄`, `CART ｜ 0`, light/dark toggle |

- Nav and utility labels: **Necto Mono 14 px uppercase, `letter-spacing: 0.7px`, `padding: 12px`**.
  Chevrons on the two dropdowns only.
- No CTA button in the header. No search field until it is opened.
- Mega-menu opens as a full-width clipped panel with 1 px column rules.
- The header wordmark is a **different asset** from the hero lockup: hand-drawn outline lettering,
  not the serif. Two lockups, two jobs.

### 5.4 Statement band — the site's signature move

- Cream ground, 40 px top/bottom padding, 1 px bottom rule.
- Left, 80% width: one `h1` at 41 px set as a *sentence* with inline emphasis:

  > At *Little Amps Coffee* we're on a never ending quest for the perfect tone, constantly
  > *sourcing and roasting* the *best specialty coffees* we can find and serving them to
  > *our community* in *Harrisburg, Pa* and beyond!

  Emphasis words are italic **and** coloured: brick, blue, mustard, brick, blue — cycling in reading
  order. The base text stays brown.
- Right, 20%: a 120–160 px line drawing (`Coffee_Dude_Pop_Up`) of a character sipping coffee.
  On hover the drawing swaps to a second pose (`hover-2`) over 0.3 s. No movement otherwise.
- This band replaces a traditional hero headline. It is the voice of the brand in one sentence.

### 5.5 Photo + product split

- Two columns, no gap beyond the 1 px rule between them.
- Left (≈72%): a full-bleed lifestyle photo (hand holding a latte, cake on a table), 8 px radius,
  with the line "**Tasty Coffee and Chill Vibes.**" in cream serif overlaid top-left, and a small
  line-drawn cyclist placed inline after "Vibes."
- Bottom-left of the photo: a `SHOP ALL` mono button. Bottom-right: `01 — 02` slider counter and
  two square arrow buttons.
- Right (≈28%): the first product card on cream, vertically centred.

### 5.6 Product grid — the core component

4-up grid, cream ground, vertical 1 px rules between columns. Each card, top to bottom:

1. **Media well**: `--la-beige` rounded square (8 px) containing the bag packshot at ~55% height.
   Two images exist per product; hover swaps to the second bag size over 0.3 s.
2. **Name** in the serif, 20 px, brown, capitalised ("Friend Blend").
3. **Price** right-aligned on the same line: `From Tk 2,600.00` in 13.7 px mono.
4. **Origin** line: `COLOMBIA, ETHIOPIA` — mono uppercase 11 px, brown at 70%.
5. **Gauges**: three tiny line-art icons in a row (`Sweetness`, `Acidity`, `Complexity`), each a
   circular dial whose fill indicates level, with a 9 px mono label under each. Optional second row
   for complexity.
6. **Notes**: `Notes: Caramel, Citrus, Milk Chocolate` in 13 px sans.
7. **Roast meter**: the roast name (`Medium Roast`) above a two-segment horizontal bar — a filled
   accent segment in the card's colour whose length encodes the level, plus a short brown cap.
8. **One solid button**: `QUICK VIEW`, 2 px radius, mono 12 px uppercase, in one of four colours —
   `--la-brick`, `--la-mustard`, `--la-blue`, `--la-peach` — cycling across the grid. Text colour
   flips for contrast (cream on brick, brown on the rest).

No star ratings, no "sale" banners except the small circular seal that some bags carry, no wishlist
hearts, no hover lift, no shadow.

### 5.7 Subscription band — brown

- Full-bleed `--la-brown`, cream text, 160 px padding.
- Eyebrow `COFFEE SUBSCRIPTION` in mono 12 px cream at 70%.
- Heading "Amp Up Your Mornings" at 51 px cream serif.
- One short paragraph, `max-width: 46ch`, cream.
- Two product cards (cream media wells, serif titles, mono prices) and a `SHOP SUBSCRIPTIONS`
  mono button on the band.

### 5.8 Wholesale — blue

- Full-bleed `--la-blue` band with 36 px inner gutter.
- Left: a full-height roastery photo, 8 px radius (roaster in an orange drum machine).
- Right: a cream panel, 8 px radius, containing:
  - `WHOLESALE` mono eyebrow
  - "**Got a Coffee Shop?** / **Need Coffee in Bulk?**" at 41 px, first line in brick, second in
    brown — a two-line heading where colour carries the turn
  - one paragraph, ≈60 ch, brown
  - `GET IN TOUCH` mono button, brown fill, cream text, aligned bottom-left with space above

### 5.9 Merch carousel

- Cream ground. Heading "Rep the **Home Team**!" — "Home Team" in mustard — with a small bird
  drawing inline after the exclamation mark.
- Two square arrow buttons top-right, cream with brown 1 px borders.
- Product cards as §5.6, 3–4 visible, horizontal scroll on mobile.

### 5.10 Community board

- Cream ground. Heading "Community Board:" in mustard serif, second line
  "What's Happening in Our World" in brown.
- 4-up grid of blog cards separated by 1 px rules:
  - 8 px rounded photo (4:5 or 1:1)
  - date `06.08.2026` and optional tag `COFFEE` in mono 11 px, separated by `|`
  - title in serif 20 px, two lines
  - 3-line excerpt, 13 px sans, truncated with ellipsis
  - `READ MORE` mono button in a rotating accent colour
- No author avatar, no read-time, no category filters.

### 5.11 Footer — brick

- Full-bleed `--la-brick` band, 36 px gutter, 60 px top padding.
- Inside it, one **cream rounded panel** (8 px) containing:
  - the large wordmark SVG
  - `VISIT US` mono eyebrow, two addresses in sans, phone/email, two social icons
  - `Company` / `Shop` link columns in mono uppercase
- Beneath the panel, still on brick: a full-width strip of square instagram photos, edge to edge,
  no gaps.
- Overlapping that strip at the left: a line-drawn speech bubble reading
  `FOLLOW US ON THE 'GRAM`.
- Legal line at the very bottom: `© 2026 LITTLE AMPS COFFEE` left, `SITE CREDITS` right, 11 px
  mono, cream.

---

## 6. Component Library

### Buttons

| Property | Value |
| :--- | :--- |
| Shape | rectangle, 2 px radius |
| Fill | one flat palette colour |
| Border | 1 px brown (only when the fill is cream) |
| Label | Necto Mono, 13.6 px, uppercase, `+0.05em` |
| Padding | ≈10 px 14 px |
| Hover | fill darkens one step; no lift, no shadow |
| Icon | none, or a 12 px line glyph before the label |

Variants are colour variants, not size variants. There is no "ghost" button except on the footer
panel.

### Badges / seals

Small circular seal (e.g. "NEW", "STAFF PICK") in blue or brick, mono 12.4 px uppercase, or the
round roast sticker printed on the bag art. Never a pill, never a ribbon.

### Gauges

Three per product: Sweetness, Acidity, Complexity. A 16 px line-art dial with 1–3 filled segments,
label underneath in 9 px mono uppercase. Implemented as small images on the reference; in code they
should be inline SVG so they inherit colour.

### Roast meter

Two segments, total width of the card column: a filled brown bar (level) and a 24 px darker cap.
Label above in 11 px mono: `Light Roast` … `Dark Roast`.

### Cards

No card container. The "card" is a column: media well, type, meter, button. Separation comes from
the grid's 1 px rules and vertical space.

### Forms

Square-ish fields, 1 px brown border, cream fill, mono label above, no floating labels, no rounded
pills. Newsletter pop-up uses an orange filled button and a small character illustration.

---

## 7. Illustration & Asset Language

The drawings are the brand. They are all **single-weight black/brown line art**, no fills, no
shading, roughly 120–220 px, and they are placed where a person would doodle on a menu:

| Asset | Where |
| :--- | :--- |
| Coffee-drinking character (two poses) | statement band, right of the `h1`, hover swap |
| Cyclist | inline after "Vibes." in the photo statement |
| Bird | inline after "Rep the Home Team!" |
| Swan | community board heading |
| Sun | subscription band |
| Gloved hands / amps | wholesale section, beside "Rep the Home Team!" |
| Speech bubble "FOLLOW US ON THE 'GRAM" | footer, overlapping the instagram strip |
| Roast seals, gauge dials | product cards |

**Rules**

- One drawing per block, never a cluster.
- Drawings may overlap type or sit half-off a band edge. They never sit in a frame, never get a
  caption, never animate beyond the hover swap.
- No emoji, no icon-library glyphs (Heroicons/Lucide) as decoration. Utility icons (arrows, search,
  cart) may be simple line icons; everything expressive is drawn.
- Photography is documentary: shop interiors, staff, producers, hands, beans. Warm white balance,
  visible grain, no studio white sweep, no stock-photo smiling.

---

## 8. Motion & Interaction

| Interaction | Behaviour |
| :--- | :--- |
| Statement mascot | cross-fade to second pose on hover, `0.3s ease` |
| Product media | cross-fade to second packshot on hover, `0.3s ease` |
| Marquee strip | static — no animation on the reference |
| Sliders | square arrow buttons; `01 — 02` counter; native horizontal scroll on touch |
| Mega-menu | clip-path reveal, ≈1s `cubic-bezier(.23,1,.32,1)` |
| Drawers (cart, menu) | slide + clip-path, ≈1s, overlay fade |
| Scroll | cross-document smooth scrolling; **no scroll-reveal or parallax observed** |

No fade-up-on-scroll, staggered entries or hover lifts were observed. Motion is
reserved for things that open, swap, or scroll.

`prefers-reduced-motion: reduce` stops the marquee and the swaps; nothing else depends on motion.

---

## 9. Voice & Copy

- **First person plural, warm, a little goofy.** "we're on a never ending quest for the perfect
  tone"; "Tasty Coffee and Chill Vibes."; "Sometimes you just need to play the hits."
- **Music metaphors, used sparingly.** Tone, amps, hits, sessions, playlists. One per screen, not
  one per sentence.
- **Sentence case with real punctuation.** Headlines keep full stops and question marks.
- **Specific over poetic.** "133 State Street, Harrisburg, PA", "14 years of sourcing, roasting and
  serving experience", "From Tk 2,600.00".
- **Short.** Body paragraphs are 2–3 sentences. The longest copy on the homepage is a blog excerpt.
- **No superlatives.** No "world-class", "artisanal", "curated", "elevated".

---

## 10. Anti-Patterns — What Instantly Breaks This Look

These are the failure modes that make a page read as generated rather than designed:

1. **A second display face.** Epilogue/Inter/Space Grotesk headings kill it. The serif *is* the
   brand.
2. **Loose tracking or airy leading.** `-0.1em` and `line-height: 1` are load-bearing.
3. **Neutral greys and cold whites.** Every neutral in this system is warm cream or beige.
4. **Material-3 style tokens** (surface-container-high, on-surface-variant) — the palette is seven
   named colours, not a 30-token tonal ramp.
5. **Card containers with borders, fills, radius and shadow.** Cards are columns with rules.
6. **Pill buttons and pill chips.** Buttons are near-square rectangles; labels are mono.
7. **Stat strips, filter chips, feature-chip rows, timeline cards, badge clusters.** The reference
   has none of these.
8. **Emoji as icons** (🌱 🎵) inside headings — draw a mark instead.
9. **Marketing sections invented to fill space** (three-card "journal" rows, newsletter bars,
   "Why choose us" grids). One idea per band.
10. **Gradient scrims over photography**, glassmorphism, backdrop blur.
11. **Illustration as hero art.** The drawings are marginalia, not centrepieces.
12. **Explaining the product in paragraphs.** Prices, origin, gauges and notes are set as data.

---

## 11. Fonts & Assets — Substitution Notes

The three faces are proprietary/commercial. When rebuilding without licences:

| Reference face | Free substitute | Why |
| :--- | :--- | :--- |
| Little Amps Serif (display) | **Fraunces** (opsz 144, wght 500, `SOFT` 0) or **DM Serif Display** | Fat, warm, slightly wonky serif that survives `-0.06em` tracking |
| Inclusive Sans (body) | **Inclusive Sans** (Google Fonts — the real face is free) | Identical |
| Necto Mono (utility) | **DM Mono** or **Space Mono** | Uppercase labels with a little quirk |

If Fraunces is used, reduce tracking to `-0.06em`; Fraunces is wider than Little Amps Serif and
`-0.1em` will collide.

The line drawings are custom to the brand. Any rebuild needs its own set of 6–10 single-weight
marks in the same register (one idea each: a person, an animal, an object, a speech bubble).

---

## 12. Ready-to-Use Prompt Block (for Stitch or any UI generator)

> Build a warm indie coffee-roastery homepage that looks like a record shop, not a SaaS product.
>
> Canvas `#FFF9F2`, ink `#522C25`, accents `#C03001` (brick), `#C46500` (mustard), `#FEBF6F`
> (peach), `#89B4CA` (dusty blue). No greys, no gradients, no shadows.
>
> Headings: a fat warm serif (Fraunces 500), line-height 1.0, letter-spacing −0.06em, sentence case,
> real punctuation. Body: Inclusive Sans 16px. Prices, labels, buttons and dates: DM Mono uppercase
> 13px with +0.05em tracking.
>
> Layout, in order: muted roastery video inset 15px inside a peach #FEBF6F frame at 22px radius,
> wordmark top-left →
> 32px blue strip with one short notice → 69px cream header with mono nav and a
> `CART 0` link → cream statement band with one long serif sentence where single words turn italic
> and switch to brick/blue/mustard, plus a small black line drawing of a character drinking coffee
> on the right → photo + product split captioned "Tasty Coffee and Chill Vibes." with a tiny line
> cyclist → 4-up product grid separated by 1px rules, each card a beige rounded packshot well, serif
> name, mono price and origin, three tiny line-art gauges (Sweetness, Acidity, Complexity), a notes
> line, a two-segment roast bar, and one solid near-square button (`QUICK VIEW`) → full-bleed brown
> subscription band → cream wholesale split → full-bleed dusty-blue wholesale band with a cream
> rounded panel → cream merch carousel → cream community board of 4 blog cards → brick footer band
> containing a cream rounded panel plus a gap-free instagram strip and a drawn speech bubble.
>
> Use real photography, never illustrations as heroes. Use 1px rules instead of card borders. One
> accent fill per card, cycling the palette. No stat bars, no pills, no badge clusters, no emoji, no
> scroll-reveal animations.

---

## 13. Carrying the Skeleton to Another Brand

Little Amps' structure survives a brand swap; its props do not.

| Reference | Swap for |
| :--- | :--- |
| Harrisburg, PA addresses | the new roastery's real address |
| `quest for the perfect tone` / amp metaphors | the new brand's own one-line belief |
| Friend Blend / Into The Void / etc. | the new lot names and tasting notes |
| `Tk` prices | the local currency, same mono treatment |
| Mascots (dude, bird, swan, bike) | a new set of 6–10 single-weight line marks in the same register |
| Subscription / wholesale / merch bands | keep the band rhythm; drop any band the brand doesn't sell |
| Flavour gauges + roast bar | keep — this is the most portable, most useful device on the page |

**What must not be swapped out:** the serif/sans/mono trio, the warm cream + brown base, the
three full-bleed colour bands, the tight tracking, the 1 px rule grid, the single colour-coded
button per card, and the "one idea per band" discipline.
