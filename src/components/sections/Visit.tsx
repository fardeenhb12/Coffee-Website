import { SITE } from '../../config/site';
import { useOpenStatus } from '../../hooks/useOpenStatus';
import { buildEnquiryUrl } from '../../lib/whatsapp';

export function Visit() {
  const status = useOpenStatus();

  return (
    <section className="tasting-rooms-section" id="visit">
      <div className="tasting-rooms-card" data-scroll-reveal="">
        <div>
          <span className="tasting-room-eyebrow">Tasting Room · Banani, Dhaka</span>
          <h2 className="tasting-room-title">Visit the Roastery Lab</h2>
          <p className="tasting-room-desc">
            Step into our roastery for manual pour-overs, single-origin espresso flights, and weekly batch pickups. Our baristas calibrate daily on our Tuesday roasts.
          </p>
          <div className="tasting-room-meta-grid">
            <div className="tasting-meta-item">
              <span className="material-symbols-outlined meta-icon">location_on</span>
              <div>
                <strong>Location</strong>
                <span>{SITE.address.full}</span>
              </div>
            </div>
            <div className="tasting-meta-item">
              <span className="material-symbols-outlined meta-icon">schedule</span>
              <div>
                <strong>Opening Hours</strong>
                <span>{SITE.hours}</span>
                <span className="tasting-status" data-open={status.open}>
                  <span className="tasting-status-dot" aria-hidden="true" />
                  {status.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="tasting-room-actions">
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-directions"
          >
            <span>Get Directions →</span>
          </a>
          <a
            href={buildEnquiryUrl(
              "Hi Day Three — I'd like to reserve a tasting flight at the Banani tasting room."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary-pill"
          >
            <span>Reserve a tasting</span>
          </a>
        </div>
      </div>
    </section>
  );
}
