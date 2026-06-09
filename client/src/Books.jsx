import React, { useState, useEffect } from 'react';
import './Books.css';

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
  return <div className="star-rating">{stars}</div>;
}

// Fallback cover when Open Library has nothing
function BookCover({ coverUrl, title, author }) {
  const [imgError, setImgError] = useState(false);

  if (coverUrl && !imgError) {
    return (
      <img
        src={coverUrl}
        alt={`${title} cover`}
        className="book-cover-img"
        onError={() => setImgError(true)}
      />
    );
  }

  // Text-based fallback
  const initials = title
    .split(' ')
    .filter(w => w.length > 2)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

  return (
    <div className="book-cover-fallback">
      <span className="fallback-initials">{initials || title[0]}</span>
      <span className="fallback-title">{title}</span>
    </div>
  );
}

function BookCard({ book, rank }) {
  const [expanded, setExpanded] = useState(false);
  const hasReview = book.review && book.review.trim().length > 0;

  const formattedDate = book.dateRead
    ? new Date(book.dateRead).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : null;

  return (
    <article className={`book-card ${expanded ? 'expanded' : ''}`}>
      <div className="book-rank">#{rank}</div>

      <div className="book-cover">
        <BookCover coverUrl={book.coverUrl} title={book.title} author={book.author} />
      </div>

      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>

        <div className="book-meta">
          <StarRating rating={book.rating} />
          <span className="book-rating-num">{book.rating}/5</span>
          {formattedDate && <span className="book-date">Read {formattedDate}</span>}
        </div>

        {hasReview && (
          <div className="book-review-section">
            <p className={`book-review ${expanded ? 'full' : 'clamped'}`}>
              {book.review}
            </p>
            <button
              className="review-toggle"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Show less ↑' : 'Read my thoughts →'}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/books')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Couldn\'t load books right now. Please try again later.');
        setLoading(false);
      });
  }, []);

  const FILTERS = [
    { key: 'all', label: 'All Books' },
    { key: '5', label: '★ 5 Stars' },
    { key: '4', label: '★ 4 Stars' },
    { key: '3', label: '★ 3 Stars' },
  ];

  const filtered = books.filter(b => {
    if (filter === 'all') return true;
    if (filter === '5') return b.rating === 5;
    if (filter === '4') return b.rating >= 4 && b.rating < 5;
    if (filter === '3') return b.rating >= 3 && b.rating < 4;
    return true;
  });

  return (
    <div className="books-container">

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="books-page-header text-center">
        <h1 className="books-page-title">What I'm Reading</h1>
        <p className="books-page-description">
          Every book I've read, ranked by how much I loved it. Ratings are out of 5 —
          some are my own half-star tweaks on Goodreads' integer system. 📚
        </p>
      </div>

      {/* ── Filter Pills ─────────────────────────────────────── */}
      <div className="books-filter-row">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`filter-pill ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      {loading && (
        <div className="books-loading">
          <div className="loading-spinner" />
          <p>Loading your library…</p>
        </div>
      )}

      {error && (
        <div className="books-error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="books-list">
            {filtered.map((book, idx) => (
              <BookCard key={book.id} book={book} rank={idx + 1} />
            ))}
          </div>

          <p className="books-count">
            {filtered.length} {filtered.length === 1 ? 'book' : 'books'}
            {filter !== 'all' ? ` with ${filter} stars` : ' total'}
          </p>
        </>
      )}

    </div>
  );
}

export default Books;