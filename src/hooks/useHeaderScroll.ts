import { useEffect, useRef } from 'react';

/** Don't hide until the visitor is meaningfully into the page. */
const HIDE_AFTER = 240;

/** Ignore sub-pixel jitter; only a deliberate scroll direction counts. */
const DIRECTION_DELTA = 6;

/**
 * Header dynamics.
 *
 * Attach `containerRef` to `.site-header-container` and `headerRef` to
 * `.site-header`.
 *
 * Three behaviours, in order of how much they change:
 *
 *  1. **Direction.** Scrolling down past HIDE_AFTER slides the bar away;
 *     scrolling up brings it straight back. The bar is `position: sticky` and
 *     only translated, so hiding it never reflows the page underneath.
 *  2. **Shrink emphasis.** The hysteresis (shrink past 40px, expand below 20px)
 *     is intentional: a single threshold makes the bar flicker while the hero
 *     scrolls under it.
 *  3. **Guards.** The bar holds the cart and the mobile burger, so it is forced
 *     visible whenever a drawer is open (`body.scroll-locked`) and whenever
 *     focus moves inside it — a keyboard user must never tab into a bar that
 *     has slid off-screen.
 */
export function useHeaderScroll() {
  const headerRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    let lastY = window.scrollY;
    let hidden = false;

    const setHidden = (next: boolean) => {
      if (next === hidden) return;
      hidden = next;
      container?.classList.toggle('is-hidden', next);
    };

    const handleScroll = () => {
      const header = headerRef.current;
      if (!header) return;

      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;

      if (y > 40) {
        header.classList.add('shrink');
        container?.classList.add('is-scrolled');
      } else if (y < 20) {
        header.classList.remove('shrink');
        container?.classList.remove('is-scrolled');
      }

      // a drawer is open: the burger is its close control, the cart is in here
      if (document.body.classList.contains('scroll-locked')) {
        setHidden(false);
        return;
      }

      if (y < HIDE_AFTER) {
        setHidden(false);
        return;
      }

      if (Math.abs(delta) < DIRECTION_DELTA) return;
      setHidden(delta > 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const onFocusIn = () => setHidden(false);
    container?.addEventListener('focusin', onFocusIn);

    // a drawer can open without any scroll, so watch the lock itself
    const bodyWatch = new MutationObserver(() => {
      if (document.body.classList.contains('scroll-locked')) setHidden(false);
    });
    bodyWatch.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      container?.removeEventListener('focusin', onFocusIn);
      bodyWatch.disconnect();
    };
  }, []);

  return { headerRef, containerRef };
}
