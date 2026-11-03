# PROJECT-BOOTSTRAP.md

**Universal new-project protocol.** Attach this file with your brief and any existing files.
The agent creates the documentation skeleton first, then populates it from the brief before
writing feature code. Copy this file into your templates folder and reuse it unchanged.

> **Agent instruction:** you are starting a new project. Follow the phases in order.
> Do not skip Phase 3 (doc skeleton) and do not write feature code before Phase 6 passes.
> Ask at most five consolidated questions, in one message, at the gates marked **ASK**.
> Never invent brand facts, names, prices, copy, or testimonials. If the brief is silent,
> ask or record an explicit `ASSUMPTION:` — never both.

---

## 0. Inputs

| Input | Required | Notes |
| :--- | :---: | :--- |
| Project brief | Yes | Product, audience, goal, scope, constraints |
| Existing files / repo | If any | Code, assets, brand docs, references |
| Visual references | Optional | Screens, sites, competitors, mood |
| Stack preference | Optional | Otherwise detect in Phase 1 |
| Deadline / non-goals | Optional | Write both into `AGENTS.md` §1 |

If the brief is missing, **stop after Phase 3** and ask for it. Skeletons can exist empty;
placeholders may not survive Phase 6.

---

## 1. Phase 1 — Read and classify (write nothing yet)

1. Restate the brief in five lines: **product · audience · platform · stack · hard constraints**.
2. Inventory the folder: existing code, lockfiles, assets, fonts, docs, analytics, CI.
3. **Detect** the stack from files — `package.json`, `pyproject.toml`, `composer.json`,
   `pubspec.yaml`, `*.xcodeproj`. Never assume a framework.
4. Classify the product type, because it drives every later decision:

   | Type | Default motion weighting |
   | :--- | :--- |
   | Marketing / landing | Polish (Jakub) · restraint (Emil) |
   | E-commerce | Polish (Jakub) · selective delight (Jhey) |
   | SaaS / dashboard | Restraint and speed (Emil) |
   | Portfolio / creative | Expression (Jhey) · polish (Jakub) |
   | Kids / education | Delight (Jhey) · polish (Jakub) |

5. List unknowns. **ASK** once, consolidated, maximum five items. Scope and brand facts
   are blocking; implementation details are not.

**Output:** a short classification block in chat. No files.

---

## 2. Phase 2 — Toolchain

Install only what the project needs. Check prerequisites first (`node`, `npm`, `python3`,
`uv` or `pipx`); if something is missing, say so and continue — never silently skip.

### Skills (project-scoped)

Detect the host (`opencode`, `claude`, `cursor`, `codex`, `gemini`) and pass it as `-a`.
Use `-y` so the install is non-interactive.

```bash
# Simplest-code discipline — always
npx -y skills add https://github.com/dietrichgebert/ponytail \
  --skill ponytail -a <agent> -y

# Design intelligence (styles, palettes, type pairings, UX rules) — any visual project
npx -y skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill \
  --skill ui-ux-pro-max -a <agent> -y

# Motion craft (create + audit modes) — any project with animation
npx -y skills add https://github.com/kylezantos/design-motion-principles \
  --skill design-motion-principles -a <agent> -y
```

### Knowledge graph (codebases of any size)

```bash
uv tool install graphifyy        # or: pipx install graphifyy
graphify install --project --platform <agent>
graphify --version
```

If the graph cannot be installed, note it in `AGENTS.md` §Known issues and move on.

### Verify

```bash
npx skills list
```

**Expected layout after install**

| Path | What |
| :--- | :--- |
| `.agents/skills/<name>/` | The skill itself (copied, not linked) |
| `skills-lock.json` | Source repo + hash per skill; commit it |
| `.opencode/skills/graphify/` | Graphify's `/graphify` skill (project-scoped) |
| `.opencode/plugins/graphify.js` | One query-first reminder per session |
| `graphify-out/` | Generated graph — disposable, git-ignored by default |

If a skill is already present in `.agents/skills/`, skip it rather than reinstalling.
Never install a skill globally when the project has its own lockfile — it forks the source
of truth.

**Output:** installed skill list + versions. Do not edit application code in this phase.

---

## 3. Phase 3 — Create the doc skeleton (before any feature code)

Create these four files. Each gets a header, `status: draft`, and `TODO(brief)` markers —
never filled with invented content.

### `AGENTS.md` — engineering contract (required)

```markdown
# AGENTS.md
> Engineering context. Read before touching code. Visual rules: DESIGN.md.
> Motion rules: MOTION.md (if present).

1. What this project is          — product, audience, hard non-goals
2. Stack & quick start           — versions, install, dev, build, test commands
3. Repository layout             — annotated tree, load order
4. How the code is organised     — numbered sections for each large file
5. Conventions                   — naming, state classes, data attributes, patterns
6. State & data contracts        — the mutable state, ids used by JS, anchors
7. Extension recipes             — "add a product / page / section" steps
8. Known issues & technical debt — numbered, with status
9. Manual QA checklist           — what to verify before calling it done
10. Guardrails                   — do / don't / explicitly out of scope
```

Rules for this file:

- Sections are **numbered** and stay numbered. Agents cite them.
- Every JS id in §6 must exist in markup; every anchor must resolve.
- §9 is a real checklist, not prose.
- If the project has no motion, omit `MOTION.md` links — do not create empty docs.

### `DESIGN.md` — visual specification (required if there is UI)

```markdown
1. Design intent              — 3 principles + tone words + what it is NOT
2. Color system               — token table: name, value, use. One accent.
3. Typography                 — families, roles, full scale table, rules
4. Layout & spacing           — scale, rhythm, grid, container widths
5. Shape, borders & elevation — radii, hairlines vs shadows, no-glass policy if so
6. Motion system              — link to MOTION.md, timing tokens summary
7. Section-by-section spec    — one block per page section, top to bottom
8. Component library          — buttons, pills, forms, cards, states
9. Responsive behaviour       — breakpoints and what changes at each
10. Accessibility             — contrast pairs with measured ratios, focus, targets
11. Anti-patterns             — what this project must never look like
```

Rules for this file:

- Every token in the tables must exist in code with the same name.
- Contrast ratios are **measured**, not guessed.
- Section specs describe the real markup order.
- Delete unused rows; a padded palette is a defect.

### `MOTION.md` — motion & interaction spec (only if anything moves)

```markdown
0. How to read this document
1. Scope & non-goals
2. Motion principles
3. Timing tokens               — easing, duration, delay, distance
4. Keyframe registry           — name, definition, consumers, status
5. Scroll reveal system        — contract + reference implementation
6. Component interaction specs — one block per animated component
7. State machines              — add-to-cart, overlays, forms
8. Accessibility & motion safety — reduced-motion contract, WCAG checks
9. Performance budget
10. Responsive & device behaviour
11. QA & verification
12. Gap register               — known misses, numbered, with status
```

Rules for this file:

- Every keyframe named in §4 must exist in CSS or be marked removed.
- Reduced motion is specified in the same section as the animation, not as a TODO.
- Timing values in the doc must match the code.

### `README.md` — human entry point (required)

What it is, how to run it, where the docs live, one screenshot placeholder.

---

## 4. Phase 4 — Populate from the brief

Run this only when the brief (and assets) are present.

1. Fill every `TODO(brief)` in one pass. Delete skeleton sections that do not apply.
2. **Cross-link tokens:** `DESIGN.md` color/type/spacing names → real CSS custom properties.
   `MOTION.md` timings → real values in CSS. `AGENTS.md` ids → real markup ids.
3. Write the **section-by-section** spec from the actual section order, not from imagination.
4. Record only facts the brief or files support. Unknowns become one `ASSUMPTION:` line
   at the top of the affected doc, repeated nowhere else.
5. If the brief contradicts an existing file, stop and **ASK** — do not overwrite silently.

**Output:** four documents with zero `TODO` and zero placeholders.

---

## 5. Phase 5 — Minimum runnable baseline

1. Scaffold the smallest thing that runs (one page, one route, one screen).
2. Create `.gitignore` and `.graphifyignore` **before** the first build so generated output
   and vendored skills never pollute the graph.
3. Establish the token layer first: colors, type scale, spacing, radii, easings.
4. Add the accessibility floor on day one: landmarks, skip link, focus-visible ring,
   labelled controls, reduced-motion block.
5. Build the graph and the navigation artifacts:

```bash
graphify extract . --code-only
graphify cluster-only . --no-label
graphify export wiki
```

6. Add a §"Knowledge graph" section to `AGENTS.md` with the real command set and the
   current node/edge/community counts.
7. Commit the baseline (if the project is a git repo) before feature work.

---

## 6. Phase 6 — Definition of done (gate)

Do not start features until every line is true.

- [ ] Brief restated and confirmed; non-goals written down
- [ ] Stack detected, not assumed; run commands verified
- [ ] Skills installed and listed; graph CLI works
- [ ] `AGENTS.md`, `DESIGN.md`, `README.md` complete; `MOTION.md` only if motion exists
- [ ] Zero `TODO` / `lorem` / placeholder copy outside the README screenshot
- [ ] Tokens defined once and used everywhere; no raw hex in components
- [ ] Every JS id in `AGENTS.md` exists; every anchor resolves
- [ ] Accessibility floor in place (focus, labels, landmarks, contrast measured)
- [ ] `prefers-reduced-motion` handled for every animation
- [ ] Responsive rules at every declared breakpoint
- [ ] `.graphifyignore` / `.gitignore` in place; graph builds clean
- [ ] Dev server runs; no console errors
- [ ] Baseline committed

If a line cannot be true yet, write why in `AGENTS.md` §Known issues with a status.

---

## 7. Guardrails (universal)

**Do**

- Match the codebase's existing structure, naming, and conventions before inventing anything.
- Keep dependencies out unless the brief requires them; every new dependency needs approval.
- Reuse tokens; delete dead tokens, dead classes, and dead keyframes when found.
- Animate only `transform`, `opacity`, `filter`; never `width`, `height`, `top`, `left`.
- Ship reduced-motion handling in the same change as the animation.
- Keep docs and code in the same commit. A stale normative doc is a bug.

**Don't**

- Don't invent brand voice, pricing, testimonials, addresses, or legal text.
- Don't add a design system file in two places; one source of truth per concern.
- Don't leave loops, pulses, or ambient motion without a pause mechanism.
- Don't ship centered-everything layouts, padded palettes, or one-radius-fits-all styling.
- Don't call a phase done because the file exists — it is done when it is populated and true.

---

## 8. Optimisation defaults (apply unless the brief says otherwise)

| Area | Default |
| :--- | :--- |
| Fonts | Max 2 families; preconnect; `display=swap`; subset if self-hosted |
| Images | Explicit dimensions; lazy below the fold; modern formats; art-directed crops |
| Layout | Container token + breakpoints declared once; no horizontal overflow |
| JS | No globals; guarded lookups (`if (el)`); delegated handlers for re-rendered lists |
| State | One mutable store per concern; derived values computed, not stored |
| Motion | Custom easing tokens; enter ≠ exit weight; no animation on high-frequency actions |
| A11y | 4.5:1 body text; 24px minimum targets (44px on touch); visible focus; labels |
| Docs | Numbered sections; tables over prose where a table is clearer |

---

## 9. Commands appendix

```bash
# --- skills ---
npx -y skills add <repo-or-url> --skill <name> -a <agent> -y
npx -y skills list
npx -y skills update -p

# --- graph ---
uv tool install graphifyy
graphify install --project --platform <agent>
graphify extract . --code-only
graphify update .
graphify cluster-only . --no-label
graphify export wiki
graphify query "<question>"
graphify path "<A>" "<B>"
graphify explain "<concept>"

# --- design intelligence (ui-ux-pro-max) ---
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<product> <industry>" --design-system
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<concern>" --domain <style|color|typography|ux|motion|icons>
```

---

## 10. Stop conditions

Stop and **ASK** — do not guess — when:

- the brief is missing, contradictory, or conflicts with existing files;
- brand voice, naming, pricing, or legal copy is undefined;
- the stack cannot be detected and the choice changes the architecture;
- a required install fails and the workaround would alter the project;
- a normative document and the code disagree.

Otherwise proceed to the next phase and report what changed.
