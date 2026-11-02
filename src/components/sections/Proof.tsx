export function Proof() {
  return (
    <section className="proof-section" id="why-date">
      <div className="proof-container">
        <div className="proof-header" data-scroll-reveal="">
          <h2 className="proof-headline">Why We Print the Date</h2>
          <p className="proof-subtext">
            In Dhaka, coffee is sold on adjectives and shelf life estimates. We think a bag should state three checkable facts before it asks for your trust.
          </p>
        </div>

        <div className="proof-grid">
          <div className="proof-card" data-scroll-reveal="" data-stagger="1">
            <div className="proof-card-top">
              <span className="proof-step">01</span>
            </div>
            <h3 className="proof-title">A date printed on every bag</h3>
            <p className="proof-desc">
              Stamped the minute beans leave the cooling tray. Never an approximate batch date, a delivery estimate, or a vague “best before.”
            </p>
          </div>

          <div className="proof-card" data-scroll-reveal="" data-stagger="2">
            <div className="proof-card-top">
              <span className="proof-step">02</span>
            </div>
            <h3 className="proof-title">A named producer on every lot</h3>
            <p className="proof-desc">
              Farm, region, washing station, elevation, and process on the label. Traceable single origins, never anonymous commodity grade beans.
            </p>
          </div>

          <div className="proof-card" data-scroll-reveal="" data-stagger="3">
            <div className="proof-card-top">
              <span className="proof-step">03</span>
            </div>
            <h3 className="proof-title">A roast every Tuesday dispatched same day</h3>
            <p className="proof-desc">
              Roasted Tuesday morning in Banani. Order by 2 PM, confirmed on WhatsApp, and handed to the courier the same afternoon.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
