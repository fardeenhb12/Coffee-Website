# Instruction for Gemini — Day Three × Little Amps, reference quality

**Paste this entire file to the agent. It is self-contained.**
**Deliverable:** a new Stitch canvas for the Day Three homepage that a working designer would
believe was art-directed by the Little Amps team — using only Day Three's real content.
**Working directory:** `/Users/fardeen.bhuiyan/Desktop/AI Projects/Coffee Website React`
**Scope:** Stitch canvas only. Read the repo; do not edit it. `src/styles/main.css` is frozen.

---

## 0. Your role, and the one rule

You are not inventing a visual direction. The direction is already decided and already measured.
Your job is **execution at reference fidelity**.

> The one rule: **borrow Little Amps' structure and mechanics, never its content.**
> Day Three is a different roastery with different facts. What transfers is the layout rhythm, the
> type system, the palette roles, the card anatomy and the discipline. The address, the record
> collection, the Spotify playlists, the producers and the products do **not** transfer.

If a required fact or asset does not exist, **stop and ask**. Do not fill the gap with plausible
copy. Invented detail is the single largest source of the "AI slop" you are being asked to avoid.

---

## 1. Read these first, in this order

| # | File | What you take from it |
| :--- | :--- | :--- |
| 1 | `docs/references/little-amps/DESIGN.md` | **Visual source of truth.** Exact fonts, hexes, sizes, section anatomy, anti-patterns. |
| 2 | `AGENTS.md` §1, §5, §6 | What Day Three is, the real data contracts, the guardrails. |
| 3 | `BRAND.md` | The brand belief: freshness honesty, Tuesday roast, Day Three. |
| 4 | `src/config/site.ts` | Address, hours, phone, WhatsApp, free-delivery goal. **Never retype these from memory.** |
| 5 | `src/data/lots.ts` | The real lots, prices, notes, roast dates, stock. |
| 6 | `PAGE-SPEC.md` | Which sections exist and what they say. |
| 7 | `https://littleampscoffee.com/` | The live reference. Look at it at 1440 px before you generate anything. |

A full-page capture of the reference at 1440 px is committed next to this file:
`docs/references/little-amps/reference-homepage-1440.jpg`. Use it for the side-by-side in §11.

**Do not follow these files — they are superseded and are the reason the last canvas looked
generated:**

- `docs/superpowers/specs/2026-11-01-little-amps-stitch-redesign-design.md`
- `docs/superpowers/plans/2026-11-01-little-amps-stitch-redesign.md`

Their palette (`#FFFBEB` / `#C2410C` / `#059669`), their font choices ("let the generator pick a
warm display face"), their seven-section list and their three-card journal row are all wrong.
Do not reuse any of it.

---

## 2. Non-negotiables

Copy these values from the reference document. Do not approximate, do not substitute, do not let
the generator choose.

**Palette — exactly these seven, no others:**

```
cream    #FFF9F2   canvas
beige    #F6EDE3   media wells, quiet panels
brown    #522C25   ink, borders, subscription band
brick    #C03001   footer band, emphasis
mustard  #C46500   emphasis, card accents
peach    #FEBF6F   card accents
blue     #89B4CA   notice strip, tasting-room band
```

**Type — exactly three families:**

```
display  "Little Amps" serif, 500, line-height 1.0, letter-spacing -0.1em
         free substitute: Fraunces 500 at -0.06em, or DM Serif Display
body     "Inclusive Sans", 400, 16px
utility  "Necto Mono", 400, uppercase, 13.6px, +0.05em
         free substitute: DM Mono
```

**Geometry:**

```
root 10px · gutters 36px · section rhythm 160px desktop / 50px mobile
media radius 8px (hero wrapper 22px) · button radius 2px · badges 4px
separators 1px brown · zero shadows · zero gradients · zero blur
```

---

## 3. Banned patterns — any one of these fails the deliverable

1. A second display face, or a sans-serif heading.
2. Headings that are not the serif, or serif at any weight other than 500.
3. Letter-spacing looser than `-0.08em` on display text, or heading line-height above 1.0.
4. Any grey, cold white, or colour outside the seven tokens.
5. Material-3 / tonal-ramp token names (`surface-container-high`, `on-surface-variant`).
6. A palette or style chosen from `ui-ux-pro-max`'s colour/style tables.
7. Cards with borders, fills, radii, shadows, or hover lift. Cards are columns on 1px rules.
8. Pill buttons, pill chips, filter chips, tag chips.
9. Stat strips ("3 lots · 100% · 72 hrs"), logo rows, feature-chip rows, timeline cards,
   three-card "journal" rows, newsletter bars, "Why choose us" grids.
10. Emoji as icons or as decoration, anywhere.
11. Sticky badges clusters, "NEW" ribbons (a single round seal is allowed, max one per card).
12. Gradient scrims, glassmorphism, backdrop blur, parallax, scroll-reveal animations.
13. Stock photography, generated roastery photos, synthetic portraits, or AI "film grain" people.
14. Invented facts, invented amenities, invented producers, invented playlists, invented record
    collections, invented certifications.
15. More than one accent fill per card.
16. Copy that explains the product in paragraphs. Price, origin, notes, roast level are **data**,
    set in mono.

---

## 4. Facts: what you may use, what you must not invent

**Use verbatim from the repo:** the Banani address, opening hours, phone, email, WhatsApp number,
free-delivery threshold, lot names, origins, processes, altitudes, tasting notes, prices (250g and
1kg), roast dates, stock flags.

**Do not invent:** any amenity the cafe does not have (no vinyl corner, no record shelf, no
listening bar, no Spotify, no subscription programme, no merchandise, no wholesale programme,
no loyalty scheme), any producer story, any award, any capacity claim, any "since 20XX".

**If a band needs a fact you cannot source, delete the band** — do not write around it.

**Copy budgets are hard limits:**

| Band | Max words of body copy |
| :--- | :--- |
| Notice strip | 16 |
| Statement band | 40 (one sentence) |
| Photo caption | 5 |
| Section headings | 6 |
| Band intros | 35 |
| Lot card | 0 (name, price, origin, notes, roast name only) |
| Footer | 25 |

When forced to choose between more content and more space, **choose space**.

---

## 5. The skeleton — nine bands, no more

Do not add sections. The Day Three homepage is exactly this:

| # | Band | Ground | Content | Assets |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Hero film | dark footage | wordmark only, top-left; no headline, no CTA, no scroll cue | `public/video.mp4`, poster frame |
| 2 | Notice strip | blue | one line: next roast day · free delivery over ৳2,500 · orders confirmed on WhatsApp | — |
| 3 | Header | cream | wordmark left; `LOTS` `WHY TUESDAY` `TASTING ROOM` `BREW GUIDES` `FAQ`; `CART n` right. No account, no search | — |
| 4 | Statement band | cream | one serif sentence with 3–5 italic, colour-switched words; no mascot — leave the right 20% empty or place one simple line mark | — |
| 5 | Photo + first lot split | cream | full-bleed lifestyle photo with a 4–5 word cream serif caption overlaid top-left; one lot card right | `lot-*` or `hero-roaster.jpg` |
| 6 | Lot grid | cream | all lots, 4-up desktop, 2-up tablet, 1-up mobile, 1px rules | `lot-*.jpg` packshots |
| 7 | Roast story | brown | "Why we roast on Tuesdays", ≤35 words, one photo, no timeline, no day-by-day cards | `founder-zarif.jpg` or roastery photo |
| 8 | Tasting room | blue | address + hours + one line + one button; no feature chips, no "record collection" | interior photo |
| 9 | Footer | brick | cream rounded panel: wordmark, address, hours, WhatsApp, nav links; legal line | — |

Brew guides and FAQ are **links in the header and footer**, not homepage sections.
No section may repeat another section's message.

**Statement band — the one sentence that carries the brand.** Use this or something tighter,
never longer:

> Every bag is roasted on **Tuesday** in Banani, stamped with its **roast date**, and reaches its
> best on **Friday** — the third day.

Emphasis words are italic **and** coloured, cycling brick → blue → mustard. Base text stays brown.

---

## 6. Assets

- Use only files that exist in `public/assets/images/` and `public/video.mp4`. List them before you
  start.
- Photography is documentary: warm white balance, visible grain, no studio sweep, no stock smile.
- **No synthetic people, ever.** A generated roastery is acceptable only as a background plate and
  only if a real photo cannot carry the band; prefer the real photo.
- **Illustration policy:** at most one line mark per band, drawn as inline SVG, single weight
  (1.5px), brown, geometrically simple (a cup, a bean, a cherry, steam, a ring). **No character
  mascots, no stickers, no emoji.** If you cannot draw it cleanly in 20 SVG nodes, leave the space
  empty. Empty space is on-brand; a bad drawing is not.
- Packshots sit in a beige media well at 8px radius, never cropped, never tinted, never on white.

---

## 7. How to execute in Stitch

1. **`create_design_system_from_design_md`** using an adapted copy of
   `docs/references/little-amps/DESIGN.md` — palette §2, typography §3, geometry §4 only. Do not
   let Stitch infer the tokens.
2. **`create_project`** → new project named `Day Three — Little Amps Register v2`.
   Leave the old projects untouched.
3. **`generate_screen_from_text`**, `deviceType: DESKTOP`, with the prompt in §8. One generation.
4. **`get_screen` + download the HTML.** Verify in the HTML: the three font families, the seven
   hexes and nothing else, nine bands, no banned pattern from §3.
5. **Iterate with `edit_screens`, never by regenerating from scratch.** Regeneration loses fidelity.
   Budget: up to 4 edit passes. Each pass fixes one named defect from the checklist.
6. **Generate the MOBILE companion** only after desktop passes.
7. **Report back** with: screen link, full-page screenshot, exported HTML, and the checklist in §10
   filled in with evidence.

If `generate_screen_from_text` times out, poll `get_screen`. Do not fire duplicate generations.

---

## 8. The generation prompt

Use this text as the Stitch prompt, adjusted only for facts you pulled from the repo.
If this prompt and `DESIGN.md` ever disagree, **`DESIGN.md` wins**:

```
A warm indie coffee-roastery homepage in the register of a record shop, not a SaaS product.
Canvas #FFF9F2, ink #522C25, beige #F6EDE3, brick #C03001, mustard #C46500, peach #FEBF6F,
blue #89B4CA. No greys, no gradients, no shadows, no glass.

Headings: fat warm serif (Little Amps Serif / Fraunces 500), line-height 1.0, letter-spacing
-0.08em, sentence case, real punctuation. Body: Inclusive Sans 16px. Prices, labels, buttons and
dates: monospace, uppercase, 13px, +0.05em.

Bands, in order:
1. Muted roastery film inset 15px inside a peach #FEBF6F frame, 22px radius, wordmark top-left only.
2. 32px dusty-blue strip, one line of brown text, no animation.
3. 69px cream header split into four zones by full-height 1px #E6DAD4 vertical rules: wordmark,
   mono nav LOTS / WHY TUESDAY / TASTING ROOM / BREW GUIDES / FAQ, SEARCH, CART n.
4. Cream statement band: one 41px serif sentence where single words turn italic and switch to
   brick, blue and mustard; right 20% left empty.
5. Cream split: large lifestyle photo with a 4-word cream serif caption overlaid top-left; one
   product card to the right.
6. Cream 4-up product grid separated by 1px rules. Each card: beige 8px packshot well, serif
   product name, mono price, mono uppercase origin, three tiny line-art gauges labelled
   SWEETNESS / ACIDITY / COMPLEXITY, a notes line, a two-segment roast bar, one solid near-square
   button in the card's accent colour.
7. Full-bleed brown band: cream serif heading, one short paragraph, one photo.
8. Full-bleed dusty-blue band: address and hours, one line, one mono button.
9. Brick footer band with an inset cream rounded panel: wordmark, address, hours, WhatsApp, links,
   legal line.

Use 1px rules instead of card borders. One accent fill per card. No stat strips, no pills, no
badge clusters, no emoji, no newsletter bar, no journal cards, no scroll animations.
```

---

## 9. Skills

Use these deliberately. Misusing them is how the last canvas went wrong.

| Skill | How to use it here | How **not** to use it |
| :--- | :--- | :--- |
| `superpowers:writing-plans` | Plan the Stitch calls and the edit passes. | Do not re-plan the visual direction. |
| `superpowers:verification-before-completion` | Run every check in §10 and quote the evidence. | Do not claim success from a screenshot glance. |
| `ui-ux-pro-max` | **Only** for contrast, touch-target and focus-state audits. | Do **not** use its colour, style or pattern tables. It produced the last palette. |
| `design-motion-principles` | Hover swap timing, reduced-motion fallbacks. | Do not add entrance animations. |
| `superpowers:brainstorming` | Not needed. The direction is approved. | Do not reopen it. |

---

## 10. Checklist — evidence required, not opinion

Fill this table and include it in your report. Each row needs a concrete observation (file line,
computed value, or screenshot region), not "yes".

| # | Check | Evidence |
| :--- | :--- | :--- |
| 1 | Exactly three font families; serif on every heading | |
| 2 | Display tracking ≤ `-0.06em`, line-height ≤ 1.0 | |
| 3 | Seven hexes only; zero greys; no gradient/shadow | |
| 4 | Nine bands, in the order in §5; no extra section | |
| 5 | Every copy budget in §4 respected | |
| 6 | One accent fill per card; buttons near-square, mono, uppercase | |
| 7 | Cards are columns on 1px rules — no borders, fills, radius, shadow | |
| 8 | No banned pattern from §3 present | |
| 9 | Real Day Three assets only; no synthetic people | |
| 10 | Address / hours / WhatsApp / delivery goal match `src/config/site.ts` exactly | |
| 11 | Body text contrast ≥ 4.5:1; every target ≥ 44px | |
| 12 | Hero has no headline, no CTA, no scroll cue | |
| 13 | Mobile variant reflows to 1-up with no horizontal scroll | |

**A 1:1 result looks like this:** at 1440 px the page is cream, brown and three flat colour bands;
the headings are a fat serif with words almost touching; every price and label is mono; the lot
grid reads as four calm columns divided by hairlines; each card carries one coloured button; the
only images are real photographs and beige packshot wells; and there is noticeably more empty space
than text.

If your output needs a paragraph to explain why it looks the way it does, it is not 1:1 yet.

---

## 11. Definition of done

- Desktop and mobile screens generated, iterated with `edit_screens`.
- §10 checklist complete, with evidence.
- Exported HTML saved alongside the project and inspected.
- A one-screen side-by-side: reference homepage vs generated homepage, same viewport width.
- Anything you could not source is listed explicitly as missing — not papered over.

Send back the screen link, the screenshot, the HTML, the checklist and the missing-items list.
