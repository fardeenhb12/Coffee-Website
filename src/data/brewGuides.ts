import type { BrewGuide } from '../types';

/**
 * Four extraction recipes, ported verbatim from the Brew Guides section of
 * `legacy/index.html`. Numbers, units and degree symbols are load-bearing —
 * copy them exactly, including the en dashes in ranges.
 */
export const BREW_GUIDES: BrewGuide[] = [
  {
    id: 'v60',
    icon: 'local_cafe',
    title: 'V60 Pour Over',
    profile: 'Clean · High clarity',
    image: '/assets/images/brew-v60.jpg',
    specs: [
      { label: 'Dose', value: '15g' },
      { label: 'Water', value: '250g · 93°C (1:16.6)' },
      { label: 'Grind', value: 'Medium-fine (table salt)' },
      { label: 'Time', value: '2:45 – 3:15 min' },
    ],
    adjustment:
      'If the cup tastes sour or thin, grind finer or pour slower; if it tastes bitter or astringent, grind coarser.',
  },
  {
    id: 'aeropress',
    icon: 'compress',
    title: 'AeroPress',
    profile: 'Sweet · Full texture',
    image: '/assets/images/brew-aeropress.jpg',
    specs: [
      { label: 'Dose', value: '16g' },
      { label: 'Water', value: '200g · 90°C (1:12.5)' },
      { label: 'Grind', value: 'Medium-fine' },
      { label: 'Time', value: '2:00 min total' },
    ],
    adjustment:
      'If the brew tastes sharp or weak, steep 30 seconds longer; if astringent or difficult to press, grind coarser.',
  },
  {
    id: 'french-press',
    icon: 'coffee_maker',
    title: 'French Press',
    profile: 'Heavy body · Rich',
    image: '/assets/images/brew-frenchpress.jpg',
    specs: [
      { label: 'Dose', value: '30g' },
      { label: 'Water', value: '500g · 95°C (1:16.6)' },
      { label: 'Grind', value: 'Coarse (sea salt)' },
      { label: 'Time', value: '4:00 – 5:00 min' },
    ],
    adjustment:
      'If the body feels watery, steep a minute longer; if muddy or bitter, skim the crust before plunging.',
  },
  {
    id: 'moka-pot',
    icon: 'local_fire_department',
    title: 'Moka Pot',
    profile: 'Intense · Espresso style',
    image: '/assets/images/brew-mokapot.jpg',
    specs: [
      { label: 'Dose', value: '18g (level basket, no tamp)' },
      { label: 'Water', value: '180g (pre-heated to valve)' },
      { label: 'Grind', value: 'Fine (fine sand)' },
      { label: 'Time', value: '1:30 – 2:00 min' },
    ],
    adjustment:
      'If the coffee tastes bitter or scorched, pull off heat immediately when sputtering begins; if sour, start with boiling water in the base.',
  },
];
