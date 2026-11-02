import { buildEnquiryUrl } from '../../lib/whatsapp';

export function Roaster() {
  return (
    <section className="roaster-section" id="roaster">
      <div className="roaster-container" data-scroll-reveal="">
        <header className="roaster-header">
          <h2 className="roaster-headline">
            <span className="roaster-name">Zarif Rahman</span>
          </h2>
        </header>

        <div className="roaster-grid">
          <figure className="roaster-portrait">
            <img
              src="/assets/images/founder-zarif.jpg"
              alt="Zarif Rahman, head roaster, in the Banani roastery"
              width="1208"
              height="1500"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <div className="roaster-body">
            <p className="roaster-bio">
              Most coffee in Dhaka is roasted dark to mask old crop or long sea transit. When beans are scorched dark, every origin tastes like the roaster’s drum. We roast on a cast-iron drum in Banani to do the opposite: develop sweetness while preserving the bright acidity, floral sugars, and distinct fruit notes that the producer worked a whole season to grow.
            </p>

            <ul className="roaster-credentials">
              <li>Roasted every Tuesday</li>
              <li>Cast-iron drum, Banani</li>
              <li>Single-origin micro-lots</li>
            </ul>

            <blockquote className="roaster-pull-quote">
              <p className="quote-text">
                “If we roast it dark, you taste our machine. If we roast it right, you taste the soil of Guji or the altitude of Matagalpa. And if you brew it on Day Three, you taste it at its absolute peak.”
              </p>
            </blockquote>

            <a
              href={buildEnquiryUrl(
                "Hi Day Three — I'd like to ask Zarif about this week's lot."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-pill roaster-enquiry"
            >
              Ask Zarif about this week&rsquo;s lot
            </a>
          </div>
        </div>

        <div className="roaster-strip" aria-label="Inside the Banani roastery">
          <figure>
            <img
              src="/assets/images/roastery-drum.jpg"
              alt="Roasted beans turning in the cooling tray"
              width="1200"
              height="900"
              loading="lazy"
              decoding="async"
            />
            <figcaption>Cooling tray</figcaption>
          </figure>
          <figure>
            <img
              src="/assets/images/roastery-pour.jpg"
              alt="Pouring a V60 at the brew bar"
              width="1200"
              height="900"
              loading="lazy"
              decoding="async"
            />
            <figcaption>Brew bar</figcaption>
          </figure>
          <figure>
            <img
              src="/assets/images/roastery-pack.jpg"
              alt="Sealed kraft pouches clipped and ready to leave"
              width="1200"
              height="900"
              loading="lazy"
              decoding="async"
            />
            <figcaption>Sealed for dispatch</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
