import { useState } from 'react';
import { NAV_LINKS, SITE } from '../../config/site';
import { nextRoastLabel } from '../../lib/hours';
import { buildEnquiryUrl } from '../../lib/whatsapp';
import { useRoastCountdown } from '../../hooks/useRoastCountdown';

/**
 * Roastery footer: bookend line, brand plate, tasting-room facts, section
 * links, and the order handoff.
 *
 * Address, hours, phone and email must match the Visit section and the JSON-LD
 * block in `index.html` exactly.
 *
 * There is no newsletter form. One used to live here and toasted
 * "Subscribed" while storing nothing — a promise the site could not keep. The
 * column now carries the next roast date and the one action that works.
 */
export function Footer() {
  const [roastLabel] = useState(() =>
    nextRoastLabel(new Date(), SITE.hoursDetail.timeZone)
  );
  const countdown = useRoastCountdown();

  return (
    <footer className="site-footer">
      <p className="footer-bookend">Roasted Tuesday. Best on Day Three.</p>

      <div className="footer-container">
        {/* Mascot peeking over top-right corner */}
        <div className="footer-mascot" aria-hidden="true">
          <img
            src="/assets/images/mascot-footer-corner.png"
            alt="Day Three coffee roaster bird mascot holding a warm cup of coffee"
            width={765}
            height={605}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="footer-main-grid">
          <div className="footer-brand-col">
            <span className="footer-sub-label">Est. 2024 · Banani, Dhaka</span>
            <h3 className="footer-brand-title">{SITE.name}</h3>
            <span className="footer-brand-tagline">Specialty Coffee Roastery · Dhaka</span>
            <p className="footer-bio">
              Single-origin lots roasted every Tuesday in Banani. Stamped with the roast
              date; dispatched same day across Dhaka.
            </p>
          </div>

          <div>
            <h4 className="footer-col-heading">Tasting Room</h4>
            <ul className="footer-links-list">
              <li>
                <span className="footer-link">{SITE.address.line1}</span>
              </li>
              <li>
                <span className="footer-link">{SITE.address.line2}</span>
              </li>
              <li>
                <span className="footer-link">{SITE.hours}</span>
              </li>
              <li>
                <span className="footer-link">{SITE.email}</span>
              </li>
              <li>
                <span className="footer-link">{SITE.phone}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-heading">Roastery &amp; Sourcing</h4>
            <ul className="footer-links-list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={SITE.wholesaleMailto} className="footer-link">
                  Wholesale Roastery Supply
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-heading">Roast Dispatches</h4>
            <div className="footer-next-roast">
              <span>Next roast</span>
              <strong className="roast-date-value">{roastLabel}</strong>

              <div
                className="roast-countdown-wells"
                role="timer"
                aria-label={`Orders close in ${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, and ${countdown.seconds} seconds`}
              >
                <div className="timer-well">
                  <span className="timer-val" key={`d-${countdown.days}`}>
                    {countdown.days}
                  </span>
                  <span className="timer-unit">DAYS</span>
                </div>
                <div className="timer-well">
                  <span className="timer-val" key={`h-${countdown.hours}`}>
                    {countdown.hours}
                  </span>
                  <span className="timer-unit">HRS</span>
                </div>
                <div className="timer-well">
                  <span className="timer-val" key={`m-${countdown.minutes}`}>
                    {countdown.minutes}
                  </span>
                  <span className="timer-unit">MINS</span>
                </div>
                <div className="timer-well timer-well-active">
                  <span className="timer-val" key={`s-${countdown.seconds}`}>
                    {countdown.seconds}
                  </span>
                  <span className="timer-unit">SECS</span>
                </div>
              </div>
            </div>
            <p className="footer-bio footer-bio-spacing">
              Bags leave Banani the same day, stamped with that roast date. Tell us what
              you brew with and we will confirm what is left on the drum.
            </p>
            <a
              href={buildEnquiryUrl(
                "Hi Day Three — I'd like to order from this week's roast."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-order-request footer-order-cta"
            >
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div>© 2026 Day Three. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
