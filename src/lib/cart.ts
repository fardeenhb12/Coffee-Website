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

/** The most bags one row can hold. Mirrors the lot card's input ceiling. */
export const MAX_QUANTITY = 999;

/** Clamp any user input to a whole number in 1–999. Non-numeric input becomes 1. */
export function clampQuantity(value: string | number): number {
  const parsed = parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(MAX_QUANTITY, Math.max(1, parsed));
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

export type CartAction =
  | { type: 'add'; item: CartItem }
  | { type: 'increment'; key: string }
  | { type: 'decrement'; key: string }
  | { type: 'remove'; key: string };

/**
 * Adding the same lot in the same size with the same grind accumulates into one
 * row; any difference in id, size or grind starts a new one. `decrement` drops
 * the row entirely when the quantity would fall to zero.
 *
 * No row passes `MAX_QUANTITY`: the drawer's hold-to-repeat stepper would
 * otherwise climb forever, and the WhatsApp order line would carry a number no
 * roastery can honour.
 */
export function cartReducer(items: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'add': {
      const key = cartKey(action.item);
      const exists = items.some((item) => cartKey(item) === key);

      if (!exists) {
        return [
          ...items,
          {
            ...action.item,
            quantity: Math.min(MAX_QUANTITY, Math.max(1, action.item.quantity)),
          },
        ];
      }

      return items.map((item) =>
        cartKey(item) === key
          ? {
              ...item,
              quantity: Math.min(MAX_QUANTITY, item.quantity + action.item.quantity),
            }
          : item
      );
    }

    case 'increment':
      return items.map((item) =>
        cartKey(item) === action.key
          ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + 1) }
          : item
      );

    case 'decrement':
      return items.flatMap((item) => {
        if (cartKey(item) !== action.key) return [item];
        return item.quantity > 1
          ? [{ ...item, quantity: item.quantity - 1 }]
          : [];
      });

    case 'remove':
      return items.filter((item) => cartKey(item) !== action.key);
  }
}
