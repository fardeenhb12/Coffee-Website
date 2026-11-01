import type { CartItem } from '../types';
import { SITE } from '../config/site';
import { getCartTotals } from './cart';
import { enquiryUrl } from './enquiryLink';
import { formatTakaBare } from './format';

/**
 * The order-request handoff.
 *
 * The site never takes payment. It composes a plain-text message and opens
 * WhatsApp; a human roastery lead confirms availability and arranges payment.
 * The line order, the `•` bullets, the em dashes and the `×` are all part of
 * the message the roastery receives — do not reformat them.
 */
export function buildWhatsAppMessage(
  items: CartItem[],
  freeDeliveryGoal: number = SITE.freeDeliveryGoal
): string {
  const { subtotal } = getCartTotals(items);

  const lines = ["Hi Day Three — I'd like to order:", ''];

  items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    lines.push(
      `• ${item.name} — ${item.size}, ${item.grind} — ×${item.quantity} — ${formatTakaBare(itemTotal)}`
    );
  });

  lines.push('');
  lines.push(`Subtotal: ${formatTakaBare(subtotal)}`);

  if (subtotal >= freeDeliveryGoal) {
    lines.push(`Free delivery (over ${formatTakaBare(freeDeliveryGoal)})`);
  } else {
    lines.push(
      `Delivery: standard courier in Dhaka (free over ${formatTakaBare(freeDeliveryGoal)})`
    );
  }

  return lines.join('\n');
}

export function buildWhatsAppUrl(
  items: CartItem[],
  freeDeliveryGoal: number = SITE.freeDeliveryGoal
): string {
  const message = buildWhatsAppMessage(items, freeDeliveryGoal);
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * A prefilled WhatsApp enquiry — no cart, no order. Used by the sections that
 * ask a human a question (a tasting reservation, a question for the roaster)
 * rather than placing a bag.
 */
export function buildEnquiryUrl(text: string): string {
  return enquiryUrl(SITE.whatsappNumber, text);
}
