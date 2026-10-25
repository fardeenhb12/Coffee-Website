# DESIGN.md

The visual and motion specification for **Aroma Coffee Co.** Where `AGENTS.md` explains
how the code is built, this file explains what it should look and feel like.

Source of truth for tokens is `:root` in `styles/main.css`. This document covers *what* the
system looks like; the normative *how it moves* specification — timings, keyframe registry,
per-component contracts, reduced-motion rules — is
[`MOTION.md`](./MOTION.md) (`MOTION-001`). Where
the two overlap, the motion spec wins on timing and the visual spec wins on appearance.

---

## 1. Design intent

**Warm editorial minimalism with tactile artisanal luxury.**

The site reads like a printed specialty-coffee journal rather than a commerce template.
Three ideas drive every decision:

1. **Section rhythm through contrast.** The page alternates deep near-black stages with
   warm parchment bands. Each swing signals a change in narrative register: dark =
   atmosphere, ceremony, origin; light = product, information, action.
2. **Serif voice, sans mechanics.** Literata carries emotion (headlines, quotes, prices,
   product names) with a screen-first, low-contrast cut that stays legible at small sizes
   and in figures. IBM Plex Sans carries body copy, forms, buttons and the small uppercase
   metadata — a humanist text face, chosen for legibility at 11–13px.
3. **Restraint in color, confidence in space.** One brass accent, generous vertical
   breathing room, hairline borders instead of heavy boxes, and a single glass layer for
   fixed chrome and floating overlays.

Tone words: reverent, tactile, slow-living, precise. Nothing should feel rushed, glossy,
startup-y, or playful.

---

## 2. Color system

Defined as CSS custom properties in `:root` (main.css §1).

### Surfaces
| Token | Hex | Use |
| :--- | :--- | :--- |
| `--color-pitch-black` | `#0B0A09` | Page base, hero, header, concierge, mission editorial |
| `--color-surface` | `#191512` | Cards on dark, modal body, cart chrome, hover states |
| `--color-parchment-sand` | `#EFE6D6` | Primary light band (provisions, forms, tasting rooms) |
| `--color-crisp-white` | `#FFFFFF` | Cards on parchment, primary text on dark |

Two darks and one light. Borders, not tints, create depth.

### Accent & ink
| Token | Hex | Use |
| :--- | :--- | :--- |
| `--color-antique-brass` | `#B08D57` | The single accent: eyebrows, status dots, icons, borders, links on dark |
| `--color-antique-brass-light` | `#D3B183` | Shipping-bar copy on dark, hero micro-metadata |
| `--color-espresso-roast` | `#3A2C1F` | Primary ink on light surfaces, dark CTAs |
| `--color-crisp-white` | `#FFFFFF` | Primary text on dark |

### Neutral text & lines
| Token | Hex | Use |
| :--- | :--- | :--- |
| `--color-on-surface` | `#F1ECE4` | Default body text on dark |
| `--color-on-surface-variant` | `#D3CBBE` | Secondary body text on dark |
| `--color-on-surface-muted` | `#A1988A` | Footer links, tertiary meta |
| `--color-outline` | `#9C9282` | Muted labels |

### Practical color rules
- Dark sections: hairlines are `rgba(176,141,87,0.18–0.5)`; never pure black borders.
- Light sections: hairlines are `rgba(60,52,44,0.15–0.25)`; never pure black borders.
- Brass is an accent only — eyebrows, dots, icons, small labels. Never body text, never
  large fills on parchment (contrast fails).
- Brass on `#0B0A09` and espresso on parchment are the two safe high-contrast pairings.
- Selection color is brass background with pitch-black text.
- Functional green appears only as `#059669` for "online/confirmed" dots and check icons.

---

## 3. Typography

### Families
| Role | Stack |
| :--- | :--- |
| Display / serif | `'Literata', Georgia, serif` — variable 200–900 + true italic 200–900, optical size 7–72 |
| Body / UI / labels | `'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif` — 300, 400, 500, 600 + italic |
| Icons | `'Material Symbols Outlined'` (variable, FILL 0–1) |

Two families only. Labels are the same sans at 600 with `0.1em` tracking — never mono, never below 11px.

Body base: `16px`, `line-height: 1.6`, antialiased.

### Display scale
| Element | Size | Weight | Notes |
| :--- | :--- | :--- | :--- |
| Hero headline | `clamp(2.35rem, 5.2vw, 4.6rem)` | 500 | `line-height: 1.08`, `letter-spacing: -0.018em`; second line italic 400 |
| Mission big quote | `clamp(2rem, 4vw, 3.25rem)` | 500 | `line-height: 1.25`; `<em>` in parchment italic |
| Concierge heading | `clamp(2.2rem, 3.5vw, 3rem)` | 600 | `line-height: 1.15` |
| Provisions title | `clamp(2rem, 3.5vw, 2.75rem)` | 600 | `-0.01em` |
| Stat value | `2.25rem` | 700 | Serif |
| Tasting room title | `1.65rem` | 600 | |
| Product price | `1.625rem` | 700 | |
| Product name | `clamp(1.4rem, 4.8cqi + 0.45rem, 1.85rem)` | 700 | `line-height: 1.2`, `-0.02em` |
| Brand title | `1.45rem` | 600 | Uppercase |
| Footer brand | `1.4rem` | 600 | Uppercase |
| Cart total | `1.35rem` | 700 | |
| Cart / form / modal titles | `1.2–1.35rem` | 600 | |
| Pillar title | `1.15rem` | 600 | |
| Service title | `1.05rem` | 600 | |

### Body & UI scale
| Role | Size | Weight | Tracking |
| :--- | :--- | :--- | :--- |
| Hero subtext | `1.125rem` | 300 | `line-height: 1.7` |
| Mission body | `1.05rem` | 300 | `line-height: 1.8` |
| Section subtitles / descriptions | `0.95rem` | 400 | |
| Concierge sub | `0.95rem` | 300 | `1.7` |
| Card descriptions | `0.8125rem` | 400 | `1.55–1.6` |
| Buttons | `0.8125rem` | 600–700 | `0.1–0.12em`, uppercase |
| Nav links | `0.8125rem` | 600 | `0.12em`, uppercase |
| Form labels | `0.6875rem` | 700 | `0.15em`, uppercase |
| Eyebrows / tag pills | `0.6875rem` | 600–700 | `0.1em`, uppercase |
| Product meta (origin) | `0.6875rem` | 600 | `0.1em`, uppercase |
| Badges | `0.625rem` | 700 | `0.18em`, uppercase |
| Micro labels (metrics) | `0.625rem` | 600 | `0.2em`, uppercase |
| Footer links | `0.8125rem` | 400 | |
| Footer legal | `0.75rem` | 400 | |
| Toast | `0.8125rem` | 500 | |
| Product flavour chips | `0.725rem` | 500 | `0.02em`, sans-serif |

### Typographic rules
- Eyebrows and micro-labels are always uppercase with wide tracking (0.15–0.3em) and are
  usually brass.
- Italic serif is the signature emphasis — used for the hero's second line, mission quote
  `<em>`, and the estate pull-quote. Don't italicise sans-serif copy. Product flavour notes
  are rendered in crisp sans-serif chip pills for optimal legibility.
- Headline line lengths are capped (~860px hero block, ~780px mission body, ~640px hero
  subtext) so the editorial measure stays short.
- Prices are serif and tabular in feel; keep them adjacent to a small uppercase unit label
  (`/ 250g Foil Degas Pouch`).

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
- Full-width bands use `--space-2xl` vertical padding (provisions, concierge, mission);
  tighter bands use `--space-xl` (pillars, tasting rooms).
- Hero stage: `padding-top: calc(var(--header-height) + 4.5rem)`, bottom `5.5rem`.
- Hero: single `100svh` band; the film panel is part of the same grid, not a separate section.
- Section headers sit on a hairline with `--space-lg` below and `--space-xl` margin after.

### Grids
| Grid | Columns | Gap |
| :--- | :--- | :--- |
| Pillars | `repeat(4, 1fr)` with 1px grid-gap as dividers | 1px |
| Products | `repeat(3, 1fr)` | `2rem` |
| Concierge | `5fr 7fr` | `3.5rem` |
| Form rows | `1fr 1fr` | `1rem` |
| Footer | `2fr 1fr 1fr 1.5fr` | `3rem` |

All containers are centered with `max-width: 1280px; margin: 0 auto`.

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
Four tokens on one scale: `--radius-sm: 9px` for controls inside a card (inputs, selects,
image frames, thumbnails), `--radius: 14px` for standard cards and panels,
`--radius-lg: 22px` for large surfaces (concierge card, tasting card, modal, cart drawer
edge), and `--radius-pill: 999px` for buttons, badges and status pills.
Status dots (`.status-dot`, `.green-dot`) and icon controls stay circular.
Radii tighten with scale: a child control never out-rounds its parent surface.

### Elevation
Shadows are soft, dark, and directional; light sections use warm-tinted shadows.
| Element | Shadow |
| :--- | :--- |
| Primary hero CTA | `0 8px 25px rgba(0,0,0,.35)` → hover `0 12px 30px rgba(0,0,0,.5)` |
| Play button | `0 12px 35px rgba(0,0,0,.6)` |
| Featured product card | `0 16px 40px rgba(60,52,44,.08)` |
| Concierge form card | `0 20px 50px rgba(0,0,0,.4)` |
| Tasting rooms card | `0 8px 30px rgba(60,52,44,.05)` |
| Cart drawer | `-10px 0 40px rgba(0,0,0,.7)` |
| Video modal | `0 25px 60px rgba(0,0,0,.8)` |
| Toast | `0 10px 30px rgba(0,0,0,.5)` |

### Glass layer
One recipe, used only for fixed chrome and floating overlays — never for content cards:

| Token | Value | Use |
| :--- | :--- | :--- |
| `--glass-dark` | `rgba(11,10,9,.32)` | Header and dispatch bar at rest, over the hero film |
| `--glass-dark-strong` | `rgba(11,10,9,.72)` | Scrolled header, so text stays readable over parchment |
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
- **Nav underline:** a 2-layer gradient at 50% width each slides across on hover and slides
  off on leave. Do not replace with a simple `border-bottom` (the current `.active` rule
  does both — see §12).
- **Hover lift:** cards and buttons translate `-1px`/`-2px` with shadow growth; never scale
  whole cards.
- **Image zoom:** product images scale `1.05` inside an `overflow:hidden` 1:1.15 frame over
  `600ms`.
- **Icon nudge:** primary CTA arrow translates `4px` right on hover.
- **Service card nudge:** `translateX(4px)` and brass border on hover.
- **Footer links:** colour to white + `translateX(2px)`.
- **Press feedback:** cart stepper buttons scale `0.85` on `:active`; the product quantity
  stepper input uses the same press treatment on its +/− controls.

---

## 7. Section-by-section specification

### 7.1 Dispatch bar — dark
Full-width `#0B0A09` strip, bottom hairline, `0.45rem` vertical padding. One static line of
uppercase `0.6875rem` items separated by brass `·`. Centred, never animated. On
≤768px only the first item ("Roasted in Banani Lab") is shown.

### 7.2 Header — glass
Fixed; two-tier (dispatch bar above nav). 80px → 64px on scroll past 40px. Both tiers use
the glass recipe: 32% near-black at rest over the hero film, 72% once scrolled, with
`blur(22px) saturate(1.35)`, a 1px light hairline and an inset top highlight. Left: serif
uppercase wordmark + brass subline. Center: four uppercase nav links with sliding underline.
Right: the cart pill (`(n)` + `৳ total`), then the hamburger below 1024px.

### 7.3 Hero stage — dark, centred
Full-height (`min-height: 100svh`), one centred column over the film, max 960px. No card,
no eyebrow chip. Serif headline (`clamp(2.35rem, 5.2vw, 4.6rem)`, leading `1.08`, tracking
`-0.018em`) → 18px subtext (max 620px) → centred CTA pair. On load the column enters once
(headline lines through their masks, body, actions); see `MOTION.md` §6.15. The "Scroll"
cue is anchored to the fold, centred, and described in §7.4.

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

### 7.5 Mission band — removed
The repeating parchment marquee was deleted. The mission statement now appears once, in
7.10; do not reintroduce a scrolling band.

### 7.6 Sourcing pillars — dark
4-up bento with 1px gaps acting as dividers, shared `--radius`. Each cell: brass icon +
tracked `01 / Origin` label, serif title, small body copy, then a footer split between a
brass micro-label and a white micro-value. Hover lifts the cell's background only.
Responsive: 4 → 2 (≤1024) → 1 (≤768).

### 7.7 Current micro-lots — parchment
Header row: brass eyebrow, serif title, muted sub, and an outlined "Find My Roast" pill
that inverts on hover. 3-up product grid; the middle card is the "featured" treatment
(white background, brass border, warm shadow) while the flanking cards are translucent
taupe with a top-left `Out of Stock` badge.

Product card anatomy: image frame (1:1.15, `--radius-sm`, hover zoom; art-directed
4:3 source at ≤768px) → status badge (top-left) + optional half-peeled Arabica sticker seal (top-right) → large bold serif
name on a single line (container-relative `clamp(1.4rem, 4.8cqi + 0.45rem, 1.85rem)`, ellipsis
safety) → small sans-serif flavour chips (`.product-notes li`) → serif price + uppercase
unit → optional grind select → hairline → quantity stepper input + full-width espresso
add-to-bag (aligned to bottom across cards via flex layout). Sold-out cards repeat the grind select in a disabled state and use a muted
waitlist pill.

Responsive: 3 → 2 (≤1024) → 1 (≤768). On mobile the header's "Find My Roast"
pill is hidden (the same destination is in the mobile nav), the in-stock lot leads,
its frame becomes 4:3 with a separate art-directed source, and sold-out lots collapse
to compact text rows (image and flavour chips hidden, waitlist pill and an Out of Stock
label retained) so the buyable lot is reached without scrolling past dead stock.

### 7.8 Concierge — dark
Two columns (`5fr 7fr`). Left: brass tag, serif heading, sub, then three service cards
(icon tile + title + body; brass border and 4px nudge on hover). Right: parchment form card.

Form card: header bar with eyebrow + serif title + green-dot status pill, two-column name/
phone row, email, inquiry select, message textarea, submit pill + "response within 4
hours" note, and a brass-tinted success alert that appears below.

### 7.9 Tasting rooms — parchment
Single centered white card, `--radius-lg`, thin warm border, soft shadow. Left: serif title
and description. Right: espresso "Book Cupping Table" pill and outlined "Get Directions"
pill. Stacks at ≤768px.

### 7.10 Mission editorial — dark
Full-bleed background photograph at `0.12` opacity behind a centered 1040px column:
brass eyebrow, large serif quote with italic second line, 1.05rem/300 body, then a
three-item stat row divided by a top hairline. Values serif 2.25rem; labels brass micro.
The first sentence (`.mission-quote-line`) holds a single line at ≥768px; the italic
second line wraps freely, and the nowrap is released below 768px.

### 7.11 Footer — darkest
`--color-pitch-black`, top hairline, `2fr 1fr 1fr 1.5fr` grid: brand column (serif uppercase title,
brass tagline, bio), labs list, provisions links, newsletter. Inputs are dark pills
with a matching brass circular submit button. Bottom bar: legal + craft line in `0.75rem`
muted text. Collapses to 2 columns ≤1024 and 1 ≤768.

### 7.12 Cart drawer — dark overlay
Right-side panel, 440px max, glass surface (82% warm black + `blur(28px)`), left hairline, `-10px 0 40px` shadow, 400ms
`--ease-expo-out` slide. Opens from the header bag pill or an add-to-bag action; the dialog
label updates with the item count and subtotal before it slides in. Header with bag icon +
serif title + circular close. Brass-tinted free-shipping banner with a 4px progress track.
Scrollable line items (72px thumb, serif name, brass calibration, mini stepper, serif line
price). Footer with subtotal row, tax note, and a full-width parchment checkout pill with a
lock icon.

### 7.13 Video modal — near-black
Backdrop `rgba(0,0,0,.9)`, no blur. Container max 900px, `--radius-lg`, scales `0.96 → 1`.
16:9 player frame with a circular close button top-right, then an info bar with serif title,
brass subtitle, and a runtime badge.

### 7.14 Toasts — floating
Bottom-right stack, 0.75rem gap. Dark pill with brass border, icon in brass, `0.8125rem`
text, `0.35s` spring entrance and `0.3s` exit. Auto-dismiss after 3.5s. Non-interactive
container (`pointer-events: none`) with interactive toasts.

---

## 8. Component library

### Buttons
| Variant | Surface | Text | Border | Hover |
| :--- | :--- | :--- | :--- | :--- |
| Primary pill | parchment | pitch black | none | white fill, `-2px` lift, deeper shadow |
| Secondary pill | glass tint | on-surface | `rgba(255,255,255,.18)` | brass border, tighter glass, `-1px` |
| Roast finder | transparent | espresso | `rgba(60,52,44,.35)` | inverts to espresso fill |
| Add to bag | espresso | white | none | pitch black fill, `-1px` |
| Add to bag (success) | brass | pitch black | none | reverts after 2s |
| Sold out / waitlist | transparent | espresso | `rgba(60,52,44,.35)` | inverts to espresso fill, `-1px` |
| Form submit | espresso | white | none | black fill, `-2px` |
| Book table | espresso | white | none | black fill, `-1px` |
| Directions | transparent | espresso | `rgba(60,52,44,.3)` | parchment fill |
| Checkout | parchment | pitch black | none | white fill, `-2px` |

All are pill-shaped (`--radius-pill`), uppercase, `0.8125rem`, tracked `0.1–0.12em`. Icon
buttons are 38px circles on dark and 36–44px for overlay close.

### Pills & badges
- **Status dot:** 6px brass circle, 2s pulse; green variant `#059669` for "on duty".
- **Tag pill:** outlined, `--radius-pill`, `0.35rem 1.15rem` padding, 0.6875rem 600 text.
- **Product status chips:** absolute top-left on the image frame (`top: 1rem; left: 1rem;`),
  `0.625rem` 600, `--radius-pill`, dark glass (`rgba(11,10,9,0.85)` + 8px blur, 1px subtle white border).
  `In Stock` includes a pulsing brass status dot; `Out of Stock` renders crisp uppercase text.
- **Half-peeled sticker seal (`.badge-peeled-sticker`):** Minimal vintage-artisanal circular badge overhanging the top-right corner of the featured card (`top: -1.75rem; right: -1.75rem; width: 140px; height: 140px; z-index: 5`). Displays "100% ARABICA" with a tactile half-curled corner exposing double drop shadow (`filter: drop-shadow(0 12px 24px rgba(30,22,14,0.35)) drop-shadow(0 2px 6px rgba(30,22,14,0.18))`), rendered in warm parchment cream with an antique brass rim. Subtle micro-interaction on card hover (`rotate(5deg) scale(1.05)` with spring ease); collapses to 96×96px (`top: -0.9rem; right: -0.9rem`) on ≤768px; frozen under reduced motion.
- **Product flavour chips:** inline-flex, `--radius-pill`, `0.25rem 0.6rem` padding, `0.725rem` 500 IBM Plex Sans text, warm translucent background (`rgba(60,52,44,0.06)`) and subtle hairline border.
- **Form status pill:** 10% espresso fill with green dot.

### Form controls
- Labels: uppercase `0.6875rem`, 700, `0.15em`, espresso, 0.4rem below the field.
- Inputs/selects/textareas: white fill on light cards, `--radius-sm`, `rgba(60,52,44,.22)`
  border, `0.75rem 1rem` padding, slight shadow.
- Focus: espresso border + `0 0 0 3px rgba(60,52,44,.12)` ring; no default outline.
- Selects: `appearance: none` with a chevron icon overlaid at `right: 0.75rem`.
- Textarea: vertical resize, `min-height: 100px`.

### Quantity stepper & cart stepper
Product cards use an editable quantity stepper: 44px `−` / `+` buttons around a centered
numeric input (`1–999`), in a hairline pill. The value can be typed directly; blur, Enter,
and the buttons clamp it. The cart drawer keeps the inline-flex stepper pill,
`0.25rem 0.85rem` padding, `0.85rem` gap; parchment-tinted on light, surface-tinted on
dark. Stepper buttons are 700-weight glyphs with `:active` scale `0.85`; the value is
centered with `min-width: 1.25rem`.

### Cards
Every card uses a hairline border and a radius, never a hard drop shadow alone. Hover
changes border colour and lifts 1–2px. Featured product cards add a white fill and warm
shadow to signal availability.

## 9. Responsive behaviour

### ≤1024px
- `--margin-desktop: 1.5rem`
- Desktop nav hidden; hamburger shown
- Pillars 4 → 2 columns
- Products 3 → 2 columns
- Concierge stacks to a single column, `2.5rem` gap
- Footer 4 → 2 columns

### ≤768px
- Header heights 70/60px
- Pillars 2 → 1, products 2 → 1
- Product grid: in-stock lot first, "Find My Roast" hidden, featured image becomes a
  separately art-directed 4:3 source; sold-out lots collapse to compact rows with their
  image and flavour chips hidden
- Form two-column row collapses to one
- Footer 1 column
- Hero stays centred; the headline wraps to two or three lines
- Tasting rooms card stacks, left-aligned

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
- Brass-on-parchment must never carry essential body text; use espresso
- Interactive hit targets stay ≥44px on touch (`stepper-btn`, `qty-step`, `burger-btn`,
  overlay closes); the product quantity uses a 44px stepper input
- Never remove a focus outline without a visible replacement

---

## 11. Do / Don't

**Do**
- Alternate dark and parchment bands; never place two light bands back to back.
- Use Literata for anything emotional or numeric-significant; sans for anything
  operational.
- Keep brass to accents and micro-labels.
- Use hairlines plus radius instead of heavy borders or nested boxes.
- Keep vertical padding generous; the page should feel unhurried.
- Animate only `transform`, `opacity`, and `filter`.
- Keep uppercase labels tracked between `0.1em` and `0.3em` — never tight, never ultrawide
  beyond `0.3em`.

**Don't**
- Introduce new hues, gradients in chrome, or neon accents.
- Put brass text on parchment for anything that must be read.
- Use sans-serif for headlines or serif for UI labels.
- Add a fifth stagger step or delays beyond `0.32s`.
- Scale whole cards on hover; only inner images.
- Add heavy shadows on light surfaces — they must stay warm and diffuse.
- Let body copy exceed ~780px measure.

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

*Anti-pattern prevention:* No gray-on-gray or low-contrast text below 4.5:1 exists in any primary or secondary content path.

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
   - Display/Emotional: *Literata* (screen-first editorial serif, low contrast, optical sizing).
   - Body/UI: *IBM Plex Sans* (humanist sans, legible down to 11px).
   - Micro-labels: the same sans at 600, tracking `0.1em`, uppercase.
   - Base text size: 16px (`1rem`) body font size with minimum `line-height: 1.6` for optimal readability.
3. **Reading Measure**: Long-form body paragraphs are constrained to a maximum width of 60–75 characters (~680–780px), preventing eye fatigue across widescreen displays.

### 13.4 Form & Status UX Standards

- **Field Association**: Every `<input>`, `<select>`, and `<textarea>` in `#concierge-contact-form` has an explicitly linked `<label for="...">`.
- **Keyboard Trapping & Modal Focus**: The cart drawer and video modal use `createFocusTrap` to contain Tab focus while active, restore prior focus upon closing, and support dismissal via `Escape` and backdrop clicks.
- **Asynchronous Feedback**: Form submission provides instant tactile feedback ("Dispatching..." with animated status spinner), disables the submit button to prevent duplicate submissions, and announces completion via an accessible `#form-feedback-alert` (`role="alert"`) and transient toast notifications (`#toast-container` with `aria-live="polite"`).
