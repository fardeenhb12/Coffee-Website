# SKILLS.md — which skills to use, and how not to let them wreck the design

The repo ships 40+ agent skills in `.agents/skills/`. They are not all useful here, and a few
of them are actively dangerous to a pixel-parity migration.

**The rule that governs every skill in this file:** skills change *how you work*, never *what
the page looks like*. Any skill output that would alter markup, CSS, type, colour, spacing or
motion is advisory only. `src/styles/main.css` is frozen and `FIDELITY.md` outranks every skill.

Read `MIGRATION.md` first.

---

## 1. Invoke in this order

| Order | Skill | When | Why |
| :- | :--- | :--- | :--- |
| 1 | **`using-superpowers`** | already loaded — do not re-invoke | tells you to check for skills before acting |
| 2 | **`graphify`** | before reading any file | build the graph, then navigate by query |
| 3 | **`writing-plans`** | once, after orienting | turn the four sections into a plan you can execute |
| 4 | **`executing-plans`** | while porting | keep you on the plan instead of drifting |
| 5 | **`ponytail`** (full) | for every code change | smallest complete diff |
| 6 | **`verification-before-completion`** | before every "done" | evidence before assertions |
| 7 | **`systematic-debugging`** | only when something renders wrong | find the cause, don't guess at the CSS |
| 8 | **`code-review`** | after the four sections, before you report | review the branch against `MIGRATION.md` |
| 9 | **`finishing-a-development-branch`** | at the very end | decide how the work lands |

Optional, situational: `dispatching-parallel-agents` (§3), `codebase-design` (§4),
`test-driven-development` (§5), `writing-for-agents` (if you edit these docs).

**Do not invoke `brainstorming`.** It is the right skill for new work and the wrong skill here.
Its job is to question the design and propose alternatives; the design is already decided,
documented in `DESIGN.md`, and frozen in CSS. If you feel the urge to brainstorm, write the
idea in your report instead.

---

## 2. graphify — navigate, don't grep

Build the graph once, at the start, from the project root:

```bash
/graphify .
```

Then ask it questions instead of grepping:

```bash
/graphify query "how does the cart reach WhatsApp?"
/graphify query "what does the proof section depend on?"
/graphify path "LotCard" "CartContext"
/graphify explain "cartKey"
```

Why bother: the graph already knows which component imports which data file, which hook backs
which section, and which legacy line range feeds which component. Grepping for a class name
returns 40 hits; a query returns the three that matter.

Caveats for this repo:

- `legacy/` is source material, not live code. Treat graph edges from it as reference only.
- `graphify-out/` is gitignored and disposable. Rebuild it after the port lands; do not commit it.
- The graph will show `src/styles/main.css` as a hub with no dependents except `main.tsx`.
  That is correct and must stay correct.

---

## 3. dispatching-parallel-agents — the four sections are independent

`Proof`, `Roaster`, `BrewGuides` and `Visit` share no state, no props and no imports. `App.tsx`
already imports all four, so each is a self-contained file edit. They are a textbook parallel
batch.

If you dispatch subagents, give each one:

- its own file and its own legacy line range,
- `FIDELITY.md` §2–§6 verbatim,
- the instruction **not** to touch `main.css`, `App.tsx`, `package.json` or any other section,
- the requirement to run `npm run check` and paste the output.

Then verify centrally. Never let two agents touch the same file.

---

## 4. ponytail — full mode, for every edit

Invoke `ponytail` (level `full`, the default) before writing code and keep it on for the
session.

It will push you toward the smallest diff, which is exactly right here. Applied to this task:

- Delete the stub's comment block when you fill the section — don't leave a tombstone.
- No new helper, no new type, no new file, no new prop. Four sections, four files.
- No abstraction for "future sections". There is no future section.
- Reuse `SITE`, `BREW_GUIDES`, `formatTaka`, `Faq.tsx`'s pattern. They exist.
- The shortest diff that renders identically wins.

Where ponytail must yield: it will happily suggest deleting a "redundant" wrapper `<div>`.
Here, a wrapper the CSS targets is not redundant. `FIDELITY.md` §2.3 wins.

---

## 5. ui-ux-pro-max — audit only, never apply

This skill carries 79 styles, 192 product palettes, 74 font pairings, 119 UX guidelines and 22
stack guides. Pointed at a React project it will, by default, propose a design system. **That
would destroy this migration.**

Invoke it in one mode only: **as an auditor of what is already built.**

```bash
/ui-ux-pro-max audit the Visit and Brew Guides sections for accessibility regressions
```

Legitimate uses:

- contrast checks on the existing tokens,
- touch-target size (≥ 44px) and focus-ring visibility,
- responsive breakpoint sanity at 390 / 768 / 1024 / 1440,
- checking that state is not signalled by colour alone.

Illegitimate uses — refuse these even if the skill suggests them:

- any palette, font pairing, style or layout recommendation,
- any new component or pattern,
- any "modernise", "elevate", "polish" or "refresh" pass,
- any suggestion that reaches `main.css`.

If an audit finds a real accessibility defect, report it. Do not fix it in this branch — the
fix belongs in a design change with `DESIGN.md` updated, and `FIDELITY.md` §8 says so.

---

## 6. design-motion-principles — same restraint

Useful for checking that entrances, hovers and reduced-motion behaviour still match
`MOTION.md`. Not useful for adding motion.

Invoke it to **compare**, not to create:

- do the reveal offsets and durations match `MOTION.md`?
- does `prefers-reduced-motion: reduce` leave nothing invisible and nothing moving?
- are hover affordances the same as the legacy build (rule colour change, no lift)?

Every timing already lives in the frozen CSS. There is nothing here to author.

---

## 7. verification-before-completion — the non-negotiable one

Before you write the words "done", "complete", "fixed" or "passing", you must have run the
commands and be looking at their output:

```bash
npm run build
npm run check:strict
npm run dev        # then click through it
```

Paste the real output in your report. If the check is red, say so — a red check reported
honestly is worth more than a green claim nobody verified.

`npm run check:strict` reporting **0 warnings** is the single strongest signal that the port is
complete: it means every copy block from the legacy markup now exists in `src/`.

---

## 8. systematic-debugging — when something looks wrong

The failure mode here is specific: the page renders, TypeScript is happy, and something is
visually off. Resist opening `main.css`.

Diagnose in this order:

1. **DOM shape.** Does the element have the wrapper its siblings have? Is a `data-*` attribute
   missing? Is a class on the wrong node? Diff against the legacy line range.
2. **Class name.** `npm run check` catches unknown tokens.
3. **Attribute casing.** `class` vs `className`, `for` vs `htmlFor`, `playsinline` vs
   `playsInline` — a dropped `playsInline` breaks the hero video on iOS.
4. **Text.** A stray `&nbsp;`, a hyphen instead of `−`, a straight quote instead of `’`.
5. **Only then** suspect CSS — and if you do, you have almost certainly changed the DOM.

---

## 9. code-review and finishing-a-development-branch

After the four sections are green, run `code-review` with the fixed point set to the commit
before the migration started. It reviews two axes — does the code follow this repo's standards
(`AGENTS.md`), and does it match what was asked (`MIGRATION.md`). Both answers matter.

Then `finishing-a-development-branch` to decide how the work lands. Do not merge, tag or push
without the human saying so.

---

## 10. Skills that do not apply

| Skill | Why not |
| :--- | :--- |
| `brainstorming` | the design is decided and frozen; this skill exists to question it |
| `prototype` | nothing to explore — the target already exists as `legacy/` |
| `research` | the answers are in this repo |
| `domain-modeling` | `GLOSSARY.md` already fixes the vocabulary |
| `tdd` / `test-driven-development` | no new logic. If you find yourself changing `lib/cart.ts` or `lib/whatsapp.ts`, stop — that is a behaviour change and needs a test and a conversation first |
| `improve-codebase-architecture` | post-migration work, not migration work |
| `wizard` | nothing to provision |
| `handoff` | you are the handoff |

---

## 11. One-line summary

Graphify to navigate, writing-plans to plan, ponytail to write, verification to prove,
code-review to check, and ui-ux-pro-max strictly as a critic — with `main.css` frozen the whole
way.
