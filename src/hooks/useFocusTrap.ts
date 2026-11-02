import { useCallback, useMemo, useRef } from 'react';
import type { RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(nodes: HTMLElement[]): HTMLElement[] {
  return nodes.flatMap((node) =>
    Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => !el.hasAttribute('inert') && el.getClientRects().length > 0
    )
  );
}

/**
 * Keyboard focus trap.
 *
 * Wraps Tab and Shift+Tab inside the given containers and restores focus to
 * whatever was focused before activation.
 *
 * Difference from `scripts/main.js`: this hook does **not** toggle `inert`.
 * In React, the component owns `inert` as a prop (`inert={!isOpen}`), so
 * letting the hook also write the attribute would make the two fight. The
 * closed panels still leave the tab order and the accessibility tree exactly
 * as before — React just applies it one render earlier.
 */
export function useFocusTrap(containers: Array<RefObject<HTMLElement | null>>) {
  const previousFocus = useRef<HTMLElement | null>(null);
  const containersRef = useRef(containers);
  containersRef.current = containers;

  const handleKeydown = useCallback((event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const nodes = containersRef.current
      .map((ref) => ref.current)
      .filter((node): node is HTMLElement => node !== null);

    const focusable = getFocusable(nodes);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  const activate = useCallback(
    (initialFocus?: HTMLElement | null) => {
      previousFocus.current = document.activeElement as HTMLElement | null;
      document.addEventListener('keydown', handleKeydown, true);

      const nodes = containersRef.current
        .map((ref) => ref.current)
        .filter((node): node is HTMLElement => node !== null);

      const target = initialFocus ?? getFocusable(nodes)[0];
      target?.focus();
    },
    [handleKeydown]
  );

  const deactivate = useCallback(() => {
    document.removeEventListener('keydown', handleKeydown, true);
    previousFocus.current?.focus?.();
    previousFocus.current = null;
  }, [handleKeydown]);

  return useMemo(() => ({ activate, deactivate }), [activate, deactivate]);
}
