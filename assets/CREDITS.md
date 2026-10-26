# Image credits

## Product imagery (superseded 26 October 2026)

The three earlier micro-lot packshots are retained for reference but are **no longer referenced
by the page** — the cards now use the generated `lot-*.jpg` set below. They were generated with
**Magnific Mystic** (`realism`, `magnific_sharpy`, 2K; 4:5 desktop and 4:3 mobile) on
2026-10-25, then centre-cropped in-browser to 1200×1380 / 1200×900 and encoded at JPEG
quality 82.

| File | Subject |
| :--- | :--- |
| `lot-ethiopia.jpg` | Glass canister of dark-roasted beans, dried blueberries |
| `lot-nicaragua.jpg` | Kraft pouch with a blank brass-edged label, bean scoop |
| `lot-peru.jpg` | Glass canister of beans, jasmine sprig, white cup |
| `lot-*-mobile.jpg` | Art-directed 4:3 crops for ≤768px cards |
| `badge-sticker-raw.png` | 100% Arabica half-peeled vintage sticker badge (Magnific Mystic master, manual transparent cutout, 2026-10-25) |
| `badge-arabica-peeled.png` | Processed copy archive |

The packaging is intentionally blank — no generated lettering or logos. Lot
numbers and origins are rendered in HTML. The 100% Arabica certification badge is
rendered as a tactile half-peeled seal overlay overhanging the featured card. Magnific's terms apply to the
generated files.

## Generated set (26 Oct 2026)

The founder portrait, seven lot packshots and three roastery strip images were generated with
**Magnific Mystic** through the official API (`POST /v1/ai/mystic`), at 2K, then resized and
re-encoded locally with `sips` (JPEG quality 82).

- **Portrait** — model `editorial_portraits`, engine `magnific_sharpy`, aspect `social_post_4_5`,
  creative detailing 25, monochrome black and white to match the reference. The generated
  subject is a **synthetic person** used to depict the fictional founder; it is not a
  photograph of a real, identifiable individual.
- **Packshots** — model `realism`, same engine, aspect `social_post_4_5`, each generated with the
  Uraga pouch as a `structure_reference` at strength 65 so the bag silhouette, scale and camera
  angle stay consistent across the range. Packaging is blank: no generated lettering or logos.
- **Roastery strip** — model `realism`, aspect `classic_4_3`.

| File | Subject |
| :--- | :--- |
| `founder-zarif.jpg` | Founder portrait, roastery, monochrome, 1208×1500 |
| `lot-dhaka-daily.jpg` | Kraft pouch, ink clip |
| `lot-espresso-no-1.jpg` | Charcoal pouch, brass clip |
| `lot-uraga-natural.jpg` | Kraft pouch, oxblood band |
| `lot-las-nubes.jpg` | Off-white pouch, brass clip |
| `lot-el-bosque.jpg` | Kraft pouch, brass clip |
| `lot-mogiana.jpg` | Stone-grey pouch, oxblood clip |
| `lot-worka-anaerobic.jpg` | Charcoal pouch, oxblood clip |
| `roastery-drum.jpg` | Cooling tray |
| `roastery-pour.jpg` | Brew bar |
| `roastery-pack.jpg` | Sealed pouches |

Prompts are recorded in `MAGNIFIC-PROMPTS.md`. Magnific's terms apply to the generated files.
Do not present these images as documentary photography of a real business.

## Paper texture and marks

The paper grain and the mug ring are **CSS/SVG**, not image assets. They live in
`styles/main.css` as `--paper-grain` and the `.proof-section::before` ring; no external files
and no licence obligations.

## Site photography


These photographs are stored locally and were sourced through the **Magnific API**
(Freepik stock library) on 2026-10-25. Every asset is the **freemium** licence type.

> **Attribution:** the Freepik free licence requires credit unless the downloading
> account is on a Premium plan. Confirm the plan before publishing; if the free tier
> applies, add a "Photography by …" line to the footer. Keep this file in the repo either
> way.

| File | Resource | Author | Source |
| :--- | :--- | :--- | :--- |
| `hero-roaster.jpg` | #11333690 — beans in a roasting drum | bublikhaus | <https://www.magnific.com/free-photo/dark-aromatic-chocolate-coffee-beans-freshly-baked-hot-cool-dawn-inside-best-professional-roasting-machine_11333690.htm> |
| `mission-pour-over.jpg` | #9029465 — barista brewing pour-over | cookie_studio | <https://www.magnific.com/free-photo/male-barista-brewing-coffee-alternative-method-pour_9029465.htm> |

## Archived originals

The previous lot photographs were replaced on 2026-10-25 and moved to
`assets/images/archive/` so they remain recoverable.

| File | Resource | Author | Source |
| :--- | :--- | :--- | :--- |
| `archive/lot-ethiopia.jpg` | #1271483 — roasted beans, macro | suksao | <https://www.magnific.com/free-photo/coffee-beans_1271483.htm> |
| `archive/lot-nicaragua.jpg` | #1007889 — beans with scoop | jannoon028 | <https://www.magnific.com/free-photo/coffee-beans-closeup-background_1007889.htm> |
| `archive/lot-peru.jpg` | #959220 — pour-over filter | kaboompics | <https://www.magnific.com/free-photo/coffee-maker-pouring-coffee-filter_959220.htm> |

## 100% Localized Assets

All photography, packshots, video posters, Open Graph previews, and icons are stored locally
in the `assets/` directory (zero external image CDN dependencies):
- `assets/favicon.ico` — localized favicon.
- `assets/images/og-image.jpg` — localized Open Graph preview image.
- `assets/images/video-poster.jpg` — localized documentary video modal poster.
- `assets/images/badge-sticker-raw.png` — Manual transparent cutout sticker badge in active use (`assets/images/badge-arabica-peeled.png` archive).

## Processing

Product packshots: centre-cropped in-browser to 1200×1380 (desktop) and
1200×900 (mobile), JPEG quality 82. Separate 4:5 and 4:3 compositions were
generated so the mobile card does not crop the product.
Stock photography: resized and re-encoded locally with `sips` (JPEG, quality 66–76).
Masters were 4K–6K originals; no AI upscaling was applied to the stock images.
