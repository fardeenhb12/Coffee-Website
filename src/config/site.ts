/**
 * Single source of truth for every fact repeated across the page.
 *
 * Visit section, footer, and the JSON-LD block in `index.html` must stay in
 * lockstep with these values. Change them here, then mirror them there.
 */

export const SITE = {
  name: 'Day Three',
  tagline: 'Dhaka • Specialty Roasters',

  /** LAUNCH BLOCKER: replace with the owner's active number, country code, no symbols. */
  whatsappNumber: '8801700000000',

  /** Free delivery threshold in BDT. */
  freeDeliveryGoal: 2500,

  address: {
    line1: 'House 14, Road 11, Banani',
    line2: 'Dhaka 1213, Bangladesh',
    full: 'House 14, Road 11, Banani, Dhaka 1213',
  },

  hours: 'Open Daily: 8:00 AM – 9:00 PM',

  /**
   * The same hours as numbers, so the Visit section can say whether the room
   * is open right now. Keep in step with `hours` above — that string is what
   * renders, this is what the clock is measured against.
   */
  hoursDetail: {
    opensAt: 8,
    closesAt: 21,
    timeZone: 'Asia/Dhaka',
  },

  email: 'hello@daythree.coffee',
  wholesaleEmail: 'wholesale@daythree.coffee',
  phone: '+880 1700-000000',

  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=House+14+Road+11+Banani+Dhaka',

  wholesaleMailto:
    'mailto:wholesale@daythree.coffee?subject=Wholesale%20Roastery%20Enquiry',
} as const;

export const DISPATCH_NOTICE = [
  'Roasted every Tuesday',
  'Order by 2 PM for same-day dispatch',
  'Free delivery over ৳ 2,500',
] as const;

export const NAV_LINKS = [
  { href: '#provisions-showcase', label: 'Shop' },
  { href: '#why-date', label: 'Why The Date' },
  { href: '#brew-guides', label: 'Brew Guides' },
  { href: '#visit', label: 'Visit' },
] as const;
