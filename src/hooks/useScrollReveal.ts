import { useEffect } from 'react';
import { prefersReducedMotion } from './usePrefersReducedMotion';

const SELECTOR = '[data-scroll-reveal]';

/**
 * Distance (px) beyond the viewport in which a block is already considered
 * "in". Revealing a little before a block is actually on screen is the whole
 * trick: with a trigger exactly at the edge, a fast scroll shows the block at
 * `opacity: 0` for a frame or two and the page appears to have holes in it.
 */
const REVEAL_MARGIN = 320;

/**
 * Single page-wide reveal observer.
 *
 * Mount once, in `App`. It observes every `[data-scroll-reveal]` element that
 * exists now and every one added later (the lot cards render after the cart
 * context settles), so section components never wire up their own observers —
 * they only set the attribute.
 *
 * Directional: a block reveals as it approaches from either side and hides
 * once it has left. Which side it enters from is decided *at the moment of the
 * reveal* from the live rect — an element crossing into the margin from above
 * has a negative `top`, one arriving from below is beyond the fold. The side is
 * stored as `is-above`, which the stylesheet turns into the entrance offset.
 *
 * Deciding at reveal time rather than at exit time matters: a jump (skip link,
 * anchor, scroll restoration) can carry a block from below the viewport to
 * above it without ever intersecting, and `IntersectionObserver` fires nothing
 * on that transition — an exit-time side would sit there stale.
 *
 * The margin is what makes hiding safe: blocks only hide while they are still
 * REVEAL_MARGIN away from the viewport, so nothing visible ever goes blank.
 *
 * Two escape hatches keep the effect from becoming a trap:
 *   - `focusin` reveals a block immediately, so a keyboard user tabbing into a
 *     hidden block never gets a focus ring on an invisible control.
 *   - the reduced-motion preference is watched live, not just at mount.
 */
export function useScrollReveal(): void {
  useEffect(() => {
    const blocks = () => document.querySelectorAll<HTMLElement>(SELECTOR);

    const revealAll = () => {
      blocks().forEach((el) => {
        el.classList.remove('is-above');
        el.classList.add('is-revealed');
      });
    };

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const motionAllowed = () => !prefersReducedMotion() && 'IntersectionObserver' in window;

    if (!motionAllowed()) {
      revealAll();
      const mutations = new MutationObserver(revealAll);
      mutations.observe(document.body, { childList: true, subtree: true });

      // if the visitor turns reduced motion back off, restore the real behaviour
      const restore = () => {
        if (prefersReducedMotion()) return;
        mutations.disconnect();
        reduced?.removeEventListener('change', restore);
        boot();
      };
      reduced?.addEventListener('change', restore);

      return () => {
        mutations.disconnect();
        reduced?.removeEventListener('change', restore);
      };
    }

    function boot() {
      // when the visitor turns reduced motion on, the effect parks: blocks stay
      // revealed until the preference is turned back off
      let parked = false;

      const reveal = (el: HTMLElement) => {
        const comesFromAbove = el.getBoundingClientRect().top < 0;

        if (el.classList.contains('is-above') !== comesFromAbove) {
          // the stored side disagrees with where the block actually is, so the
          // hidden transform has to be committed before the entrance starts or
          // the transition would run from the wrong offset
          el.classList.toggle('is-above', comesFromAbove);
          void el.offsetHeight;
        }

        el.classList.add('is-revealed');
      };

      const observer = new IntersectionObserver(
        (entries) => {
          if (parked) return;

          entries.forEach((entry) => {
            const el = entry.target as HTMLElement;

            if (entry.isIntersecting) {
              reveal(el);
              return;
            }

            // hid outside the margin, so no visible pixel changes state
            el.classList.remove('is-revealed');
            el.classList.toggle('is-above', el.getBoundingClientRect().top < 0);
          });
        },
        {
          root: null,
          rootMargin: `${REVEAL_MARGIN}px 0px ${REVEAL_MARGIN}px 0px`,
          threshold: 0,
        }
      );

      blocks().forEach((el) => observer.observe(el));

      // blocks added later (lot cards, cart rows) still get wired up
      const mutations = new MutationObserver(() => {
        blocks().forEach((el) => observer.observe(el));
      });
      mutations.observe(document.body, { childList: true, subtree: true });

      // keyboard users must never land on a control inside a hidden block
      const onFocusIn = (event: FocusEvent) => {
        const target = event.target as HTMLElement | null;
        const block = target?.closest<HTMLElement>(SELECTOR);
        if (block) block.classList.add('is-revealed');
      };
      document.addEventListener('focusin', onFocusIn);

      const onPreferenceChange = () => {
        parked = prefersReducedMotion();
        if (parked) revealAll();
      };
      reduced?.addEventListener('change', onPreferenceChange);

      return () => {
        observer.disconnect();
        mutations.disconnect();
        document.removeEventListener('focusin', onFocusIn);
        reduced?.removeEventListener('change', onPreferenceChange);
      };
    }

    return boot();
  }, []);
}
