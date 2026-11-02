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

const { cartReducer, cartKey, MAX_QUANTITY } = await importTs('src/lib/cart.ts');

const bag = (over = {}) => ({
  id: 'uraga-natural',
  name: 'Uraga Natural',
  size: '250g',
  grind: 'whole bean',
  price: 1295,
  quantity: 1,
  ...over,
});

test('adding a new identity appends a row', () => {
  const next = cartReducer([], { type: 'add', item: bag() });
  assert.equal(next.length, 1);
  assert.equal(next[0].quantity, 1);
});

test('adding the same identity accumulates into one row', () => {
  const next = cartReducer([bag()], { type: 'add', item: bag({ quantity: 2 }) });
  assert.equal(next.length, 1);
  assert.equal(next[0].quantity, 3);
});

test('a different grind is a different row', () => {
  const next = cartReducer([bag()], { type: 'add', item: bag({ grind: 'V60 grind' }) });
  assert.equal(next.length, 2);
});

test('increment never passes the ceiling', () => {
  const full = bag({ quantity: MAX_QUANTITY });
  const next = cartReducer([full], { type: 'increment', key: cartKey(full) });
  assert.equal(next[0].quantity, MAX_QUANTITY);
});

test('add cannot push a row past the ceiling', () => {
  const near = bag({ quantity: 990 });
  const next = cartReducer([near], { type: 'add', item: bag({ quantity: 20 }) });
  assert.equal(next[0].quantity, MAX_QUANTITY);
});

test('decrement stops at one', () => {
  const two = bag({ quantity: 2 });
  const next = cartReducer([two], { type: 'decrement', key: cartKey(two) });
  assert.equal(next[0].quantity, 1);
});

test('decrement from one removes the row', () => {
  const next = cartReducer([bag()], { type: 'decrement', key: cartKey(bag()) });
  assert.deepEqual(next, []);
});

test('remove drops only the matching row', () => {
  const other = bag({ id: 'las-nubes', name: 'Las Nubes' });
  const next = cartReducer([bag(), other], { type: 'remove', key: cartKey(other) });
  assert.equal(next.length, 1);
  assert.equal(next[0].id, 'uraga-natural');
});

test('removing the only row leaves an empty bag', () => {
  assert.deepEqual(cartReducer([bag()], { type: 'remove', key: cartKey(bag()) }), []);
});
