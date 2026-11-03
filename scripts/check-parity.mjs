#!/usr/bin/env node
/**
 * Design-parity guard for the React migration.
 *
 * Fails if the port has drifted from the legacy site. Run after every phase:
 *
 *   npm run check            structural checks + copy warnings
 *   npm run check:strict     the same, but any missing copy is a failure
 *
 * Checks
 *   1. FROZEN CSS    `src/styles/main.css` is byte-identical to the original.
 *   2. CLASS PARITY  every class used in `src/` exists in the CSS or in the
 *                    legacy markup (catches typos and invented classes).
 *   3. ID PARITY     every `id` in the legacy markup still exists in `src/`.
 *   4. ASSET PARITY  every `/assets/...` path referenced in `src/` resolves.
 *   5. TEXT PARITY   every copy block in the legacy markup still appears in
 *                    `src/` or the Vite `index.html`.
 *
 * Exit code 1 on any hard failure.
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const STRICT = process.argv.includes('--strict');

/**
 * sha256 of `src/styles/main.css`.
 *
 * Changed deliberately on 2 November 2026: the site was moved from the
 * Direction C gallery treatment to the Little Amps register (see
 * docs/references/little-amps/DESIGN.md). The stylesheet is still frozen —
 * it is a single hand-written file, still imported once, and this constant
 * still fails the build the moment it changes. Update it only for another
 * deliberate design decision, never to silence drift.
 * Changed deliberately on 2 November 2026 (second time): the closing three
 * sections gained a footer bookend, a live open/closed status, a roaster
 * credentials row and WhatsApp enquiry actions. See
 * `docs/superpowers/specs/2026-11-02-footer-visit-roaster-design.md`.
 *
 * Changed again the same day: headlines on light grounds moved to the warmer
 * `--brown-title`, and the Lots headline stopped inheriting the 0.8 opacity of
 * the supporting copy beside it. Side arrows positioned on carousel flanks.
 *
 * Changed again on 2 November 2026: the bag drawer gained a per-row remove
 * control and hold-to-repeat steppers. New section-15 blocks only; no existing
 * selector edited. See
 * `docs/superpowers/specs/2026-11-02-cart-drawer-refinements-design.md`.
 *
 * Changed again on 2 November 2026: Modern Rounded Component Refresh & Apple
 * Micro-Interactions. Eliminates flat dividers and sharp edges across Proof,
 * FAQ, Roaster and Cart; adds elevated squircle cards, circular badge wells,
 * frosted quote plate, pill tags, and Apple-grade :active spring compression
 * (scale(0.95)) and hover elevation (translateY(-4px)).
 * See `docs/superpowers/specs/2026-11-02-modern-rounded-micro-interactions-design.md`.
 *
 * Changed again on 2 November 2026: Middle-aligned FAQ section and compact
 * max-width. Constrained FAQ container from 1600px to 840px to eliminate
 * oversized horizontal stretching; centered FAQ headline, subtext, and container;
 * refined accordion and chevron padding for sleek visual rhythm.
 *
 * Changed again on 3 November 2026: Upgraded utility & number typography token
 * `--mono` from DM Mono to DM Sans. Eliminates the code-like slashed zero (0̸)
 * and awkward monospace pitch across elevation figures, prices, and roast
 * dates in favor of clean, circular, humanized numbers.
 *
 * Changed again on 3 November 2026: Refined desktop navigation active state.
 * Replaced harsh full-cell inset box-shadow (which collided with the left hairline
 * divider) with an elegant floating rounded pill indicator (`::after`) aligned
 * directly to the text width and breathing above the bottom border. Initialized
 * active state to empty when viewing the hero banner at scrollY = 0.
 *
 * Changed again on 3 November 2026: Applied DM Sans (`var(--mono)`) to lot fact
 * values (`.lot-fact dd` for process, altitude, and roast date) and cart subtotal
 * price (`.cart-total-amount`), eliminating the serif font and Inclusive Sans
 * quirks for unified, modern numeric typography.
 *
 * Changed again on 3 November 2026: Constrained roaster pull-quote width with
 * `max-width: 54ch`, eliminating the over-extended 760px wide letterbox box,
 * balancing vertical padding and typographic rhythm.
 *
 * Changed again on 3 November 2026: Redesigned the Roaster section as a curated
 * artisan dossier plate (Direction A benchmarked against Mobbin). Positioned
 * "Head Roaster & Founder" directly under "Zarif Rahman" with flex gap spacing.
 * Added tactile crinkle paper texture overlay (`crinkle-paper.jpg`, 20% overlay)
 * across the Roaster section background to eliminate flat brown blandness.
 *
 * Changed again on 3 November 2026: Added live countdown timer wells to the
 * footer's Next Roast dispatch date (Mobbin Direction A: Flodesk/Apple modular
 * wells). Removed the redundant "ORDERS CLOSE IN" live pill kicker above the date
 * to keep the layout minimal and uncluttered.
 *
 * Changed again on 3 November 2026: Added interactive horizontal scroll progress
 * bar and scrubber to the 3D coffee lots carousel (`.coverflow-scrollbar-container`,
 * `.coverflow-scrollbar-track`, `.coverflow-scrollbar-thumb`), supporting 2-finger
 * trackpad horizontal wheeling, touch dragging, and click scrubbing.
 *
 * Changed again on 3 November 2026: Replaced cart drawer text thumbnail placeholder
 * with product packaging photos (`.cart-item-thumb`), styled with `object-fit: cover`
 * and centered alignment for clean framing.
 *
 * Changed again on 3 November 2026: Switched primary body typeface `--sans` from
 * Inclusive Sans to DM Sans across the entire site for clean, modern sans-serif typography.
 *
 * Changed again on 3 November 2026: Added frosted glass translucent effect
 * (`backdrop-filter: blur(12px)`, translucent cream tint, soft shadow) to the
 * hero "How We Roast" secondary pill button for enhanced visibility over the ambient video.
 *
 * Changed again on 3 November 2026: Added subtle roasted coffee beans scattered
 * along the page margins peeking in on the left and right sides of the FAQ section
 * (`.faq-beans-decor`, `.faq-beans-left`, `.faq-beans-right`).
 */
const FROZEN_CSS_SHA = 'dbb803e6ddfffa6951d6e64b2e0463e99acdf9ad173e30bb75e428872a931540';

/**
 * IDs that existed in the legacy markup and were removed on purpose.
 *
 * `#newsletter-form` went with the footer's fake subscribe form, which toasted
 * "Subscribed" and stored nothing.
 */
const RETIRED_IDS = ['newsletter-form'];

/**
 * Copy blocks that cannot be verified statically because part of the sentence
 * is computed at render time. Each entry needs a human to eyeball it once; see
 * FIDELITY.md §"Interpolated copy".
 */
const ALLOWED_COPY_GAPS = [
  'Add ৳ 2,500 more for free delivery',
  'Free delivery unlocked (over ৳ 2,500)',
  'Adjust: If the cup tastes sour or thin, grind finer or pour slower; if it tastes bitter or astringent, grind coarser.',
  'Adjust: If the brew tastes sharp or weak, steep 30 seconds longer; if astringent or difficult to press, grind coarser.',
  'Adjust: If the body feels watery, steep a minute longer; if muddy or bitter, skim the crust before plunging.',
  'Adjust: If the coffee tastes bitter or scorched, pull off heat immediately when sputtering begins; if sour, start with boiling water in the base.',
  'Roasted in Dhaka · Every Tuesday',
  'Roasted in Dhaka Every Tuesday',
  'The Freshness Standard · Banani, Dhaka',
  'The Freshness Standard Banani, Dhaka',
  'Extraction Calibration · Banani Lab',
  'Extraction Calibration Banani Lab',
  'Clear Answers · Dhaka Roastery',
  'Clear Answers Dhaka Roastery',
  'Order by 2 PM for same-day dispatch',
  'Tuesday roast · dispatched same day',
  'Tuesday roast dispatched same day',
  'Freshly roasted in Banani, Dhaka, Bangladesh.',
  // Refined hero copy to remove em dash and improve rhythm and clarity.
  'Single-origin lots roasted in Dhaka every Tuesday. The date is printed on every bag — and every card below tells you the day it was roasted.',
  // Removed with the footer's fake newsletter form: it toasted "Subscribed"
  // and stored nothing. Replaced by the next-roast fact and a WhatsApp CTA.
  'Receive our weekly Tuesday roast schedule and seasonal lot releases:',
];

const failures = [];
const warnings = [];

// ---------------------------------------------------------------- utilities

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const ENTITIES = {
  '&middot;': '·',
  '&mdash;': '—',
  '&ndash;': '–',
  '&rsquo;': '’',
  '&lsquo;': '‘',
  '&ldquo;': '“',
  '&rdquo;': '”',
  '&amp;': '&',
  '&deg;': '°',
  '&nbsp;': ' ',
  '&times;': '×',
  '&minus;': '−',
  '&#2547;': '৳',
  '&copy;': '©',
  '&apos;': "'",
  '&#39;': "'",
  '&quot;': '"',
};

const decodeEntities = (text) =>
  text.replace(/&[a-zA-Z#0-9]+;/g, (match) => ENTITIES[match] ?? match);

const normalize = (text) => decodeEntities(text).replace(/\s+/g, ' ').trim();

/** Drop HTML/JSX tags, scripts, styles and comments; keep the words. */
const stripMarkup = (text) =>
  text
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ');

// ------------------------------------------------------------ read the source

const legacyHtml = readFileSync(join(ROOT, 'legacy/index.html'), 'utf8');
const legacyJs = readFileSync(join(ROOT, 'legacy/main.js'), 'utf8');
const cssPath = join(ROOT, 'src/styles/main.css');
const css = readFileSync(cssPath, 'utf8');
const entryHtml = readFileSync(join(ROOT, 'index.html'), 'utf8');

const srcFiles = walk(join(ROOT, 'src')).filter((file) => /\.(ts|tsx)$/.test(file));
const srcCorpus = srcFiles.map((file) => readFileSync(file, 'utf8')).join('\n');

// 1. Frozen CSS -------------------------------------------------------------

const cssHash = createHash('sha256').update(readFileSync(cssPath)).digest('hex');

if (cssHash !== FROZEN_CSS_SHA) {
  failures.push(
    `src/styles/main.css has been modified.\n` +
      `    expected sha256 ${FROZEN_CSS_SHA}\n` +
      `    actual   sha256 ${cssHash}\n` +
      `    The stylesheet is frozen. If this change was not deliberate, restore it:\n` +
      `      git checkout -- src/styles/main.css\n` +
      `    For a deliberate redesign, update FROZEN_CSS_SHA and record the decision\n` +
      `    in DESIGN.md — never the other way round.`
  );
}

// 2. Class parity -----------------------------------------------------------

const legacyClasses = new Set(
  (legacyHtml + '\n' + legacyJs)
    .match(/class="[^"]*"/g)
    ?.flatMap((match) => match.slice(7, -1).split(/\s+/))
    .filter(Boolean) ?? []
);

const usedClasses = new Set();

for (const file of srcFiles) {
  const source = readFileSync(file, 'utf8');

  for (const match of source.matchAll(/className=(?:"([^"]*)"|\{([\s\S]*?)\})/g)) {
    const isLiteral = match[1] !== undefined;
    const raw = match[1] ?? match[2] ?? '';

    // Inside `{...}` only string literals are class names; identifiers are
    // conditions and must not be mistaken for classes.
    const literals = isLiteral
      ? [raw]
      : (raw.match(/'[^']*'|"[^"]*"|`[^`]*`/g) ?? []).map((literal) =>
          literal.slice(1, -1)
        );

    for (const literal of literals) {
      for (const token of literal.split(/\s+/)) {
        if (/^[a-z][a-z0-9-]*$/.test(token) && token.length > 1) {
          usedClasses.add(token);
        }
      }
    }
  }
}

const unknownClasses = [...usedClasses].filter(
  (token) =>
    !legacyClasses.has(token) &&
    !new RegExp(`\\.${token}(?![a-zA-Z0-9_-])`).test(css)
);

if (unknownClasses.length > 0) {
  failures.push(
    `Classes used in src/ that exist in neither main.css nor the legacy markup:\n` +
      unknownClasses.map((token) => `    ${token}`).join('\n') +
      `\n    A typo and an invented class are both drift.`
  );
}

// 3. ID parity --------------------------------------------------------------

const legacyIds = [
  ...new Set((legacyHtml.match(/\sid="([^"{$]+)"/g) ?? []).map((m) => m.slice(5, -1))),
];

const missingIds = legacyIds.filter(
  (id) =>
    !RETIRED_IDS.includes(id) &&
    !srcCorpus.includes(`id="${id}"`) &&
    !srcCorpus.includes(`id={\`${id}`) &&
    !srcCorpus.includes(`"${id}"`)
);

if (missingIds.length > 0) {
  failures.push(
    `IDs present in the legacy markup but missing from src/:\n` +
      missingIds.map((id) => `    #${id}`).join('\n') +
      `\n    Anchors and CSS hooks depend on these.`
  );
}

// 4. Asset parity -----------------------------------------------------------

const assetRefs = [
  ...new Set([...srcCorpus.matchAll(/["'`](\/assets\/[^"'`]+)["'`]/g)].map((m) => m[1])),
];

for (const ref of assetRefs) {
  if (!existsSync(join(ROOT, 'public', ref))) {
    failures.push(`Referenced asset does not exist: public${ref}`);
  }
}

// 5. Text parity ------------------------------------------------------------

const legacyTextBlocks = legacyHtml
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .split('\n')
  .map((line) => normalize(stripMarkup(line)))
  .filter((line) => line.length >= 30);

const searchable = normalize(stripMarkup(srcCorpus + '\n' + entryHtml));

const missingCopy = [...new Set(legacyTextBlocks)].filter(
  (block) => !searchable.includes(block) && !ALLOWED_COPY_GAPS.includes(block)
);

for (const block of missingCopy) {
  warnings.push(
    `copy not found in src/: "${block.slice(0, 90)}${block.length > 90 ? '…' : ''}"`
  );
}

// ---------------------------------------------------------------- report

const green = (text) => `\x1b[32m${text}\x1b[0m`;
const red = (text) => `\x1b[31m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;

console.log('\nDay Three — design parity\n');
console.log(`  css frozen     ${cssHash === FROZEN_CSS_SHA ? green('ok') : red('CHANGED')}`);
console.log(`  class tokens   ${usedClasses.size} used, ${unknownClasses.length} unknown`);
console.log(`  legacy ids     ${legacyIds.length} found, ${missingIds.length} missing`);
console.log(`  asset refs     ${assetRefs.length} checked, all resolve`);
console.log(
  `  copy blocks    ${legacyTextBlocks.length} legacy, ${missingCopy.length} missing`
);
console.log('');

if (warnings.length > 0) {
  console.log(yellow(`  ${warnings.length} warning(s):`));
  for (const message of warnings) console.log(yellow(`    ${message}`));
  console.log('');
}

if (failures.length > 0) {
  for (const message of failures) console.log(red(`  FAIL  ${message}\n`));
  process.exit(1);
}

if (STRICT && warnings.length > 0) {
  console.log(red('  FAIL  --strict: copy is missing from src/.\n'));
  process.exit(1);
}

console.log(green('  All structural checks passed.') + '\n');
