# Design Document: Day Three Coffee — Little Amps Indie Redesign (Stitch Canvas)

- **Date:** 2026-11-01
- **Status:** Draft (Awaiting Builder Check & Approval)
- **Target Platform:** Google Stitch (New Project & Canvas)
- **Reference Inspiration:** [Little Amps Coffee Roasters](https://littleampscoffee.com/) / [`Little Amps Coffee Roasters.md`](/Users/fardeen.bhuiyan/Downloads/Little%20Amps%20Coffee%20Roasters%20-%20Harrisburg,%20PA%20Specialty%20Coffee.md)

---

## 1. Intent & The Why

The goal is to design a new canvas in Google Stitch for **Day Three**, a specialty coffee roastery in Banani, Dhaka, inspired by the visual warmth, indie personality, and community-first atmosphere of **Little Amps Coffee Roasters** (Harrisburg, PA).

Currently, the Day Three web experience is built around a stark, architectural "Gallery" aesthetic (Direction C: monochrome, hairline rules, cold editorial restraint). While elegant, the user desires the tactile charm, vinyl/music culture ("quest for the perfect tone"), playful flavor profile meters (Sweetness, Acidity, Complexity, Roast Level), and warm cream/terracotta palette exemplified by Little Amps.

This design document specifies the architecture, visual tokens, section flow, and prompt generation required to build this new experience on a fresh Stitch canvas.

---

## 2. Goals, Non-Goals, & Anti-Goals

### Goals
- **Fresh Stitch Project**: Provision a brand-new project container in Google Stitch (`create_project`) without altering existing Stitch projects.
- **Tone & Terroir Fusion**: Marry Day Three's authentic roastery facts (Tuesday roast dispatch in Banani, single-origin micro-lots, BDT pricing, WhatsApp ordering, Dhaka tasting room) with Little Amps' warm retro-indie soul.
- **Visual Spec Meters**: Implement Little Amps' signature 4-gauge flavor breakdown (Sweetness, Acidity, Complexity, Roast Level) across Day Three's micro-lots.
- **Complete Landing Page Screen**: Generate a full desktop screen via Stitch (`generate_screen_from_text`) encompassing announcement bar, hero, lots showcase, roast philosophy, tasting room + vinyl listening corner, producer journal, and community footer.
- **Design Intelligence**: Adhere to `ui-ux-pro-max` guidelines for warm culinary/beverage e-commerce (text contrast $\ge 4.5:1$, touch targets $\ge 44\text{px}$, responsive hierarchy).

### Non-Goals
- **No In-Place Codebase Overwrite**: Do not modify the existing React workspace or edit `src/styles/main.css` (which remains frozen per `AGENTS.md`). The output is generated and hosted in Google Stitch.
- **No Mock Payments**: Maintain Day Three's honesty—no checkout forms, fake credit card inputs, or payment gateway illusions. Orders remain direct WhatsApp order requests.
- **No Overwriting Existing Stitch Projects**: Leave `projects/12354049484749372163` untouched.

### Anti-Goals
- **Anti-Corporate / Anti-Slick**: Avoid generic modern SaaS cards, neon gradients, glassmorphism, or sterile stark corporate layouts.
- **No Emoji-as-Icons**: Use clean vector/graphic icons for flavor meters and UI indicators.
- **No Fluff**: Keep copy concrete, sensory, and grounded in coffee sourcing and Tuesday roast dates.

---

## 3. Approaches Considered & Trade-offs

1. **Approach 1: "Tone & Terroir" — Day Three in Little Amps' Soul (Selected)**
   - *Description*: Translates Day Three's Dhaka roastery and Tuesday roast honesty into Little Amps' warm indie aesthetic with flavor meters, vinyl record culture, and cream/rust tones.
   - *Trade-offs*: Requires synthesizing Day Three's actual offerings into a new visual vocabulary, but preserves authentic business identity and local Dhaka connection.
   - *Verdict*: Selected by user.

2. **Approach 2: Direct Little Amps Clone (Harrisburg)**
   - *Description*: Direct recreation of Little Amps (Friend Blend, Coffee Dude mascot, Harrisburg PA address, USD currency).
   - *Trade-offs*: Perfect visual fidelity to the reference site, but irrelevant to Day Three's roastery context and products.

3. **Approach 3: Neo-Brutalist Vinyl Roastery**
   - *Description*: High-contrast sticker badges, oversized aggressive typography, and harsh color blocking.
   - *Trade-offs*: Very distinctive and bold, but lacks the cozy, inviting neighborhood warmth that makes Little Amps beloved.

---

## 4. Visual Design System & Tokens (`ui-ux-pro-max`)

### Color Architecture
- **Base Canvas (`--bg-cream`)**: `#FFFBEB` (Warm Buttermilk Cream)
- **Surface / Cards (`--surface-card`)**: `#FFFFFF` (Crisp Paper White)
- **Primary Ink (`--color-ink`)**: `#1E1714` (Deep Espresso Noir)
- **Secondary Accent (`--color-terracotta`)**: `#C2410C` (Warm Rust / Terracotta)
- **Tertiary Accent (`--color-amber`)**: `#D97706` (Roasted Amber / Honey)
- **Botanical / Status (`--color-sage`)**: `#059669` (Fresh Sage / Mint Green for roast dates, origin pills)
- **Dividers & Borders (`--border-warm`)**: `#F2E6E2` / `#E5DCD6` (Soft warm hairlines)

### Typography Hierarchy
- **Display Headlines**: Warm, characterful display serif or chunky retro-modern grotesque (evoking 1970s vinyl album covers and craft roasters).
- **Body & Technical Specs**: Clean, highly readable humanist sans-serif with tabular numerals for roast dates, grams, and BDT prices.
- **Badges & Eyebrows**: Uppercase tracked lettering (`+0.06em` to `+0.08em`) on solid or pill badges.

### Visual Spec Meters (The Little Amps Signature)
Every coffee lot card presents 4 visual attribute gauges:
1. **Sweetness**: Low / Medium / High (with custom sensory pip meter)
2. **Acidity**: Low / Medium / Extra High
3. **Complexity**: Low / Medium / High
4. **Roast Level**: Light / Medium-Light / Medium / Dark

---

## 5. Structural Screen Architecture (Section Flow)

The generated screen will feature 7 cohesive sections:

1. **Top Notice / Broadcast Bar**
   - Marquee / centered note: *"Next Roast Day: Tuesday in Banani • Dispatched Fresh Across Dhaka on Friday (Day Three) • Free delivery over ৳ 2,500"*

2. **Navigation Header**
   - Logo: **Day Three Coffee Roasters** (warm retro typography).
   - Links: *Current Roasts*, *Why Tuesday*, *Tasting Room*, *Journal*, *Spotify Playlists*.
   - Action: Slide-out Cart pill with item counter.

3. **Hero Section ("Chasing the Perfect Tone")**
   - Headline: *"Specialty Coffee Roasted for Tone & Honest Freshness."*
   - Subhead: Sourced from high-altitude micro-lots in Guji, Huila, and Santa Barbara. Roasted on Tuesdays in Banani, Dhaka, stamped with its roast date, and peaked for Friday brewing.
   - CTAs: Primary pill button *"Explore Tuesday's Roast"* (`#C2410C`), Secondary button *"Our Freshness Promise"*.
   - Hero Visual: Warm, sunlit roastery scene with warm orange roaster drum, hessian bean sacks, and vinyl records playing on the counter.

4. **Current Micro-Lots Showcase (Interactive Cards with Flavor Meters)**
   - Header: *"Fresh From the Roaster"* with filter chips (*All Lots*, *Single Origin*, *Blends*).
   - 3–4 Lot Cards featuring:
     - High-resolution bag preview or sensory artwork.
     - Origin pill (e.g. `Guji, Ethiopia • 2,150 MASL`).
     - Lot Title (e.g. *Uraga Natural*, *Las Nubes*, *Finca El Ocotillo*).
     - Price & Size selector: `৳ 1,295 (250g)` / `৳ 4,100 (1kg)`.
     - **The 4 Little Amps Spec Meters**: Sweetness (High), Acidity (Extra High), Complexity (Medium), Roast (Medium).
     - Tasting notes pills: `Blueberry Jam`, `Wildflower Honey`, `Bergamot`.
     - Primary Action: *"Add to Cart / Order on WhatsApp"*.

5. **Why We Roast on Tuesdays (Roaster Philosophy & Equipment)**
   - Editorial split layout:
     - Left: Authentic photography of roaster lead checking bean development and roast date stamp on packaging.
     - Right: Narrative copy explaining the degas cycle—why beans roasted on Tuesday taste best on Friday (Day Three), refusing supermarket stale shelf-life.

6. **Banani Tasting Room & Vinyl Listening Corner**
   - Atmosphere: *"Sounds, Sips & Records in Dhaka"*.
   - Details: House 42, Road 11, Block C, Banani, Dhaka • Open daily 8 AM – 10 PM.
   - Feature: A dedicated record shelf & barista-curated vinyl turntable playing throughout the day, inviting guests to linger and cup coffees.

7. **Producer Spotlight, Cupping Journal & Community Footer**
   - 3 Story Cards (Little Amps editorial format):
     - *Producer Highlight: Jorge Elías Rojas (4th generation farmer)*.
     - *What is Cupping? The Friday Quality Ritual in Banani*.
     - *Listen Along: Day Three Roastery Session on Spotify 🎵*.
   - Footer: Operating hours, Dhaka address, WhatsApp dispatch ordering disclaimer, and email signup.

---

## 6. What's Left to the Builder

- Creating the Stitch project via `create_project`.
- Crafting and executing the rich generation prompt via `generate_screen_from_text`.
- Verifying the resulting screen URL and screenshot thumbnail.
- Generating additional mobile or tablet viewport variants if desired.

