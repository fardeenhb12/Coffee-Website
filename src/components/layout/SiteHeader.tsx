import { useEffect, useRef, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useHeaderScroll } from '../../hooks/useHeaderScroll';
import { lockScroll, unlockScroll } from '../../hooks/useScrollLock';
import { pushOverlay, removeOverlay } from '../../hooks/useOverlayStack';
import { NAV_LINKS, SITE } from '../../config/site';
import { formatTaka } from '../../lib/format';
import { MobileNav } from './MobileNav';

/**
 * Sticky header shell: dispatch bar, brand, desktop nav, cart pill, burger.
 *
 * Owns the mobile drawer's open state so the burger's `aria-expanded` and the
 * drawer's `inert` can never disagree.
 *
 * Markup parity: `legacy/index.html` lines 65–130. The drawer is a **sibling**
 * of `.site-header-container`, not a child — the container is sticky and
 * nesting a fixed overlay inside it changes the stacking context.
 */
export function SiteHeader() {
  const { totalCount, subtotal, openCart } = useCart();
  const { headerRef, containerRef } = useHeaderScroll();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHref, setActiveHref] = useState<string>(NAV_LINKS[0]?.href ?? '#provisions-showcase');

  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);

  const trap = useFocusTrap([burgerRef, drawerRef]);

  // Scroll progress & active section spy
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(window.scrollY / docHeight, 0), 1) : 0;
      setScrollProgress(progress);

      // Section spy
      const sections = NAV_LINKS.map((link) => {
        const id = link.href.replace('#', '');
        const el = document.getElementById(id);
        return { href: link.href, top: el ? el.offsetTop - 120 : 0 };
      }).reverse();

      const scrollPos = window.scrollY;
      const current = sections.find((sec) => scrollPos >= sec.top);
      if (current) {
        setActiveHref(current.href);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Open/close side effects: scroll lock, Escape dismissal, focus trap.
  useEffect(() => {
    if (menuOpen) {
      lockScroll('mobile-nav');
      pushOverlay('mobile-nav', () => setMenuOpen(false));
      trap.activate(
        drawerRef.current?.querySelector<HTMLElement>('.mobile-nav-link') ?? null
      );
    } else {
      unlockScroll('mobile-nav');
      removeOverlay('mobile-nav');
      trap.deactivate();
    }
  }, [menuOpen, trap]);

  // Never leave the page locked if the header unmounts mid-open.
  useEffect(
    () => () => {
      unlockScroll('mobile-nav');
      removeOverlay('mobile-nav');
    },
    []
  );

  // Retrigger the pill's bounce animation when the item count changes.
  useEffect(() => {
    const el = countRef.current;
    if (!el || totalCount === 0) return;

    el.classList.remove('bounce');
    void el.offsetWidth;
    el.classList.add('bounce');
  }, [totalCount]);

  const cartLabel = `Open Shopping Bag, ${totalCount} ${
    totalCount === 1 ? 'item' : 'items'
  }`;

  return (
    <>
      <div className="site-header-container" id="site-header-container" ref={containerRef}>
        <header className="site-header" id="site-header" ref={headerRef}>
          <div
            className="scroll-progress-bar"
            style={{ transform: `scaleX(${scrollProgress})` }}
            aria-hidden="true"
          />
          <div className="header-background"></div>

          <div className="header-inner">
            <a href="#" className="brand-logo" aria-label="Day Three Home">
              <span className="brand-title">{SITE.name}</span>
              <span className="brand-sub">{SITE.tagline}</span>
            </a>

            <nav className="desktop-nav" aria-label="Main Menu">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={activeHref === link.href ? 'nav-link active' : 'nav-link'}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="header-actions">
              <button
                type="button"
                className="cart-pill-btn"
                id="cart-pill-btn"
                aria-label={cartLabel}
                onClick={openCart}
              >
                <span className="material-symbols-outlined cart-icon">shopping_bag</span>
                <span className="cart-count" id="cart-header-count" ref={countRef}>
                  ({totalCount})
                </span>
                <span className="cart-price" id="cart-header-price">
                  {formatTaka(subtotal)}
                </span>
              </button>

              <button
                type="button"
                className={menuOpen ? 'burger-btn is-active' : 'burger-btn'}
                id="burger-btn"
                aria-label={
                  menuOpen ? 'Close navigation menu' : 'Toggle navigation menu'
                }
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
                ref={burgerRef}
              >
                <div className="burger-box">
                  <div className="burger-inner">
                    <span className="top-bun"></span>
                    <span className="patty"></span>
                    <span className="bottom-bun"></span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </header>
      </div>

      <MobileNav
        isOpen={menuOpen}
        drawerRef={drawerRef}
        onNavigate={() => setMenuOpen(false)}
      />
    </>
  );
}
