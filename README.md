# Leafline — free book reader

A polished, responsive reading app for **legally free public-domain ebooks**. Catalog metadata is provided by [Gutendex](https://gutendex.com/) and book text by [Project Gutenberg](https://www.gutenberg.org/).

## Features
- Discover classics, search by title or author, explore themes.
- Read directly in a paged reader, adjust typography and theme, and use keyboard arrow navigation.
- Save books and reading position in your browser; reopen to keep reading.
- Mobile-friendly layout, loading/error states and accessible controls.
- Source links to Project Gutenberg for each book.

## Run

```bash
npm install
npx vercel dev
npm test
npm run build
```

Vercel deployment: import this GitHub repository and choose the Other framework (no build command). `api/books.js` and `api/text.js` are serverless API proxies and will run on Vercel. For local API testing, use `vercel dev` rather than bare Vite; plain static servers do not serve the Vercel APIs.

## Notes

No login is needed. Library and reading progress are stored **only in this browser** using localStorage; clearing site storage or changing devices loses them. Available titles and reader formats depend on Project Gutenberg. Gutenberg's copyright terms vary by country: check local law before reading or downloading. No copyrighted book piracy or paywall bypass is supported.
