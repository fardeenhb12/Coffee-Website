import { useEffect, useRef, useState } from 'react';
import { LOTS } from '../../data/lots';
import { useCart } from '../../context/CartContext';
import { clampQuantity } from '../../lib/cart';
import { formatTaka, padIndex } from '../../lib/format';

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


/** One row of the sensory profile: label, four steps, and the value in words. */
function Gauge({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="lot-gauge"
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={4}
      aria-label={label}
    >
      <span className="lot-gauge-name">{label}</span>
      <div className="lot-gauge-meter" aria-hidden="true">
        {[1, 2, 3, 4].map((step) => (
          <span key={step} className={step <= value ? 'lot-gauge-bar on' : 'lot-gauge-bar'} />
        ))}
      </div>
      <span className="lot-gauge-value">{value}/4</span>
    </div>
  );
}

/**
 * Cover flow stage with the selected lot's spec and order deck beneath it.
 *
 * The deck is split by intent, not by content type: everything you read sits on
 * the left, everything you act on sits behind a rule on the right. On narrow
 * screens the order block moves directly under the name, because a buyer who
 * already knows what they want shouldn't have to scroll past the spec sheet to
 * reach the button.
 */
export function Lots() {
  const { addItem, openCart } = useCart();
  const [activeIndex, setActiveIndex] = useState(2);
  const [selectedSize, setSelectedSize] = useState<'250g' | '1kg'>('250g');
  const [qtyInput, setQtyInput] = useState('1');
  const [addedQty, setAddedQty] = useState<number | null>(null);
  const [showParticle, setShowParticle] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const feedbackTimer = useRef<number | null>(null);
  const particleTimer = useRef<number | null>(null);
  const pointerStartX = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragClearTimer = useRef<number | null>(null);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(
    () => () => {
      if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
      if (particleTimer.current) window.clearTimeout(particleTimer.current);
      if (dragClearTimer.current) window.clearTimeout(dragClearTimer.current);
    },
    []
  );

  const activeLot = LOTS[activeIndex] || LOTS[0];
  const isSoldOut = !activeLot.stock;
  const quantity = clampQuantity(qtyInput);
  const currentPrice = selectedSize === '250g' ? activeLot.price250 : activeLot.price1000;
  const lineTotal = currentPrice * quantity;
  const sensory = SENSORY_MAP[activeLot.id] ?? { sweetness: 3, acidity: 3, complexity: 3 };

  const sizes = [
    { id: '250g' as const, label: '250 g', price: activeLot.price250 },
    { id: '1kg' as const, label: '1 kg', price: activeLot.price1000 },
  ];

  function previous() {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : LOTS.length - 1));
  }

  function next() {
    setActiveIndex((prev) => (prev < LOTS.length - 1 ? prev + 1 : 0));
  }

  function commitQuantity() {
    setQtyInput(String(clampQuantity(qtyInput)));
  }

  function stepQuantity(delta: number) {
    setQtyInput(String(clampQuantity(quantity + delta)));
  }

  function handleAddToBag() {
    addItem({
      id: activeLot.id,
      name: activeLot.name,
      size: selectedSize,
      grind: 'whole bean',
      price: currentPrice,
      quantity,
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

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      previous();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    }
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    pointerStartX.current = e.clientX;
    isDraggingRef.current = false;
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (pointerStartX.current === null) return;
    const diff = Math.abs(e.clientX - pointerStartX.current);
    if (diff > 10) {
      isDraggingRef.current = true;
    }
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (pointerStartX.current !== null) {
      const deltaX = e.clientX - pointerStartX.current;
      if (Math.abs(deltaX) > 40) {
        if (deltaX > 0) previous();
        else next();
      }
      pointerStartX.current = null;
    }
    if (dragClearTimer.current) window.clearTimeout(dragClearTimer.current);
    dragClearTimer.current = window.setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);
  }

  function handlePointerCancel() {
    pointerStartX.current = null;
    isDraggingRef.current = false;
  }

  const ctaLabel = isSoldOut
    ? `Sold out · next roast ${activeLot.nextRoastDate || 'Tuesday'}`
    : addedQty
      ? `Added ${addedQty} to bag`
      : `${quantity > 1 ? `Add ${quantity} bags` : 'Add to bag'} · ${formatTaka(lineTotal)}`;

  return (
    <section className="provisions-section" id="provisions-showcase">
      <div className="provisions-container">
        <div className="provisions-header" data-scroll-reveal="">
          <div className="provisions-header-text">
            <h2 className="provisions-title">This Week&apos;s Roast</h2>
            <p className="provisions-sub">
              Single-origin lots and house blends roasted every Tuesday in Dhaka. Stamped
              with the roast date; dispatched same day.
            </p>
          </div>
        </div>

        {/* Cover flow stage */}
        <div
          className="coverflow-stage-wrapper"
          role="region"
          aria-roledescription="carousel"
          aria-label="3D coffee lots collection"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          {/* Side navigation arrows */}
          <button
            type="button"
            className="coverflow-nav-btn prev-btn"
            id="lots-prev"
            aria-label="Previous coffee lot"
            onClick={previous}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              chevron_left
            </span>
          </button>

          <div className="coverflow-viewport">
            <div
              className="coverflow-track"
              id="lots-grid"
              role="group"
              aria-label="Coffee lots list"
            >
              {LOTS.map((lot, index) => {
                const offset = index - activeIndex;
                const absOffset = Math.abs(offset);
                const sign = Math.sign(offset);

                const stride = isMobile ? 125 : 200;
                const translateX = offset === 0 ? 0 : offset * stride + sign * 20;
                const translateZ = offset === 0 ? 0 : -absOffset * 75;
                const rotateY = offset === 0 ? 0 : sign * -28;
                const scale = offset === 0 ? 1.15 : Math.max(0.72, 1 - absOffset * 0.12);
                const opacity = absOffset > 2 ? 0.35 : offset === 0 ? 1 : 0.82;

                const cardStyle: React.CSSProperties = {
                  transform: `translate3d(-50%, -50%, 0) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex: 10 - absOffset,
                  opacity,
                };

                return (
                  <button
                    key={lot.id}
                    type="button"
                    className={offset === 0 ? 'coverflow-card is-active' : 'coverflow-card'}
                    style={cardStyle}
                    onClick={() => {
                      if (isDraggingRef.current) return;
                      setActiveIndex(index);
                    }}
                    aria-label={`Select ${lot.name}`}
                    aria-current={offset === 0 ? 'true' : undefined}
                  >
                    <img
                      src={lot.image}
                      alt={`${lot.name} — ${lot.origin} packaging`}
                      width={1200}
                      height={1500}
                      loading={absOffset <= 1 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="coverflow-nav-btn next-btn"
            id="lots-next"
            aria-label="Next coffee lot"
            onClick={next}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              chevron_right
            </span>
          </button>
        </div>

        {/* Selected lot — read on the left, act on the right */}
        <div className="lot-deck-section" data-scroll-reveal="">
          <div className="lot-deck-identity">
            <span className="sr-only" id="lots-indicator" aria-live="polite">
              {padIndex(activeIndex + 1)} / {padIndex(LOTS.length)}
            </span>
            <h3 className="lot-deck-title">{activeLot.name}</h3>
            <p className="lot-deck-subtitle">{activeLot.origin}</p>
          </div>

          <div className="lot-deck-details">
            <dl className="lot-deck-facts">
              <div className="lot-fact">
                <dt>Process</dt>
                <dd>{activeLot.process || '—'}</dd>
              </div>
              <div className="lot-fact">
                <dt>Altitude</dt>
                <dd>{activeLot.altitude}</dd>
              </div>
              <div className="lot-fact">
                <dt>Roasted</dt>
                <dd>{activeLot.roastDate}</dd>
              </div>
            </dl>

            <div className="lot-deck-notes">
              <span className="lot-deck-label">Tasting notes</span>
              <p className="lot-deck-notes-text">{activeLot.notes.join(' · ')}</p>
            </div>

            <div className="lot-deck-gauges" aria-label="Sensory profile, 1 to 4">
              <Gauge label="Sweetness" value={sensory.sweetness} />
              <Gauge label="Acidity" value={sensory.acidity} />
              <Gauge label="Complexity" value={sensory.complexity} />
            </div>
          </div>

          <div className="lot-deck-buy">
            <span className="lot-deck-label" id={`size-label-${activeLot.id}`}>
              Bag size
            </span>

            <div
              className="lot-deck-size-group"
              role="radiogroup"
              aria-labelledby={`size-label-${activeLot.id}`}
            >
              {sizes.map((size) => (
                <label
                  key={size.id}
                  className={
                    selectedSize === size.id ? 'lot-size-option is-active' : 'lot-size-option'
                  }
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name={`size-${activeLot.id}`}
                    value={size.id}
                    checked={selectedSize === size.id}
                    onChange={() => setSelectedSize(size.id)}
                  />
                  <span className="lot-size-name">{size.label}</span>
                  <span className="lot-size-price">{formatTaka(size.price)}</span>
                </label>
              ))}
            </div>

            <div className="lot-deck-actions">
              <div className="lot-deck-qty">
                <span className="lot-deck-label" id={`qty-label-${activeLot.id}`}>
                  Quantity
                </span>
                <div className="qty-control">
                  <button
                    type="button"
                    className="qty-step qty-dec"
                    aria-label={`Decrease quantity of ${activeLot.name}`}
                    onClick={() => stepQuantity(-1)}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className="qty-input"
                    id={`qty-${activeLot.id}`}
                    value={qtyInput}
                    min={1}
                    max={999}
                    step={1}
                    inputMode="numeric"
                    aria-labelledby={`qty-label-${activeLot.id}`}
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
                    aria-label={`Increase quantity of ${activeLot.name}`}
                    onClick={() => stepQuantity(1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                className={
                  addedQty ? 'btn-add-bag lot-deck-add-btn is-success' : 'btn-add-bag lot-deck-add-btn'
                }
                disabled={isSoldOut}
                onClick={handleAddToBag}
              >
                {showParticle && (
                  <span className="particle-plus-one" aria-hidden="true">
                    +{addedQty || 1} {selectedSize}
                  </span>
                )}
                <span className="material-symbols-outlined icon-sm">
                  {addedQty ? 'check' : 'shopping_bag'}
                </span>
                <span>{ctaLabel}</span>
              </button>
            </div>

            <p className="lot-deck-dispatch">Order by 2 PM for same-day dispatch</p>
          </div>
        </div>
      </div>
    </section>
  );
}
