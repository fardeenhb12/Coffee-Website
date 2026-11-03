# MAGNIFIC-PROMPTS — generated photography

**Status: generated 26 October 2026.** The full set is in `assets/images/`; provenance is in
`assets/CREDITS.md`. The packshots were generated with the Uraga pouch as a
`structure_reference` at strength 65, which keeps the bag silhouette, scale and angle
consistent across the range; band colours in the table below were partly replaced by clip
colours. The activation steps at the end are kept for future regenerations.

Eleven images, one shoot. The site has no real photography, so the whole set is generated to
look like it was taken in one room on one afternoon: same north window, same paper backdrop,
same muted grade.

Generate in **Magnific** (Mystic / realism preset, 2K, no style transfer). Export PNG or
JPEG, crop to the ratio below, and keep the paper background around `#F8F5EF` so the images
sit on the page without a visible seam.

## Shared look — paste this first in every prompt

> Editorial roastery photograph, natural north-window light from the left, warm neutral
> palette of paper `#F8F5EF`, ink `#0D0D0C`, brass `#B08D57`, kraft `#C9B79C`, soft matte
> finish, fine film grain, 50mm lens at f/2.8, shallow depth of field, muted desaturated
> colour, photorealistic, no HDR, no gloss.

**Negative prompt for every image:**

> text, lettering, typography, logos, watermarks, extra fingers, clutter, props, latte art,
> steam clichés, neon, oversaturation, dark moody café, smiling stock-photo pose

The reason for one shared prefix: eleven images that each invent their own light will read as
eleven stock photos, which is the opposite of what this site needs.

---

## 1. Founder portrait — `founder-zarif.jpg` · 4:5 · 1208×1500

Prompt actually used (regenerated for the hands fix and the monochrome look):

> Black and white editorial portrait photograph of a South Asian man in his late thirties, head
> roaster and founder, short dark hair, light stubble, wearing a dark knit sweater over an
> open-collar shirt, standing beside a cast-iron drum coffee roaster in a quiet roastery,
> looking at the camera with calm confidence, shoulders relaxed, arms lowered, hands out of
> frame below the bottom edge, medium shot from the chest up, plaster wall softly out of focus
> behind him, soft north-window light from the left, monochrome black and white, fine film
> grain, 50mm lens at f2.8, shallow depth of field, photorealistic, no crossed arms, no visible
> hands, no fingers, no text, no lettering, no logos, no watermark.

The "hands out of frame" clause is load-bearing: earlier attempts at a crossed-arms pose
produced an extra hand. Keep hands below the crop, and write the monochrome request into the
prompt rather than relying on a CSS filter.

This is a synthetic person. The site treats him as the fictional founder "Zarif Rahman"; do
not present the image as a photograph of a real, identifiable individual.

---

## 2–8. Lot packshots — 4:5 · 1200×1500

One packaging system, varied only by a small band colour, so the carousel reads as a range
rather than a collage. Blank label: **no lettering at all** — the roast date and lot name are
rendered in HTML on top of and below the image.

Base prompt (swap the bracketed details):

> Single 250g kraft stand-up coffee pouch with a blank unprinted label area and a small brass
> clip, `[band colour]` band across the lower third, standing on warm paper, three-quarter
> angle at eye level, soft directional shadow to the right, matte foil, no text, no logo.

| File | Lot | Band |
| :--- | :--- | :--- |
| `lot-dhaka-daily.jpg` | Dhaka Daily | ink |
| `lot-espresso-no-1.jpg` | Espresso No. 1 | charcoal |
| `lot-uraga-natural.jpg` | Uraga Natural | oxblood `#8A3B2E` |
| `lot-las-nubes.jpg` | Las Nubes | brass |
| `lot-el-bosque.jpg` | El Bosque | ink |
| `lot-mogiana.jpg` | Mogiana | oxblood |
| `lot-worka-anaerobic.jpg` | Worka Anaerobic | charcoal |

Shoot all seven in the same session with the same prompt, changing only the band. Ask for the
pouch centred and filling roughly 70% of the frame height.

---

## 9–11. Roastery strip — 4:3 · 1200×900

These sit under the founder block, so they should feel like the same room.

| File | Prompt |
| :--- | :--- |
| `roastery-drum.jpg` | Roasted beans filling a cast-iron cooling tray, close overhead angle, warm overhead light, metal paddle at rest, fine film grain, no hands. |
| `roastery-pour.jpg` | Hands pouring from a gooseneck kettle into a white V60 on a wooden brew bar, face out of frame, shallow depth of field, warm window light, no text. |
| `roastery-pack.jpg` | Three blank kraft coffee pouches sealed and lined up on paper, brass clips, soft shadow, ready for dispatch, no lettering or logos. |

---

## After generating

1. Crop to the ratio, export JPEG quality ~80, target under 200 kB each.
2. Put the files in `assets/images/` with the exact names above.
3. Activate the product images by setting `image` on each lot in `scripts/main.js`:

```js
{
  id: 'uraga-natural',
  // …
  image: 'assets/images/lot-uraga-natural.jpg',
}
```

The card only renders a photograph when `image` is set, so partial sets degrade cleanly —
but the carousel should ship with all seven or none, never a mix.

4. The founder portrait is already wired in `index.html`
   (`assets/images/founder-zarif.jpg`). If you regenerate it, keep the same filename, keep the
   monochrome look, and update the `alt` text only if the subject or setting changes.
5. Record the tool, date, preset and these prompts in `assets/CREDITS.md`.

## Alt text rules

Alt text describes what is visible, not what the copy claims. "A kraft coffee pouch on a
paper backdrop", not "Uraga Natural, roasted Tuesday". The roast date is real text; the
photograph is atmosphere.
