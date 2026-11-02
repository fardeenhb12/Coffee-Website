import { useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { lockScroll, unlockScroll } from '../../hooks/useScrollLock';
import { pushOverlay, removeOverlay } from '../../hooks/useOverlayStack';
import { SITE } from '../../config/site';
import { cartKey } from '../../lib/cart';
import { formatTaka } from '../../lib/format';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import { CartItemRow } from './CartItemRow';

/**
 * Slide-out bag drawer.
 *
 * Never charges anything: the footer button composes a WhatsApp order request
 * and opens it in a new tab. A human confirms availability and payment.
 *
 * Markup parity: `legacy/index.html` lines 718–756 plus the empty state at
 * `scripts/main.js` lines 358–364.
 */
export function CartDrawer() {
  const {
    items,
    totalCount,
    subtotal,
    isOpen,
    increment,
    decrement,
    removeItem,
    closeCart,
  } = useCart();
  const { showToast } = useToast();

  const drawerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const trap = useFocusTrap([drawerRef]);

  useEffect(() => {
    if (isOpen) {
      lockScroll('cart');
      pushOverlay('cart', closeCart);
      trap.activate(closeRef.current);
    } else {
      unlockScroll('cart');
      removeOverlay('cart');
      trap.deactivate();
    }
  }, [isOpen, closeCart, trap]);

  useEffect(
    () => () => {
      unlockScroll('cart');
      removeOverlay('cart');
    },
    []
  );

  const remaining = SITE.freeDeliveryGoal - subtotal;
  const progressPercent = Math.min(100, (subtotal / SITE.freeDeliveryGoal) * 100);

  const drawerLabel = `Shopping Bag, ${totalCount} ${
    totalCount === 1 ? 'item' : 'items'
  }, ${formatTaka(subtotal)}`;

  function handleOrderRequest() {
    if (items.length === 0) return;
    window.open(buildWhatsAppUrl(items), '_blank', 'noopener,noreferrer');
  }

  function handleExplore() {
    closeCart();
    // Closing unlocks the body in a commit effect, and unlocking is where the
    // frozen scroll offset gets restored. Scroll on a later frame or that
    // restore undoes the jump and the visitor lands wherever the page was.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById('provisions-showcase')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    });
  }

  function handleDecrement(key: string, quantity: number) {
    if (quantity <= 1) {
      showToast('Item removed from bag', 'delete');
    }
    decrement(key);
  }

  function handleRemove(key: string) {
    removeItem(key);
    showToast('Item removed from bag', 'delete');
  }

  return (
    <>
      <div
        className={isOpen ? 'cart-drawer-overlay is-active' : 'cart-drawer-overlay'}
        id="cart-drawer-overlay"
        onClick={closeCart}
      ></div>

      <aside
        className={isOpen ? 'cart-drawer is-active' : 'cart-drawer'}
        id="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={drawerLabel}
        ref={drawerRef}
        inert={!isOpen}
      >
        <div className="cart-drawer-header">
          <h3 className="cart-drawer-title">
            <span className="material-symbols-outlined text-antique-brass icon-md">
              shopping_bag
            </span>
            <span>Your Bag</span>
          </h3>

          <button
            type="button"
            className="cart-drawer-close"
            id="cart-drawer-close"
            aria-label="Close Shopping Bag"
            onClick={closeCart}
            ref={closeRef}
          >
            <span className="material-symbols-outlined icon-md">close</span>
          </button>
        </div>

        <div className="cart-shipping-banner">
          <div id="shipping-note">
            {remaining <= 0 ? (
              <strong>
                Free delivery unlocked (over {formatTaka(SITE.freeDeliveryGoal)})
              </strong>
            ) : (
              <>
                Add <strong>{formatTaka(remaining)}</strong> more for free delivery
              </>
            )}
          </div>

          <div className="shipping-bar-track">
            <div
              className="shipping-bar-fill"
              id="shipping-bar-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="cart-items-list" id="cart-items-list">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon-wrap">
                <span className="material-symbols-outlined cart-empty-icon" aria-hidden="true">
                  local_cafe
                </span>
              </div>
              <p className="cart-empty-title">Your Roastery Bag is Empty</p>
              <p className="cart-empty-text">
                Select freshly roasted single-origin lots and house blends from this
                week&apos;s roast.
              </p>
              <button
                type="button"
                className="btn-primary-pill cart-empty-cta"
                onClick={handleExplore}
              >
                <span>Shop This Week&apos;s Roast</span>
                <span className="material-symbols-outlined icon-sm" aria-hidden="true">
                  arrow_forward
                </span>
              </button>
            </div>
          ) : (
            items.map((item) => {
              const key = cartKey(item);
              return (
                <CartItemRow
                  key={key}
                  item={item}
                  onIncrement={() => increment(key)}
                  onDecrement={() => handleDecrement(key, item.quantity)}
                  onRemove={() => handleRemove(key)}
                />
              );
            })
          )}
        </div>

        <div className="cart-drawer-footer">
          <div className="cart-subtotal-row">
            <span>Estimated Subtotal</span>
            <span className="cart-total-amount" id="cart-drawer-subtotal">
              {formatTaka(subtotal)}
            </span>
          </div>

          <p className="cart-tax-note">
            Orders are confirmed by a human on WhatsApp. Payment is arranged upon
            confirmation.
          </p>

          <button
            type="button"
            className="btn-order-request"
            id="order-request-btn"
            disabled={items.length === 0}
            aria-disabled={items.length === 0}
            onClick={handleOrderRequest}
          >
            <span>Request Order on WhatsApp →</span>
          </button>
        </div>
      </aside>
    </>
  );
}
