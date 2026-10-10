export function validId(input) {
  const str = String(input ?? '');
  return /^\d{1,7}$/.test(str) && Number(str) > 0 ? Number(str) : null;
}

export function cleanGutenbergText(text) {
  let value = String(text ?? '').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const beginning = /\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^\n]*\*\*\*/i.exec(value);
  if (beginning) value = value.slice(beginning.index + beginning[0].length);
  const end = /\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^\n]*\*\*\*/i.exec(value);
  if (end) value = value.slice(0, end.index);
  return value.trim();
}

export function chunkIntoPages(text, target = 3500) {
  const paragraphs = String(text ?? '').split(/\n\s*\n/g).map(p => p.trim()).filter(Boolean);
  const pages = [];
  let current = [];
  let chars = 0;
  for (const para of paragraphs) {
    if (current.length && chars + para.length > target) {
      pages.push(current);
      current = [];
      chars = 0;
    }
    current.push(para);
    chars += para.length;
  }
  if (current.length) pages.push(current);
  return pages;
}
