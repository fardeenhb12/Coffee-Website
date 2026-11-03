/**
 * Shared domain types for the Day Three storefront.
 *
 * Vocabulary follows GLOSSARY.md: a "lot" is one green coffee from one producer,
 * a "bag" is the sealed retail unit, "grind" is the particle size chosen at order
 * time, and an "order request" is what the cart submits to WhatsApp.
 */

export type LotCategory = 'Blend' | 'Single' | 'Seasonal';

export interface Lot {
  id: string;
  name: string;
  category: LotCategory;
  origin: string;
  region: string;
  process: string;
  altitude: string;
  notes: string[];
  /** Price in BDT for a 250g bag. */
  price250: number;
  /** Price in BDT for a 1kg bag. */
  price1000: number;
  /** Printed on the bag, format DD.MM.YYYY. */
  roastDate: string;
  /** Only present when the lot is sold out. */
  nextRoastDate?: string;
  stock: boolean;
  image: string;
}

export type BagSize = '250g' | '1kg';

/** Exactly the `value` attributes of the grind `<select>` in the lot card. */
export type GrindOption =
  | 'whole bean'
  | 'V60 grind'
  | 'Espresso grind'
  | 'French press grind';

export interface CartItem {
  id: string;
  name: string;
  size: BagSize;
  grind: GrindOption;
  /** Unit price in BDT for the chosen size, frozen at add-to-bag time. */
  price: number;
  quantity: number;
  /** Optional packshot photo URL for the item thumbnail. */
  image?: string;
}

export interface BrewSpec {
  label: string;
  value: string;
}

export interface BrewGuide {
  id: string;
  /** Material Symbols ligature name, e.g. `local_cafe`. */
  icon: string;
  title: string;
  profile: string;
  image: string;
  specs: BrewSpec[];
  /** Sentence rendered after the bold `Adjust:` lead-in. */
  adjustment: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  /** Rendered as `<details open>` when true. Only the first item is open. */
  open?: boolean;
}

export type ToastIcon = string;

export interface ToastMessage {
  id: number;
  message: string;
  icon: ToastIcon;
  /** Set for the last 300ms of the toast's life so it can fade out. */
  hiding?: boolean;
}
