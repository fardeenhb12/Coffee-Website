import type { CartItem } from '../types';

/**
 * Cart identity and arithmetic.
 *
 * These three functions reproduce `scripts/main.js` exactly. The composite row
 * key is the contract: the same lot in the same size with the same grind is one
 * row whose quantity accumulates; any difference makes a new row.
 */

/** `${id}::${size}::${grind}` — the identity of a cart row. */
export function cartKey(item: Pick<CartItem, 'id' | 'size' | 'grind'>): string {
  return `${item.id}::${item.size}::${item.grind}`;
}

/** Clamp any user input to a whole number in 1–999. Non-numeric input becomes 1. */
export function clampQuantity(value: string | number): number {
  const parsed = parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(999, Math.max(1, parsed));
}

export interface CartTotals {
  /** Sum of every row's quantity — the number in the header pill. */
  totalCount: number;
  /** Sum of price × quantity in BDT. */
  subtotal: number;
}

export function getCartTotals(items: CartItem[]): CartTotals {
  return items.reduce<CartTotals>(
    (totals, item) => ({
      totalCount: totals.totalCount + item.quantity,
      subtotal: totals.subtotal + item.price * item.quantity,
    }),
    { totalCount: 0, subtotal: 0 }
  );
}
