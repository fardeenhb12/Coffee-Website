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
import { cartReducer, getCartTotals } from '../lib/cart';

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
