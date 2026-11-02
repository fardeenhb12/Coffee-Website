/**
 * Acceleration curve for press-and-hold steppers.
 *
 * A hold steps once on press, waits `HOLD_DELAY`, then repeats every
 * `HOLD_INTERVAL` milliseconds, shortening by 10% each time until
 * `HOLD_MIN_INTERVAL`. Roughly: 20 steps in a second and a half, 120 in three.
 *
 * Timers are the hook's business (`useHoldRepeat`); this module only decides how
 * long the next wait is, so the shape of the curve can be tested without a DOM.
 */
export const HOLD_DELAY = 380;
export const HOLD_INTERVAL = 130;
export const HOLD_MIN_INTERVAL = 32;

export function nextHoldInterval(current: number): number {
  return Math.max(HOLD_MIN_INTERVAL, Math.round(current * 0.9));
}
