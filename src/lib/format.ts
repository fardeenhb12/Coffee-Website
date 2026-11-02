/**
 * Currency formatting. The site renders BDT as `৳ 1,295` with a space in the
 * UI and `৳1,295` without one inside the WhatsApp message. Both forms exist in
 * the original build; keep them distinct.
 */

/** `1295` → `৳ 1,295` — used everywhere in the UI. */
export function formatTaka(amount: number): string {
  return `৳ ${amount.toLocaleString()}`;
}

/** `1295` → `৳1,295` — used inside the WhatsApp order request. */
export function formatTakaBare(amount: number): string {
  return `৳${amount.toLocaleString()}`;
}

/** Zero-padded index for the carousel indicator: `1` → `01`. */
export function padIndex(value: number): string {
  return String(value).padStart(2, '0');
}
