import { useEffect, useState } from 'react';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { useScrollReveal } from './hooks/useScrollReveal';
import { SiteHeader } from './components/layout/SiteHeader';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { Hero } from './components/sections/Hero';
import { Lots } from './components/sections/Lots';
import { Proof } from './components/sections/Proof';
import { Roaster } from './components/sections/Roaster';
import { BrewGuides } from './components/sections/BrewGuides';
import { Visit } from './components/sections/Visit';
import { Faq } from './components/sections/Faq';

/**
 * Page composition. Section order is fixed by `PAGE-SPEC.md` and by the CSS,
 * which numbers its sections in this order — do not reorder.
 *
 * Providers: toast outermost (the cart drawer raises toasts), then cart.
 * `useScrollReveal` must run above the sections so one observer covers them all.
 */
export default function App() {
  useScrollReveal();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 550);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ToastProvider>
      <CartProvider>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>

        <SiteHeader />

        <main id="main-content">
          <Hero />
          <Lots />
          <Proof />
          <Roaster />
          <BrewGuides />
          <Visit />
          <Faq />
        </main>

        <Footer />
        <CartDrawer />

        <button
          type="button"
          className={showBackToTop ? 'back-to-top-btn is-visible' : 'back-to-top-btn'}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll back to top"
        >
          <span>Top</span>
          <span aria-hidden="true">↑</span>
        </button>
      </CartProvider>
    </ToastProvider>
  );
}
