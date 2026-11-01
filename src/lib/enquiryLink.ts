/**
 * The WhatsApp enquiry link, with no imports.
 *
 * Kept separate from `whatsapp.ts` so the string template can be tested
 * without pulling the cart's module graph through a test runner. The order
 * path builds its own message; this is only for the "ask a human" links in
 * the Visit, Roaster and Footer sections.
 */
export function enquiryUrl(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
