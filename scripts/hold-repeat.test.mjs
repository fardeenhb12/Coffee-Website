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

const { HOLD_DELAY, HOLD_INTERVAL, HOLD_MIN_INTERVAL, nextHoldInterval } =
  await importTs('src/lib/holdRepeat.ts');

test('the pinned schedule', () => {
  assert.equal(HOLD_DELAY, 380);
  assert.equal(HOLD_INTERVAL, 130);
  assert.equal(HOLD_MIN_INTERVAL, 32);
});

test('the first repeat is shorter than the first interval', () => {
  assert.equal(nextHoldInterval(HOLD_INTERVAL), 117);
});

test('the interval only ever shrinks', () => {
  let ms = HOLD_INTERVAL;
  for (let i = 0; i < 40; i += 1) {
    const next = nextHoldInterval(ms);
    assert.ok(next <= ms, `${next} must not exceed ${ms}`);
    ms = next;
  }
});

test('a long hold converges on the floor and stops there', () => {
  let ms = HOLD_INTERVAL;
  for (let i = 0; i < 60; i += 1) ms = nextHoldInterval(ms);
  assert.equal(ms, HOLD_MIN_INTERVAL);
});
