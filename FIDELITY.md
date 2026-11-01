# FIDELITY.md — the parity contract

What "the design must not change" means, concretely enough to check.

Read `MIGRATION.md` first. This file is the rulebook you consult while writing a component and
the checklist you run when you think you're done.

---

## 1. Frozen files

| File | Status | Enforced by |
| :--- | :--- | :--- |
| `src/styles/main.css` | **frozen** — sha256 `7aa0397c3515526adcd09b86a0bb0df89c2326de102a9f0c8de8aadda8f8d322` | `npm run check` |
| `legacy/index.html` | **read-only reference** — 764 lines | `npm run check` (it reads it) |
| `legacy/main.js` | **read-only reference** — 956 lines | `npm run check` (it reads it) |
| `src/data/*.ts` | **frozen content** — copy, prices, dates | review |
| `src/config/site.ts` | **frozen facts** — address, hours, phone | review |

Frozen means: if you find yourself wanting to change it, you have misread the task.

---

## 2. DOM parity

The CSS was written against one specific DOM. It is not defensive: it does not tolerate an
extra wrapper, a reordered sibling or a moved class. Five real traps, each of which silently
breaks the layout:

### 2.1 Siblings stay siblings

```html
<!-- legacy -->
<div class="notice-static">
  <span class="notice-item">Roasted every Tuesday</span>
  <span class="dot-separator">·</span>
  <span class="notice-item">Order by 2 PM…</span>
</div>
```

The separator is a **sibling** of the items. `.notice-static` is a flex row and
`.dot-separator` is one of its children. Nesting it inside `.notice-item` — the "obvious" thing
when you map over an array — collapses the row.

```tsx
// correct: the fragment keeps them siblings
{ITEMS.map((item, index) => (
  <Fragment key={item}>
    {index > 0 && <span className="dot-separator" aria-hidden="true">·</span>}
    <span className="notice-item">{item}</span>
  </Fragment>
))}
```

### 2.2 Overlays are not inside the sticky shell

`.site-header-container` is sticky and establishes a stacking context. The mobile drawer and
the cart drawer are **siblings** of it, not children. `SiteHeader.tsx` returns a fragment for
exactly this reason.

### 2.3 Wrappers that look redundant are not

`.lot-card-inner` wraps the card body; `.product-actions-block.buy-block` sits outside it. The
CSS targets both. Do not "flatten" either.

### 2.4 Class lists on one node stay on one node

`.hero-date-band.proof-date-band` is one element with two classes, not two nested elements. The
proof date band reuses the hero band's rules and then overrides their colours — the override
selects the compound `.hero-date-band.proof-date-band`.

### 2.5 Attribute order does not matter; attribute presence does

`id`, `role`, `aria-*`, `data-*` all matter and must survive. Order does not.

---

## 3. Characters

Copy is not editable, and that includes the punctuation. Encode as the character, not the
entity:

| Legacy | Becomes | Where |
| :--- | :--- | :--- |
| `&middot;` | `·` | nav, meta rows, footer, breadcrumbs |
| `&mdash;` | `—` | hero subtext, pull quote, add-to-bag feedback |
| `&ndash;` | `–` | time ranges, altitude ranges |
| `&#2547;` | `৳` | every price |
| `&deg;` | `°` | brew water temperatures |
| `&rsquo;` | `’` | possessives in headings |
| `&ldquo;` `&rdquo;` | `“` `”` | the pull quote |
| `&times;` | `×` | WhatsApp line items |
| `&minus;` | `−` | quantity steppers (U+2212, not a hyphen) |
| `&copy;` | `©` | footer |

In JSX text, an apostrophe inside a string is fine; a bare `'` in JSX text is fine too. Where
a linter complains, use `&apos;` — it renders identically.

**The stepper minus is `−` (U+2212), not `-`.** It is wider and sits at optical centre. Copy it
from the legacy markup.

---

## 4. What React legitimately changes

Five deviations are expected and correct. Anything else is drift.

1. **`class` → `className`, `for` → `htmlFor`, `tabindex` → `tabIndex`, `playsinline` →
   `playsInline`, `autoplay` → `autoPlay`, `preload` stays `preload`.** Attribute-name casing
   only; the rendered HTML is identical.
2. **`inert` is a React prop, not a hook side effect.** The legacy build toggled `inert` from
   the focus-trap helper. In React the component owns it (`inert={!isOpen}`) so React and the
   hook never fight over the attribute. Same rendered result.
3. **Repeated markup is generated.** `.proof-card`, `.brew-card`, `.lot-card`, `.faq-item` and
   nav links come from `.map()` with a `key`. The rendered DOM is identical; only the source
   is shorter.
4. **Handlers replace `addEventListener`.** `onClick`, `onChange`, `onSubmit`. The resulting
   behaviour and the ARIA state must be identical.
5. **Controlled inputs.** The quantity field keeps a string in state so the user can clear it
   mid-edit, and clamps on blur and Enter — matching the legacy `change`/`blur`/Enter behaviour
   exactly.

Nothing else changes. No extra wrapper, no removed element, no renamed class, no new attribute.

---

## 5. Interpolated copy

The parity script compares source text, so it cannot verify a sentence assembled at render time.
Two blocks are allowlisted in `scripts/check-parity.mjs` and must be eyeballed once in the
browser:

| Rendered text | Built from |
| :--- | :--- |
| `Add ৳ 2,500 more for free delivery` | `Add <strong>{formatTaka(remaining)}</strong> more for free delivery` |
| `Free delivery unlocked (over ৳ 2,500)` | `<strong>Free delivery unlocked (over {formatTaka(goal)})</strong>` |

If you add another interpolated sentence, add it to `ALLOWED_COPY_GAPS` and say so in your
report — do not let the check go quiet on something nobody verified.

---

## 6. Per-section checklist

Run this against each section as you finish it.

| Check | How |
| :--- | :--- |
| Section element and `id` match | `id="why-date"`, `id="roaster"`, `id="brew-guides"`, `id="visit"` |
| Root class matches | `.proof-section`, `.roaster-section`, `.brew-guides-section`, `.tasting-rooms-section` |
| `data-scroll-reveal=""` on the same blocks | compare with legacy line range |
| `data-stagger` values present and correct | 1..3 for proof, 1..4 for brew |
| Every class token exists in `main.css` | `npm run check` |
| Every image path resolves | `npm run check` |
| Image `width`/`height`/`loading`/`decoding` preserved | visual diff for layout shift |
| Headings keep their level | `h2` for section titles, `h3` for cards |
| `aria-label`s preserved verbatim | compare with legacy |
| Copy byte-identical after entity decoding | `npm run check:strict` |
| No hooks in the component | read the file |

---

## 7. Manual checklist

Automated checks catch structure. Only your eyes catch rendering. Run the site
(`npm run dev` → `http://localhost:3000`) and the legacy file side by side, at four widths.

| Width | What to look at |
| :--- | :--- |
| **390** | Proof cards stack, roaster strip becomes one column, brew cards single file, visit card padding, no horizontal scroll |
| **768** | Two-up grids, nav still collapsed, footer grid reflows |
| **1024** | Three-up proof, roaster grid two-up, carousel shows the intended number of cards |
| **1440** | Full gallery band, hairlines align, no orphaned rules, date band spans correctly |

And in every width:

- [ ] One `#F8F5EF` ground from Current Lots down — no section alternates
- [ ] Rules are 1px; nothing has a radius, a shadow or a filled card
- [ ] Display type is left-aligned and not clipped
- [ ] Keyboard: tab through the whole page, focus ring visible on every control, order unchanged
- [ ] `prefers-reduced-motion: reduce` — nothing invisible, nothing moving, no reveal stuck at
      `opacity: 0`
- [ ] Bag: 250g → 1kg changes the price; quantity clamps 1–999; add-to-bag updates the pill,
      opens the drawer, and the WhatsApp message reads exactly as `MIGRATION.md` §Done describes

---

## 8. If the design genuinely needs to change

Then it is a design change, and design changes are a different task with a different process.
Open `DESIGN.md`, agree the change with the human, and update the frozen hash in
`scripts/check-parity.mjs` in the same commit — deliberately, visibly, on purpose.

Never sneak a change in under a migration commit. That is the one failure mode this whole
document exists to prevent.
