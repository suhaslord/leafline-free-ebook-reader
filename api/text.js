import { validId, cleanGutenbergText } from './shared.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const id = validId(new URL(req.url, 'https://leafline.app').searchParams.get('id'));
  if (!id) return res.status(400).json({ error: 'Invalid book identifier.' });
  const candidates = [
    `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`,
    `https://www.gutenberg.org/ebooks/${id}.txt.utf-8`,
    `https://www.gutenberg.org/files/${id}/${id}-0.txt`,
    `https://www.gutenberg.org/files/${id}/${id}.txt`
  ];
  for (const candidate of candidates) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8500);
    try {
      const r = await fetch(candidate, { signal: controller.signal, headers: { 'User-Agent': 'LeaflineReader/1.0 (public-domain web reader)' } });
      if (!r.ok) continue;
      const type = r.headers.get('content-type') || '';
      if (type.includes('text/html')) continue;
      const buffer = await r.arrayBuffer();
      if (buffer.byteLength > 8 * 1024 * 1024) continue;
      const text = cleanGutenbergText(new TextDecoder('utf-8', { fatal: false }).decode(buffer));
      if (text.length < 200) continue;
      res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(text);
    } catch (_) { /* try another official Gutenberg format */ }
    finally { clearTimeout(timeout); }
  }
  return res.status(404).json({ error: 'This title does not have a readable plain-text edition. Open its Project Gutenberg page instead.' });
}
