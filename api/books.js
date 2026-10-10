import { searchFallback } from './seed.js';

const PROVIDERS = [
  'https://gutendex.com/books/',
  'https://discovery.kalimaapp.com/books/'
];

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const url = new URL(req.url, 'https://leafline.app');
  const search = (url.searchParams.get('search') || '').slice(0, 120);
  const topic = (url.searchParams.get('topic') || '').slice(0, 80);
  const ids = (url.searchParams.get('ids') || '').replace(/[^0-9,]/g, '').slice(0, 150);
  const page = Math.min(Math.max(parseInt(url.searchParams.get('page') || '1', 10) || 1, 1), 100);
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (topic) params.set('topic', topic);
  if (ids) params.set('ids', ids);
  if (page > 1) params.set('page', String(page));
  params.set('languages', 'en');

  for (const base of PROVIDERS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
      const response = await fetch(`${base}?${params}`, { signal: controller.signal, headers: { Accept: 'application/json' } });
      if (!response.ok) continue;
      const data = await response.json();
      if (!Array.isArray(data.results)) continue;
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=1200');
      return res.status(200).json({ count: data.count ?? 0, next: data.next || null, results: data.results });
    } catch (_) { /* use the next catalog provider */ }
    finally { clearTimeout(timeout); }
  }

  // A degraded but functional catalog is better than a broken homepage.
  res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');
  return res.status(200).json(searchFallback({ ids, search, topic, page }));
}
