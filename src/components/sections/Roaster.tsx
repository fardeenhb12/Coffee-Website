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
      </div>
    </section>
  );
}
