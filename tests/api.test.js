import test from 'node:test';
import assert from 'node:assert/strict';
import { validId, cleanGutenbergText, chunkIntoPages } from '../api/shared.js';

test('validates book IDs and rejects injection/empty IDs', () => {
  assert.equal(validId('1342'), 1342);
  for (const id of ['0','-5','1342/abc','abc','1%2F3','','99999999']) assert.equal(validId(id), null);
});

test('cleans Gutenberg front and back matter without removing the novel', () => {
  const value = 'Preface\n*** START OF THE PROJECT GUTENBERG EBOOK TEST ***\n\nCHAPTER I\n\nA quiet beginning.\n\n*** END OF THE PROJECT GUTENBERG EBOOK TEST ***\nDisclaimer';
  assert.equal(cleanGutenbergText(value), 'CHAPTER I\n\nA quiet beginning.');
});

test('splits content on paragraph boundaries', () => {
  assert.deepEqual(chunkIntoPages('alpha\n\nbeta\n\ngamma', 8), [['alpha'], ['beta'], ['gamma']]);
  assert.deepEqual(chunkIntoPages('  '), []);
});

import { searchFallback, FALLBACK_BOOKS } from '../api/seed.js';
test('bundled catalog can recover from provider outages', () => {
  assert.ok(FALLBACK_BOOKS.length >= 20);
  assert.equal(searchFallback({ ids:'1342,84',search:'',topic:'',page:1 }).count, 2);
  assert.equal(searchFallback({ ids:'',search:'Jane',topic:'',page:1 }).count >= 1, true);
  assert.equal(searchFallback({ ids:'',search:'',topic:'mystery',page:1 }).results.some(b=>b.id===1661), true);
});
