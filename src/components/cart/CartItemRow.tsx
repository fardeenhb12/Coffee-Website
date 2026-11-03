import type { CartItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { useHoldRepeat } from '../../hooks/useHoldRepeat';
import { formatTaka } from '../../lib/format';
import { LOTS } from '../../data/lots';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

/**
 * One row in the bag drawer.
 *
 * The thumb shows the product's photography packshot (`.cart-item-thumb`),
 * matching the selected lot.
 *
 * Both steppers repeat while held (`useHoldRepeat`), so a bulk change is one
 * gesture instead of thirty clicks. The trash clears the row outright.
 */
export function CartItemRow({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemRowProps) {
  const { isOpen } = useCart();
  const decrement = useHoldRepeat(onDecrement, isOpen);
  const increment = useHoldRepeat(onIncrement, isOpen);

  const lot = LOTS.find((l) => l.id === item.id);
  const lotImage = item.image || lot?.image || '/assets/images/lot-uraga-natural.jpg';

  return (
    <div className="cart-item-row">
      <img
        src={lotImage}
        alt={`${item.name} ${item.size} bag`}
        className="cart-item-thumb"
        width={84}
        height={84}
        loading="lazy"
      />

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
