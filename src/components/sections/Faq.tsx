import { FAQS } from '../../data/faqs';

/**
 * Frequently asked questions.
 *
 * This is the reference section for the migration: a data-driven section with
 * no local state, no event handlers and no measurements. Every other content
 * section should read like this one — `data-scroll-reveal=""` on the blocks
 * that animate, the legacy class names untouched, copy rendered from `src/data`.
 *
 * The accordion is native `<details>` / `<summary>`; do not replace it with a
 * React open/close state, the CSS depends on the native marker behaviour.
 *
 * Markup parity: `legacy/index.html` lines 570–644.
 */
export function Faq() {
  return (
    <section className="faq-section" id="faq">
      <img
        src="/assets/images/coffee-beans-left.png"
        alt=""
        aria-hidden="true"
        className="faq-beans-decor faq-beans-left"
        loading="lazy"
        decoding="async"
        width={509}
        height={431}
      />
      <img
        src="/assets/images/coffee-beans-right.png"
        alt=""
        aria-hidden="true"
        className="faq-beans-decor faq-beans-right"
        loading="lazy"
        decoding="async"
        width={509}
        height={461}
      />
      <div className="faq-container">
        <div className="faq-header" data-scroll-reveal="">
          <h2 className="faq-headline">Frequently Asked Questions</h2>
          <p className="faq-subtext">
            Everything you need to know about roast dates, grinds, delivery, and how we
            trade.
          </p>
        </div>

        <div className="faq-list" data-scroll-reveal="">
          {FAQS.map((faq) => (
            <details key={faq.id} className="faq-item" open={faq.open}>
              <summary className="faq-question">
                <span>{faq.question}</span>
                <span className="material-symbols-outlined faq-chevron">expand_more</span>
              </summary>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
