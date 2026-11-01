# React Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the migration of Day Three's website to React 19 by porting the remaining four static content sections (`Proof`, `Roaster`, `BrewGuides`, `Visit`) with 100% DOM, class, asset, and text parity, strictly keeping `src/styles/main.css` frozen.

**Architecture:** Each remaining section is implemented as a pure, static React component matching the canonical `Faq.tsx` pattern: no local state, zero hooks, preserving exact legacy markup wrappers and sibling structures. Copy and data are sourced from existing typed data files (`src/data/brewGuides.ts`, `src/config/site.ts`) and legacy HTML with byte-for-byte fidelity after HTML entity decoding.

**Tech Stack:** React 19, TypeScript (strict), Vite 6, Vanilla CSS (`src/styles/main.css`, sha256 frozen).

**Spec:** `MIGRATION.md`, `FIDELITY.md`, `AGENTS.md`.

## Global Constraints

- `src/styles/main.css` is frozen: sha256 `38b54c92cf1a2ae617c4b05081bc2fcf6f48c62a74f04621fe9c3b3abce6ea14`. No CSS modifications, no inline styles, no new stylesheets.
- Runtime dependencies: `react`, `react-dom` only. No other libraries.
- Zero hooks in `Proof`, `Roaster`, `BrewGuides`, and `Visit`.
- Exact DOM and class hierarchy preserved: same wrappers, same sibling order, same class lists, same `id`s, same `data-scroll-reveal=""`, and same `data-stagger` values.
- Image attributes (`width`, `height`, `loading="lazy"`, `decoding="async"`) must be preserved verbatim.
- Copy must match byte-for-byte after entity decoding (`&middot;` → `·`, `&mdash;` → `—`, `&ndash;` → `–`, `&ldquo;`/`&rdquo;` → `“`/`”`, `&rsquo;` → `’`, `&deg;` → `°`, `&#2547;` → `৳`).
- Verification gate: `npm run build` and `npm run check:strict` must pass with 0 failures and 0 warnings.

## Review Focus

- Compound class `.hero-date-band.proof-date-band` on a single element (not nested) in Proof.
- Image paths in Roaster must resolve to `/assets/images/...` (public dir) with exact dimensions `1208×1500` and `1200×900`.
- BrewGuides adjustment prefix `Adjust:` must be bold literal in JSX, while adjustment text comes from `BREW_GUIDES`.
- Visit metadata and links must align exactly with `SITE.address.full`, `SITE.hours`, and `SITE.mapsUrl`.
- Verification of parity check `--strict` mode passing with 0 missing copy blocks.

---

### Task 1: Port Why We Print the Date (`src/components/sections/Proof.tsx`)

**Files:**
- Modify: `src/components/sections/Proof.tsx`
- Reference: `legacy/index.html:237-316`

**Interfaces:**
- Consumes: None (pure markup section)
- Produces: `Proof(): JSX.Element`

- [ ] **Step 1: Implement `Proof` component in `src/components/sections/Proof.tsx`**
Replace the shell with exact markup structure from `legacy/index.html` lines 237–316:
- Section `#why-date` with class `proof-section`
- `.proof-container`
- `.proof-header` with `data-scroll-reveal=""`
- `.proof-grid` containing 3 `.proof-card`s with `data-scroll-reveal=""` and `data-stagger="1"`, `"2"`, `"3"`, step, icon, title, desc, footer badge and meta
- `.hero-date-band.proof-date-band` with `data-scroll-reveal=""` and `aria-label="Our roast date proof contract"`, 3 `.band-cell`s

- [ ] **Step 2: Run build and parity check**
Run: `npm run build && node scripts/check-parity.mjs`
Expected: Proof copy warnings (5 blocks) disappear from missing copy list.

---

### Task 2: Port The Roaster (`src/components/sections/Roaster.tsx`)

**Files:**
- Modify: `src/components/sections/Roaster.tsx`
- Reference: `legacy/index.html:321-370`

**Interfaces:**
- Consumes: None
- Produces: `Roaster(): JSX.Element`

- [ ] **Step 1: Implement `Roaster` component in `src/components/sections/Roaster.tsx`**
Replace the shell with exact markup structure from `legacy/index.html` lines 321–370:
- Section `#roaster` with class `roaster-section`
- `.roaster-container` with `data-scroll-reveal=""`
- `header.roaster-header` with eyebrow, h2 (.roaster-name + .roaster-role)
- `.roaster-grid`:
  - `figure.roaster-portrait` with `/assets/images/founder-zarif.jpg`, width 1208, height 1500, loading lazy, decoding async, and figcaption
  - `.roaster-body` with `p.roaster-bio` and `blockquote.roaster-pull-quote` (p.quote-text with typographic quotes and cite.quote-author)
- `.roaster-strip` with `aria-label="Inside the Banani roastery"`: 3 figures with images `/assets/images/roastery-drum.jpg`, `/assets/images/roastery-pour.jpg`, `/assets/images/roastery-pack.jpg`, width 1200, height 900, loading lazy, decoding async, and figcaptions.

- [ ] **Step 2: Run build and parity check**
Run: `npm run build && node scripts/check-parity.mjs`
Expected: Roaster copy warnings (2 blocks) disappear from missing copy list.

---

### Task 3: Port Brew Guides (`src/components/sections/BrewGuides.tsx`)

**Files:**
- Modify: `src/components/sections/BrewGuides.tsx`
- Reference: `legacy/index.html:375-527`, `src/data/brewGuides.ts`

**Interfaces:**
- Consumes: `BREW_GUIDES` from `../../data/brewGuides`
- Produces: `BrewGuides(): JSX.Element`

- [ ] **Step 1: Implement `BrewGuides` component in `src/components/sections/BrewGuides.tsx`**
Map `BREW_GUIDES` into the `.brew-guides-grid`:
- Section `#brew-guides` with class `brew-guides-section`
- `.brew-guides-container`
- `.brew-guides-header` with `data-scroll-reveal=""`
- `.brew-guides-grid` mapping each `guide` with index:
  - `article.brew-card` with `key={guide.id}`, `data-scroll-reveal=""`, `data-stagger={String(index + 1)}`
  - `.brew-card-header` with `span.material-symbols-outlined.brew-method-icon` and `div` containing `h3.brew-method-title` and `span.brew-method-profile`
  - `.brew-specs-table` mapping `guide.specs` to `.brew-spec-row` with `.brew-spec-label` and `.brew-spec-value`
  - `p.brew-adjustment-note` with `<strong>Adjust:</strong> {guide.adjustment}`

- [ ] **Step 2: Run build and parity check**
Run: `npm run build && node scripts/check-parity.mjs`
Expected: Brew Guides copy warnings (4 blocks) disappear from missing copy list.

---

### Task 4: Port Dhaka Tasting Room (`src/components/sections/Visit.tsx`)

**Files:**
- Modify: `src/components/sections/Visit.tsx`
- Reference: `legacy/index.html:532-565`, `src/config/site.ts`

**Interfaces:**
- Consumes: `SITE` from `../../config/site`
- Produces: `Visit(): JSX.Element`

- [ ] **Step 1: Implement `Visit` component in `src/components/sections/Visit.tsx`**
Replace the shell with exact markup structure:
- Section `#visit` with class `tasting-rooms-section`
- `.tasting-rooms-card` with `data-scroll-reveal=""`
- Inside wrapper div:
  - `span.tasting-room-eyebrow`: `Tasting Room · Banani, Dhaka`
  - `h2.tasting-room-title`: `Visit the Roastery Lab`
  - `p.tasting-room-desc`: `Step into our roastery for manual pour-overs, single-origin espresso flights, and weekly batch pickups. Our baristas calibrate daily on our Tuesday roasts.`
  - `.tasting-room-meta-grid`:
    - `.tasting-meta-item` (location_on): `<strong>Location</strong>`, `<span>{SITE.address.full}</span>`
    - `.tasting-meta-item` (schedule): `<strong>Opening Hours</strong>`, `<span>{SITE.hours}</span>`
- `.tasting-room-actions`:
  - `a.btn-directions` with `href={SITE.mapsUrl}`, `target="_blank"`, `rel="noopener noreferrer"`, icon `map` and `<span>Get Directions</span>`

- [ ] **Step 2: Run build and parity check**
Run: `npm run build && node scripts/check-parity.mjs`
Expected: Visit copy warning (1 block) disappears. Total missing copy blocks reaches 0.

---

### Task 5: Final Strict Verification and Quality Audit

**Files:**
- Verify: whole project

- [ ] **Step 1: Run TypeScript compiler and production build**
Run: `npm run build`
Expected: Clean build with 0 errors.

- [ ] **Step 2: Run strict design parity check**
Run: `npm run check:strict`
Expected: 0 failures, 0 warnings. All 44 legacy copy blocks found, 0 unknown classes, 30 IDs found, all asset refs resolve, CSS hash intact.

- [ ] **Step 3: Verification with browser walkthrough**
Run dev server and test responsive rendering and drawer interaction.
