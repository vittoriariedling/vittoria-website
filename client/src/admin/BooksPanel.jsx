import { useState } from 'react';
import { api, errorMessage } from '../auth/api';
import { EditorActions, Field, ImageField, formError } from './editing';
import useAdminList from './useAdminList';

const RATINGS = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0];
const EMPTY = { title: '', author: '', isbn13: '', rating: 5, review: '', date_read: '', cover_media_id: null, currently_reading: false };
const stars = (r) => '★'.repeat(Math.floor(r)) + (r % 1 ? '½' : '');

function BookEditor({ book, onDone }) {
  const [form, setForm] = useState(book ? { ...EMPTY, ...book, isbn13: book.isbn13 ?? '', date_read: book.date_read ?? '' } : EMPTY);
  const [previews, setPreviews] = useState(book?.cover_url ? { [book.cover_media_id]: book.cover_url } : {});
  const [busy, setBusy] = useState(false);
  const [finding, setFinding] = useState(false);
  const [error, setError] = useState('');
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const setCover = (id, src) => {
    if (id && src) setPreviews((p) => ({ ...p, [id]: src }));
    set('cover_media_id')(id);
  };

  const findCover = async () => {
    setFinding(true);
    setError('');
    try {
      const { data } = await api.post('/api/admin/books/find-cover', { isbn13: form.isbn13 });
      setCover(data.id, data.src);
    } catch (err) {
      setError(formError(err));
    } finally {
      setFinding(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const body = {
      title: form.title, author: form.author, isbn13: form.isbn13 || null, rating: Number(form.rating),
      review: form.review, date_read: form.date_read || null, cover_media_id: form.cover_media_id,
      currently_reading: form.currently_reading,
    };
    try {
      if (book) await api.put(`/api/admin/books/${book.id}`, body);
      else await api.post('/api/admin/books', body);
      onDone();
    } catch (err) {
      setError(formError(err));
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${form.title}"?`)) return;
    setBusy(true);
    try {
      await api.delete(`/api/admin/books/${book.id}`);
      onDone();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <form className="admin-form editor" onSubmit={save}>
      <h3 className="admin-subtitle">{book ? 'Edit book' : 'Add a book'}</h3>
      <div className="admin-form-grid">
        <Field label="Title" wide required value={form.title} onChange={set('title')} maxLength={500} />
        <Field label="Author" required value={form.author} onChange={set('author')} maxLength={300} />
        <label className="admin-field">
          <span>Rating</span>
          <select className="admin-input" value={form.rating} onChange={(e) => set('rating')(e.target.value)}>
            {RATINGS.map((r) => <option key={r} value={r}>{r ? `${r} ${stars(r)}` : 'not rated'}</option>)}
          </select>
        </label>
        <Field label="Date read" type="date" value={form.date_read} onChange={set('date_read')} />
        <Field label="ISBN-13" hint="(finds the cover)" value={form.isbn13} onChange={set('isbn13')} inputMode="numeric" />
        <Field label="Review" hint="(optional)" textarea wide rows={6} value={form.review} onChange={set('review')} />
        <label className="admin-toggle admin-field-wide">
          <input type="checkbox" checked={form.currently_reading}
                 onChange={(e) => set('currently_reading')(e.target.checked)} />
          Currently reading <span className="admin-muted">(shows at the top of the reading page instead of the list)</span>
        </label>
      </div>
      <div className="editor-cover">
        <ImageField label="Cover" value={form.cover_media_id} previews={previews} onChange={setCover} />
        <button type="button" className="admin-btn" onClick={findCover} disabled={finding || !form.isbn13}>
          {finding ? 'Looking…' : 'Find cover by ISBN'}
        </button>
      </div>
      <p className="admin-hint">The reading page lists books most recently read first; books without a date read go at the end.</p>
      <EditorActions busy={busy} error={error} onCancel={onDone} onDelete={book ? remove : null}>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={busy}>{book ? 'Save' : 'Add book'}</button>
      </EditorActions>
    </form>
  );
}

export default function BooksPanel() {
  const { data: books, error, reload } = useAdminList('/api/admin/books');
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');

  if (editing) {
    return (
      <section className="admin-panel">
        <BookEditor book={editing === 'new' ? null : editing} onDone={() => { setEditing(null); reload(); }} />
      </section>
    );
  }

  const q = query.trim().toLowerCase();
  const shown = (books ?? []).filter((b) => !q || `${b.title} ${b.author}`.toLowerCase().includes(q));

  return (
    <section className="admin-panel" aria-labelledby="books-heading">
      <div className="admin-list-header">
        <h2 id="books-heading" className="admin-panel-title">What I'm reading</h2>
        <button type="button" className="admin-btn admin-btn-primary" onClick={() => setEditing('new')}>+ Add a book</button>
      </div>
      <input className="admin-input admin-search" type="search" placeholder="Search title or author" value={query}
             onChange={(e) => setQuery(e.target.value)} aria-label="Search books" />
      {error && <div className="admin-error" role="alert">{error}</div>}
      {books === null && !error && <p className="admin-empty">Loading…</p>}
      {books && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <tbody>
              {shown.map((b) => (
                <tr key={b.id}>
                  <td className="admin-thumb-cell">{b.cover_url ? <img src={b.cover_url} alt="" /> : <span />}</td>
                  <td>{b.title}<div className="admin-muted">{b.author}</div></td>
                  <td className="admin-stars" data-label="Rating">{b.rating ? <>{stars(b.rating)} <span className="admin-muted">{b.rating}</span></> : <span className="admin-muted">not rated</span>}</td>
                  <td className="admin-muted">{b.currently_reading ? <span className="admin-badge admin-badge-active">Reading</span> : b.review ? 'Reviewed' : ''}</td>
                  <td className="admin-actions">
                    <button type="button" className="admin-btn" onClick={() => setEditing(b)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
