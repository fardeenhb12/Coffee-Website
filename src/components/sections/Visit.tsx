import { SITE } from '../../config/site';
import { useOpenStatus } from '../../hooks/useOpenStatus';
import { buildEnquiryUrl } from '../../lib/whatsapp';

/**
 * SITE.hours is one display string ("Open Daily: 8:00 AM – 9:00 PM"). The visit
 * panel needs the label and the times apart so each can carry its own weight,
 * but there is still only one source of truth: split it, never retype it.
 */
const HOURS_SEPARATOR = ': ';
const separatorAt = SITE.hours.indexOf(HOURS_SEPARATOR);
const hoursLabel = separatorAt === -1 ? 'Opening hours' : SITE.hours.slice(0, separatorAt);
const hoursValue = separatorAt === -1 ? SITE.hours : SITE.hours.slice(separatorAt + HOURS_SEPARATOR.length);

export function Visit() {
  const status = useOpenStatus();

  return (
    <section className="tasting-rooms-section" id="visit">
      <div className="tasting-rooms-card" data-scroll-reveal="">
        <figure className="tasting-room-media">
          <img
            src="/assets/images/tasting-room.jpg"
            alt="Pour-over drippers resting on glass carafes of brewed coffee, cups stacked beside them, kraft bags on the shelf behind"
            width={1200}
            height={961}
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="tasting-room-body">
          <h2 className="tasting-room-title">Visit the Roastery Lab</h2>
          <p className="tasting-room-desc">
            Step into our roastery for manual pour-overs, single-origin espresso flights, and weekly batch pickups. Our baristas calibrate daily on our Tuesday roasts.
          </p>

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

          <dl className="tasting-room-facts">
            <div className="tasting-fact">
              <dt className="tasting-fact-label">{hoursLabel}</dt>
              <dd className="tasting-hours">{hoursValue}</dd>
              <dd className="tasting-status" data-open={status.open}>
                <span className="tasting-status-dot" aria-hidden="true" />
                {status.label}
              </dd>
            </div>

            <div className="tasting-fact">
              <dt className="tasting-fact-label">Location</dt>
              <dd className="tasting-fact-value">{SITE.address.full}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
