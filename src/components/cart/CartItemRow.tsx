import type { CartItem } from '../../types';
import { formatTaka } from '../../lib/format';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
}

/**
 * One row in the bag drawer.
 *
 * The thumb is a sized placeholder, not a photo — `.cart-item-thumb` paints the
 * ground and `.cart-thumb-weight` carries the size. Do not add an `<img>`.
 *
 * Markup parity: `scripts/main.js` lines 372–388.
 */
export function CartItemRow({ item, onIncrement, onDecrement }: CartItemRowProps) {
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
              onClick={onDecrement}
            >
              −
            </button>
            <span className="stepper-val">{item.quantity}</span>
            <button
              type="button"
              className="stepper-btn cart-inc-btn"
              aria-label={`Increase quantity of ${item.name}, ${item.size}, ${item.grind}`}
              onClick={onIncrement}
            >
              +
            </button>
          </div>

          <div className="cart-item-price">{formatTaka(item.price * item.quantity)}</div>
        </div>
      </div>
    </div>
  );
}
