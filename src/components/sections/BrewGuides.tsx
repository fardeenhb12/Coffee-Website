import { useState } from 'react';
import { BREW_GUIDES } from '../../data/brewGuides';

export function BrewGuides() {
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  return (
    <section className="brew-guides-section" id="brew-guides">
      <div className="brew-guides-container">
        <div className="brew-guides-header" data-scroll-reveal="">
          <h2 className="brew-guides-headline">Brew Guides</h2>
          <p className="brew-guides-subtext">
            Four methods, tested on our weekly roasts. Start with these parameters, then
            adjust by taste.
          </p>
        </div>

        <div className="brew-guides-grid">
          {BREW_GUIDES.map((guide, index) => {
            const isFlipped = flippedCardId === guide.id;
            return (
              <article
                key={guide.id}
                className={isFlipped ? 'brew-card is-flipped' : 'brew-card'}
                data-scroll-reveal=""
                data-stagger={String(index + 1)}
                tabIndex={0}
                role="region"
                aria-label={`${guide.title} brew guide — hover or tap to flip for recipe`}
                onClick={() => setFlippedCardId(isFlipped ? null : guide.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setFlippedCardId(isFlipped ? null : guide.id);
                  }
                }}
              >
                <div className="brew-card-inner">
                  {/* Front Face: Method Photography + Title & Profile + Flip Cue */}
                  <div className="brew-card-face brew-card-front">
                    <div className="brew-card-media">
                      <img
                        src={guide.image}
                        alt={`${guide.title} equipment`}
                        className="brew-card-img"
                        width="800"
                        height="800"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="brew-card-front-content">
                      <h3 className="brew-method-title">{guide.title}</h3>
                      <span className="brew-method-profile">{guide.profile}</span>
                    </div>
                  </div>

                  {/* Back Face: Exact Extraction Parameters & Adjustment Tip */}
                  <div className="brew-card-face brew-card-back">
                    <div>
                      <div className="brew-card-header">
                        <div>
                          <h3 className="brew-method-title">{guide.title}</h3>
                          <span className="brew-method-profile">{guide.profile}</span>
                        </div>
                      </div>

                      <div className="brew-specs-table">
                        {guide.specs.map((spec) => (
                          <div key={spec.label} className="brew-spec-row">
                            <span className="brew-spec-label">{spec.label}</span>
                            <span className="brew-spec-value">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="brew-adjustment-note">
                      <strong>Adjust:</strong> {guide.adjustment}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
