import { test } from 'node:test';
import assert from 'node:assert/strict';
import esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

async function importTs(relPath) {
  const fullPath = path.join(ROOT, relPath);
  const tsCode = fs.readFileSync(fullPath, 'utf8');
  const { code } = esbuild.transformSync(tsCode, { loader: 'ts' });
  const base64 = Buffer.from(code).toString('base64');
  return import(`data:text/javascript;base64,${base64}`);
}

const { getOpenStatus, nextRoastLabel, getRoastCountdown, getNextRoastTarget } = await importTs('src/lib/hours.ts');
const { enquiryUrl } = await importTs('src/lib/enquiryLink.ts');

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

test('next roast is the coming Tuesday, in Dhaka', () => {
  // Monday 2 Nov 2026, 16:00 in Banani.
  assert.equal(nextRoastLabel(new Date('2026-11-02T10:00:00Z'), 'Asia/Dhaka'), 'Tuesday 3 November');
});

test('on a Tuesday the roast is today, not next week', () => {
  // Tuesday 3 Nov 2026, 11:00 in Banani.
  assert.equal(nextRoastLabel(new Date('2026-11-03T05:00:00Z'), 'Asia/Dhaka'), 'Tuesday 3 November');
});

test('late Monday in Dhaka is still this week, even if UTC is still Sunday', () => {
  // Monday 2 Nov 2026, 23:30 in Banani = 17:30 UTC.
  assert.equal(nextRoastLabel(new Date('2026-11-02T17:30:00Z'), 'Asia/Dhaka'), 'Tuesday 3 November');
});

test('countdown calculates remaining time to Tuesday 2:00 PM Dhaka cutoff', () => {
  // Monday 2 Nov 2026, 14:00 in Banani (08:00 UTC) -> exactly 24 hours to Tuesday 14:00
  const cd = getRoastCountdown(new Date('2026-11-02T08:00:00Z'), 'Asia/Dhaka');
  assert.equal(cd.days, '01');
  assert.equal(cd.hours, '00');
  assert.equal(cd.minutes, '00');
  assert.equal(cd.seconds, '00');
  assert.equal(cd.isRoastDay, false);
});

test('countdown on Tuesday before 2 PM targets today cutoff', () => {
  // Tuesday 3 Nov 2026, 11:30 in Banani (05:30 UTC) -> 2 hours 30 mins remaining
  const cd = getRoastCountdown(new Date('2026-11-03T05:30:00Z'), 'Asia/Dhaka');
  assert.equal(cd.days, '00');
  assert.equal(cd.hours, '02');
  assert.equal(cd.minutes, '30');
  assert.equal(cd.seconds, '00');
  assert.equal(cd.isRoastDay, true);
});

test('countdown on Tuesday after 2 PM targets next week Tuesday', () => {
  // Tuesday 3 Nov 2026, 15:00 in Banani (09:00 UTC) -> next Tuesday 14:00 (6 days 23 hours)
  const cd = getRoastCountdown(new Date('2026-11-03T09:00:00Z'), 'Asia/Dhaka');
  assert.equal(cd.days, '06');
  assert.equal(cd.hours, '23');
  assert.equal(cd.minutes, '00');
  assert.equal(cd.seconds, '00');
});
