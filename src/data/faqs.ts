import type { Faq } from '../types';

/**
 * The six questions from the FAQ section of `legacy/index.html`.
 *
 * Answer copy is verbatim. The ৳ amounts, courier districts and payment methods
 * are factual claims about the business — do not paraphrase them.
 */
export const FAQS: Faq[] = [
  {
    id: 'freshness',
    question: 'How fresh is this coffee, and when should I drink it?',
    answer:
      'Every lot is roasted in Banani on Tuesday mornings. Freshly roasted coffee releases CO₂ and needs 48 to 72 hours to settle. Your bag enters its peak flavour window on Day Three (Friday) and stays sweet and expressive through Day 14.',
    open: true,
  },
  {
    id: 'grind',
    question: 'Can you grind the beans for my specific brewer?',
    answer:
      'Yes. Select Whole Bean, V60 / Pour Over, AeroPress, French Press, or Moka Pot when choosing your bag. We grind on commercial precision flat burrs immediately before dispatch.',
  },
  {
    id: 'delivery',
    question: 'How long does delivery take across Dhaka?',
    answer:
      'Orders confirmed on WhatsApp by 2:00 PM Tuesday are dispatched the same afternoon. Courier deliveries across Gulshan, Banani, Dhanmondi, Uttara, and greater Dhaka metro typically arrive within 24 to 48 hours. Delivery is free for orders over ৳2,500.',
  },
  {
    id: 'payment',
    question: 'How do I pay for my order?',
    answer:
      'We do not take payments through the website. Submitting your bag creates a prefilled WhatsApp message with your items, grinds, and subtotal. A human confirms availability and shares payment options: bKash, Nagad, bank transfer, or cash on delivery.',
  },
  {
    id: 'sold-out',
    question: 'Why is a lot sold out, and when will it return?',
    answer:
      'We roast estate coffees in micro-batches. When a lot sells out, its card displays the next roast date so you know when the next batch is planned. If the green crop is finished, we retire the lot and introduce a new harvest.',
  },
  {
    id: 'wholesale',
    question: 'Do you supply cafes, creative studios, and offices?',
    answer:
      'Yes. We provide weekly batch roasts, barista calibration, and custom delivery schedules for specialty cafes and workspaces in Dhaka. Contact us via the wholesale enquiry link in the footer below.',
  },
];
