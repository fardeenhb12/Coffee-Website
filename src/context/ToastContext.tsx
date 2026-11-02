import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { ToastMessage } from '../types';

interface ToastContextValue {
  /** `showToast('Subscribed to Tuesday Roast Dispatches', 'verified')` */
  showToast: (message: string, icon?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VISIBLE_MS = 3500;
const FADE_MS = 300;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(0);

  const showToast = useCallback((message: string, icon = 'check_circle') => {
    const id = nextId.current;
    nextId.current += 1;

    setToasts((current) => [...current, { id, message, icon }]);

    window.setTimeout(() => {
      setToasts((current) =>
        current.map((toast) => (toast.id === id ? { ...toast, hiding: true } : toast))
      );
    }, VISIBLE_MS);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, VISIBLE_MS + FADE_MS);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Rendered once, outside every section, exactly as in the legacy markup. */}
      <div className="toast-container" id="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={toast.hiding ? 'toast is-hiding' : 'toast'}>
            <span className="material-symbols-outlined toast-icon">{toast.icon}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return context;
}
