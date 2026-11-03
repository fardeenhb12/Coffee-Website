import { useEffect, useRef, useState } from 'react';
import type { Lot } from '../../types';
import { useCart } from '../../context/CartContext';
import { clampQuantity } from '../../lib/cart';
import { formatTaka } from '../../lib/format';

interface LotCardProps {
  lot: Lot;
  index: number;
}

const ADD_FEEDBACK_MS = 2000;

const SENSORY_MAP: Record<string, { sweetness: number; acidity: number; complexity: number }> = {
  'dhaka-daily': { sweetness: 3, acidity: 2, complexity: 2 },
  'espresso-no-1': { sweetness: 3, acidity: 2, complexity: 3 },
  'uraga-natural': { sweetness: 4, acidity: 4, complexity: 4 },
  'las-nubes': { sweetness: 3, acidity: 3, complexity: 3 },
  'el-bosque': { sweetness: 3, acidity: 4, complexity: 3 },
  'mogiana': { sweetness: 3, acidity: 1, complexity: 2 },
  'worka-anaerobic': { sweetness: 4, acidity: 4, complexity: 4 },
};

/**
 * Minimalist lot card in the Little Amps register.
 *
 * Streamlined:
 * - Upright bag cutout in warm ground
 * - Lot name paired with price at the top
 * - Clean origin subtitle (no altitude/process clutter)
 * - Stepped analog flavor gauges (Sweetness / Acidity / Complexity) with hover spring
 * - Tasting notes in clean sensory prose (no bullet clutter)
 * - Tuesday roast date stamp
 * - Tactile quantity stepper and Add to Bag button with shopping_bag icon
 */
export function LotCard({ lot, index }: LotCardProps) {
  const { addItem, openCart } = useCart();

  const [qtyInput, setQtyInput] = useState('1');
  const [addedQty, setAddedQty] = useState<number | null>(null);
  const [showParticle, setShowParticle] = useState(false);

  const feedbackTimer = useRef<number | null>(null);
  const particleTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
      if (particleTimer.current) window.clearTimeout(particleTimer.current);
    },
    []
  );

  const isSoldOut = !lot.stock;
  const price = lot.price250;
  const sensory = SENSORY_MAP[lot.id] ?? { sweetness: 3, acidity: 3, complexity: 3 };

  function commitQuantity() {
    setQtyInput(String(clampQuantity(qtyInput)));
  }

  function stepQuantity(delta: number) {
    setQtyInput(String(clampQuantity(clampQuantity(qtyInput) + delta)));
  }

  function handleAddToBag() {
    const quantity = clampQuantity(qtyInput);

    addItem({
      id: lot.id,
      name: lot.name,
      size: '250g',
      grind: 'whole bean',
      price,
      quantity,
      image: lot.image,
    });

    setAddedQty(quantity);
    setQtyInput('1');
    setShowParticle(true);
    openCart();

    if (particleTimer.current) window.clearTimeout(particleTimer.current);
    particleTimer.current = window.setTimeout(() => setShowParticle(false), 650);

    if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => setAddedQty(null), ADD_FEEDBACK_MS);
  }

  return (
    <article
      className={isSoldOut ? 'lot-card is-soldout' : 'lot-card'}
      data-lot-id={lot.id}
      data-scroll-reveal=""
      data-stagger={(index % 4) + 1}
    >
      <div className="lot-card-inner">
        <figure className="lot-media">
          <img
            src={lot.image}
            alt={`${lot.name} — ${lot.origin} coffee`}
            width={1200}
            height={1500}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        </figure>

        <div className="lot-price-row">
          <h3 className="product-name lot-name">{lot.name}</h3>
          <span className="product-price lot-price">{formatTaka(price)}</span>
        </div>

        <div className="lot-meta-row">
          <span className="lot-meta-item">{lot.origin}</span>
        </div>

        <div className="lot-gauges" aria-label="Sensory profile">
          <div className="lot-gauge" title={`Sweetness: ${sensory.sweetness}/4`}>
            <span className="lot-gauge-name">Sweetness</span>
            <div className="lot-gauge-meter">
              {[1, 2, 3, 4].map((step) => (
                <span
                  key={step}
                  className={step <= sensory.sweetness ? 'lot-gauge-bar on' : 'lot-gauge-bar'}
                />
              ))}
            </div>
          </div>

          <div className="lot-gauge" title={`Acidity: ${sensory.acidity}/4`}>
            <span className="lot-gauge-name">Acidity</span>
            <div className="lot-gauge-meter">
              {[1, 2, 3, 4].map((step) => (
                <span
                  key={step}
                  className={step <= sensory.acidity ? 'lot-gauge-bar on' : 'lot-gauge-bar'}
                />
              ))}
            </div>
          </div>

          <div className="lot-gauge" title={`Complexity: ${sensory.complexity}/4`}>
            <span className="lot-gauge-name">Complexity</span>
            <div className="lot-gauge-meter">
              {[1, 2, 3, 4].map((step) => (
                <span
                  key={step}
                  className={step <= sensory.complexity ? 'lot-gauge-bar on' : 'lot-gauge-bar'}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="product-notes" aria-label={`Tasting notes for ${lot.name}`}>
          {lot.notes.join(', ')}
        </p>

        <div className="lot-date-row">
          <span className="lot-roast-text">Roasted {lot.roastDate}</span>
        </div>
      </div>

      <div className="product-actions-block buy-block">
        {isSoldOut ? (
          <button type="button" className="btn-waitlist" disabled>
            <span>Sold Out · Next Roast {lot.nextRoastDate || 'Tuesday'}</span>
          </button>
        ) : (
          <div className="product-buy-row">
            <div className="qty-control">
              <button
                type="button"
                className="qty-step qty-dec"
                aria-label={`Decrease quantity of ${lot.name}`}
                onClick={() => stepQuantity(-1)}
              >
                −
              </button>
              <input
                type="number"
                className="qty-input"
                id={`qty-${lot.id}`}
                value={qtyInput}
                min={1}
                max={999}
                step={1}
                inputMode="numeric"
                aria-label={`Quantity of ${lot.name}`}
                onChange={(event) => setQtyInput(event.target.value)}
                onBlur={commitQuantity}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    commitQuantity();
                  }
                }}
              />
              <button
                type="button"
                className="qty-step qty-inc"
                aria-label={`Increase quantity of ${lot.name}`}
                onClick={() => stepQuantity(1)}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className={addedQty ? 'btn-add-bag lot-add-btn is-success' : 'btn-add-bag lot-add-btn'}
              onClick={handleAddToBag}
            >
              {showParticle && (
                <span className="particle-plus-one" aria-hidden="true">
                  +{addedQty || 1} {(addedQty || 1) > 1 ? 'Bags' : 'Bag'}
                </span>
              )}
              <span className="material-symbols-outlined icon-sm">
                {addedQty ? 'check' : 'shopping_bag'}
              </span>
              <span>{addedQty ? `Added ${addedQty} to Bag` : 'Add to Bag'}</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
