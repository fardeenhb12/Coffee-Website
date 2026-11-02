import type { CartItem } from '../../types';
import { useHoldRepeat } from '../../hooks/useHoldRepeat';
import { formatTaka } from '../../lib/format';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

/**
 * One row in the bag drawer.
 *
 * The thumb is a sized placeholder, not a photo — `.cart-item-thumb` paints the
 * ground and `.cart-thumb-weight` carries the size. Do not add an `<img>`.
 *
 * Both steppers repeat while held (`useHoldRepeat`), so a bulk change is one
 * gesture instead of thirty clicks. The trash clears the row outright.
 *
 * Markup parity: `scripts/main.js` lines 372–388, plus the remove control.
 */
export function CartItemRow({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemRowProps) {
  const decrement = useHoldRepeat(onDecrement);
  const increment = useHoldRepeat(onIncrement);

  return (
    <div className="cart-item-row">
      <div className="cart-item-thumb">
        <span className="cart-thumb-weight">{item.size}</span>
      </div>

      <div className="cart-item-details">
        <div className="cart-item-name">{item.name}</div>
        <div className="cart-item-spec">
          {item.size} · {item.grind}
        </div>

        <div className="cart-item-bottom">
          <div className="quantity-stepper cart-item-stepper">
            <button
              type="button"
              className="stepper-btn cart-dec-btn"
              aria-label={`Decrease quantity of ${item.name}, ${item.size}, ${item.grind}`}
              {...decrement}
            >
              −
            </button>
            <span className="stepper-val">{item.quantity}</span>
            <button
              type="button"
              className="stepper-btn cart-inc-btn"
              aria-label={`Increase quantity of ${item.name}, ${item.size}, ${item.grind}`}
              {...increment}
            >
              +
            </button>
          </div>

          <div className="cart-item-price">{formatTaka(item.price * item.quantity)}</div>

          <button
            type="button"
            className="cart-item-remove"
            aria-label={`Remove ${item.name}, ${item.size}, ${item.grind} from bag`}
            onClick={onRemove}
          >
            <span className="material-symbols-outlined icon-sm" aria-hidden="true">
              delete
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
