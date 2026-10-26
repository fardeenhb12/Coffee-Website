# Day Three — Brand Brief

The business, the customer, and the one belief the site has to argue. Decisions that led
here are recorded in `docs/adr/`; vocabulary lives in `GLOSSARY.md`.

## The business requirement

A boutique Dhaka roastery selling roasted single-origin lots direct to home brewers, in
250g and 1kg bags, with every order confirmed by a human over WhatsApp.

The site has one commercial job: **turn a first-time visitor into a first bag, and a first
bag into a second.** A home brewer who buys monthly is worth roughly twelve bags a year;
a visitor who only reads the story is worth nothing. Everything on the page is judged
against that.

Constraints that shape the design:

- No backend, no inventory sync, no payment integration. Payment happens after the
  WhatsApp confirmation.
- One person answers the messages. The site must not promise a reply time it cannot keep.
- Photography is generated, not archival. It must read as roastery reportage, never as stock
  lifestyle; provenance and prompts are recorded in `assets/CREDITS.md` and
  `MAGNIFIC-PROMPTS.md`.

## Who it is for

**Primary — the Dhaka home brewer.** 28–40, lives in Gulshan, Banani, Dhanmondi or
Bashundhara. Owns a V60, AeroPress, moka pot or French press. Already buys from North End
or IZH. Comfortable paying ৳1,200–1,500 for 250g, but has been burned by stale beans and
cannot tell from any Dhaka website how old they are. Discovers coffee through Instagram
and friends, not search.

What they need before they buy: the roast date, the origin, the process, what it tastes
like, and a grind recommendation for the gear they own. In that order.

**Secondary — the visitor.** Someone who wants to sit and drink coffee before committing
to a bag. Served by the tasting room, not by the shop.

**Tertiary — wholesale and events.** Real, but a different conversation with different
proof. One footer link. Never on the landing page.

## The meaning we serve

**A bag should tell you when it was roasted.**

Freshness is the whole difference between coffee worth ৳1,200 and coffee worth nothing,
and the Dhaka market hides it. North End shows a delivery estimate. East Bengal posts
roast dates to Facebook. Everyone else shows nothing. So the brand's belief, its name, its
first line, and its proof are the same fact stated four ways.

The moral claim is *checkability*, not charity: every bag is dated, every lot names its
producer, every price is on the page. That replaced an unevidenced mission (ADR-0001).

## Positioning

Boutique, not the incumbent. Roughly 10–15% above North End, justified by freshness
honesty and lot traceability rather than by rarity language. The competitor we beat is not
North End's price — it is the uncertainty of buying beans in Dhaka without knowing their
age.

## The proof we lead with

1. **A date, printed.** On the bag, on the card, in the cart.
2. **A named producer.** Region, farm, altitude, process — not "premium arabica".
3. **A weekly roast.** Predictable enough to plan around: roasted Tuesdays, dispatched
   the same day they're confirmed.

## Voice

Concrete, unhurried, sensory. Short sentences. Specific numbers over adjectives.

- Write: *Roasted 14 October. Blueberry, cocoa nib, cane sugar. Best from the 17th.*
- Don't write: *Artisanal small-batch micro-lots, curated for the discerning palate.*

**Never use:** "Dhaka's foremost", "world-class", "artisanal", "curated", "elevate",
"journey", exclamation marks, or any claim about proceeds, charity or mission that cannot
be evidenced on the page.

## What this brand refuses

- Stock photography. Fewer real photos beat more borrowed ones.
- Superlatives standing in for evidence.
- Countdown timers, fake scarcity, "only 3 left" invented urgency.
- Selling a bag it cannot ship. A sold-out lot is shown as sold out with the next roast
  date — not disguised.
