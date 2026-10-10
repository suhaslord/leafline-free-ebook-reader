// Small, self-contained shelf of widely known Project Gutenberg classics.
// Used only if external catalog providers are unavailable.
const entries = [
  [1342, 'Pride and Prejudice', 'Austen, Jane', 'fiction romance love'],
  [84, 'Frankenstein; Or, The Modern Prometheus', 'Shelley, Mary Wollstonecraft', 'fiction science fiction horror'],
  [1661, 'The Adventures of Sherlock Holmes', 'Doyle, Arthur Conan', 'fiction mystery detective'],
  [11, "Alice's Adventures in Wonderland", 'Carroll, Lewis', 'fiction fantasy adventure'],
  [35, 'The Time Machine', 'Wells, H. G.', 'fiction science fiction adventure'],
  [345, 'Dracula', 'Stoker, Bram', 'fiction horror gothic'],
  [2701, 'Moby Dick; Or, The Whale', 'Melville, Herman', 'fiction adventure'],
  [45, 'Anne of Green Gables', 'Montgomery, L. M.', 'fiction family'],
  [1260, 'Jane Eyre: An Autobiography', 'Brontë, Charlotte', 'fiction romance love'],
  [55, 'The Wonderful Wizard of Oz', 'Baum, L. Frank', 'fiction fantasy adventure'],
  [2641, 'A Room with a View', 'Forster, E. M.', 'fiction romance love'],
  [64317, 'The Great Gatsby', 'Fitzgerald, F. Scott', 'fiction romance'],
  [98, 'A Tale of Two Cities', 'Dickens, Charles', 'fiction historical history'],
  [174, 'The Picture of Dorian Gray', 'Wilde, Oscar', 'fiction fantasy gothic'],
  [768, 'Wuthering Heights', 'Brontë, Emily', 'fiction romance love'],
  [46, 'A Christmas Carol in Prose', 'Dickens, Charles', 'fiction fantasy'],
  [76, 'Adventures of Huckleberry Finn', 'Twain, Mark', 'fiction adventure'],
  [43, 'The Strange Case of Dr. Jekyll and Mr. Hyde', 'Stevenson, Robert Louis', 'fiction mystery horror'],
  [120, 'Treasure Island', 'Stevenson, Robert Louis', 'fiction adventure'],
  [1400, 'Great Expectations', 'Dickens, Charles', 'fiction romance'],
  [25344, 'The Scarlet Letter', 'Hawthorne, Nathaniel', 'fiction romance history'],
  [5200, 'Metamorphosis', 'Kafka, Franz', 'fiction fantasy'],
  [730, 'Oliver Twist', 'Dickens, Charles', 'fiction'],
  [2542, 'A Doll’s House', 'Ibsen, Henrik', 'fiction drama'],
];

export const FALLBACK_BOOKS = entries.map(([id, title, name, tags]) => ({
  id, title, authors: [{ name }], languages: ['en'], subjects: tags.split(' '), bookshelves: [],
  formats: { 'image/jpeg': `https://www.gutenberg.org/cache/epub/${id}/pg${id}.cover.medium.jpg` }, download_count: 0
}));

export function searchFallback({ ids, search, topic, page }) {
  let books = FALLBACK_BOOKS;
  if (ids) {
    const wanted = new Set(ids.split(',').map(Number));
    books = books.filter(b => wanted.has(b.id));
  }
  if (search) {
    const words = search.toLowerCase().split(/\s+/).filter(Boolean);
    books = books.filter(b => words.every(word => `${b.title} ${b.authors[0].name}`.toLowerCase().includes(word)));
  }
  if (topic) books = books.filter(b => b.subjects.join(' ').toLowerCase().includes(topic.toLowerCase()));
  const offset = (page - 1) * 20;
  return { count: books.length, next: offset + 20 < books.length ? `?page=${page + 1}` : null, results: books.slice(offset, offset + 20), fallback: true };
}
