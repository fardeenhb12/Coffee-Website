# Modern Rounded Component Refresh & Apple Micro-Interactions Design

## 1. Overview & Objective
Modernize the visual architecture and interaction feel of **Day Three** by eliminating remaining sharp lines, flat dividers, and 0-radius boxes across the site. In their place, establish a unified **Apple-grade rounded card system** (squircle containers, soft inset plates, pill controls) paired with **tactile spring physics, active compression states, and smooth elevation micro-interactions**.

This elevates the roastery website into a fluid, tactile web experience that feels as polished as modern Apple design while honouring the brand's warm Little Amps palette (`--cream`, `--beige`, `--brown`, `--brick`, `--peach`, `--blue`).

---

## 2. Approaches Considered

| Approach | Description | Trade-offs | Status |
| :--- | :--- | :--- | :--- |
| **Approach 1: Inset System Cards with Apple Spring Dynamics** *(Selected)* | Modernize all flat divider sections (Proof facts, FAQ accordions, Roaster credentials/quote, Cart rows) into distinct rounded inset cards with squircle radii, subtle borders, tactile `:active` spring physics, and fluid hover lifts. | Requires comprehensive styling across multiple sections; delivers a cohesive, ultra-tactile modern experience. | **Selected by User** |
| **Approach 2: Control-Focused Micro-Interactions** | Maintain flat section divider lines and restrict rounding and spring animations exclusively to buttons, steppers, and media. | Minimal CSS adjustments, but leaves Proof facts and FAQ accordions looking dated and rigid. | **Rejected** |

---

## 3. Visual & Component Architecture

### 3.1 Proof Section (`#why-date`)
- **Current State**: Three `.proof-card` items sitting under raw 1px horizontal top borders (`border-top: 1px solid var(--line)`) with no enclosure.
- **Modernized Design**:
  - Transform each `.proof-card` into an elevated rounded inset card:
    - `background-color: var(--beige)` with subtle paper texture.
    - `border-radius: var(--panel)` (`2.0rem`).
    - `border: 1px solid rgba(82, 44, 37, 0.12)`.
    - `padding: 3.2rem 2.8rem`.
    - `box-shadow: 0 4px 16px rgba(82, 44, 37, 0.03)`.
  - **Step Counter**: Enclose `01`, `02`, `03` inside a warm circular pill indicator (`width: 4.4rem; height: 4.4rem; border-radius: 50%; background: rgba(192, 48, 1, 0.08); color: var(--brick); display: grid; place-items: center`).
  - **Apple Micro-interaction**:
    - Hover: `transform: translateY(-4px)`, `box-shadow: 0 14px 32px rgba(82, 44, 37, 0.08)`, `border-color: rgba(82, 44, 37, 0.28)`.
    - Timing: `transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 280ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms ease`.

### 3.2 FAQ Accordion Section (`#faq`)
- **Current State**: Bare text items separated by flat horizontal divider lines (`border-bottom: 1px solid var(--line)`).
- **Modernized Design**:
  - Transform each `.faq-item` into an independent rounded card plate:
    - `background: var(--beige)` (or soft warm plate).
    - `border-radius: 1.6rem`.
    - `border: 1px solid rgba(82, 44, 37, 0.12)`.
    - `margin-bottom: 1.2rem`.
    - `padding: 0.4rem 2.4rem`.
    - `transition: background 200ms ease, border-color 200ms ease, box-shadow 200ms ease`.
  - **Interactive Chevron**: Circular tactile button indicator (`width: 3.6rem; height: 3.6rem; border-radius: 50%; background: rgba(82, 44, 37, 0.06); display: grid; place-items: center`).
  - **Micro-interactions**:
    - `:active` on the question button creates a gentle compression (`scale(0.985)`).
    - When opened (`.is-open` or `[open]`), card border deepens to `rgba(82, 44, 37, 0.3)` and chevron rotates 180° with a lively spring bounce (`cubic-bezier(0.34, 1.56, 0.64, 1)`).

### 3.3 Roaster Section (`#roaster`)
- **Current State**: Credentials and quote rest between flat 1px borders on the dark brown band.
- **Modernized Design**:
  - **Credentials List**: Convert into a row of rounded pill tags (`background: rgba(255, 249, 242, 0.12)`, `border: 1px solid rgba(255, 249, 242, 0.22)`, `border-radius: 9999px`, `padding: 0.8rem 1.8rem`, `font-size: 1.1rem`).
  - **Pull Quote**: Transform into a frosted inset quote card (`background: rgba(255, 249, 242, 0.08)`, `border-radius: var(--panel)`, `border: 1px solid rgba(255, 249, 242, 0.16)`, `padding: 2.8rem 3.2rem`).
  - **Action CTA**: Secondary pill button with spring-loaded active compression.

### 3.4 Interactive Controls & Spring Physics (Site-wide)
- **Buttons & Steppers (`.btn-primary`, `.btn-secondary-pill`, `.lot-add-btn`, `.stepper-btn`)**:
  - `border-radius: 9999px` (clean Apple capsule/pill).
  - Hover: Subtle luminance lift + `transform: translateY(-1px)`.
  - Active press: `transform: scale(0.95)` with rapid 150ms spring release (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Cart Drawer (`.cart-drawer`)**:
  - Each item row encapsulated in a rounded inset surface (`border-radius: 1.4rem; background: var(--beige)`).
  - Clean pill steppers and trash removal icon with smooth hover scale.
  - Checkout button with high-contrast pill geometry and haptic-feel active bounce.

---

## 4. Normative Motion Tokens

```css
:root {
  /* Apple spring and ease curves */
  --ease-apple-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-apple-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-apple-press: cubic-bezier(0.2, 0, 0, 1);

  /* Apple-inspired radii */
  --radius-pill: 9999px;
  --radius-card: 1.8rem;
  --radius-panel: 2.4rem;
  --radius-sm: 1.2rem;
}
```

---

## 5. Verification & Parity Safeguards

1. **Parity Checks**: `npm run check:strict` must pass; the updated CSS SHA will be registered in `scripts/check-parity.mjs` with full documentation.
2. **Zero Runtime Dependencies**: All animations and springs are pure, hardware-accelerated CSS (`transform`, `opacity`, `box-shadow`) with GPU compositing.
3. **Accessibility**: Touch targets remain ≥ 44px; `@media (prefers-reduced-motion: reduce)` is fully honoured (bypasses scale/transform in favour of instant state change).
4. **Visual Testing**: Automated browser rendering tests verifying desktop and mobile viewports.

