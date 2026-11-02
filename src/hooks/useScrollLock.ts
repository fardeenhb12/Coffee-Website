/**
 * Reference-counted scroll lock.
 *
 * Two overlays can be open at once (the mobile nav and the cart drawer). Each
 * caller owns a named lock, so closing one never unlocks the page while the
 * other is still open. Ported from `scripts/main.js` §0.
 *
 * Why not just `body { overflow: hidden }`: the document scrolls on the root
 * element, so clipping the body leaves the page free to scroll behind the
 * overlay. Root-level clipping does stop it, but it also takes the root out of
 * service as the scroll container, which drops every `position: sticky`
 * descendant to its static position. Freezing the body at its current offset
 * is the version that does both: the page cannot move, and the header (pinned
 * separately while locked) stays exactly where it was.
 */

const locks = new Set<string>();

let frozenAt = 0;

export function lockScroll(owner: string): void {
  if (locks.size === 0) {
    frozenAt = window.scrollY;
    document.body.style.top = `-${frozenAt}px`;
    document.body.classList.add('scroll-locked');
  }
  locks.add(owner);
}

export function unlockScroll(owner: string): void {
  locks.delete(owner);
  if (locks.size > 0) return;

  document.body.classList.remove('scroll-locked');
  document.body.style.top = '';
  window.scrollTo(0, frozenAt);
}
