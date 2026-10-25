# AGENTS.md

Engineering context for anyone — human or AI agent — working on the **Aroma Coffee Co.**
website. Read this before touching code. For visual rules, read `DESIGN.md`.

> **Agents — start here.** This project is mapped into a knowledge graph at
> `graphify-out/`. Before grepping or reading source files, run
> `graphify query "<question>"` (or open `graphify-out/wiki/index.md`). It answers
> "where is X / what calls Y" in a few hundred tokens. Workflow, commands, and what the
> graph does *not* cover: **§12**.

---

## 1. What this project is

A single-page, static marketing site for a fictional specialty coffee roastery and
tasting room in Dhaka, Bangladesh ("Aroma Coffee Co."). It presents origin stories,
current micro-lots, a consultation form, and a
**simulated** shopping cart.

There is **no backend, no database, no auth, no payment integration**. Every form
submission and checkout is simulated in the browser with timers, toasts, and staged
in-drawer confirmation panels. There is no `alert()`.
Content is hardcoded in the HTML — there is no CMS, templating layer, or data file.

> This project is tracked in Git with remote `https://github.com/fardeenhb12/Coffee-Website.git` on branch `main`.

---

## 2. Stack & quick start

| Item | Value |
| :--- | :--- |
| Markup | Plain HTML5, one file |
| Styles | Hand-written CSS (custom properties, Grid, Flexbox) |
| Scripts | Vanilla ES2017+ JS, no modules, no bundler |
| Dependencies | **None** (runtime or dev) |
| Build step | **None** |
| Tests / lint / typecheck | **None exist** |
| Fonts | Google Fonts via `<link>` in HTML (network required) |
| Images | Local photography, stickers & icons in `assets/` (zero remote CDN dependencies) |
| Video | Local `video.mp4` |
| Currency | BDT, rendered as `৳ 1,650` |

```bash
# from the project root
npm run dev        # → npx -y serve . -p 3000  (http://localhost:3000)
npm start          # identical
```

You can also open `index.html` directly, but `video.mp4` and relative asset paths behave
more reliably over a served origin. The dev server is the only script in `package.json`.
The knowledge-graph tooling (§12) is a machine-level CLI, not a project dependency.

---

## 3. Repository layout

```
Coffee Website/
├── AGENTS.md                       ← this file (engineering context)
├── DESIGN.md                       ← design system & visual specification
├── index.html                      ← the entire site (786 lines)
├── styles/
│   └── main.css                    ← design tokens + all components (2,953 lines)
├── scripts/
│   └── main.js                     ← all interactions (787 lines)
├── MOTION.md                       ← MOTION-001: normative motion & interaction spec
├── video.mp4                       ← hero ambient loop + documentary lightbox source
├── package.json                    ← name, description, serve scripts
├── assets/
│   ├── images/                     ← local photography (hero, 3 lots, mission)
│   └── CREDITS.md                  ← image sources + licence notes
├── .graphifyignore                 ← scopes the graph to site source
├── .opencode/                      ← graphify skill + query-first plugin (tooling, not app)
│   ├── plugins/graphify.js
│   └── skills/graphify/
└── graphify-out/                   ← generated knowledge graph (disposable, see §12)
    ├── graph.json                  ← 208 nodes · 253 edges · 12 communities
    ├── graph.html                  ← interactive, clickable map
    ├── GRAPH_REPORT.md             ← god nodes, communities, suggested questions
    └── wiki/                       ← markdown articles; index.md is the entry point
```

`MOTION.md` is the normative motion specification (`MOTION-001`). Read
it before changing any animation, transition, overlay, or scroll behaviour — it defines the
tokens, the keyframe registry, per-component contracts, reduced-motion requirements, and a
gap register. It is documentation only and is not loaded by the app. Its Appendix A
preserves the original `iamcoffeeco.org` research and records what was adopted or rejected.

### Load order

1. `styles/main.css` — `<link>` in `<head>`
2. Local favicon + `og:` meta in `<head>`
3. Body markup, in this order: header shell → mobile drawer → `<main>` → footer → cart
   overlay/drawer → video modal → toast container
4. `scripts/main.js` — `<script>` at the very end of `<body>` (no `defer` needed)

---

## 4. How the code is organised

### `styles/main.css` — 19 numbered sections

| # | Section | Notes |
| :-: | :--- | :--- |
| 1 | Design tokens (`:root`) | Palette, fonts, spacing, radii, easings, header heights |
| 2 | Base & reset | Box-sizing, body, selection, Material Symbols defaults |
| 3 | Keyframes | Underline slide, reveal keyframes, pulse, toast |
| 4 | Scroll-reveal utilities | `[data-scroll-reveal]`, `.is-revealed`, stagger delays |
| 5 | Top dispatch bar | Static one-line notice strip |
| 6 | Header & nav | Glass header, shrink state, nav underline |
| 7 | Hamburger & mobile drawer | Three-bar→X morph |
| 8 | Hero stage | Centred headline over full-bleed film, scroll cue |
| 9 | Sourcing pillars | 4-column bento grid |
| 10 | Provisions / products | Product cards, grind select, quantity stepper input, add-to-bag |
| 11 | Concierge | Service cards + consultation form |
| 12 | Tasting rooms | Light CTA card |
| 13 | Mission editorial | Background image + stat row |
| 14 | Footer | 4-column grid, newsletter |
| 15 | Cart drawer | Overlay, shipping bar, line items |
| 16 | Video modal | Lightbox |
| 17 | Toasts | Fixed bottom-right stack |
| 18 | Responsive media queries | `max-width: 1024px`, `max-width: 768px` |
| 19 | Reduced motion | `prefers-reduced-motion` overrides |

New CSS goes in the matching numbered section. New sections go at the end of section 17,
before the media queries.

### `scripts/main.js` — one `DOMContentLoaded` listener, a shared-utilities prelude, then 10 numbered sections

| # | Concern | Key functions / hooks |
| :-: | :--- | :--- |
| 0 | Shared utilities | `scrollLocks` reference-counted lock, `createFocusTrap`, overlay stack |
| 1 | Toast notifications | `showToast(message, icon = 'check_circle')` |
| 2 | Sticky header shrink | `handleHeaderScroll()` on passive `scroll` |
| 3 | Scroll reveal | One `IntersectionObserver`, `rootMargin: '0px 0px -60px 0px'`, `threshold: 0.12` |
| 4 | Mobile nav | `toggleMobileMenu(forceState?)`, Escape to close |
| 5 | Cart engine | `cartState`, `openCartDrawer()`, `closeCartDrawer()`, `renderCart()` |
| 6 | Product qty / add to bag | `qty-input`, `qty-inc`, `qty-dec`, grind select, `addToBagBtn` |
| 7 | Video modal + ambient hero film | `openVideoModal()`, `closeVideoModal()`, `syncHeroVideoPlayback()` |
| 8 | Consultation form | Fake 1.2s async submit → `.show` feedback alert |
| 9 | Newsletter | Toast only |
| 10 | Cupping booking | Scrolls to form, pre-selects `#inquiry-type` |

Everything is scoped inside the `DOMContentLoaded` callback — there are **no globals**.
Follow that. Do not introduce exports, bundles, or top-level side effects.

---

## 5. Conventions

### Naming
- Classes: flat, kebab-case, descriptive — `.product-card`, `.cart-item-thumb`. No BEM
  suffixes, no utility framework.
- State classes are prefixed `is-` or are modifiers on the block:
  `.is-active`, `.is-open`, `.is-revealed`, `.is-above`, `.is-success`, `.is-hiding`, `.shrink`,
  `.show`, `.scroll-locked`, `.bounce`.
- IDs exist **only** as JS hooks or anchor targets. Do not style by ID.
- JS constants: `camelCase`; DOM refs are `const el = document.getElementById(...)`.

### Behaviour via data attributes
| Attribute | Values | Meaning |
| :--- | :--- | :--- |
| `data-scroll-reveal` | *(empty)*, `scale` | Element fades/scales in on intersect |
| `data-stagger` | `1`–`4` | Adds 0.08s–0.32s transition delay |
| `data-key` | `${id}::${calibration}` | Cart stepper row identity |

### Patterns to reuse
- **Guarded lookups:** always `if (el) { ... }` — sections are removed/added by hand and
  must not throw.
- **Confirmations:** toasts for the newsletter, waitlist, and line-item removal.
  Add-to-bag is the exception: it opens the cart drawer and updates the dialog's
  `aria-label` with the new count and subtotal, so no toast is shown over checkout.
- **Re-render + rebind:** `renderCart()` rebuilds `innerHTML`, then re-attaches stepper
  listeners. Keep that pairing intact.
- **State by class toggle**, never by inline styles, except the deliberate inline styles
  already present in markup.
- **IDs in JS are the contract.** If you rename an `id` in HTML, update `main.js` in the
  same change. `index.html` is not in the knowledge graph, so resolve ids with
  `grep -n 'id="' index.html` rather than `graphify query` (§12).

### HTML
- One `id` per element; ids listed in §6 are load-bearing.
- Keep ARIA labels on icon-only buttons and `aria-expanded` on the burger.
- Copy voice is editorial and devotional ("consecrated craft", "Kingdom mission"). Preserve
  it — do not "neutralise" the tone while refactoring.

---

## 6. State & data contracts

### `cartState` (the only mutable state)
```js
{
  items: [
    {
      id: 'nicaragua-single-estate',      // shared across grind variants (see §8)
      name: 'Missionary Grown',
      origin: 'Matagalpa, Nicaragua',
      calibration: 'Whole Bean (Recommended)', // grind option's visible text
      price: 1650,                        // integer BDT
      quantity: 1,
      image: 'assets/images/nicaragua-lot.webp' // local asset path
    }
  ],
  freeShippingGoal: 3000                  // BDT; drives the progress bar
}
```
Derived values: `totalCount = Σ quantity`, `subtotal = Σ price × quantity`.
Formatting is always `` `৳ ${n.toLocaleString()}` ``.

The cart initializes empty and is **not persisted** — a reload resets it.

### IDs referenced by `main.js`

`toast-container`, `site-header`, `burger-btn`, `mobile-nav-drawer`,
`cart-pill-btn`, `cart-drawer-overlay`, `cart-drawer`, `cart-drawer-close`,
`cart-items-list`, `cart-header-count`, `cart-header-price`, `cart-drawer-subtotal`,
`shipping-bar-fill`, `shipping-note`, `checkout-btn`,
`qty-input`, `qty-inc`, `qty-dec`, `grind-type`, `add-nicaragua-cart`,
`video-modal-backdrop`, `video-modal-close`, `hero-play-secondary-btn`,
`video-simulation`, `hero-bg-video`,
`concierge-contact-form`, `form-feedback-alert`, `form-submit-btn`,
`newsletter-form`, `btn-book-table`, `contact-section`, `inquiry-type`

`main-content` exists in markup but is not queried by JS. `site-header-container` only carries the `.is-scrolled` glass state.

### Anchor targets
`#hero`, `#provisions-showcase`, `#interactive-selector`, `#contact-section` (nested inside
`#interactive-selector`), `#dhaka-cafes`.

---

## 7. Extension recipes

**Add a coffee product**
1. Duplicate an `article.product-card` in `#provisions-showcase`.
2. Update the desktop 4:5 `<img>` and the mobile 4:3 `<source>`, `alt`, dimensions,
   `.product-name`, `.product-notes` flavour chips, `.product-price`, `.product-unit`.
3. Active products need a unique `id` on the quantity input, stepper buttons, and add
   button, plus new handlers in `main.js` §6 (the current handlers are hardcoded to the
   Nicaragua lot).
4. Add a matching entry to `cartState.items` only if it should be pre-seeded.
5. For a sold-out lot, reuse the `.product-card` shell, keep the `.btn-waitlist`
   action, and add a unique disabled `select` in `.grind-select-group.is-disabled`.
   Use the `Out of Stock` badge/label (positioned top-left), not `Archived`.

**Add a nav item**
Add to `.desktop-nav` and `.mobile-nav-drawer`, pointing at an existing section id.
Keep labels uppercase in CSS (they're transformed, so write normal case in HTML).

**Add a service highlight**
Duplicate `.service-highlight-card`; pair a Material Symbols icon in `.service-icon-box`
with `.service-title` and `.service-text`.

**Add a whole section**
Place it inside `<main>` in narrative order, add `data-scroll-reveal` to the top-level
wrapper, create a new numbered CSS section before the media queries, and add responsive
overrides in section 18.

**Design intelligence & UX audit queries (UI/UX Pro Max)**
The repository includes the `.agents/skills/ui-ux-pro-max` intelligence dataset. Use its local search engine before introducing new styles or components:
```bash
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <style|color|typography|ux|icons|gsap>
```

---

## 8. Known issues & technical debt

Status tracking for all items previously identified in §8:

1. **[Resolved] Anchor links hide under the fixed header.** Added `scroll-margin-top: calc(var(--header-height) + 5.5rem);` to `section[id]` and `#contact-section` in `styles/main.css`.
2. **[Resolved] Cart is pre-filled on first visit.** Initial HTML markup renders `(0)` and `৳ 0`, and `cartState.items` initializes empty `[]` in `scripts/main.js`.
3. **[Resolved] Stagger has no effect on pillar cards.** Individual `data-scroll-reveal` attributes moved to each `.pillar-card` in `index.html`.
4. **[Resolved] Double underline on active nav link.** Deleted redundant `border-bottom: 1.5px solid` from `.nav-link.active`, preserving the brass sliding gradient underline.
5. **[Resolved] Checkout is an `alert()`.** Implemented staged in-drawer confirmation workflow (`renderCheckoutConfirm()` and `renderCheckoutDone()`) with live rider ticket generation and order reset.
6. **No persistence.** Cart intentionally resets on reload (in accordance with project guardrails: "Persistence of any kind" is out of scope).
7. **[Resolved] No focus management.** Implemented `createFocusTrap` with keyboard traps and focus restoration on overlays; `role="dialog"`, `aria-modal="true"`, and `inert` toggles applied to mobile drawer, cart drawer, and video modal.
8. **[Resolved] Auto-moving tickers removed entirely.** One static dispatch bar replaces both marquees, so WCAG 2.2.2 has nothing to pause.
9. **[Resolved] Dead code.** Removed unused `lastScrollY`, unused `tmpl-anim-*` and `drawerSlideIn` keyframes, and pruned unused `--gutter` token.
10. **[Resolved] Cart row identity collides across grinds.** Implemented composite lookup key `cartKey(item) = ${item.id}::${item.calibration}` in `scripts/main.js`.
11. **[Resolved] Scroll-lock is shared state.** Implemented reference-counted `scrollLocks` Set in `scripts/main.js` so closing one overlay never unlocks while another remains active.
12. **[Resolved] Remote dependencies.** All assets (photography, packshots, favicon, og:image, and video poster) are 100% localized in `assets/` (credited in `assets/CREDITS.md`). Zero external image CDN dependencies.
13. **[Resolved] No reduced-motion handling.** Implemented comprehensive `@media (prefers-reduced-motion: reduce)` rules in `styles/main.css` §19 and `prefersReducedMotion()` checks in `scripts/main.js` to freeze pulses, disable autoplays, and snap reveals.
14. **[Resolved] Quantity capped at 10.** Replaced the dropdown with an editable stepper input (`1–999`) with +/− controls, direct entry, and a 44px touch target.
15. **[Resolved] Sold-out cards lacked grind context and read as "Archived".** Added disabled grind selectors, updated the label in favour of **Out of Stock** (aligned top-left with In Stock), and kept the waitlist action active.

All ad-hoc inline styling and pseudo-Tailwind classes (`text-[18px]`, `font-variation-settings`)
have been migrated to semantic design-system tokens and component classes in `styles/main.css`.
Prefer classes from the design system for anything new.

---

## 9. Manual QA checklist & UI/UX Pro Max Verification

No automated tests exist. Before declaring a change done, verify in a browser at desktop
and ≤768px:

- [ ] **Header dynamics**: Shrinks past 40px scroll; glass background darkens and holds text contrast over parchment; anchor jumps land with proper clearance.
- [ ] **Mobile navigation**: Hamburger morphs to X, drawer opens, body scroll locked, Tab focus trapped, Escape closes.
- [ ] **Hero entrance**: Headline lines → body → actions, once, under 1.2s; centred over the film; no replay on scroll; instant under reduced motion.
- [ ] **Scroll reveal cascade**: Every `[data-scroll-reveal]` block fades in on entry and reverses on exit, in both scroll directions; `will-change: auto` frees layer memory while revealed.
- [ ] **Navigation underlines**: Slide in on hover, slide back on leave, nothing visible at rest.
- [ ] **Cart drawer**: Pill or add-to-bag opens the drawer; overlay click and Escape close it; Tab focus stays trapped and returns to the trigger.
- [ ] **Steppers & touch targets**: Cart row steppers and product quantity +/− buttons meet ≥44px touch targets on mobile/touch; quantities clamp at 1 (and 999).
- [ ] **Add-to-bag**: Quantity stepper input (1–999, direct entry or +/−) adds the chosen amount, the button swaps its label and reverts after 2s, and the cart drawer opens automatically.
- [ ] **Cart totals & shipping bar**: Line item +/- recalculates count, subtotal, and updates free shipping progress bar at ৳ 3,000.
- [ ] **Staged checkout**: "Proceed to Dispatch" opens confirmation panel; order generates ticket without `alert()`.
- [ ] **Hero film & cue**: Full-bleed film loops muted, retries autoplay on `canplay`/first gesture, pauses off-screen; brass scroll beam travels the full track and stops under reduced motion.
- [ ] **Documentary modal**: Plays video with captions (`captions.vtt`); Escape/backdrop/close dismisses and restores focus.
- [ ] **Consultation form**: Validates required fields, animates spinner, displays `#form-feedback-alert`, and resets.
- [ ] **Dispatch bar**: One static line on desktop, only the first item on ≤768px; no animation.
- [ ] **Reduced motion pass**: With `prefers-reduced-motion: reduce`, all pulses freeze, reveals snap instantly, and autoplays halt.
- [ ] **Responsive collapse**: 4→2→1 (pillars), 3→2→1 (products) without horizontal scroll; on mobile the in-stock lot leads, the header CTA is hidden, and sold-out lots become compact rows.
- [ ] **Product titles**: Every card name stays on one line at 1440, 1024, 768, 390, and 320; no ellipsis in the current copy.
- [ ] **Flavour chips**: Product flavour notes render as small sans-serif chips (`IBM Plex Sans`, `0.725rem`, 500) with warm translucent pills; wrapping cleanly across all screen sizes.

---

## 10. Guardrails

**Do**
- Keep the site dependency-free and build-free unless explicitly asked otherwise.
- Reuse tokens from `:root`; no new hex values.
- Match existing component structure and naming before inventing abstractions.
- Add responsive rules at both breakpoints when introducing layout.
- Keep copy in the established editorial/devotional voice.

**Don't**
- Don't add a framework, bundler, Tailwind, or npm packages without approval.
- Don't convert CSS/JS to modules or split files unless the request includes that scope.
- Don't "fix" the fictional brand, prices, addresses, or mission language.
- Don't delete `MOTION.md` or treat it as optional reading before changing animation code.
- Don't rename existing ids or data attributes without updating `main.js` in the same edit.

**Explicitly out of scope (current state)**
- Real form submission, email, or CRM wiring
- Payments, inventory, auth, orders
- Persistence of any kind
- Multi-page routing, i18n, analytics, CMS

---

## 11. UI/UX Pro Max Conformance Report

Audit summary performed using the `ui-ux-pro-max` design intelligence framework:

| Priority Category | Verification Metric | Status |
| :--- | :--- | :---: |
| **1. Accessibility** | Text contrast ≥ 4.5:1 (up to 19.8:1 on dark, 10.9:1 on light), visible 2px brass focus rings, alt text, skip link | **Compliant (WCAG 2.2 AAA/AA)** |
| **2. Touch & Interaction** | Steppers, burger, overlay closes and the quantity input ≥ 44×44px; compact controls meet WCAG 2.5.8's 24px floor | **Compliant (WCAG 2.5.8)** |
| **3. Performance** | Compositor-only animations (`transform`, `opacity`), font preconnection, CLS < 0.1, GPU layer release post-reveal | **Compliant** |
| **4. Style Selection** | Warm Editorial Minimalism & Tactile Artisanal Luxury, Google Material Symbols vector icons (no emojis) | **Compliant** |
| **5. Layout & Responsive**| Mobile-first responsive hierarchy, zero horizontal overflow, 35–65 ch line length limits | **Compliant** |
| **6. Typography & Color** | Curated palette (`#0B0A09`, `#EFE6D6`, `#B08D57`), Literata + IBM Plex Sans | **Compliant** |
| **7. Animation & Motion** | Normative timing tokens (`--ease-*`, `--ease-media`), `@media (prefers-reduced-motion)` parity | **Compliant (MOTION-001)** |
| **8. Forms & Feedback** | Explicit `<label for="...">` mapping, live region feedback (`role="alert"` + `aria-live="polite"` toasts) | **Compliant** |
| **9. Navigation** | Fixed glass header, darkens past 40px, full-panel mobile drawer with keyboard focus trap | **Compliant** |
| **10. Media** | No auto-moving content (WCAG 2.2.2 N/A), WebVTT ambient documentary captions, offscreen video pause | **Compliant** |

## 12. Knowledge graph (graphify)

The site is mapped into a knowledge graph at `graphify-out/`. Querying it is the fastest
way to answer "where is X?" or "what calls Y?" without reading ~4,000 lines of source.

**This is a machine-level dev tool, not a project dependency.** Nothing in `index.html`,
`styles/`, or `scripts/` imports it; the site keeps its zero-dependency, zero-build shape.
The graph is an index for agents and humans, and `graphify-out/` is disposable.

### Where it lives

| Path | Role |
| :--- | :--- |
| `graphify-out/wiki/index.md` | **Entry point.** Pre-written community articles + god nodes. |
| `graphify-out/graph.json` | The graph: nodes, typed edges, `EXTRACTED`/`INFERRED` confidence. |
| `graphify-out/graph.html` | Open in a browser: click, filter, search the map. |
| `graphify-out/GRAPH_REPORT.md` | Broad architecture review only — not for targeted questions. |
| `graphify-out/.graphify_*` | Labels, analysis, cache. Generated; never hand-edit. |
| `.graphifyignore` | Scopes scanning to site source; excludes `.agents/`, `.opencode/`, media, CSVs. |
| `.opencode/skills/graphify/` | The `/graphify` skill (installed project-scoped). |
| `.opencode/plugins/graphify.js` | Session hook: one "query the graph first" reminder per session. |

### Query first, read second

| Task | Command |
| :--- | :--- |
| Locate a behaviour | `graphify query "where is checkout confirmation rendered"` |
| How two symbols connect | `graphify path "toggleMobileMenu" "closeCartDrawer"` |
| Understand one symbol | `graphify explain "renderCart"` |
| Architectural hubs | `graphify god-nodes --top 10` |
| Blast radius of a change | `graphify affected "renderCart"` |
| Smaller output (subagents) | append `--budget 800` to `query` |

Exit codes: `0` answered · `3` ambiguous name (candidates are listed — pick one) ·
`4` no matching node.

Escalation ladder: `query` → `wiki/index.md` → `GRAPH_REPORT.md` → `grep`/read. Reach for
raw search only when the graph genuinely cannot answer — e.g. CSS selectors, HTML ids, or
copy changes. When dispatching a subagent that explores code, put the query-first rule in
its prompt.

### Coverage — read this before trusting the graph

Code is parsed with tree-sitter AST; Markdown is indexed as heading/section nodes carrying
`file` + line. Plain CSS is unsupported, and HTML only appears via the optional LLM
(semantic) pass, which has not been run.

| File | In the graph? | Use instead |
| :--- | :---: | :--- |
| `scripts/main.js` | Yes — all 22 top-level functions | graph |
| `package.json` | Yes — scripts, metadata | graph |
| `AGENTS.md`, `DESIGN.md`, `MOTION.md`, `assets/CREDITS.md` | Yes — section headings with `file:line` | graph to locate, then read the section |
| `index.html` | **No** | `grep -n 'id="' index.html` |
| `styles/main.css` | **No** (CSS unsupported) | `grep -n '^\.' styles/main.css` |

Doc lookups are the underrated win: `graphify query "motion timing tokens"` returns
`3. Timing tokens`, `3.1 Easing`, `3.2 Duration` with `MOTION.md` line numbers, so you can
jump straight to the section instead of grepping the spec. Treat those line numbers as
hints — they drift until the next `graphify update .`.

Current map: **208 nodes · 253 edges · 12 communities** (89% `EXTRACTED`, 11% `INFERRED`).
Communities cluster by document and subsystem: the motion spec, the design system, the
agent docs, cart & checkout rendering, overlay/scroll-lock lifecycle, and package metadata.
The most-connected nodes are the motion spec's section hubs plus `renderCart()` (12 edges),
`createFocusTrap()` (8), `openCartDrawer()` (8), `toggleMobileMenu()` (8), and
`closeVideoModal()` (7). `INFERRED` edges are resolved by the tool rather than read from
source — verify one before relying on it.

### Keeping it current

```bash
graphify update .                       # after editing code or docs — AST only, no API cost
graphify extract . --code-only --force  # code-only rebuild (skips the Markdown specs)
graphify cluster-only . --no-label      # re-cluster, regenerate report + graph.html
graphify export wiki                    # regenerate the wiki articles (not run by update)
```

`update` is the routine command: it re-parses changed files (including Markdown) and
refreshes the report. The CLI lives at `~/.local/bin/graphify` (installed via
`uv tool install graphifyy`; new shells pick it up from `~/.zshrc`). Delete
`graphify-out/` and re-extract at any time — nothing in the site depends on it.

### Extending to `index.html`

`index.html` is the one significant gap: it holds the id contract, so agents still fall
back to grep for it. The semantic pass picks up HTML structure and prose concepts, given a
provider key:

```bash
DEEPSEEK_API_KEY=... graphify extract . --backend deepseek
graphify label . --backend deepseek
```

That adds HTML nodes and concept links, and replaces the hub-derived community names with
model-written ones. Only the semantic layer leaves the machine; code parsing stays local.
The result is cached, so later `graphify update .` runs remain free. Plain CSS still will
not be indexed — for selectors, grep `styles/main.css` directly.
