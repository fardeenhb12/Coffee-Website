import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { CartItem } from '../types';
import { cartKey, getCartTotals } from '../lib/cart';

type CartAction =
  | { type: 'add'; item: CartItem }
  | { type: 'increment'; key: string }
  | { type: 'decrement'; key: string }
  | { type: 'remove'; key: string };

/**
 * Adding the same lot in the same size with the same grind accumulates into one
 * row; any difference in id, size or grind starts a new one. `decrement` drops
 * the row entirely when the quantity would fall to zero.
 */
function cartReducer(items: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'add': {
      const key = cartKey(action.item);
      const exists = items.some((item) => cartKey(item) === key);

      if (!exists) return [...items, action.item];

      return items.map((item) =>
        cartKey(item) === key
          ? { ...item, quantity: item.quantity + action.item.quantity }
          : item
      );
    }

    case 'increment':
      return items.map((item) =>
        cartKey(item) === action.key
          ? { ...item, quantity: item.quantity + 1 }
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

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  increment: (key: string) => void;
  decrement: (key: string) => void;
  removeItem: (key: string) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: 'add', item });
  }, []);

  const increment = useCallback((key: string) => {
    dispatch({ type: 'increment', key });
  }, []);

  const decrement = useCallback((key: string) => {
    dispatch({ type: 'decrement', key });
  }, []);

  const removeItem = useCallback((key: string) => {
    dispatch({ type: 'remove', key });
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const { totalCount, subtotal } = useMemo(() => getCartTotals(items), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalCount,
      subtotal,
      isOpen,
      addItem,
      increment,
      decrement,
      removeItem,
      openCart,
      closeCart,
    }),
    [
      items,
      totalCount,
      subtotal,
      isOpen,
      addItem,
      increment,
      decrement,
      removeItem,
      openCart,
      closeCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside <CartProvider>');
  }
  return context;
}
