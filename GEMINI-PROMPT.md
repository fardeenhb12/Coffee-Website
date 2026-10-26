You are implementing the Direction C "Gallery" restyle of the Day Three website. Work in the
repository as it stands. Do not commit to a branch other than the one you were told to use; if
none was specified, create `gallery-restyle` and work there.

## Environment — Google Antigravity

The repository root is open as your workspace and `AGENTS.md` is loaded as project context;
both are binding. Use your terminal for grep, git and the local server
(`npm run dev` → `http://localhost:3000`), and your browser tool for visual verification.
Do not install packages, scaffold a framework, or hand file edits to the browser agent — every
edit is yours, in `styles/main.css` plus the one `<link>` line in `index.html`.

## Read first, in this order

1. `GALLERY-RESTYLE.md` — the authoritative build brief. Exact tokens, selectors, phases,
   acceptance checks. Where anything disagrees with it, it wins.
2. `docs/adr/0005-direction-c-gallery.md` — why this direction was chosen.
3. `AGENTS.md` §6 — engineering guardrails.
4. `DESIGN.md` §1–§5 and §7 — the visual system as it will read after your work.
5. `MOTION.md` §3, §8, §16 — timings stay; hover affordances change.

Do not start writing CSS until you have read all five.

## The task

Restyled page: the hero stays a dark film bookend with its composition, copy, video, date band
and entrance animation intact — only its typeface changes. Every section below it (Current Lots,
Why We Print the Date, The Roaster, Brew Guides, Visit, FAQ) moves onto a single `#FAF9F6`
ground with large Inter Tight headings, Inter body copy, 1px rules instead of card boxes, zero
radii, zero shadows and no hover lift. The footer becomes an ink plate. Inter Tight + Inter are
adopted site-wide.

## Hard constraints

- Edit `styles/main.css` and exactly one line of `index.html` (the Google Fonts `<link>`).
  Nothing else.
- Do not edit `scripts/main.js`. Do not change the DOM, class names, IDs, `data-*` attributes,
  roles, ARIA attributes, copy, section order, metadata or JSON-LD.
- No new dependencies, no build step, no preprocessor, no `@import`, no utility framework, no
  new images, icons or fonts beyond Inter Tight / Inter.
- The cart engine, 250g/1kg price toggle, grind select, 1–999 quantity clamping, scroll
  reveals, focus traps and WhatsApp handoff must behave exactly as they do now.
- All new colour values come from the `--gallery-*` tokens in the brief. No new hex literals.
- Brass on paper is decorative only. Never brass text or brass icons on paper. Small secondary
  text uses `--gallery-graphite-text`, never `--gallery-graphite`.
- Preserve WCAG 2.2: 44px touch targets, visible focus rings, state not signalled by colour
  alone.

## Work order

Follow `GALLERY-RESTYLE.md` §11, phases 1–8, in order. Commit after each phase with a message
naming the phase (e.g. `style: gallery tokens and type`). Do not squash the phases.

Sequence in short:

1. Font link; typography, gallery-colour and radius tokens; the missing `--font-sans` and
   `--radius-xs` definitions.
2. Chrome: header cart pill, drawer, toasts, mobile drawer, footer ground and type.
3. Current lots: section, card-to-column, inline tasting notes, size toggle, grind, quantity,
   buttons.
4. Proof section and the date-band colour scoping (hero band untouched).
5. Roaster and brew guides.
6. Visit and FAQ.
7. Responsive, reduced motion, dead-code sweep (the list is in the brief §10).
8. Sync `DESIGN.md` only if a value drifted from the brief.

## Definition of done

Run the greps in `GALLERY-RESTYLE.md` §12 and make them return what the brief expects. Then
check every item in that manual matrix at 390, 768, 1024 and 1440 px, in the Antigravity
browser against the local server:

- one `#FAF9F6` ground below the hero, no card boxes, no radii, no shadows;
- only the permitted brass lines on paper;
- display type left-aligned, legible, not clipped;
- lot names wrap, buy row stays on one line at 390px;
- keyboard order and focus rings intact on paper and ink;
- reduced motion leaves nothing invisible and nothing moving;
- size toggle changes price, quantity clamps, add to bag updates count/total/drawer, WhatsApp
  message format unchanged.

Capture one screenshot per breakpoint (1440 / 1024 / 768 / 390) as artifacts, and keep a short
task list artifact updated as you pass each phase.

## Rules of engagement

- Do not ask design questions; the brief answers them. If two instructions genuinely conflict,
  follow `GALLERY-RESTYLE.md`, note the conflict in your final report, and continue.
- Do not "improve" the design, add ornament, reintroduce a serif or mono face, add a hover
  lift, or fill empty space with decoration.
- If a required change would need a DOM or JavaScript edit, stop that item, leave it undone,
  and report it — do not touch `main.js`.
- Do not reformat unrelated CSS. Keep the diff scoped to the restyle.

## Report back with

- the branch and the list of commits, one line each;
- files changed (`git diff --stat`);
- the exact output of the §12 greps;
- the four breakpoint screenshots as artifacts, plus a walkthrough artifact summarising what
  changed section by section;
- any deviations from the brief and why;
- anything you could not complete without a JS/DOM change.
