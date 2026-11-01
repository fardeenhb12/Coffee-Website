# Day Three Coffee — Little Amps Indie Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provision a new project on Google Stitch and generate a complete, responsive landing page redesign for Day Three Coffee Roasters inspired by the warm, music-centric aesthetic and visual flavor meters of Little Amps Coffee Roasters.

**Architecture:** Use the Stitch MCP interface (`create_project`, `generate_screen_from_text`, `get_project`, `get_screen`) to create a fresh canvas container and generate a full desktop layout translating Day Three's Tuesday roastery honesty into Little Amps' retro-indie design language.

**Tech Stack:** Google Stitch MCP Server, Stitch Text-to-UI engine, `ui-ux-pro-max` design tokens.

**Spec:** [`docs/superpowers/specs/2026-11-01-little-amps-stitch-redesign-design.md`](file:///Users/fardeen.bhuiyan/Desktop/AI%20Projects/Coffee%20Website%20React/docs/superpowers/specs/2026-11-01-little-amps-stitch-redesign-design.md)

## Global Constraints

- **Platform**: Google Stitch canvas only. Do not touch or modify the frozen local React codebase or `src/styles/main.css`.
- **Isolation**: Leave existing Stitch project `projects/12354049484749372163` completely intact; operate strictly inside a newly provisioned project.
- **Palette Tokens**: Base `#FFFBEB` (Buttermilk Cream), Ink `#1E1714` (Deep Espresso), Primary Accent `#C2410C` (Terracotta/Rust), Botanical `#059669` (Sage/Mint), Cards `#FFFFFF`.
- **Spec Meters**: Every coffee product card must render Little Amps' iconic 4-meter attribute set: Sweetness, Acidity, Complexity, and Roast Level.
- **Honesty & Parity**: No fake payment gateways. Roastery location is Banani, Dhaka; Tuesday roast cycle; BDT pricing; WhatsApp order handoff.

## Review Focus

1. **Stitch API Timeout on Screen Generation**: `generate_screen_from_text` can take 60–120 seconds. The plan handles potential timeouts by querying `get_screen` / `get_project` rather than issuing duplicate generation calls.
2. **Missing Spec Meters**: Screen generation prompt must explicitly define the four visual attribute gauges for each lot card so the model does not default to plain text bullet points.
3. **Overwriting Existing Project**: Ensure the project ID returned from `create_project` is strictly captured and passed to all subsequent calls.
4. **Accessibility & Contrast**: Text on `#FFFBEB` background must use high-contrast `#1E1714` ($\ge 4.5:1$).
5. **Brand Integrity**: Retain Day Three's Tuesday roast and Banani tasting room coordinates without substituting Harrisburg locations.

---

### Task 1: Provision New Stitch Project Container

**Files:**
- N/A (Cloud MCP tool call)

**Interfaces:**
- Consumes: Project Title `"Day Three Coffee — Little Amps Indie Edition"`
- Produces: `projectId` (e.g. `1234567890123456789`)

- [ ] **Step 1: Call `create_project` on Stitch MCP**

Call `call_mcp_tool` with:
- `ServerName`: `"stitch"`
- `ToolName`: `"create_project"`
- `Arguments`: `{"title": "Day Three Coffee — Little Amps Indie Edition"}`

- [ ] **Step 2: Verify project creation and extract `projectId`**

Verify output contains `name: "projects/<projectId>"` and `title: "Day Three Coffee — Little Amps Indie Edition"`.
Record `<projectId>` for subsequent steps.

- [ ] **Step 3: Confirm project container via `get_project`**

Call `call_mcp_tool` with:
- `ServerName`: `"stitch"`
- `ToolName`: `"get_project"`
- `Arguments`: `{"name": "projects/<projectId>"}`

Expected: Project status `ACTIVE` with an empty screen list.

---

### Task 2: Generate Desktop Screen in Stitch

**Files:**
- Spec: [`docs/superpowers/specs/2026-11-01-little-amps-stitch-redesign-design.md`](file:///Users/fardeen.bhuiyan/Desktop/AI%20Projects/Coffee%20Website%20React/docs/superpowers/specs/2026-11-01-little-amps-stitch-redesign-design.md)

**Interfaces:**
- Consumes: `projectId` from Task 1
- Produces: `screenId` (resource name `projects/<projectId>/screens/<screenId>`)

- [ ] **Step 1: Construct detailed normative Stitch prompt**

Assemble the structured prompt incorporating all 7 sections, the Little Amps flavor spec meters, typography, and color tokens:
- **Style**: Warm retro-indie craft coffee roastery with vinyl record & music culture ("chasing the perfect tone"). Warm cream canvas (`#FFFBEB`), deep espresso ink (`#1E1714`), warm rust/terracotta buttons (`#C2410C`), sage green accents (`#059669`), paper-white cards (`#FFFFFF`).
- **Section 1 (Top Bar)**: "Next Roast Day: Tuesday in Banani • Dispatched Fresh on Friday (Day Three) across Dhaka • Free delivery over ৳ 2,500".
- **Section 2 (Header)**: Day Three Coffee Roasters vintage badge logo, navigation links (*Current Lots*, *Why Tuesday*, *Tasting Room*, *Journal*, *Spotify*), and Cart Pill button.
- **Section 3 (Hero Stage)**: "Specialty Coffee Roasted for Tone & Honest Freshness." Sunlit roastery imagery with an orange drum roaster, warm analog vibes, and vinyl turntable. Action buttons: "Explore Tuesday's Roast" (terracotta pill) and "Our Freshness Promise".
- **Section 4 (Micro-Lots with Little Amps Spec Meters)**: 3 featured lots (*Uraga Natural - Ethiopia*, *Las Nubes - Colombia*, *Finca El Ocotillo - Honduras*). Each card contains:
  - Roast date stamp & 250g/1kg toggle.
  - Price: `৳ 1,295 (250g)` / `৳ 4,100 (1kg)`.
  - **The 4 Little Amps flavor gauge meters**:
    - *Sweetness*: [High]
    - *Acidity*: [Extra High]
    - *Complexity*: [Medium]
    - *Roast*: [Medium Roast]
  - Sensory note pills (e.g. *Blueberry Jam*, *Wildflower Honey*, *Bergamot*).
  - "Add to Order (WhatsApp)" action.
- **Section 5 (Why We Roast on Tuesdays)**: Editorial split layout explaining the degas curve—roasting Tuesday in Banani, resting 3 days, peaking Friday (Day Three).
- **Section 6 (Banani Tasting Room & Vinyl Corner)**: "Sounds, Sips & Records in Dhaka" at House 42, Road 11, Block C, Banani. Open daily 8 AM – 10 PM. Showcasing vinyl turntable and cupping sessions.
- **Section 7 (Producer Spotlight & Community Footer)**: Journal cards for *Producer Highlight: Jorge Elías Rojas*, *What is Cupping?*, and *Roastery Sessions on Spotify 🎵*. Warm footer with Dhaka dispatch info.

- [ ] **Step 2: Execute `generate_screen_from_text`**

Call `call_mcp_tool` with:
- `ServerName`: `"stitch"`
- `ToolName`: `"generate_screen_from_text"`
- `Arguments`:
  - `projectId`: `"<projectId>"`
  - `prompt`: `<assembled prompt>`
  - `deviceType`: `"DESKTOP"`

- [ ] **Step 3: Handle execution / polling**

If tool returns with screen instance: extract `screenId`.
If tool times out: invoke `get_screen` or `get_project` every 30 seconds (up to 5 times) until the generated screen is populated.

---

### Task 3: Inspect Screen Details, Artifacts & Screenshots

**Files:**
- N/A (Stitch inspection)

**Interfaces:**
- Consumes: `projectId`, `screenId` from Task 2
- Produces: Screenshot URL, design tokens inspection, and verification report

- [ ] **Step 1: Fetch full screen details via `get_screen`**

Call `call_mcp_tool` with:
- `ServerName`: `"stitch"`
- `ToolName`: `"get_screen"`
- `Arguments`: `{"name": "projects/<projectId>/screens/<screenId>"}`

Verify screen status is completed and retrieve HTML/code entries.

- [ ] **Step 2: Inspect Project Screenshot Thumbnail**

Call `call_mcp_tool` with:
- `ServerName`: `"stitch"`
- `ToolName`: `"get_project"`
- `Arguments`: `{"name": "projects/<projectId>"}`

Extract `thumbnailScreenshot.downloadUrl` and screen instances coordinates.

- [ ] **Step 3: Verify all 5 review focus items against the generated screen**

1. Confirm Little Amps 4-gauge flavor meters are present in the DOM.
2. Confirm palette tokens (`#FFFBEB`, `#1E1714`, `#C2410C`) are applied.
3. Confirm Tuesday roast & Banani, Dhaka addresses are preserved.
4. Confirm no payment forms or mock checkout exist.
5. Capture and link the generated screen in the report.

---

### Task 4: Generate Mobile Viewport Variant (Optional Companion)

**Files:**
- N/A (Stitch companion screen)

**Interfaces:**
- Consumes: `projectId` from Task 1
- Produces: `mobileScreenId`

- [ ] **Step 1: Execute `generate_screen_from_text` for Mobile**

Call `call_mcp_tool` with:
- `ServerName`: `"stitch"`
- `ToolName`: `"generate_screen_from_text"`
- `Arguments`:
  - `projectId`: `"<projectId>"`
  - `prompt`: `"Mobile viewport version of Day Three Coffee Little Amps redesign. Compact stacked layout, sticky bottom cart bar, tap-friendly flavor spec meters, and single-column lot cards on warm cream background."`
  - `deviceType`: `"MOBILE"`

- [ ] **Step 2: Verify mobile screen generation and retrieve details**

Confirm companion mobile screen is attached to the project.

