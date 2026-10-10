const FALLBACK = 'https://gutendex.com/books/';
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const url = new URL(req.url, 'https://leafline.app');
  const q = (url.searchParams.get('search') || '').slice(0, 120);
  const topic = (url.searchParams.get('topic') || '').slice(0, 80);
  const ids = (url.searchParams.get('ids') || '').replace(/[^0-9,]/g, '').slice(0, 150);
  const page = Math.min(Math.max(parseInt(url.searchParams.get('page') || '1', 10) || 1, 1), 100);
  const params = new URLSearchParams();
  if (q) params.set('search', q);
  if (topic) params.set('topic', topic);
  if (ids) params.set('ids', ids);
  if (page > 1) params.set('page', String(page));
  params.set('languages', 'en');
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    let upstream;
    try { upstream = await fetch(`${FALLBACK}?${params}`, { signal: controller.signal, headers: { Accept: 'application/json' } }); }
    finally { clearTimeout(timeout); }
    if (!upstream.ok) throw new Error(`Catalog returned ${upstream.status}`);
    const data = await upstream.json();
    res.setHeader('Cache-Control', 'public, s-maxage=180, stale-while-revalidate=600');
    return res.status(200).json({ count: data.count ?? 0, next: data.next || null, results: data.results || [] });
  } catch (error) {
    return res.status(502).json({ error: 'Book catalog is temporarily unavailable. Please try again.' });
  }
}
