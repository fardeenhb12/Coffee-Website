> **Status, 2 November 2026: complete.** All four sections are ported and `npm run check:strict` is
> green. The stylesheet was then deliberately rewritten for the Little Amps register and re-frozen
> at the hash below — see `docs/references/little-amps/DESIGN.md`. The ten laws still govern any
> future edit.

# MIGRATION.md — finish the React conversion

**You are finishing a migration, not designing anything.** The site is built. The design is
locked. Your job is to move the last four sections out of the legacy HTML and into React
components without changing a single pixel, and then to prove you didn't.

Read this file top to bottom before you touch anything. It is the entry point; it tells you
what to read next.

---

## The one unbreakable rule

`src/styles/main.css` is **frozen**. It is a byte-for-byte copy of the hand-written stylesheet
that produces the current design — 3,241 lines, 19 numbered sections, every token, every
breakpoint, every reduced-motion rule.

```
sha256  f71b806301f27a0befa19381c575deb420b9273ede5553ff1a31ae94aa9a8beb
```

Do not edit it. Do not split it. Do not convert it to CSS Modules, Tailwind, styled-components,
CSS-in-JS, Sass, or per-component stylesheets. Do not "clean up" a selector. Do not add a
variable. Do not reformat it.

`npm run check` verifies the hash and fails the moment it changes.

This is not fussiness. The stylesheet is the design. Every rule in it is load-bearing: it
assumes a specific DOM — which element wraps which, which sibling order, which class sits on
which node. Change the markup shape and the design breaks in ways no type checker will catch.
That is the entire risk of this migration, and the rest of this document exists to close it.

---

## Read in this order

| # | File | Why |
| :- | :--- | :--- |
| 1 | `MIGRATION.md` | this file — what to do |
| 2 | `FIDELITY.md` | the parity contract — what "unchanged" means concretely |
| 3 | `SKILLS.md` | which skills to invoke, and which must not be allowed to redesign |
| 4 | `AGENTS.md` | engineering context: structure, conventions, guardrails |
| 5 | `legacy/index.html` | the markup you are porting (764 lines) |
| 6 | `legacy/main.js` | the behaviour you are porting (956 lines) |
| 7 | `DESIGN.md` | the visual system you must preserve |
| 8 | `MOTION.md` | timings and motion contracts you must preserve |

`GLOSSARY.md`, `BRAND.md` and `PAGE-SPEC.md` are reference — read them if copy or naming is
unclear, not before.

**Path mapping.** `DESIGN.md`, `MOTION.md` and `GALLERY-RESTYLE.md` were written before the
React migration, so their paths are historical. Translate as you read:

| The spec says | It now means |
| :--- | :--- |
| `styles/main.css` | `src/styles/main.css` (frozen, same file) |
| `scripts/main.js` | `legacy/main.js` (read-only reference) |
| `index.html` | `legacy/index.html` (read-only reference), or the Vite entry `index.html` |
| `assets/images/…` | `public/assets/images/…`, referenced as `/assets/images/…` |

---

## Where the migration currently stands

The scaffold, the styling, the data layer and every piece of stateful behaviour are already
done. **Four sections are still empty shells.** That is your work.

### Done — read these as the reference implementations

| File | What it shows |
| :--- | :--- |
| `src/components/sections/Faq.tsx` | **The canonical pattern.** Data-driven section, no state, no handlers, exact class names. Copy this shape. |
| `src/components/sections/Hero.tsx` | Video + entrance animation + a date band |
| `src/components/sections/Lots.tsx` | Carousel wiring, native scroller, indicator |
| `src/components/lots/LotCard.tsx` | Local state, size/grind/quantity, add-to-bag |
| `src/components/layout/Footer.tsx` | Static layout + a form |
| `src/components/layout/SiteHeader.tsx` | Focus trap, scroll lock, overlay stack |
| `src/components/cart/CartDrawer.tsx` | Drawer state, totals, WhatsApp handoff |

### Your work — four shells

| File | Section | Legacy source |
| :--- | :--- | :--- |
| `src/components/sections/Proof.tsx` | Why We Print the Date | `legacy/index.html` lines **237–316** |
| `src/components/sections/Roaster.tsx` | The Roaster | `legacy/index.html` lines **321–370** |
| `src/components/sections/BrewGuides.tsx` | Brew Guides | `legacy/index.html` lines **375–527** |
| `src/components/sections/Visit.tsx` | Dhaka Tasting Room | `legacy/index.html` lines **532–565** |

Each shell has a comment block naming its exact structure. The copy is verbatim in the legacy
file. The CSS for all four already exists and is frozen.

### Already extracted for you

- `src/data/lots.ts` — 7 lots, typed
- `src/data/brewGuides.ts` — 4 brew recipes, typed (Brew Guides section must consume this)
- `src/data/faqs.ts` — 6 questions
- `src/config/site.ts` — address, hours, phone, email, maps URL, WhatsApp number, free-delivery goal
- `src/lib/cart.ts` — `cartKey`, `clampQuantity`, `getCartTotals`
- `src/lib/whatsapp.ts` — `buildWhatsAppMessage`, `buildWhatsAppUrl`
- `src/lib/format.ts` — `formatTaka`, `formatTakaBare`, `padIndex`
- `src/context/CartContext.tsx` — the bag, as a reducer
- `src/context/ToastContext.tsx` — `showToast(message, icon)`
- `src/hooks/*` — scroll reveal, focus trap, scroll lock, overlay stack, header shrink, hero video, carousel

---

## The ten laws of the port

1. **Same DOM, same classes.** Every element, wrapper, sibling order, class name, `id`,
   `data-*` attribute, `role` and `aria-*` attribute in the legacy markup must exist in the
   component, on the same node. No extra wrapper `<div>`. No removed wrapper `<div>`.
2. **Copy is not editable.** Not one word, not one dash. `&middot;` becomes `·`, `&mdash;`
   becomes `—`, `&#2547;` becomes `৳` — the character is preserved, only the encoding changes.
   See `FIDELITY.md` §Characters.
3. **No new CSS.** Not inline `style`, not a new class, not a `<style>` tag. If something looks
   wrong, the markup is wrong — fix the markup.
4. **No new dependencies.** No UI kit, no icon package, no animation library, no router. React
   and React DOM are the only runtime dependencies and stay that way.
5. **No new state that the legacy build didn't have.** These four sections are static. `Proof`,
   `Roaster` and `Visit` should have zero hooks. `BrewGuides` renders from `BREW_GUIDES` and has
   zero hooks.
6. **No redesign, no "improvement".** No hover lift, no added shadow, no rounded corner, no
   extra animation, no reordered section, no "better" heading level. If you think something
   should change, write it in your report instead of doing it.
7. **`data-scroll-reveal=""` on exactly the blocks that have it in the legacy markup.** The
   observer lives in `App.tsx` and picks up new nodes automatically. Never wire a second
   observer inside a section.
8. **Images keep their paths and dimensions.** `/assets/images/...`, plus the `width`,
   `height`, `loading` and `decoding` attributes from the legacy markup. Dimensions are what
   stop layout shift.
9. **Guard the build.** `npm run build` and `npm run check` must both pass before you claim
   anything is done. Evidence before assertions.
10. **Never delete `legacy/` yourself** unless the human explicitly asks. It is the porting
    reference and the last phase deletes it deliberately.

---

## Work order

Do these in order. Commit after each one. Do not squash them.

**Phase 0 — orient (no edits)**
Read the files in the order above. Then run `npm run check` and note the 14 copy warnings: they
are precisely the four unported sections. Build the graphify graph (see `SKILLS.md`) and ask it
one question: *"what does the proof section depend on?"* Confirm you can navigate before you
write.

**Phase 1 — Proof** (`legacy/index.html` 237–316)
Three `.proof-card`s with `data-stagger="1..3"`, then the `.hero-date-band.proof-date-band`
reuse. Note that the date band class is shared with the hero — the CSS scopes it, so keep both
class names on that element.

**Phase 2 — Roaster** (`legacy/index.html` 321–370)
Portrait figure, bio, pull quote, three-image strip. The pull quote is a `blockquote` with a
`cite`; keep the typographic quotes in the copy.

**Phase 3 — Brew Guides** (`legacy/index.html` 375–527)
Render from `BREW_GUIDES`. `Adjust:` is a literal bold lead-in in the markup; the data stores
only the sentence after it. Watch the en dashes in the time ranges.

**Phase 4 — Visit** (`legacy/index.html` 532–565)
Pull address, hours and the maps URL from `SITE`. The address, hours, phone and email must match
the footer and the JSON-LD block in `index.html` exactly — that parity is a hard rule in
`AGENTS.md`.

**Phase 5 — verify**
`npm run build` → `npm run check:strict` must report **0 warnings**. Then a manual pass at 390,
768, 1024 and 1440 px against `http://localhost:3000`, comparing section by section with the
legacy build. See `FIDELITY.md` §Manual checklist.

**Phase 6 — retire the reference**
Only when Phase 5 is green and the human agrees: delete `legacy/`, remove the `legacy` mentions
from `AGENTS.md` and `README.md`, and drop the legacy half of `scripts/check-parity.mjs`. The
frozen-CSS hash check stays forever.

---

## Verification — run these, paste the output

```bash
npm run build          # tsc -b && vite build — must be clean
npm run check          # design parity guard
npm run check:strict   # same, but missing copy fails
npm run dev            # http://localhost:3000
```

`npm run check` verifies five things and prints one line each:

```
  css frozen     ok              ← the stylesheet hash is unchanged
  class tokens   N used, 0 unknown
  legacy ids     30 found, 0 missing
  asset refs     8 checked, all resolve
  copy blocks    44 legacy, 0 missing
```

Anything red is drift. Fix the component, never the stylesheet.

---

## Definition of done

- [ ] Four sections ported, each matching its legacy line range element for element
- [ ] `npm run build` clean, no TypeScript errors, no warnings
- [ ] `npm run check:strict` reports 0 failures and 0 warnings
- [ ] `src/styles/main.css` hash still `38b54c92…` — unchanged
- [ ] No new dependency in `package.json`
- [ ] No new class, `id`, inline style or CSS rule anywhere
- [ ] Zero hooks in `Proof`, `Roaster`, `Visit`; zero hooks in `BrewGuides`
- [ ] Manual pass at 390 / 768 / 1024 / 1440 px, section by section against the legacy build
- [ ] Keyboard tab order and focus rings unchanged
- [ ] Reduced motion leaves nothing invisible and nothing moving
- [ ] Bag still works: size toggle changes price, quantity clamps 1–999, add-to-bag updates the
      pill and drawer, WhatsApp message format byte-identical

---

## Report back with

1. Files changed, one line each, with what was ported.
2. The full output of `npm run build` and `npm run check:strict`.
3. Anything in the legacy markup that could not be expressed in React without changing the DOM,
   and what you did about it.
4. Every place the design looked wrong to you — as a suggestion, not a change.
5. The commit list.

If a genuine conflict appears between this document and `legacy/index.html`, the legacy markup
wins for markup and `FIDELITY.md` wins for the rules. Say so in the report.
