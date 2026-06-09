// server/routes/books.js
const express = require('express');
const https = require('https');
const router = express.Router();
const booksData = require('../data/books.json');

// ── Sorting ─────────────────────────────────────────────────────────
// Primary:   rating desc
// Tiebreak 1: has review (true before false)
// Tiebreak 2: dateRead desc (more recent first), nulls last

function sortBooks(books) {
  return [...books].sort((a, b) => {
    // 1. Rating
    if (b.rating !== a.rating) return b.rating - a.rating;

    // 2. Has review
    const aHasReview = a.review && a.review.trim().length > 0;
    const bHasReview = b.review && b.review.trim().length > 0;
    if (bHasReview !== aHasReview) return bHasReview ? 1 : -1;

    // 3. Date read (more recent = higher)
    const aDate = a.dateRead ? new Date(a.dateRead).getTime() : 0;
    const bDate = b.dateRead ? new Date(b.dateRead).getTime() : 0;
    return bDate - aDate;
  });
}

// ── Cover fetching ───────────────────────────────────────────────────
// Strategy: try Open Library first; if it returns a 1x1 placeholder
// (content-length ≤ 500) or errors, fall back to Google Books API.
// Results are cached in memory for the lifetime of the server process.

const coverCache = {};

function fetchWithRedirects(url, options = {}, redirects = 5) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : require('http');
    const req = lib.get(url, { ...options }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location && redirects > 0) {
        resolve(fetchWithRedirects(res.headers.location, options, redirects - 1));
        return;
      }
      resolve(res);
    });
    req.on('error', reject);
  });
}

async function fetchOpenLibraryCover(isbn13) {
  const url = `https://covers.openlibrary.org/b/isbn/${isbn13}-M.jpg?default=false`;
  try {
    const res = await fetchWithRedirects(url, {
      headers: { 'User-Agent': 'personal-website-bookshelf/1.0' }
    });
    // ?default=false returns 404 when no cover exists (no placeholder)
    if (res.statusCode === 200) {
      res.resume();
      return `https://covers.openlibrary.org/b/isbn/${isbn13}-M.jpg`;
    }
    res.resume();
    return null;
  } catch {
    return null;
  }
}

async function fetchGoogleBooksCover(isbn13) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn13}&fields=items/volumeInfo/imageLinks`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'personal-website-bookshelf/1.0' } }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          const links = data?.items?.[0]?.volumeInfo?.imageLinks;
          // Prefer thumbnail (128px wide) over smallThumbnail
          const raw = links?.thumbnail || links?.smallThumbnail || null;
          // Google returns http; upgrade to https and strip zoom param for larger image
          const cover = raw
            ? raw.replace('http://', 'https://').replace('&zoom=1', '').replace('zoom=1&', '')
            : null;
          resolve(cover);
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function fetchCoverUrl(isbn13) {
  if (!isbn13) return null;
  if (coverCache[isbn13] !== undefined) return coverCache[isbn13];

  let cover = await fetchOpenLibraryCover(isbn13);
  if (!cover) cover = await fetchGoogleBooksCover(isbn13);

  coverCache[isbn13] = cover;
  return cover;
}

// ── Route ────────────────────────────────────────────────────────────

router.get('/', async (req, res) => {
  try {
    const sorted = sortBooks(booksData);

    const booksWithCovers = await Promise.all(
      sorted.map(async (book) => {
        const coverUrl = await fetchCoverUrl(book.isbn13);
        return { ...book, coverUrl };
      })
    );

    res.json(booksWithCovers);
  } catch (err) {
    console.error('Books API error:', err);
    res.status(500).json({ error: 'Failed to load books' });
  }
});

module.exports = router;