import { useLayoutEffect, useRef, useState } from 'react';
import useApi from './useApi';
import PageStatus from './PageStatus';
import { usePage } from './site/context';
import { BooksGardenBottom, BooksGardenLeft, BooksGardenSide, CornerSprig } from './garden/scenes';
import './Books.css';

const TILES = ['var(--tile-1)', 'var(--tile-2)', 'var(--tile-3)', 'var(--tile-4)', 'var(--tile-5)', 'var(--tile-6)'];

// Star rating renderer — supports half stars
function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<span key={i} className="star full">★</span>);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<span key={i} className="star half">★</span>);
    } else {
      stars.push(<span key={i} className="star empty">★</span>);
    }
  }
  return <div className="star-rating" aria-label={`${rating} out of 5 stars`}>{stars}</div>;
}

// Pastel tile with initials when there's no cover
function BookCover({ coverUrl, title, rank }) {
  const [imgError, setImgError] = useState(false);

  if (coverUrl && !imgError) {
    return (
      <img
        src={coverUrl}
        alt={`${title} cover`}
        className="book-cover-img"
        loading="lazy"
        onError={() => setImgError(true)}
      />
    );
  }

  const initials = title
    .split(' ')
    .filter(w => w.length > 2)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

  return (
    <div className="book-cover-fallback" style={{ background: TILES[(rank - 1) % TILES.length] }}>
      <span className="fallback-initials">{initials || title[0]}</span>
    </div>
  );
}

/** True when the element's text overflows its (line-clamped) box. Rechecks on resize. */
function useIsTruncated(ref, active) {
  const [truncated, setTruncated] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !active) return undefined;
    const check = () => setTruncated(el.scrollHeight > el.clientHeight + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, active]);
  return truncated;
}

function BookCard({ book, rank }) {
  const [expanded, setExpanded] = useState(false);
  const hasReview = book.review && book.review.trim().length > 0;
  const reviewRef = useRef(null);
  const truncated = useIsTruncated(reviewRef, hasReview && !expanded);

  const formattedDate = book.dateRead
    // dateRead is "YYYY-MM-DD"; parse as a local date so e.g. May 1 doesn't show as April
    ? new Date(`${book.dateRead}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : null;

  return (
    <article className="book-card paper">
      <div className="book-rank">{String(rank).padStart(2, '0')}</div>

      <div className="book-cover">
        <BookCover coverUrl={book.coverUrl} title={book.title} rank={rank} />
      </div>

      <div className="book-info">
        {formattedDate && <span className="eyebrow">Read {formattedDate}</span>}
        <h2 className="book-title">{book.title}</h2>
        <p className="book-author">{book.author}</p>

        <div className="book-meta">
          {book.rating > 0 ? (
            <>
              <StarRating rating={book.rating} />
              <span className="book-rating-num">{book.rating}/5</span>
            </>
          ) : <span className="book-rating-num">not rated</span>}
        </div>

        {hasReview && (
          <div className="book-review-section">
            <p ref={reviewRef} className={`book-review ${expanded ? 'full' : 'clamped'}`}>{book.review}</p>
            {/* Only offer to expand when the preview actually cuts the review off. */}
            {(truncated || expanded) && (
              <button type="button" className="review-toggle text-link" aria-expanded={expanded}
                      onClick={() => setExpanded(!expanded)}>
                {expanded ? 'Show less ↑' : 'Read my thoughts →'}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

const FILTERS = [
  { key: 'all', label: 'All books' },
  { key: '5', label: '★ 5 stars' },
  { key: '4', label: '★ 4 stars' },
  { key: '3', label: '★ 3 stars' },
  { key: '2', label: '★ 2 & below' },
];

function Books() {
  const { data, loading, error } = useApi('/api/books');
  const { title, intro } = usePage('books');
  const all = data ?? [];
  const reading = all.filter(b => b.currentlyReading);
  const books = all.filter(b => !b.currentlyReading);
  const year = new Date().getFullYear();
  const readThisYear = books.filter(b => b.dateRead?.startsWith(`${year}-`)).length;
  const [filter, setFilter] = useState('all');

  const filtered = books.filter(b => {
    if (filter === 'all') return true;
    if (filter === '5') return b.rating === 5;
    if (filter === '4') return b.rating >= 4 && b.rating < 5;
    if (filter === '3') return b.rating >= 3 && b.rating < 4;
    if (filter === '2') return b.rating > 0 && b.rating < 3;  // unrated books only show under All
    return true;
  });

  return (
    <div className="page books-page">
      <CornerSprig className="books-sprig" />
      <BooksGardenBottom />
      <BooksGardenSide />
      <BooksGardenLeft />
      <div className="page-inner books-inner">
        {title && <h1 className="page-title">{title}</h1>}
        {intro && <p className="page-intro">{intro}</p>}

        {!loading && !error && (
          <div className="books-top">
            <div className="books-year-count">
              <strong>{readThisYear}</strong>
              <span>{readThisYear === 1 ? 'book' : 'books'} read in {year}</span>
            </div>

            {reading.length > 0 && (
              <section className="reading-now" aria-labelledby="reading-now-title">
                <h2 id="reading-now-title" className="eyebrow">Currently reading</h2>
                <ul className="reading-now-list">
                  {reading.map((book, i) => (
                    <li key={book.id} className="reading-now-card paper">
                      <div className="reading-now-cover">
                        <BookCover coverUrl={book.coverUrl} title={book.title} rank={i + 1} />
                      </div>
                      <div>
                        <p className="reading-now-title">{book.title}</p>
                        <p className="reading-now-author">{book.author}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        <div className="books-filter-row" role="group" aria-label="Filter by rating">
          {FILTERS.map(f => (
            <button
              type="button"
              key={f.key}
              className={`books-filter ${filter === f.key ? 'active' : ''}`}
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && <PageStatus loading message="Loading the library…" />}
        {error && <PageStatus message="Couldn't load books right now. Please try again later." />}

        {!loading && !error && (
          <>
            <div className="books-list">
              {filtered.map((book, idx) => (
                <BookCard key={book.id} book={book} rank={idx + 1} />
              ))}
            </div>

            <p className="books-count eyebrow">
              {filtered.length} {filtered.length === 1 ? 'book' : 'books'}
              {filter !== 'all' ? ` · ${FILTERS.find(f => f.key === filter).label.replace('★ ', '')}` : ' read'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Books;
