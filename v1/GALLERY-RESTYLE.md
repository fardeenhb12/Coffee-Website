# GALLERY-RESTYLE — Direction C implementation brief

**Audience:** the implementing agent (Gemini) and any human reviewing the work.
**Status:** approved direction, not yet implemented.
**Authority:** this file is the normative *build* instruction for the Gallery restyle.
`DESIGN.md` describes what the result looks like, `MOTION.md` (MOTION-001) governs motion,
`AGENTS.md` governs engineering rules. Where this file and `DESIGN.md` disagree on a value,
this file wins until the CSS matches it; after that, update `DESIGN.md` and delete the duplicate.

The visual source of truth is **Direction C — Gallery** in `moodboard.html`
(the `.dir--c` block) and `MOODBOARD.md` § *Direction C*.

---

## 0. Read this before you write a line of CSS

1. Read `AGENTS.md` §6 (guardrails), `DESIGN.md` §1–§5, and `MOTION.md` §3 and §8.
2. The deliverable is **one rewritten stylesheet** (`styles/main.css`) plus **one changed
   line in `index.html`** (the font `<link>`). Nothing else.
3. Do not edit `scripts/main.js`. Do not rename, add or remove classes, IDs, `data-*`
   attributes, roles or ARIA attributes. The cart engine, size toggles, quantity clamps,
   scroll reveals and WhatsApp handoff must keep working through the restyle.
4. Do not change copy, section order, anchor IDs, metadata, JSON-LD, or the cart flow.
5. No new dependencies, no build step, no CSS preprocessor, no `@import`, no utility
   framework, no new image or icon assets.
6. Work in the phases in §11, committing after each phase. A phase is done only when every
   box in §12 passes at 390 / 768 / 1024 / 1440 px.

---

## 1. Decision

Direction C replaces the current warm-editorial system **from the section after the hero
downward**, and its type pairing — **Inter Tight + Inter** — is adopted **site-wide**,
including the hero. The hero keeps its video, scrim, layout, copy and entrance animation;
only its typeface changes.

Why: the moodboard proposed C as "the most elegant and least ownable" of the three
directions. The pairing is what makes it legible and modern; the restraint is what makes the
roast date the loudest thing on the page. Direction A's batch-sheet density was not chosen.

### 1.1 What changes, file by file

| File | Change | Allowed? |
| :--- | :--- | :--- |
| `styles/main.css` | Full restyle: tokens, type, sections 9–17, responsive, chrome | Yes — the work |
| `index.html` | Replace one Google Fonts `<link>` | Yes — one line |
| `scripts/main.js` | Nothing | **No** |
| `DESIGN.md`, `AGENTS.md`, `MOTION.md`, `BUILD-PLAN.md`, `MOODBOARD.md`, `README.md` | Already updated by this handoff; only touch if implementation deviates | Only to correct drift |
| `moodboard.html`, `design-a.html` | Review artefacts, not production | **No** |

### 1.2 Non-goals

- Not a rebuild. Same DOM, same information architecture, same copy, same content order.
- Not a new hero. The hero is the "home" being kept: same film, same composition, same
  buttons, same date band, same load choreography.
- Not a motion redesign. Timing tokens, easings, reveals, drawer and toast choreography stay
  exactly as MOTION-001 defines them (§7).
- Not a new palette for the dark chrome. The header, drawer and toasts stay dark; they lose
  their shadows and radii but keep the glass.

---

## 2. The five rules of the Gallery band

These are enforcement rules, not mood words. If a CSS decision breaks one, the decision is
wrong.

1. **One ground.** Every section between the hero and the footer sits on `#F8F5EF`. There
   are no alternating bands, no tinted cards, no glass panels in that stretch. Separation is
   done with 1px rules and space.
2. **Rules, not boxes.** No card has a border on four sides, a background fill, a radius or a
   shadow. A card is a column with a 1px top rule. Content inside is separated by further
   1px rules.
3. **Type is the image.** The section heading and the lot name do the work a photograph
   would do. There is no decorative artwork, sticker, badge or icon illustration in this
   band. Material Symbols are allowed only as small functional glyphs (calendar, map pin,
   clock, chevron) at 1.25rem in ink.
4. **Nothing rounded, nothing floating.** Every radius in this band is `0`. No `box-shadow`.
   No hover lift (`translateY`). Hover changes rule colour, underline or background only.
5. **Brass is a line, not a colour.** Brass is permitted in exactly three places on paper:
   the `.provisions-header` bottom rule, the two rules of `.proof-date-band`, and the
   underline of an active size toggle — no other brass. It is never body text, never an icon
   colour, never a fill on paper. On the ink footer and dark chrome, brass text/icons are
   allowed (§8).

---

## 3. Tokens

### 3.1 Add to `:root` (main.css §1)

```css
:root {
  /* Direction C — Gallery ground */
  --gallery-paper: #F8F5EF;
  --gallery-ink: #0D0D0C;
  --gallery-ink-hover: #242220;
  --gallery-rule: #E2E0DA;
  --gallery-graphite: #8C8880;        /* large text >=24px, rules, glyphs only (3.37:1) */
  --gallery-graphite-text: #5F5B54;   /* small secondary text, AA (6.4:1) */
  --gallery-brass: #B08D57;           /* decorative lines only on paper */
}
```

Do not delete the existing `--color-*` tokens: the header, hero, drawer and toasts still use
them. Add the gallery set alongside them.

### 3.2 Typography tokens

```css
--font-display: 'Inter Tight', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-sans: var(--font-body);        /* was referenced but never defined — fixes .product-notes li */
--font-serif: var(--font-display);    /* compatibility alias; no new rule may use it */
```

Every existing `font-family: var(--font-serif)` therefore resolves to Inter Tight. Do not
mass-rename those declarations in this pass; the alias is deliberate, so the diff stays
reviewable and the remaining chrome usages behave identically.

### 3.3 Shape tokens

```css
--radius-xs: 0;   /* was referenced but never defined — fixes .brew-adjustment-note */
--radius-sm: 0;
--radius: 0;
--radius-lg: 0;
/* --radius-pill stays 999px: the hero CTAs and skip link keep their pill shape. */
```

The Gallery band sets `border-radius: 0` explicitly on its own buttons and badges rather than
zeroing `--radius-pill`, because the hero is not being restyled.

### 3.4 Type scale in the Gallery band

| Role | Size | Weight | Tracking | Leading |
| :--- | :--- | :--- | :--- | :--- |
| Section display (`.provisions-title`, `.proof-headline`, `.roaster-name`, `.brew-guides-headline`, `.faq-headline`) | `clamp(2.5rem, 6vw, 4.5rem)` | 500 | `-0.045em` | `0.98` |
| Lot name (`.lot-name`) | `clamp(1.75rem, 2.6vw + 0.5rem, 2.5rem)` | 500 | `-0.04em` | `1.02` |
| Pull quote (`.quote-text`) | `clamp(1.5rem, 3vw, 2.25rem)` | 500 | `-0.02em` | `1.35` |
| Visit title (`.tasting-room-title`) | `clamp(2rem, 4.5vw, 3.25rem)` | 500 | `-0.04em` | `1.02` |
| Proof number (`.proof-step`) | `2.5rem` | 500 | `-0.02em` | `1` |
| Section subtext (`.provisions-sub`, `.proof-subtext`, `.brew-guides-subtext`, `.faq-subtext`, `.tasting-room-desc`, `.roaster-bio`, FAQ answers) | `1.0625rem` | 400 | `0` | `1.6` |
| Card body (`.proof-desc`, `.brew-adjustment-note`, `.tasting-meta-item span`) | `0.9375rem` | 400 | `0` | `1.6` |
| Lot meta (`.lot-meta-row`) | `0.8125rem` | 400 | `0` | `1.45` |
| Price (`.product-price`, `.lot-price`) | `1.375rem` | 500 | `-0.02em` | `1` |
| Eyebrows (all six) | `0.6875rem` | 600 | `0.18em` | `1` |
| Labels (`.grind-label`, `.quantity-label`, `.proof-badge`, `.footer-col-heading`) | `0.625rem`–`0.6875rem` | 600 | `0.16em` | `1` |
| Buttons | `0.75rem` | 600 | `0.14em` | `1` |
| FAQ question | `1.0625rem` | 500 | `-0.01em` | `1.4` |

Rules:

- All display sizes use `--font-display` at **weight 500**. Do not use 600/700 above 1.5rem;
  the direction's confidence comes from size and spacing, not weight.
- Display copy is **left-aligned**. Remove `text-align: center` from every Gallery header
  block (`.proof-header`, `.brew-guides-header`, `.faq-header`, `.roaster-container`).
- Prose measure: `max-width: 62ch` for body text, `52ch` for standfirsts under a heading.
- Numerals: `font-variant-numeric: tabular-nums` on dates, prices and quantities.
- Remove `white-space: nowrap` / `text-overflow: ellipsis` from `.product-name`. Lot names
  must wrap at 390px.
- No italic in the Gallery band except the hero's second line, which keeps its italic.

### 3.5 Font loading (the one `index.html` edit)

Replace line 18 (the Literata + IBM Plex Sans link) with:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400..700;1,400..700&family=Inter:wght@300..600&display=swap">
```

Keep the preconnect pair and the Material Symbols link untouched. Verify in DevTools:
`Inter Tight` resolves for `h1`–`h3`, `Inter` for body, and no request remains for Literata
or IBM Plex Sans.

---

## 4. Layout and rhythm

| Property | Value |
| :--- | :--- |
| Container max width | `1280px` (keep `--container-max-width`) |
| Section vertical padding | `clamp(4.5rem, 9vw, 8rem)` top and bottom |
| Section side padding | `var(--margin-desktop)` (keep) |
| Section separator | `border-top: 1px solid var(--gallery-rule)` on every Gallery section except `.provisions-section`, which meets the dark hero with a hard cut and no rule |
| Rule colour | `var(--gallery-rule)` — never `rgba(0,0,0,…)`, never brass except §2 rule 5 |
| Header block → content gap | `3.5rem`–`4rem` |
| Grid gutters | `2rem`–`3rem`; **no vertical rules between columns** |
| Card top rule | `1px solid var(--gallery-rule)`; becomes `--gallery-ink` on hover |

The whole band should read as one continuous sheet: white ground, hairline rules, large
gaps. If two adjacent sections currently touch with two different backgrounds or two borders,
collapse them to one rule.

---

## 5. Section-by-section instructions

Apply in page order. Each subsection names the exact selectors present in the stylesheet.

### 5.1 Current micro-lots — `.provisions-section` (§10)

- `background-color: var(--gallery-paper)`; `color: var(--gallery-ink)`; no top border;
  top padding `clamp(5rem, 10vw, 9rem)`.
- `.provisions-header`: `padding-bottom: 2rem`; `border-bottom: 1px solid var(--gallery-brass)`
  (this is the page's signature brass line); `margin-bottom: 3.5rem`; align items to
  `flex-end`.
- `.provisions-eyebrow`: graphite-text; `.provisions-title`: display scale; `.provisions-sub`:
  `1.0625rem`, graphite-text, `max-width: 52ch`, `margin-top: 1.25rem`.
- `.products-grid`: `gap: 3rem 2.5rem`; keep 3 → 2 → 1 columns from §9.
- `.lot-card`: transparent ground; `border: 0`; `border-top: 1px solid var(--gallery-rule)`;
  `border-radius: 0`; `padding: 1.75rem 0 2.75rem`; `box-shadow: none`; hover changes only
  `border-top-color` to `--gallery-ink`; no transform.
- `.lot-card.is-soldout`: `opacity: 1` (0.85 fails contrast). Show sold-out state through
  `.lot-category-chip` text and a graphite-text lot name.
- `.lot-roast-badge`: strip the fill, border, radius and padding; become `0.6875rem`/600/
  `0.14em` uppercase ink text with a `0.875rem` graphite calendar glyph.
- `.lot-category-chip`: strip the fill; graphite-text, same micro-label scale.
- `.lot-next-roast-banner`: strip the dashed box; `0.75rem` graphite-text, top rule only.
- `.lot-name`: display scale above; ink; must wrap.
- `.lot-meta-row`: `0.8125rem` graphite-text; separators graphite; `margin-bottom: 1rem`.
- `.product-notes`: tasting notes become one inline line, not chips. `display: block;
  margin-bottom: 1.5rem;` `.product-notes li`: `display: inline; background: none;
  border: 0; padding: 0; color: var(--gallery-graphite-text); font-size: 0.875rem;`
  `.product-notes li + li::before { content: "·"; margin: 0 0.45em; }` (the current rule sets
  `content: none` — change it).
- `.lot-purchase-header`: `align-items: flex-end`; `margin-bottom: 1.25rem`.
- `.lot-size-toggle`: `background: none; border: 0; padding: 0; gap: 1.25rem; border-radius: 0`.
- `.lot-size-btn`: `min-height: 44px` (up from 32 — required); `padding: 0 0 0.35rem`;
  `border-radius: 0`; `0.6875rem`/600/`0.14em` uppercase; graphite-text; no background.
  Active: ink text, `border-bottom: 1px solid var(--gallery-brass)`, no fill, no shadow.
  Hover: ink text. Disabled: keep `cursor: not-allowed` and 0.55 opacity.
- `.grind-select`: `background: transparent; border: 0; border-bottom: 1px solid
  var(--gallery-rule); border-radius: 0; padding: 0.65rem 2rem 0.65rem 0; font-size:
  0.875rem; color: ink;` focus: `border-bottom-color: ink` and keep the global focus ring.
- `.select-chevron`: ink, `right: 0`.
- `.qty-control`: `background: transparent; border: 1px solid var(--gallery-rule);
  border-radius: 0; height: 44px`. `.qty-step:hover`: `rgba(13,13,12,0.04)`. `.qty-input`:
  ink, tabular.
- `.btn-add-bag`: ink fill, paper text, `border-radius: 0`, `min-height: 44px`,
  `box-shadow: none`; hover `--gallery-ink-hover` with **no transform**; `.is-success` keeps
  brass fill + ink text (6.3:1), squared.
- `.btn-waitlist`: transparent, 1px ink border, radius 0, 44px, ink text; hover ink fill +
  paper text, no lift.

### 5.2 Why we print the date — `.proof-section` (§9)

- Ground paper; `border-top: 1px solid var(--gallery-rule)`; ink text.
- `.proof-header`: left-aligned, `max-width: 780px`, `margin: 0 0 4rem`.
- `.proof-eyebrow` graphite-text; `.proof-headline` display scale; `.proof-subtext`
  `1.0625rem` graphite-text, `max-width: 58ch`.
- `.proof-grid`: `gap: 2.5rem`; keep 3 → 2 → 1.
- `.proof-card`: no fill, no border sides/bottom, no radius; `border-top: 1px solid
  var(--gallery-rule)`; `padding: 1.5rem 0 0`; hover: rule → ink; no transform.
- `.proof-step`: `2.5rem`/500/graphite — numbers as layout. `.proof-icon`: `1.25rem` ink
  (not brass: brass fails 3:1 on paper and icons carry meaning).
- `.proof-title`: `1.25rem`/500 ink/`1.25`. `.proof-desc`: `0.9375rem` graphite-text.
- `.proof-card-footer`: `border-top: 1px solid var(--gallery-rule)`; `.proof-badge` +
  `.proof-meta`: `0.6875rem`/600/`0.16em` uppercase graphite-text.
- `.proof-date-band`: brass top and bottom rules only; `margin-top: 4rem`. Because
  `.band-*` is shared with the dark hero, scope every colour change:
  `.proof-date-band .band-kicker`, `.proof-date-band .band-sub`,
  `.proof-date-band .band-day` → graphite-text;
  `.proof-date-band .band-date` → ink, display family, weight 500, tracking `-0.04em`,
  tabular. Do **not** edit the base `.band-*` rules.

### 5.3 The Roaster — `.roaster-section` (§11)

- Ground paper; top rule; ink; no dark band.
- `.roaster-container`: `max-width: 980px`, `text-align: left`.
- `.roaster-eyebrow` graphite-text; `.roaster-name` display scale, ink; `.roaster-role`
  `0.75rem`/600/`0.16em` uppercase graphite-text, `margin-top: 0.75rem`.
- `.roaster-bio`: `1.125rem`/`1.7`, ink, `max-width: 68ch`, `margin: 2.5rem 0 3rem`.
- `.roaster-pull-quote`: `border-top`/`border-bottom: 1px solid var(--gallery-rule)`;
  `padding: 2.5rem 0`; no side padding.
- `.quote-text`: pull-quote scale, **upright** (`font-style: normal`), ink.
- `.quote-author`: `0.6875rem`/600/`0.18em` uppercase graphite-text, `margin-top: 1.25rem`.

### 5.4 Brew guides — `.brew-guides-section` (§12)

- Ground paper; top rule; header left-aligned; display scale.
- Grid: 4 → 2 → 1, `gap: 2.5rem 2rem`.
- `.brew-card`: no fill/border/radius; top rule; `padding: 1.5rem 0 0`; hover only rule
  colour; no transform.
- `.brew-card-header`: remove its own bottom border (the card rule does the job), no bottom
  padding; `.brew-method-icon` `1.25rem` ink.
- `.brew-method-title`: `1.125rem`/500 ink. `.brew-method-profile`: `0.6875rem`/600/
  `0.12em` uppercase graphite-text.
- `.brew-spec-row`: `border-bottom: 1px solid var(--gallery-rule)` (not dashed);
  `0.8125rem`; label graphite-text, value ink/500/tabular.
- `.brew-adjustment-note`: no fill, no side border, no radius; `border-top: 1px solid
  var(--gallery-rule)`; `padding: 1rem 0 0`; `0.8125rem` graphite-text; `strong` ink.

### 5.5 Dhaka tasting room — `.tasting-rooms-section` (§13)

- Ground paper; top rule.
- `.tasting-rooms-card`: transparent, no backdrop-filter, no shadow, no radius, no side
  borders; `border-top: 1px solid var(--gallery-rule)`; `padding: 2rem 0 0`;
  keep the flex row → column at ≤768px.
- `.tasting-room-title`: `clamp(2rem, 4.5vw, 3.25rem)`; `.tasting-room-desc`: `1.0625rem`
  graphite-text, `max-width: 58ch`.
- `.tasting-room-meta-grid`: keep 2 → 1 columns, `gap: 2rem`; `.meta-icon` `1.25rem` ink;
  `strong` micro-label ink; `span` `0.9375rem` graphite-text.
- `.btn-directions`: ink fill, paper text, radius 0, `min-height: 44px`; hover
  `--gallery-ink-hover`, no lift, no shadow.

### 5.6 FAQ — `.faq-section` (§14)

- Ground paper; top rule; container stays `820px` (reading measure); header left-aligned.
- `.faq-item`: `background: none; border: 0; border-top: 1px solid var(--gallery-rule);
  border-radius: 0`; add `border-bottom` to the last item.
- `.faq-item[open]`: **no background change**; keep the rule.
- `.faq-question`: `padding: 1.5rem 0`; display family, `1.0625rem`/500, ink;
  `min-height: 44px` (already present — keep).
- `.faq-chevron`: `1.25rem` ink; the 0.25s rotate on `[open]` stays.
- `.faq-answer`: `padding: 0 0 1.75rem`; `0.9375rem` graphite-text; `max-width: 68ch`.

### 5.7 Footer — `.site-footer` (§15)

The footer is the closing bookend: it stays dark, but on **ink**, not near-black.

- `background-color: var(--gallery-ink)`; `color: rgba(250, 249, 246, 0.72)`; no top border
  (the paper → ink cut is the separation).
- `.footer-brand-title`: display family, `1.5rem`, 500, `-0.02em`, paper.
- `.footer-brand-tagline`: `0.625rem`/600/`0.18em` uppercase **brass** (allowed on ink, 6.3:1).
- `.footer-bio`: `0.8125rem`, `rgba(250,249,246,0.72)`.
- `.footer-col-heading`: `0.6875rem`/600/`0.18em` uppercase paper.
- `.footer-link`: `0.8125rem`, `rgba(250,249,246,0.72)`; hover paper; **remove
  `transform: translateX(2px)`**; keep padding so the hit area stays ≥24px.
- `.newsletter-input`: transparent, no radius, `border: 0`, `border-bottom: 1px solid
  rgba(250,249,246,0.3)`; `padding: 0.75rem 3rem 0.75rem 0`; paper text; focus:
  `border-bottom-color: var(--gallery-brass)` plus the global ring.
- `.newsletter-submit-btn`: `44px`, brass fill, ink icon, radius 0; hover paper fill.
- `.footer-bottom-bar`: `border-top: 1px solid rgba(250,249,246,0.14)`; `0.75rem`,
  `rgba(250,249,246,0.6)`.

### 5.8 Chrome — header, mobile drawer, cart, toasts (§6, §7, §16, §17)

Chrome keeps its dark glass behaviour; it adopts the new type and the square language.

- `.brand-title`, nav links, `.cart-pill-btn`, drawer titles, cart item names and prices:
  inherit Inter Tight/Inter through the tokens. Prices and counts: tabular.
- `.cart-pill-btn`: `border-radius: 0`; keep the glass fill and 44px height.
- `.cart-drawer`: `background-color: rgba(13,13,12,0.9)`; `border-radius: 0`;
  `box-shadow: none`; keep `border-left: 1px solid rgba(250,249,246,0.14)` and the blur.
- `.cart-item-thumb`: radius 0, `border: 1px solid rgba(250,249,246,0.14)`.
- `.cart-drawer-close`: radius 0, 44px.
- `.btn-order-request`: paper fill, ink text, radius 0, `min-height: 44px`, no shadow;
  hover brass fill + ink text; no lift.
- `.toast`: radius 0, no outer shadow, `border: 1px solid rgba(250,249,246,0.14)`.
- `.mobile-nav-drawer`: radius 0; keep its existing dark ground and focus trap.
- Header, dispatch bar, hero scrim, hero CTAs, hero date band: **unchanged** apart from the
  typeface. Do not restyle the hero.

---

## 6. Components, restated as a table

| Component | Fill | Border | Radius | Hover |
| :--- | :--- | :--- | :--- | :--- |
| Section | paper | top rule | 0 | — |
| Lot / proof / brew card | none | top rule | 0 | top rule → ink |
| Size toggle (active) | none | brass underline | 0 | text → ink |
| Grind select | none | bottom rule | 0 | — |
| Qty control | none | 1px rule | 0 | 4% ink tint on steps |
| Primary button | ink | none | 0 | ink-hover |
| Secondary button | none | 1px ink | 0 | ink fill, paper text |
| Notes/tags | none | none | 0 | — |
| Drawer / toast | dark glass | light hairline | 0 | unchanged choreography |
| Footer | ink | none | 0 | text-only hovers |

---

## 7. Motion parity (do not regress MOTION-001)

Timings, easings, distances of reveals, header shrink, underline slide, drawer slide, toast
lifecycle and hero entrance are **unchanged**. Only the hover *affordance* changes on paper.

| Element | Remove | Replace with (same duration/easing) |
| :--- | :--- | :--- |
| `.lot-card`, `.proof-card`, `.brew-card` hover | `translateY(-2px)`, fill change | `border-top-color` → ink |
| `.btn-add-bag`, `.btn-directions`, `.btn-waitlist`, `.btn-order-request` hover | `translateY(-1/-2px)`, `box-shadow` | background colour change only |
| `.footer-link` hover | `translateX(2px)` | colour change only |
| `.lot-size-btn` active | fill + `box-shadow` | brass underline + weight/colour |
| `.product-notes li` hover | border-colour chip | none |
| Press states (`.btn-*:active { transform: scale(.98) }`) | keep | keep |
| FAQ chevron rotate, stagger reveals, cart/toast choreography | keep | keep |

`@media (prefers-reduced-motion: reduce)` (§19) must still neutralise every remaining
transform and reveal. Update its selector list only if a selector was removed.

---

## 8. Accessibility contracts (non-negotiable)

### 8.1 Contrast (verified values)

| Pair | Ratio | Permitted use |
| :--- | ---: | :--- |
| Ink `#0D0D0C` on paper `#F8F5EF` | 17.9:1 | Any text |
| Graphite-text `#5F5B54` on paper | 6.2:1 | Small body/meta text (AA) |
| Graphite `#8C8880` on paper | 3.24:1 | ≥24px text, ≥19px bold, glyphs, rules — **not** small text |
| Brass `#B08D57` on paper | 2.84:1 | Decorative rules only — **never** text or icons |
| Brass on ink `#0D0D0C` | 6.3:1 | Text/icons in footer and dark chrome |
| Paper on ink | 17.9:1 | Any text |
| Focus ring `#96794A` on paper | 3.76:1 | Keep global `:focus-visible` |
| Focus ring on ink | 4.75:1 | Keep |

Never solve a contrast problem by lowering opacity below 0.72 on paper. Remove
`.lot-card.is-soldout { opacity: .85 }` and express the state in text.

### 8.2 Targets and semantics

- Every interactive element keeps `min-height: 44px` or a 44px hit area:
  `.lot-size-btn` (currently 32 — **fix**), `.qty-step`, `.btn-add-bag`, `.btn-directions`,
  `.newsletter-input`, `.newsletter-submit-btn`, `.faq-question`, `.cart-drawer-close`.
- `aria-pressed` on size toggles and `aria-expanded` on the burger stay exactly as they are.
- Active/selected states must not rely on colour alone: the size toggle also changes border
  and weight; the FAQ open state also rotates the chevron.
- Do not remove any `aria-label`, `role`, `aria-live`, `inert`, or `aria-hidden` attribute.
- Decorative Material Symbols stay `aria-hidden="true"`; the calendar glyph inside the lot
  roast badge already is.
- Focus order and the skip link are unchanged.

---

## 9. Responsive rules

| Breakpoint | Requirements |
| :--- | :--- |
| ≥1280px | Container 1280; sections at max padding; 3-column lots; 4-column brew |
| 1024–1279px | 2-column lots/proof; 2-column brew; display sizes follow clamp |
| 769–1023px | Header collapses to burger (existing); 2-column lots/proof/brew |
| ≤768px | 1 column everywhere; section padding `clamp(3.5rem, 8vw, 5rem)`; display type hits its clamp floor (40px); date band stacks and centres (existing); qty + add-to-bag stay on one line |
| 390px | No horizontal scroll; lot names wrap to two lines max without clipping; `.lot-size-btn` and `.qty-step` remain 44px; tasting meta stacks; footer grid 1 column |

Remove now-dead mobile rules that only served removed card chrome (e.g. image-frame aspect
ratios, sticker sizing) — see §10.

---

## 10. Defects to fix in passing

These are real bugs in the current stylesheet; the restyle should not carry them forward.

| Defect | Fix |
| :--- | :--- |
| `var(--font-sans)` used but never defined (`.product-notes li`) | Define it as `var(--font-body)` |
| `var(--radius-xs)` used but never defined (`.brew-adjustment-note`) | Define it as `0` |
| `var(--ease-out-quint)` used but never defined (`.proof-card`, `.brew-card`) | Use `var(--ease-standard)` |
| `.product-name` truncates with `nowrap` + ellipsis | Let names wrap |
| `.lot-card.is-soldout` opacity 0.85 | Remove; use graphite text + "Sold Out" chip |
| Dead CSS with no matching markup: `.product-image-frame`, `.product-image`, `.product-card`, `.featured-card`, `.badge-soldout`, `.badge-instock-pill`, `.badge-peeled-sticker`, `.product-meta-row`, `.product-origin-label`, `.product-lot-no`, `.product-soldout-label`, `.product-price-row` | Delete after confirming `grep -n "product-image\|featured-card\|badge-peeled\|product-price-row" scripts/main.js index.html` returns nothing. **Keep** `.quantity-stepper`, `.stepper-btn` and `.stepper-val` — the cart drawer renders them (`.quantity-stepper.cart-item-stepper`). |

---

## 11. Phases (commit after each)

| Phase | Work | Checkpoint |
| :--- | :--- | :--- |
| **1** | Font link swap; `--font-*`, gallery colour tokens, radius tokens; the two missing token definitions | Page loads, Inter Tight in DevTools, no Literata request, cart still opens |
| **2** | Chrome: header cart pill radius, drawer, toasts, mobile drawer, footer ground/type | Drawer + toast + mobile nav still animate and trap focus |
| **3** | Current lots: section, card, notes line, size toggle, grind, qty, buttons | Size toggle changes price; qty clamps 1–999; add to bag works |
| **4** | Proof + date band scoping | Band readable on paper; hero band unchanged |
| **5** | Roaster + brew guides | 4 → 2 → 1 columns; no dashed rules |
| **6** | Visit + FAQ | Details keyboard operable; chevron rotates |
| **7** | Responsive + reduced motion + dead-code sweep | §12 passes at 390/768/1024/1440 |
| **8** | Sync `DESIGN.md` if any value drifted; update `BUILD-PLAN.md` status | Docs match the CSS |

Do not squash the phases into one commit; the review needs to see the type change and the
layout change separately.

---

## 12. Definition of done

Automated greps (run from the repo root):

```bash
# 1. No serif or IBM Plex request remains in the product
grep -n "Literata\|IBM Plex Sans" index.html styles/main.css     # expect no output

# 2. No lift or shadow on Gallery-band hover states
grep -n -A5 "\.lot-card:hover\|\.proof-card:hover\|\.brew-card:hover\|\.btn-add-bag:hover\|\.btn-directions:hover\|\.btn-waitlist:hover\|\.btn-order-request:hover\|\.footer-link:hover" styles/main.css | grep "translateY\|box-shadow"
# expect no output

grep -n "box-shadow" styles/main.css
# only the hero CTA shadows and the .qty-control focus ring may remain

# 3. Radii in the Gallery band are zero
grep -n "border-radius: var(--radius" styles/main.css             # values must resolve to 0 or 999px only

# 4. main.js untouched
git diff --stat scripts/main.js                                   # expect no output
```

Manual matrix:

- [ ] 1440px: every Gallery section on `#F8F5EF`; the only brass on paper is the provisions
      header rule, the date band and an active size underline; no card boxes anywhere.
- [ ] 1024px: lots 2-up, brew 2-up, no clipped display type.
- [ ] 768px: single column, section headers left-aligned, date band centred, 44px controls.
- [ ] 390px: no horizontal scroll; lot name wraps; buy row one line; notes line wraps.
- [ ] Keyboard: skip link → header → nav → cart → each lot's size/grind/qty/add → FAQ rows.
      Focus ring visible on paper and on the ink footer.
- [ ] Contrast: spot-check graphite-text and brass usage against §8.1.
- [ ] Motion: reveal, header shrink, nav underline, drawer, toast, FAQ chevron all behave as
      MOTION-001 describes; reduced-motion OS setting removes transforms and reveals.
- [ ] Commerce: 250g/1kg toggles change price; qty ± and direct entry clamp; add to bag
      updates the header count/total and the drawer; the WhatsApp message is unchanged in
      format (`• Name — size, grind — ×n — ৳price`, subtotal, free-delivery line).
- [ ] No copy changed: `git diff index.html` shows only the `<link>` line.

---

## 13. Risks the implementer should not "fix" by adding decoration

- **Coldness.** Direction C warns it can read as a premium DTC template. The counter is the
  data and the copy — the roast date, the lot number, the producer — not new ornament.
  If a section looks empty, add space and scale, never a border, badge or illustration.
- **Two type families on one page.** The hero is Literata-free now (Inter Tight everywhere),
  so this risk is gone; do not reintroduce a serif for "warmth".
- **Low-contrast graphite.** The temptation is to use `#8C8880` for body text because it
  looks softer. It fails AA. Small text uses `#5F5B54`.
- **Brass creep.** Every new brass border looks good in isolation and breaks the direction.
  Brass is a closed list (§2 rule 5).

---

## 14. Addendum — texture, photography, founder layout (26 Oct 2026)

Three changes were made after the first Gallery build. This section supersedes the parts of
§2, §5.1 and §5.3 named below.

### 14.1 Paper, not glass

- `--gallery-paper` is now `#F8F5EF`, a warmer sheet, not `#FAF9F6`.
- Gallery sections carry `--paper-grain`: a 180px SVG turbulence tile shaped to sparse ink
  flecks (`feFuncA` table), repeated. Hero, footer, drawer and toasts stay clean.
- A single mug ring sits at the top-right of `.proof-section`, cropped by the section edge,
  hidden ≤768px. No droplets, no scattered beans: that is the whole decorative budget.
- New token `--gallery-quote-panel: #F3F1EA` for the founder quote only.

### 14.2 Cards are plates, not bare columns

§2 rule 2 and §5.1's "no card box" are superseded for the lots carousel only. `.lot-card` is
now a white plate: 1px `rgba(11,10,9,.08)` hairline, 2px brass top edge, zero radius, no
shadow, no hover lift. Everything else in the band remains ruleless boxes.

### 14.3 Product photography

- `.lot-media` renders a 4:5 image inside the plate when `LOTS.image` is set; absent images
  render nothing (no placeholder block).
- The photograph is a plate: no frame, no radius, no zoom. `loading="lazy"` except the first
  card; width/height always set.
- Packaging is generated blank — no model-generated lettering. Lot name and roast date stay
  HTML text. Prompts: `MAGNIFIC-PROMPTS.md`.
- Ship all seven images or none; a mixed set reads as a bug.

### 14.4 Founder section

§5.3's type-only roaster is superseded. The section is now a `5fr 6fr` grid — monochrome
portrait 4:5
with a caption strip on the left, bio and quote-panel on the right — followed by a static
three-image strip. No slider arrows: there is one real quote, and fake testimonial UI is not
permitted. Full anatomy in `DESIGN.md` §7.7.

### 14.5 Extra acceptance checks

- [ ] Grain is visible at 100% but never reads as noise over text; contrast checks still pass.
- [ ] Mug ring is cropped by the section edge and disappears ≤768px.
- [ ] No stain, droplet or bean appears outside §14.1.
- [ ] With `LOTS.image` empty, no media block and no 404 is requested.
- [ ] Founder grid stacks cleanly at 768 and 390; strip stays three-up.
