import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getOpenStatus } from '../src/lib/hours.ts';
import { enquiryUrl } from '../src/lib/enquiryLink.ts';

const HOURS = { opensAt: 8, closesAt: 21, timeZone: 'Asia/Dhaka' };
const at = (iso) => getOpenStatus(new Date(iso), HOURS);

test('opens at the boundary hour', () => {
  assert.equal(at('2026-11-02T02:00:00Z').open, true); // 08:00 Dhaka
});

test('closes at the boundary hour', () => {
  assert.equal(at('2026-11-02T15:00:00Z').open, false); // 21:00 Dhaka
});

test('midday is open, late night is closed', () => {
  assert.equal(at('2026-11-02T10:00:00Z').open, true); // 16:00 Dhaka
  assert.equal(at('2026-11-02T19:30:00Z').open, false); // 01:30 Dhaka
});

test('label reads the next boundary', () => {
  assert.equal(at('2026-11-02T10:00:00Z').label, 'Open now · closes 9:00 PM');
  assert.equal(at('2026-11-02T19:30:00Z').label, 'Closed · opens 8:00 AM');
});

test('enquiry URL targets the number and encodes the message', () => {
  assert.equal(
    enquiryUrl('8801700000000', "Hi Day Three — table for two?"),
    `https://wa.me/8801700000000?text=${encodeURIComponent(
      "Hi Day Three — table for two?"
    )}`
  );
});
