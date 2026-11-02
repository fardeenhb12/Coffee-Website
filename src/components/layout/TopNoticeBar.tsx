import { Fragment } from 'react';
import { DISPATCH_NOTICE } from '../../config/site';

/**
 * Dispatch bar above the header. Static by design — the three claims are the
 * roastery's standing terms, not live data.
 *
 * Markup parity: `legacy/index.html` lines 68–76. The separators are siblings
 * of the items, not children — `.dot-separator` is a flex child of
 * `.notice-static` and the CSS breaks if it is nested inside `.notice-item`.
 */
export function TopNoticeBar() {
  return (
    <div className="top-notice-bar" role="region" aria-label="Roastery status">
      <div className="notice-ticker-track">
        <div className="notice-static">
          {DISPATCH_NOTICE.map((item, index) => (
            <Fragment key={`a-${item}`}>
              {index > 0 && (
                <span className="dot-separator" aria-hidden="true">
                  ·
                </span>
              )}
              <span className="notice-item">{item}</span>
            </Fragment>
          ))}
        </div>
        <div className="notice-static" aria-hidden="true">
          {DISPATCH_NOTICE.map((item, index) => (
            <Fragment key={`b-${item}`}>
              {index > 0 && (
                <span className="dot-separator" aria-hidden="true">
                  ·
                </span>
              )}
              <span className="notice-item">{item}</span>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
