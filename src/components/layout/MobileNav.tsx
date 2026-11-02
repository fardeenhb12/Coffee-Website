import type { RefObject } from 'react';
import { NAV_LINKS } from '../../config/site';

interface MobileNavProps {
  isOpen: boolean;
  drawerRef: RefObject<HTMLDivElement | null>;
  onNavigate: () => void;
}

/**
 * Slide-in navigation drawer for narrow viewports.
 *
 * `inert` is owned here rather than toggled by the focus trap, so a closed
 * drawer is out of the tab order and out of the accessibility tree on the very
 * first render.
 *
 * Markup parity: `legacy/index.html` lines 123–130.
 */
export function MobileNav({ isOpen, drawerRef, onNavigate }: MobileNavProps) {
  return (
    <div
      className={isOpen ? 'mobile-nav-drawer is-open' : 'mobile-nav-drawer'}
      id="mobile-nav-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      ref={drawerRef}
      inert={!isOpen}
    >
      <nav className="mobile-nav-links">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="mobile-nav-link"
            onClick={onNavigate}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
