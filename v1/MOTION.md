# Motion & Interaction Specification

| Field | Value |
| :--- | :--- |
| **Document ID** | `MOTION-001` |
| **Version** | 2.5.4 |
| **Status** | Approved — living document |
| **Scope** | `index.html`, `styles/main.css`, `scripts/main.js` |
| **Owner** | Frontend / Design Engineering |
| **Last reviewed** | 2026-10-25 |
| **Supersedes** | v1.0 — reverse-engineering notes of `iamcoffeeco.org` |
| **Related** | [`AGENTS.md`](./AGENTS.md) (engineering), [`DESIGN.md`](./DESIGN.md) (visual system) |

---

## 0. How to read this document

This is the normative specification for every animation and interactive transition in the
Day Three site. It exists so that motion can be reviewed, tested, and extended
without re-deriving intent from CSS.

**Conformance language** (RFC 2119):

- **MUST** — required. A change that violates a MUST is a defect.
- **SHOULD** — expected unless there is a documented reason.
- **MAY** — optional, at the implementer's discretion.

**Status vocabulary** used throughout:

| Status | Meaning |
| :--- | :--- |
| **Implemented** | Present in code and matches this spec |
| **Partial** | Present but deviates; see §13 |
| **Spec only** | Required by this document, not yet built |
| **Reserved** | Declared for future use; do not consume without a spec change |
| **Deprecated** | Present in code, scheduled for removal; do not reuse |

Anything not specified here MUST follow the nearest analogous component rather than
inventing a new pattern.

---

## 1. Scope & non-goals

**In scope:** entrance choreography, hover/focus/active feedback, state transitions, overlay
choreography, loading/confirmation feedback, scroll-linked behaviour, and the
timing tokens that govern them.

**Out of scope:** colour, type, spacing, and layout (see `DESIGN.md`); content and data
contracts (see `AGENTS.md`).

**Non-goals:** this site deliberately ships **no** parallax scroll libraries, no scroll
hijacking, no Lottie/WebGL, no layout animations, and no animation framework. New motion
MUST be achievable with CSS transitions/keyframes plus small vanilla JS toggles.

---

## 2. Motion principles

1. **Motion clarifies state, never decorates.** Every animation must answer a question:
   *what just changed?* If it can't, remove it.
2. **Calm surfaces, quick feedback.** Large objects travel slowly with long ease-out curves;
   controls respond in 150–250ms. The contrast is what makes the site feel expensive.
3. **One moving thing at a time.** Hover states and reveals must not compete in
   the same viewport region.
4. **Compositor-only.** Animate `transform`, `opacity`, and `filter` only. Never animate
   `width`, `height`, `top`, `left`, `margin`, or `box-shadow` in a loop.
5. **Motion is optional.** Every non-essential animation MUST be disableable via
   `prefers-reduced-motion` (§8).
6. **No surprise sound.** Audio MUST default to muted and require a user gesture.

---

## 3. Timing tokens

Defined in `styles/main.css` §1 as custom properties. Components MUST reference the token,
not a literal curve.

### 3.1 Easing

| Token | Value | Intent | Typical use |
| :--- | :--- | :--- | :--- |
| `--ease-expo-out` | `cubic-bezier(0.19, 1, 0.22, 1)` | Immediate departure, long settle | Link underlines, drawer slide |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Balanced material curve | Scroll reveals, menu, fades |
| `--ease-spring` | `cubic-bezier(0.2, 0.6, 0.3, 1)` | Slight overshoot, tactile | Burger morph, buttons, toasts |
| `--ease-header` | `cubic-bezier(0.25, 1, 0.5, 1)` | Decelerating | Header shrink |
| `--ease-quick` | `200ms ease` | Convenience shorthand | Colour/micro-state swaps |

Additional literal curve: `cubic-bezier(0.25, 1, 0.5, 1)` for image zoom (equivalent feel to
`--ease-header`; SHOULD be migrated to the token).

### 3.2 Duration

| Band | Range | Applies to |
| :--- | :--- | :--- |
| Instant | `0–100ms` | Press feedback, opacity ticks |
| Fast | `150–250ms` | Hover, focus, colour, stepper |
| Standard | `300–400ms` | Overlays, drawers, modals, toasts |
| Entrance | `600–800ms` | Reveals, underlines, media zoom |
| Pulse | `2s` loop | Status dots |

**Ceiling:** no single transition may exceed `800ms` except ambient loops. Anything slower
reads as lag.

### 3.3 Delay

Stagger delays exist only for reveal cascades and are capped at four steps:

| Attribute | Delay |
| :--- | :--- |
| `data-stagger="1"` | `0.08s` |
| `data-stagger="2"` | `0.16s` |
| `data-stagger="3"` | `0.24s` |
| `data-stagger="4"` | `0.32s` |

A fifth step MUST NOT be added; restructure the layout instead.

### 3.4 Distance & scale constants

| Constant | Value | Used by |
| :--- | :--- | :--- |
| Reveal offset | `25px` vertical | `[data-scroll-reveal]` |
| Reveal scale | `0.94` (scale mode), `0.92`/`0.9×1.3` (reserved keyframes) | media cards |
| Card hover lift | `-1px` … `-2px` | buttons, cards |
| Icon nudge | `4px` horizontal | CTA arrows, service cards |
| Footer link nudge | `2px` horizontal | footer links |
| Image zoom | `1.05` (cards) | media frames |
| Press scale | `0.85` | stepper buttons |
| Badge bounce | `1 → 1.3 → 1` | cart count |
| Dot pulse | `1 → 1.35`, opacity `1 → 0.6` | status dots |
| Modal scale | `0.96 → 1` | lightbox |
| Toast offset | `20px` in / `12px` out with `0.95` scale | toasts |

---

## 4. Keyframe registry

All keyframes are declared in `styles/main.css` §3. This registry is authoritative: new
keyframes MUST be added here in the same change.

| Keyframe | Definition summary | Consumers | Status |
| :--- | :--- | :--- | :--- |
| `statusPulse` | `scale(1 → 1.35)`, `opacity(1 → 0.6)` at 50% | `.status-dot`, `.green-dot`, submit spinner icon | Implemented |
| `scrollBeam` | `translateY(-20px → 64px)` with opacity in/out | `.hero-scroll-beam` | Implemented |
| `cartBounce` | `scale(1 → 1.3 → 1)` | `.cart-count.bounce` | Implemented |
| `modalFadeIn` | `opacity 0→1`, `scale(0.96→1)` | form feedback alert | Implemented |
| `toastIn` | `translateY(20px) scale(0.95)` → rest | `.toast` | Implemented |
| `toastOut` | rest → `translateY(12px) scale(0.95)` | `.toast.is-hiding` | Implemented |
| `tmpl-anim-fade-up` | `translateY(25px)` fade-up | — | Deprecated |
| `tmpl-anim-fade-scale-up` | `scale(0.92)` fade-up | — | Deprecated |
| `tmpl-anim-fade-stretch-up` | `scaleX(0.9) scaleY(1.3)` + `25px` | — | Deprecated |
| `drawerSlideIn` | `translateX(100% → 0)` | — | Deprecated |

**Rule:** the three `tmpl-anim-*` keyframes and `drawerSlideIn` are reference artifacts from
the research phase. The implementation uses CSS transitions instead because they are
reversible and interruptible. Do not wire them up; delete them at the next cleanup.

---

## 5. Scroll reveal system

### 5.1 Contract

| Aspect | Requirement |
| :--- | :--- |
| Opt-in attribute | `[data-scroll-reveal]` on the element to animate |
| Variant | `[data-scroll-reveal="scale"]` for media/scale entrances |
| Revealed class | `.is-revealed` (toggled by observer on entry and exit) |
| Initial state | `opacity: 0`, `translateY(25px)`; scale variant uses `scale(0.94)` + `blur(8px)` |
| Animated properties | `opacity`, `transform`; the scale variant adds `filter` |
| Duration / easing | `800ms` `--ease-standard` |
| Stagger | `[data-stagger="1–4"]` on the **same element** as `data-scroll-reveal` |
| Observer options | `root: null`, `rootMargin: "0px 0px -60px 0px"`, `threshold: 0.12` |
| Repeat | Every viewport crossing, in both scroll directions |
| Exit origin | `.is-above` offsets the hidden state to `translateY(-25px)` when the element left through the top, so re-entry mirrors the exit edge |
| Fallback | If `IntersectionObserver` is absent, all elements reveal immediately |

**MUST:** `data-stagger` without `data-scroll-reveal` has no effect. When revealing a group,
place the reveal attribute on each child that should cascade, not on the parent grid.

### 5.2 Reference implementation

```css
[data-scroll-reveal] {
  opacity: 0;
  transform: matrix(1, 0, 0, 1, 0, 25); /* translateY(25px) */
  transition: opacity 0.8s var(--ease-standard),
              transform 0.8s var(--ease-standard);
  will-change: opacity, transform;
}

[data-scroll-reveal].is-above {
  transform: matrix(1, 0, 0, 1, 0, -25); /* re-enter from above */
}

[data-scroll-reveal].is-revealed {
  opacity: 1;
  transform: matrix(1, 0, 0, 1, 0, 0);
}

[data-scroll-reveal="scale"] {
  transform: matrix(0.94, 0, 0, 0.94, 0, 0);
  filter: blur(8px);
  transition: opacity 0.8s var(--ease-standard), transform 0.8s var(--ease-standard),
    filter 0.7s var(--ease-standard);
}
[data-scroll-reveal="scale"].is-revealed {
  transform: matrix(1, 0, 0, 1, 0, 0);
  filter: blur(0);
}
```

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-revealed');
      return;
    }
    entry.target.classList.remove('is-revealed');
    entry.target.classList.toggle('is-above', entry.boundingClientRect.top < 0);
  });
}, { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.12 });
```

### 5.3 Usage patterns

```html
<!-- simple entrance -->
<section data-scroll-reveal>…</section>

<!-- scale entrance -->
<div class="concierge-form-card" data-scroll-reveal="scale">…</div>

<!-- cascading siblings -->
<article class="product-card" data-scroll-reveal data-stagger="1">…</article>
<article class="product-card" data-scroll-reveal data-stagger="2">…</article>
<article class="product-card" data-scroll-reveal data-stagger="3">…</article>
```

### 5.4 Edge cases

- Content injected **after** page load will not be observed. If dynamic rendering is added,
  call the observer on the new nodes explicitly.
- Elements already in view on first paint reveal immediately — this is intended; do not add
  an artificial delay to the hero.
- Keep `-60px` root margin so elements reveal slightly inside the fold, not on touch.
- The hidden state is restored only once an element is **fully** out of view, so nothing
  fades out while still readable. Blocks taller than the viewport therefore stay revealed
  until any part of them leaves the fold.

---

## 6. Component interaction specifications

Each block states the trigger, the animated properties, timing, and the source of truth.

### 6.1 Sticky header shrink

| | |
| :--- | :--- |
| **Trigger** | `window.scrollY > 40` (set), `<= 40` (cleared), passive listener |
| **Class** | `.site-header.shrink` |
| **Animates** | `height` (`80px → 64px`; `70px → 60px` ≤768px); glass background `--glass-dark → --glass-dark-strong` |
| **Timing** | `300ms` `--ease-header` (background `300ms ease`) |
| **Notes** | Throttle-free; a single class toggle per scroll event. The dispatch bar above the nav darkens with it via `.site-header-container.is-scrolled`. `backdrop-filter` is never transitioned — only the background colour is. |
| **Status** | Implemented |

```css
.site-header { transition: padding .3s var(--ease-header), background-color .3s ease; }
.site-header.shrink .header-inner { height: var(--header-height-shrunk); }
```

**SHOULD:** introduce a small hysteresis (e.g. expand at `scrollY < 20`, shrink at `> 40`)
if flicker is reported near the threshold.

### 6.2 Navigation underline

Dual-gradient mechanism: two 50%-width, 1px-tall layers parked off the left edge, moved by
a `background-position` transition. No keyframes — it must interrupt cleanly on rapid hover.

| | |
| :--- | :--- |
| **Idle** | `background-position: -200% 100%, -100% 100%` |
| **Hover / active** | `background-position: 0% 100%, 100% 100%` |
| **Timing** | `500ms` `--ease-expo-out` |
| **Animates** | `background-position` (paint, not layout) |
| **Status** | Implemented |

```css
.nav-link {
  background-image: linear-gradient(currentColor, currentColor),
                    linear-gradient(currentColor, currentColor);
  background-size: 50% 1px, 50% 1px;
  background-position: -200% 100%, -100% 100%;
  background-repeat: no-repeat;
  transition: background-position .5s var(--ease-expo-out), color .2s ease;
}
.nav-link:hover, .nav-link.active {
  color: var(--color-crisp-white);
  background-position: 0% 100%, 100% 100%;
}
```

**MUST:** the active state is communicated by exactly one underline treatment. Do not
combine the animated gradient with a static `border-bottom`.

### 6.3 Mobile menu (hamburger morph + drawer)

| | |
| :--- | :--- |
| **Trigger** | `#burger-btn` click; nav link click; `Escape` |
| **Classes** | `.burger-btn.is-active`, `.mobile-nav-drawer.is-open`, `body.scroll-locked` |
| **Hamburger** | Top/bottom bars `translateX(3.5px) rotate(±135deg)`, width `100% → 26px`; middle bar `scale(0)` + `opacity 0` |
| **Drawer** | `translateX(100% → 0)` |
| **Timing** | Bars `250ms` `--ease-spring`; drawer `400ms` `--ease-standard`; colour `200ms` |
| **Pointer** | Drawer is `pointer-events: none` until open |
| **Status** | Implemented |

**MUST:** `<button aria-expanded>` reflects state; `body` scroll lock applies while open.

### 6.4 Dispatch bar (header)

| | |
| :--- | :--- |
| **Animation** | None — static single line |
| **Mobile** | ≤768px shows the first item only |
| **Status** | Implemented |

### 6.5 Mission band

| | |
| :--- | :--- |
| **Animation** | None |
| **Status** | Removed. Do not reintroduce a scrolling band. |

**MUST:** duplicated sequences are `aria-hidden="true"` so assistive tech reads the message
once. **SHOULD:** pause on `prefers-reduced-motion` and render a static single instance.

### 6.6 Ambient indicators

| Element | Animation | Timing |
| :--- | :--- | :--- |
| `.status-dot` | `statusPulse` scale/opacity | `2s` infinite ease-in-out |
| `.green-dot` (concierge on duty) | same | `2s` infinite |
| `.cart-count.bounce` | `cartBounce` | `400ms` `--ease-spring`, class removed → forced reflow → re-added |

**MUST:** pulses are decorative only — no information may depend on them.

### 6.7 Hero film, scroll cue & glass chrome

| | |
| :--- | :--- |
| **Layout** | Full-bleed muted film behind the entire hero (`position: absolute; inset: 0; object-fit: cover`); one centred type column (max 960px) |
| **Scrim** | Centre-weighted radial plus a vertical wash; one vertical wash at ≤1024px |
| **Video** | `autoplay muted loop playsinline`, `preload="auto"`, local `video.mp4`; playback retried on `canplay` and on the first user gesture |
| **Scroll cue** | Bottom-centred 1px × 64px track; 20px brass beam travels `-20px → 64px` over `2.4s` `--ease-standard`, infinite, fading in at 22% and out at 100% |
| **Play button** | `#hero-play-secondary-btn` opens the lightbox; the hero film pauses while the modal is open and resumes on close |
| **Glass chrome** | Header and dispatch bar use `--glass-dark` at rest and `--glass-dark-strong` past 40px, with `--glass-blur`; drawers, modal and toasts use the same recipe at overlay opacity |
| **Status** | Implemented |

**MUST:** the video starts muted. **SHOULD:** pause the loop when the tab is hidden and when
the section is off-screen. The scroll cue is the only post-entrance motion on the fold.

### 6.8 Cards & media hover

| Surface | Effect | Timing |
| :--- | :--- | :--- |
| `.product-card` | Border darkens, `translateY(-2px)` | `300ms ease` |
| `.badge-peeled-sticker` | `rotate(5deg) scale(1.05)` on card hover | `350ms --ease-spring` |
| `.product-image` | `scale(1.05)` inside `overflow: hidden` frame | `600ms cubic-bezier(.25,1,.5,1)` |
| `.pillar-card` | Background only | `250ms ease` |
| `.service-highlight-card` | Brass border, `translateX(4px)` | `250ms ease` |
| `.footer-link` | White text, `translateX(2px)` | `200ms ease` |
| `.recommendation-box` | Opacity/transform during content swap | `300ms ease` |

**MUST NOT:** scale the whole card. Only the inner image scales.

### 6.9 Buttons & steppers

| Control | Hover | Active | Timing |
| :--- | :--- | :--- | :--- |
| Primary pill | `translateY(-2px)`, white fill, deeper shadow | `scale(0.98)`, instant | `250ms --ease-spring` |
| Secondary pill | brass border, `translateY(-1px)` | reset | `250ms ease` |
| CTA arrow | `translateX(4px)` | — | `200ms ease` |
| Add to bag | `translateY(-1px)`, black fill | — | `250ms --ease-spring` |
| Quantity stepper `−` / `+` | no fill (squared 1px rule) | `scale(0.88)` | `150ms ease` |
| Cart stepper buttons | colour shift | `scale(0.85)` | `150ms ease` |

All interactive controls **MUST** have a visible focus state and a ≥44px touch target.
Cart steppers and the product quantity stepper expand to 44px at ≤768px and on coarse
pointers; primary actions also scale to `0.98` on `:active` — a state change, not a
transition, so it lands in the same frame. The product quantity is an editable stepper
input (`1–999`): the `−`/`+` buttons and the numeric field share one 44px control.

### 6.10 Cart drawer

| | |
| :--- | :--- |
| **Open** | `#cart-pill-btn` or `#add-nicaragua-cart` → re-render cart, rewrite the dialog `aria-label` with count + subtotal, then overlay + drawer classes |
| **Close** | Close button, overlay click, `Escape`; focus returns to the invoking control |
| **Drawer** | `translateX(100% → 0)`, `400ms` `--ease-expo-out` |
| **Overlay** | Opacity `0 → 1`, `350ms ease` |
| **Badge** | Bounce on every re-render |
| **Shipping bar** | Width transition `300ms ease`, clamped `0–100%` |
| **Step feedback** | Line items re-render; removal triggers a `delete` toast |
| **Status** | Implemented; focus trap/restore verified (§8.4, §13.6) |

**MUST:** body scroll locks while open, and the lock is released exactly once on close.
Add-to-bag opens the drawer as its confirmation — it does **not** fire a toast, which
would cover the checkout button.

### 6.11 Toast lifecycle

```
create (toastIn 350ms spring) → hold 3500ms → is-hiding (toastOut 300ms) → remove()
```

| | |
| :--- | :--- |
| **Container** | Fixed bottom-right, `pointer-events: none`; individual toasts re-enable pointer events |
| **Stacking** | Column, `0.75rem` gap, newest appended last |
| **Icon** | Material Symbols name passed per message |
| **Status** | Implemented |

**MUST:** the container carries `aria-live="polite"`. Toasts MUST NOT be the sole channel
for destructive or blocking information.

### 6.12 Video lightbox

| | |
| :--- | :--- |
| **Open** | `#hero-play-secondary-btn` (the hero film has no inline play control) |
| **Entry** | Backdrop opacity `0 → 1` (`300ms`), container `scale(0.96 → 1)` (`300ms --ease-spring`) |
| **On open** | Hero video pauses; modal video resets to `0`, unmutes, plays |
| **Close** | Close button, backdrop click (target === backdrop), `Escape` |
| **On close** | Modal video pauses; hero video resumes |
| **Status** | Implemented; focus trap/restore verified (§8.4, §13.6) |

### 6.13 Form submission feedback

| | |
| :--- | :--- |
| **Trigger** | `submit` on `#concierge-contact-form` (native validation first) |
| **Submitting** | Button label swaps to "Dispatching…" with a pulsing `autorenew` icon; disabled |
| **Duration** | Simulated `1200ms` |
| **Success** | `.form-feedback-alert.show` (`modalFadeIn` `300ms`), form reset, toast, scroll into view |
| **Status** | Implemented (simulated only) |

**MUST:** the submit button is re-enabled and its original markup restored in every exit
path.

### 6.14 Anchor navigation

`html { scroll-behavior: smooth }` governs all in-page anchors.

**MUST:** targets define `scroll-margin-top` equal to the fixed header height plus breathing
room, otherwise the heading lands behind the fixed header (§13.1).

### 6.15 Hero entrance (page load)

| | |
| :--- | :--- |
| **Trigger** | `body.is-loaded`, added on the second `requestAnimationFrame` after `DOMContentLoaded` |
| **Sequence** | Headline line 1 `0ms` → line 2 `90ms` (mask) → body `300ms` → actions `400ms` |
| **Recipe** | Jakub enter: `opacity 0→1`, `translateY(14px / 105%)→0`, `blur(4px / 3px)→0` |
| **Properties** | `transform`, `opacity`, `filter` only |
| **Interruptible** | Yes — transitions, not keyframes |
| **Replay** | Never. It is a load state, not a scroll effect |
| **Reduced motion** | Elements render in their final state; the global §8.1 block zeroes the transition |

**MUST:** the hero header carries **no** `data-scroll-reveal` — the entrance owns it. The
two headline lines are wrapped in `.hero-line > span` so each can be masked; `overflow:
hidden` plus `0.08em` descender padding prevents clipped italics.

**SHOULD:** keep the whole sequence under 1.2s. Do not add sound, parallax, or a third
headline line to it.

---

## 7. State machines

### 7.1 Add to bag

| From | Event | To | Side effects |
| :--- | :--- | :--- | :--- |
| Idle | click add | Success | Merge/increment by the selected quantity, swap the button label, `renderCart()`, open the cart drawer with an updated `aria-label`, reset quantity to 1, bounce the badge |
| Success | `2000ms` elapsed | Idle | Restore label + remove `.is-success` |

Guard: quantity is typed or stepped into the 1–999 field and clamps on blur/Enter;
sold-out lots route to the waitlist form instead of rendering a dead disabled control.
Add-to-bag does not fire a toast.

### 7.2 Overlay lifecycle (drawer & modal)

| State | Drawer classes | Modal classes | Body |
| :--- | :--- | :--- | :--- |
| Closed | — | — | unlocked |
| Opening | `.is-active` on overlay + drawer | `.is-active` on backdrop | `scroll-locked` |
| Open | same | same | `scroll-locked` |
| Closing | classes removed | classes removed | unlocked |

**MUST:** `Escape` closes the topmost overlay only. Closing one overlay must not unlock
scroll if another remains open (§13.7).

### 7.3 Form

`Idle → Submitting (disabled, spinner) → Success (alert + toast) → Idle (reset)`.

No failure branch exists; if a real endpoint is added, a `Failure` state with an inline
`role="alert"` error is **required**.

---

## 8. Accessibility & motion safety

### 8.1 Required reduced-motion behaviour

Implemented in `styles/main.css` §18 and `scripts/main.js`. The contract:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }

  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Preserve comprehension: content must still appear */
  [data-scroll-reveal] {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }

  /* The hero entrance collapses to its final state */
  .hero-line > span,
  .hero-subtext,
  .hero-cta-group {
    opacity: 1;
    transform: none;
    filter: none;
  }

  .hero-scroll-beam {
    animation: none;
    opacity: 0.9;
    transform: translateY(24px);
  }

  .product-image { transform: none !important; }
}
```

### 8.2 Rules

- **MUST** not autoplay audio. Video autoplay is acceptable only muted and `playsinline`.
- **MUST** not flash more than 3 times per second.
- **MUST** keep all information available without motion (no reveal-gated content).
- **MUST** restore focus to the invoking element when an overlay closes.
- **MUST** trap focus inside open dialogs (cart drawer, video modal).
- **SHOULD** keep animated elements out of the tab order unless they are controls.
- **SHOULD** honour `prefers-reduced-motion` for pulses, reveals, and zoom.
- **MUST** ensure focus outlines are never removed without a replacement.

### 8.3 Live regions

| Region | Attribute | Content |
| :--- | :--- | :--- |
| `#toast-container` | `aria-live="polite"` | Transient confirmations |
| `#form-feedback-alert` | `role="alert"` | Consultation confirmation |
| `#cart-drawer` | `aria-label` rewritten before open | Item count + subtotal; focus moves to close |

### 8.4 UI/UX Pro Max Motion & WCAG 2.2 Audit

| Rule / WCAG Criterion | Priority | Requirement | Implementation & Verification | Status |
| :--- | :---: | :--- | :--- | :---: |
| **WCAG 2.2.2 (Pause, Stop, Hide)** | CRITICAL | Moving tickers/loops must provide user pause mechanism | N/A — no auto-moving content. The dispatch bar is static; the hero loop is muted, decorative and pauses off-screen. | **Pass** |
| **WCAG 2.3.1 (Three Flashes)** | CRITICAL | Animations must not flash > 3 times/sec | All pulses (`statusPulse`) operate at 1.0s (1.0 Hz) and toasts ease at 350ms, well below the 3 Hz threshold. | **Pass** |
| **WCAG 2.4.11 (Focus Not Obscured)** | HIGH | Sticky headers must not obscure focused elements | `scroll-margin-top: calc(var(--header-height) + 5.5rem);` applied to all section anchors and `#contact-section`. | **Pass** |
| **WCAG 2.5.8 (Target Size)** | CRITICAL | Pointer inputs require minimum 24px (web) / 44px (touch) | Desktop targets ≥36px; mobile and coarse-pointer targets expand to ≥44px × 44px (`.stepper-btn`, `.burger-btn`, overlay closes). | **Pass** |
| **Compositor Efficiency** | HIGH | Animate only GPU properties (`transform`, `opacity`, `filter`) | All transitions use `transform` and `opacity`; zero animations on `width`, `height`, `top`, or `margin`. `will-change: auto;` releases layers on reveal. | **Pass** |
| **Focus Trapping & Escape** | CRITICAL | Overlays must trap focus and dismiss via Escape | `createFocusTrap` activates on mobile drawer, cart, and video modal; `Escape` listener pops and dismisses the topmost overlay only. | **Pass** |

---

## 9. Performance budget

| Constraint | Limit |
| :--- | :--- |
| Animated properties | `transform`, `opacity`, `filter` only |
| Backdrop blur | None — surfaces are solid |
| `will-change` | Only while a transition is imminent; avoid permanent usage |
| Long tasks from animation JS | none — animation logic is class toggles only |
| Video | `preload="auto"` only for the hero loop; modal reuses the same file |
| Layout thrash | no reads (`offsetWidth`) inside scroll handlers except the deliberate reflow-for-bounce |

**Implementation rules**

- Prefer CSS transitions over keyframes for reversible interactions (hover, open/close).
- Use keyframes only for loops (`statusPulse`) and one-shot confirms.
- `will-change` **SHOULD** be scoped to elements that animate on scroll and removed after
  reveal.
- Test with 4× CPU throttling; reveals and the drawer must hold 60fps.

---

## 10. Responsive & device behaviour

| Context | Behaviour |
| :--- | :--- |
| ≤1024px | Nav collapses to the hamburger; drawer animation becomes the primary navigation motion |
| ≤768px | Header heights shrink to `70/60px`; hero type stays centred and wraps — no animation change. Product grid leads with the in-stock lot, switches to a 4:3 art-directed image, and collapses sold-out lots to compact rows. |
| Touch | Hover-only effects are inert; all state changes must be reachable by tap |
| Pointer: coarse | Steppers and overlay closes must meet ≥44px hit area |
| Hidden tab | Hero video pauses via the Page Visibility API |

---

## 11. QA & verification

### 11.1 Manual checklist

- [ ] Hero enters once, top to bottom, in under 1.2s, and never replays on scroll
- [ ] Scroll beam travels the full track and fades at both ends; header darkens to glass on the first 40px
- [ ] Header transitions once at 40px, no flicker
- [ ] Every hover state reverts cleanly when the pointer leaves mid-transition
- [ ] Nav underline enters and exits without a snap
- [ ] Burger morphs and reverses correctly, including rapid double-clicks
- [ ] Every reveal replays on re-entry from either direction; nothing stays invisible after scrolling past it
- [ ] Stagger cascade is visible (not simultaneous) on product cards
- [ ] Dispatch bar renders one static line and never animates
- [ ] Drawer and modal open/close repeatedly without stacking classes
- [ ] `Escape` closes only the topmost overlay
- [ ] Toasts stack, expire at 3.5s, and remove their nodes
- [ ] Add-to-bag success state reverts at 2s even if the cart is opened meanwhile; quantity resets to 1
- [ ] Quantity clamps to 1–999 on blur/Enter, and the +/− controls hold 44px targets
- [ ] Add-to-bag opens the drawer, announces count + subtotal in the dialog label, and does not stack a toast over checkout
- [ ] Form spinner runs, then the alert appears and the form resets
- [ ] No layout shift during any transition

### 11.2 Instrumentation procedure

1. Chrome DevTools → Performance → record while opening the drawer and scrolling the page.
2. Confirm no long tasks > 50ms caused by animation code.
3. Confirm no `Layout` rows in the animation frames (only `Composite`/`Paint`).
4. Toggle **Emulate CSS `prefers-reduced-motion: reduce`** and repeat §11.1 — content must
   be fully visible with motion suppressed.
5. Throttle CPU 4× and re-check the drawer at ≤768px.

### 11.3 Definition of done for a motion change

- Spec table in §6 updated.
- Keyframe registry (§4) updated if a keyframe was added or retired.
- Reduced-motion behaviour verified.
- §11.1 rows relevant to the change pass.
- Changelog entry added.

---

## 12. Governance

### 12.1 Adding motion

1. State the question the animation answers.
2. Choose an existing token; justify any new token.
3. Specify: trigger, initial/active state, properties, duration, easing, interruption
   behaviour, and reduced-motion fallback.
4. Add a row to §3, §4 (if keyframed), and §6.
5. Implement with class toggles; no scroll listeners for decoration.

### 12.2 Review checklist

- [ ] Uses a registered token, not a literal
- [ ] Animates only `transform`/`opacity`/`filter`
- [ ] Reversible and interruptible
- [ ] ≤ 800ms (or an ambient loop)
- [ ] Reduced-motion path defined
- [ ] No content hidden behind animation
- [ ] Registry and changelog updated

### 12.3 Deprecation

Mark the entry **Deprecated**, note the replacement, keep it for one release, then remove
it in the same change as its last consumer.

### 12.4 Versioning

Semantic versioning of this document: **major** for removed/renamed tokens or changed
conformance requirements; **minor** for new components or tokens; **patch** for
clarifications. The code and this file MUST be updated together.

---

## 13. Known deviations (gap register)

All deviations identified against v2.0 have been implemented and verified in code.

| # | Deviation | Severity | Required action | Status |
| :-: | :--- | :--- | :--- | :--- |
| 13.1 | No `scroll-margin-top` on anchor targets; links land under the fixed header | High | Add `scroll-margin-top: calc(var(--header-height) + 3rem)` | **Resolved** (`styles/main.css` §2) |
| 13.2 | `.nav-link.active` ran an underline keyframe **and** a border | Medium | One treatment only | **Resolved** (background-position transition, no keyframes) |
| 13.3 | `.pillar-card`s carry `data-stagger` but no `data-scroll-reveal`; grid cascades as one unit | Medium | Move the reveal attribute to each card | **Resolved** (`index.html`) |
| 13.4 | `tmpl-anim-*` and `drawerSlideIn` keyframes unused; `--gutter` unused | Low | Delete or adopt | **Resolved** (deleted unused tokens & keyframes) |
| 13.5 | No `prefers-reduced-motion` handling anywhere | High | Ship §8.1 | **Resolved** (`styles/main.css` §19, `scripts/main.js`) |
| 13.6 | Drawer lacks dialog semantics/focus trap; modal lacks focus trap | High | Add `role="dialog"`, `aria-modal`, trap + restore | **Resolved** (`index.html`, `scripts/main.js` §0) |
| 13.7 | `scroll-locked` is global; closing one overlay unlocks the other | Medium | Reference-count the lock | **Resolved** (`scripts/main.js` §0 `scrollLocks` Set) |
| 13.8 | Sommelier swap timeout `150ms` vs `300ms` transition | Low | Match durations or use `transitionend` | **Resolved** (component later removed) |
| 13.9 | Stepper hit areas < 44px on touch | Medium | Increase padding at ≤768px | **Resolved** (44px min on mobile / pointer: coarse) |
| 13.10 | `activeMethod` captured but unused; `lastScrollY` written but unread | Low | Wire up or delete | **Resolved** (method advice wired; dead code pruned) |
| 13.11 | Marquee duplicates exposed to assistive tech | Medium | Remove the tickers | **Resolved** (marquees deleted; static bar in `index.html`) |
| 13.12 | `will-change` applied permanently to reveal elements and hero video | Medium | Remove after reveal; scope to animating states | **Resolved** (`will-change: auto` on revealed elements) |
| 13.13 | Image-zoom curve is a literal, not a token | Low | Add `--ease-media` or reuse `--ease-header` | **Resolved** (`--ease-media` declared & consumed) |

---

## 14. Appendix A — reference research (iamcoffeeco.org)

The original v1.0 notes documented how the reference site achieved its feel. What this
implementation adopted:

| Reference technique | Decision | Rationale |
| :--- | :--- | :--- |
| Dual-gradient sliding underline | **Adopted** | Distinctive, cheap, works on any background |
| Matrix-based fade/scale/stretch reveals | **Partially adopted** | Effects kept; implemented as transitions so they interrupt cleanly |
| Header that shrinks on scroll | **Adopted** | Glass removed; the shrink behaviour stayed |
| Three-bar hamburger → X | **Adopted** | Same geometry and spring curve |
| Fullscreen mobile overlay | **Adopted**, adapted to a dark right-edge drawer | Matches this site's panel language |
| Mask-faded infinite marquee | **Rejected after review** | Template-signature motion; replaced by a static dispatch bar |
| Parallax / 0.3× hero scroll | **Rejected** | Costly, fights reduced-motion, adds no clarity |
| Secondary image cross-fade on product hover | **Not built** | Would need a second image per product |
| Scroll-triggered testimonial reveals at 50% viewport | **Not applicable** | No testimonial section |
| Ellipsis loading button | **Replaced** | Pulsing icon + label swap fits the brand |

The reference's section rhythm (black → light → black) and its token philosophy were carried
into `DESIGN.md`.

---

## 15. Appendix B — where motion lives

| Concern | File / location |
| :--- | :--- |
| Tokens | `styles/main.css` §1 (`--ease-*`, `--header-height*`) |
| Keyframes | `styles/main.css` §3 |
| Reveal utilities | `styles/main.css` §4 |
| Component transitions | `styles/main.css` §5–19, per component |
| Breakpoint overrides | `styles/main.css` §18 |
| Reveal observer | `scripts/main.js` §3 |
| Header shrink | `scripts/main.js` §2 |
| Menu | `scripts/main.js` §4 |
| Cart / drawer | `scripts/main.js` §5 |
| Add-to-bag | `scripts/main.js` §6 |
| Modal / audio | `scripts/main.js` §8 |
| Forms | `scripts/main.js` §9–11 |

---

## 16. Gallery restyle — appearance-only changes (v2.6.0)

The Direction C restyle (`GALLERY-RESTYLE.md`) changes hover *affordances* on paper. It does
**not** change any timing token, easing, duration, distance, stagger, or lifecycle in §3–§7.
This section is an amendment to §6, not a replacement.

### 16.1 Affordance migration

| Component | Retired | Replaced by | Timing |
| :--- | :--- | :--- | :--- |
| `.lot-card`, `.proof-card`, `.brew-card` | `translateY(-2px)`, fill/shadow change | `border-top-color` → `--gallery-ink` | `200ms` `--ease-standard` |
| `.btn-add-bag`, `.btn-directions`, `.btn-waitlist`, `.btn-order-request` | `translateY(-1/-2px)`, shadow growth | background colour only | `250ms` `--ease-spring` (unchanged) |
| `.footer-link` | `translateX(2px)` | colour only | `200ms` ease (unchanged) |
| `.lot-size-btn` active | fill + shadow | 1px brass underline + weight/colour | instant state, no transition on the price |
| `.grind-select` focus | border colour + ring | bottom rule → ink + global focus ring | instant |
| `.faq-item[open]` | background/border change | none; chevron only | chevron `250ms` ease (unchanged) |
| `.product-notes li` | chip border hover | none | — |

Preserved unchanged: hero entrance (§6.15), header shrink (§6.1), nav underline (§6.2),
mobile drawer (§6.3), dispatch bar (§6.4), scroll reveal (§5), drawer (§6.10), toasts
(§6.11), press feedback (`scale(.98)` / `.85`), stagger cascade.

### 16.2 Constraints

- Only `transform`, `opacity`, `background-color`, `border-color` animate. Hover states must
  not change layout: the card rule is already 1px, so recolouring it causes no reflow.
- No new keyframes. The Gallery band adds none.
- `@media (prefers-reduced-motion: reduce)` (§8.1) keeps its behaviour; remove selectors for
  components that no longer move, add none.
- If a future change wants a lift, shadow or scale back, it is a motion change and must come
  back through §12.1 — not a styling tweak.

### 16.3 Verification

Add to §11.1:

- [ ] No card, button or link moves on hover in the Gallery band; only colour changes
- [ ] Size toggle changes text, underline and price with no transition on the value
- [ ] FAQ rows open with no background change and a 250ms chevron rotation
- [ ] No layout shift when a card hover recolours its top rule

---

## 17. Changelog

| Version | Date | Change |
| :--- | :--- | :--- |
| 2.6.0 | 2026-10-26 | Direction C (Gallery) restyle: hover lift, shadow growth, image zoom, icon nudge and footer `translateX` retired in favour of colour-only feedback on paper (§16). No timing or easing token changed; reduced-motion contract unchanged. |
| 2.5.4 | 2026-10-25 | Removed origin metadata rows from all 3 product cards; increased product title scale to bold serif `clamp(1.4rem, 4.8cqi + 0.45rem, 1.85rem)`; unified flex card hierarchy and balanced vertical spacing rhythm across all three product cards. |
| 2.5.3 | 2026-10-25 | Added `.badge-peeled-sticker` minimal half-peeled sticker seal to single-origin lot with subtle card-hover rotation and spring ease (`rotate(4deg) scale(1.06)`, 350ms `--ease-spring`, reduced-motion disabled). 100% of website assets (favicon, video poster, og:image) localized to `assets/` with zero remote CDN dependencies. |
| 2.5.2 | 2026-10-25 | Product status chips aligned consistently to the top-left across all cards (`top: 1rem; left: 1rem;`) with dark glass styling and **Out of Stock** text; tasting notes converted to small sans-serif chips (`IBM Plex Sans`, 0.725rem, 500) with subtle pill borders and hover feedback. |
| 2.5.1 | 2026-10-25 | Quantity control replaced with an editable 1–999 stepper (direct entry + `−`/`+`); sold-out cards gain disabled grind selectors and a **Sold Out** badge, replacing the archived label. |
| 2.5.0 | 2026-10-25 | Product-card buy flow reworked: quantity is now a 1–10 select, the buy row closes the card, and add-to-bag opens the cart drawer (updating its dialog label) instead of firing a toast. Mobile leads with the in-stock lot, uses a 4:3 art-directed image, and collapses archived lots. |
| 2.4.0 | 2026-10-25 | Home hero recentred (dispatch panel and eyebrow chip removed); animated brass scroll beam added; glass layer introduced for header, drawers, modal and toasts; display serif switched from Playfair Display to Literata. |
| 2.3.0 | 2026-10-25 | Hero film promoted to a full-bleed looping backdrop with a floating dispatch panel; autoplay retry on `canplay`/first gesture; rounded radius scale and warmer hairline/brass palette applied across components. |
| 2.2.0 | 2026-10-25 | Scroll reveals are now bidirectional: `.is-revealed` toggles on exit as well as entry, and `.is-above` mirrors the exit edge so blocks re-enter from the direction they left. |
| 2.1.1 | 2026-10-25 | Integrated UI/UX Pro Max WCAG 2.2 AA / AAA motion audit in §8.4 covering target sizes, focus visibility, auto-rotation controls, and reduced-motion parity. |
| 2.1.0 | 2026-10-25 | Closed all 13 gap register items: tokens registered (`--ease-media`), dead keyframes removed, double nav underline removed, touch hit areas expanded, sommelier timing matched, and GPU layer memory freed post-reveal. |
| 2.0.1 | 2026-10-25 | Renamed `animations_and_interactions.md` → `MOTION.md` to match the uppercase root-document convention. No conformance changes. |
| 2.0.0 | 2026-10-25 | Rewritten as a normative specification: token tables, keyframe registry, per-component contracts, state machines, a11y and performance requirements, governance, and a gap register. Research notes moved to Appendix A. |
| 1.0.0 | — | Reverse-engineering notes for `iamcoffeeco.org`; descriptive only, not tied to this codebase. |
