import { useCallback, useEffect, useRef } from 'react';
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react';
import { HOLD_DELAY, HOLD_INTERVAL, nextHoldInterval } from '../lib/holdRepeat';

export interface HoldRepeatHandlers {
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  onLostPointerCapture: () => void;
  onClick: (event: ReactMouseEvent<HTMLElement>) => void;
}

/**
 * Press once to step, keep holding to accelerate.
 *
 * The first step happens on pointerdown so the press feels immediate; repeats
 * follow on a self-rescheduling timer whose interval shrinks every tick. The
 * click handler only answers keyboard activation (`event.detail === 0`),
 * because a pointer's synthesized click already stepped on pointerdown.
 *
 * The element these handlers go on needs `touch-action: none`, or a held finger
 * starts a scroll and the gesture dies. `.cart-dec-btn` / `.cart-inc-btn` set it.
 */
export function useHoldRepeat(onStep: () => void): HoldRepeatHandlers {
  const stepRef = useRef(onStep);
  stepRef.current = onStep;

  const timer = useRef<number | null>(null);
  const interval = useRef(HOLD_INTERVAL);

  const stop = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    interval.current = HOLD_INTERVAL;
  }, []);

  const tick = useCallback(function schedule(delay: number) {
    timer.current = window.setTimeout(() => {
      stepRef.current();
      interval.current = nextHoldInterval(interval.current);
      schedule(interval.current);
    }, delay);
  }, []);

  useEffect(() => stop, [stop]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      stop();
      stepRef.current();
      tick(HOLD_DELAY);
    },
    [stop, tick]
  );

  const onClick = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    if (event.detail === 0) stepRef.current();
  }, []);

  return {
    onPointerDown,
    onPointerUp: stop,
    onPointerCancel: stop,
    onLostPointerCapture: stop,
    onClick,
  };
}
