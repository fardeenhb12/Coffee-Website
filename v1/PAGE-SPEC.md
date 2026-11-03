# Day Three — Page Spec

The single-page structure the rebuild targets, and the order it gets built in. Brand
rationale is in `BRAND.md`; decisions in `docs/adr/`.

The information architecture below is unchanged by the Direction C restyle. Colour, type,
spacing and component rules live in `GALLERY-RESTYLE.md` and `DESIGN.md`; do not restate
them here.

## Information architecture

| # | Section | Purpose | Primary action |
|:-:|---|---|---|
| 1 | Dispatch bar | State the freshness contract before anything else | — |
| 2 | Header + nav | Four honest links and the bag | Shop |
| 3 | Hero | Say what is sold, where, and when it was roasted | Shop this week's roast |
| 4 | This week's roast | Make the roast date the first fact on the page | Browse lots |
| 5 | Lot grid | Let someone choose a bag and read its date | Add to bag |
| 6 | Why we print the date | Turn the claim into three checkable proofs | — |
| 7 | The roaster | Put a human behind the coffee | — |
| 8 | Brew guides | Deliver what the nav promises | Open a recipe |
| 9 | Visit | Prove the roastery is a real place | Get directions |
| 10 | FAQ | Answer the questions that otherwise become messages | — |
| 11 | Footer | Real contact, wholesale, newsletter | Subscribe |
| — | Cart drawer | Collect the request and hand off | Request on WhatsApp |

**Cut from the current site:** the four sourcing pillars, the concierge section and its
five-field B2B form, the mission editorial and its three stats, the video lightbox modal.
None of them move a home brewer toward a bag.

## Hero

- **Headline:** *Roasted Tuesday. Best from Friday.*
- **Sub:** Single-origin lots roasted in Dhaka every Tuesday. The date is printed on every
  bag — and on every card below.
- **Primary CTA:** Shop this week's roast → lot grid
- **Secondary CTA:** How we roast → the date section
- No "watch the origin film" button. The ambient roastery loop ships as the hero backdrop
  (`video.mp4`, muted, paused off-screen and under reduced motion); typography carries the
  page above it.

## The seven lots

Two blends, four single origins, one seasonal. All buyable — the old site's defining
failure was two of three cards being unavailable.

| Name | Category | Origin | Process | 250g |
|---|---|---|---|---|
| Dhaka Daily | Blend | Ethiopia + Brazil | — | ৳995 |
| Espresso No. 1 | Blend | Brazil + Colombia | — | ৳1,050 |
| Uraga Natural | Single | Guji, Ethiopia | Natural | ৳1,295 |
| Las Nubes | Single | Matagalpa, Nicaragua | Washed | ৳1,195 |
| El Bosque | Single | San Ignacio, Peru | Washed | ৳1,250 |
| Mogiana | Single | Mogiana, Brazil | Pulped natural | ৳1,195 |
| Worka Anaerobic | Seasonal | Worka, Ethiopia | Anaerobic | ৳1,750 |

**The last two rows are placeholders**, added to test the grid at realistic density. They
must be replaced with real lots or removed before launch. `Uraga`, `Las Nubes` and
`El Bosque` inherit the old site's photography slots; `Missionary Grown` and
`Guardian del Bosque` are retired as names because they describe belief rather than
coffee.

Every card carries: lot name, origin, process, tasting notes as one inline line, **roast
date**, 250g/1kg toggle, grind selector, and add-to-bag. One card may show sold out, with the
next roast date — never more than one.

## Ordering flow

Add to bag → drawer opens → adjust quantities → **Request this order on WhatsApp** → the
drawer builds a prefilled message (lots, grinds, sizes, quantities, subtotal) and hands
off. Payment (bKash, Nagad, bank, card, COD) is agreed in that conversation. Nothing on
the site claims a payment has been taken.

Free delivery over **৳2,500** — exactly two bags, reachable, and it pushes the second bag.
The old ৳3,000 threshold was unreachable at the new prices.

## Build phases

1. **Nav + hero** — header, dispatch bar, hero, no imagery. This is the round that
   settles typography, spacing and tone.
2. **Lots + cart** — grid, category filter, card anatomy, drawer, WhatsApp handoff.
3. **Proof + roaster** — the three proofs, the human.
4. **Brew guides + FAQ** — four methods with one recipe each.
5. **Visit + footer** — address, hours, map, contact, wholesale link.
6. **Whole-page pass** — responsive at 1024/768/390, reduced motion, focus states,
   keyboard traps, contrast.

## Launch blockers

Recorded now so they are not discovered on launch day.

- **Address is a placeholder.** "House 14, Road 11, Banani" is the value currently shipped in
  the page, footer and JSON-LD; it must be confirmed by the owner. A real operating business
  must not publish an address it does not occupy.
- **Two of seven lots are placeholders** and must be replaced with real stock.
- **Photography is generated, not documentary.** Direction C still leads with type, rules and
  dates; the portrait and packshots are a documented concept set (`MAGNIFIC-PROMPTS.md`,
  `assets/CREDITS.md`). Do not add stock imagery or present generated images as documentary
  fact.
- **`Day Three` is unverified** — `.com` / `.com.bd` availability and a Bangladesh
  trademark search are outstanding (ADR-0004).
