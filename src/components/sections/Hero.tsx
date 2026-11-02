import { useEffect, useState } from 'react';
import { useHeroVideo } from '../../hooks/useHeroVideo';

/**
 * Dark film bookend. Stays dark in every direction; the rest of the page is
 * the gallery band.
 *
 * The entrance animation is driven by `body.is-loaded` (set in `main.tsx`) plus
 * the `.hero-line > span`, `.hero-eyebrow`, `.hero-subtext`, `.hero-cta-group`
 * and `.hero-date-band` selectors in `main.css`. Do not add local state to
 * trigger it — the CSS owns the timing.
 *
 * Markup parity: `legacy/index.html` lines 140–199.
 */
export function Hero() {
  const videoRef = useHeroVideo();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 900) {
        setScrollY(window.scrollY);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxY = Math.min(scrollY * 0.2, 90);
  const fadeOpacity = Math.max(1 - scrollY / 650, 0.05);

  return (
    <>
      <section className="hero-stage-section" id="hero">
      <div
        className="hero-backdrop"
        aria-hidden="true"
      >
        <video
          className="hero-looping-video"
          id="hero-bg-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/images/hero-roaster.jpg"
          ref={videoRef}
          style={{ transform: `translate3d(0, ${parallaxY * 0.35}px, 0) scale(1.08)` }}
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
        <div className="hero-gradient-overlay"></div>
      </div>

      <div className="hero-layout">
        <div
          className="hero-header-block"
          style={{
            opacity: fadeOpacity,
            transform: `translate3d(0, -${parallaxY * 0.4}px, 0)`,
          }}
        >
          <h1 className="hero-headline">
            <span className="hero-line">
              <span>Roasted Tuesday.</span>
            </span>
            <span className="hero-line italic-line">
              <span>Best from Friday.</span>
            </span>
          </h1>

          <p className="hero-subtext">
            Single-origin lots roasted in Dhaka every Tuesday. The date is printed on
            every bag — and every card below tells you the day it was roasted.
          </p>

          <div className="hero-cta-group">
            <a href="#provisions-showcase" className="btn-primary-pill">
              <span>Shop this week&apos;s roast</span>
            </a>

            <a href="#why-date" className="btn-secondary-pill">
              <span>How we roast</span>
            </a>
          </div>
        </div>
      </div>

      <a className="hero-scroll-cue" href="#provisions-showcase" aria-label="Scroll to our coffee">
        <span className="hero-scroll-label">Scroll</span>
        <span className="hero-scroll-track" aria-hidden="true">
          <span className="hero-scroll-beam"></span>
        </span>
      </a>
    </section>

    <div className="hero-date-band" aria-label="This week's roast">
      <div className="band-cell band-cell-label">
        <span className="band-kicker">Next roast</span>
        <span className="band-sub">Lot 014</span>
      </div>

      <div className="band-cell band-cell-date">
        <span className="band-date">21.10.2026</span>
        <span className="band-day">Tuesday · dispatched same day</span>
      </div>

      <div className="band-cell band-cell-meta">
        <span className="band-kicker">In stock</span>
        <span className="band-sub">7 lots · 2 sold out</span>
      </div>
    </div>
  </>
  );
}
