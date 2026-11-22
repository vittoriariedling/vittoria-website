import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, errorMessage } from '../auth/api';
import { EditorActions, Field, ImageField, formError, move, slugify } from './editing';
import { formatDate } from './format';
import useAdminList from './useAdminList';

const SECTION_TYPES = [
  ['paragraph', 'Paragraph'],
  ['callout', 'Subheading'],
  ['image', 'Wide photo'],
  ['photo-left', 'Photo left + text'],
  ['photo-right', 'Photo right + text'],
  ['three-photos', 'Row of photos'],
  ['quote', 'Quote'],
];
const TYPE_LABEL = Object.fromEntries(SECTION_TYPES);

let nextKey = 1;
const withKey = (s) => ({ ...s, key: nextKey++ });

function blankSection(type) {
  if (type === 'three-photos') return withKey({ type, photos: [{}, {}, {}] });
  return withKey({ type });
}

const EMPTY = {
  slug: '', title: '', date_label: '', region: '', tags: '', preview_description: '',
  hero_media_id: null, hero_alt: '', cover_media_id: null, cover_alt: '', cover_caption: '',
  sections: [blankSection('paragraph')], published: false,
};

/** Form state -> request body (drops editor-only keys and empty photo slots). */
function toBody(form, published) {
  const sections = form.sections.map(({ key, ...s }) => {
    void key;
    const out = { type: s.type };
    for (const f of ['content', 'label', 'caption', 'text', 'media_id']) if (s[f]) out[f] = s[f];
    if (s.type === 'three-photos') {
      out.photos = (s.photos ?? []).filter((p) => p.media_id)
        .map((p) => ({ media_id: p.media_id, ...(p.caption ? { caption: p.caption } : {}) }));
    }
    return out;
  });
  return {
    slug: form.slug, title: form.title, date_label: form.date_label,
    region: form.region || null, preview_description: form.preview_description || null,
    tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    hero_media_id: form.hero_media_id, hero_alt: form.hero_alt || null,
    cover_media_id: form.cover_media_id, cover_alt: form.cover_alt || null,
    cover_caption: form.cover_caption || null,
    sections, published,
  };
}

function fromPost(post) {
  return {
    ...EMPTY,
    ...Object.fromEntries(Object.entries(post).filter(([, v]) => v !== null)),
    tags: (post.tags ?? []).join(', '),
    sections: post.sections.map((s) => withKey(
      s.type === 'three-photos' ? { ...s, photos: [...s.photos, {}, {}, {}].slice(0, 3) } : s,
    )),
  };
}

function SectionEditor({ section, index, count, previews, addPreview, onUpdate, onMove, onRemove }) {
  // Functional updates, so two uploads finishing together don't overwrite each other.
  const set = (patch) => onUpdate((s) => ({ ...s, ...patch }));
  const setPhoto = (i, patch) => onUpdate((s) => ({ ...s, photos: s.photos.map((q, j) => (j === i ? { ...q, ...patch } : q)) }));
  const image = (field = 'media_id') => (id, src) => { addPreview(id, src); set({ [field]: id }); };
  const { type } = section;

  return (
    <div className="section-card">
      <div className="section-card-head">
        <span className="section-card-type">{index + 1}. {TYPE_LABEL[type]}</span>
        <div className="section-card-tools">
          <button type="button" className="admin-btn-icon" onClick={() => onMove(-1)} disabled={index === 0}
                  aria-label="Move section up">↑</button>
          <button type="button" className="admin-btn-icon" onClick={() => onMove(1)} disabled={index === count - 1}
                  aria-label="Move section down">↓</button>
          <button type="button" className="admin-btn-icon danger" onClick={onRemove} aria-label="Remove section">×</button>
        </div>
      </div>

      {(type === 'paragraph' || type === 'quote') && (
        <Field label={type === 'quote' ? 'Quote' : 'Text'} textarea wide value={section.content}
               onChange={(content) => set({ content })} rows={type === 'paragraph' ? 6 : 3} />
      )}
      {type === 'quote' && <Field label="Label" hint="(optional, e.g. who said it)" value={section.label}
                                  onChange={(label) => set({ label })} />}
      {type === 'callout' && <Field label="Subheading" wide value={section.content} onChange={(content) => set({ content })} />}

      {['image', 'photo-left', 'photo-right'].includes(type) && (
        <div className="section-photo">
          <ImageField value={section.media_id} previews={previews} onChange={image()} />
          <div className="section-photo-fields">
            <Field label="Caption" wide value={section.caption} onChange={(caption) => set({ caption })} />
            {type !== 'image' && (
              <Field label="Text beside the photo" textarea wide value={section.text} onChange={(text) => set({ text })} />
            )}
          </div>
        </div>
      )}

      {type === 'three-photos' && (
        <div className="section-trio">
          {section.photos.map((p, i) => (
            <div key={i} className="section-trio-item">
              <ImageField compact value={p.media_id} previews={previews} onChange={(id, src) => {
                addPreview(id, src);
                setPhoto(i, { media_id: id });
              }} />
              <input className="admin-input" placeholder="Caption" value={p.caption ?? ''} maxLength={500}
                     onChange={(e) => setPhoto(i, { caption: e.target.value })} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NewsletterEditor({ postId, onDone }) {
  const [form, setForm] = useState(postId ? null : EMPTY);
  const [previews, setPreviews] = useState({});
  const [slugTouched, setSlugTouched] = useState(Boolean(postId));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [addType, setAddType] = useState('paragraph');

  useEffect(() => {
    if (!postId) return;
    api.get(`/api/admin/posts/${postId}`).then(
      ({ data }) => { setForm(fromPost(data)); setPreviews(data.previews); },
      (err) => setError(errorMessage(err)),
    );
  }, [postId]);

  if (!form) return error ? <div className="admin-error">{error}</div> : <p className="admin-empty">Loading…</p>;

  const set = (key) => (value) => setForm((f) => ({
    ...f, [key]: value, ...(key === 'title' && !slugTouched ? { slug: slugify(value) } : {}),
  }));
  const addPreview = (id, src) => { if (id && src) setPreviews((p) => ({ ...p, [id]: src })); };
  const setSections = (fn) => setForm((f) => ({ ...f, sections: fn(f.sections) }));

  const save = async (published) => {
    setBusy(true);
    setError('');
    try {
      const body = toBody(form, published);
      if (postId) await api.put(`/api/admin/posts/${postId}`, body);
      else await api.post('/api/admin/posts', body);
      onDone();
    } catch (err) {
      setError(formError(err));
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${form.title}"? This can't be undone.`)) return;
    setBusy(true);
    try {
      await api.delete(`/api/admin/posts/${postId}`);
      onDone();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <form className="admin-form editor" onSubmit={(e) => { e.preventDefault(); save(form.published); }}>
      <div className="editor-head">
        <h3 className="admin-subtitle">{postId ? 'Edit newsletter' : 'New newsletter'}</h3>
        <span className={`admin-badge ${form.published ? 'admin-badge-active' : 'admin-badge-expired'}`}>
          {form.published ? 'Published' : 'Draft'}
        </span>
      </div>

      <div className="admin-form-grid">
        <Field label="Title" wide required value={form.title} onChange={set('title')} maxLength={300} />
        <Field label="URL" hint="(the end of the link)" value={form.slug} required maxLength={200}
               pattern="[a-z0-9]+(-[a-z0-9]+)*" title="lowercase letters, numbers and dashes"
               onChange={(v) => { setSlugTouched(true); set('slug')(v); }} />
        <Field label="Date" hint="(e.g. March 1, 2026)" value={form.date_label} onChange={set('date_label')} maxLength={100} />
        <Field label="Region" hint="(optional)" value={form.region} onChange={set('region')} maxLength={50} />
        <Field label="Tags" hint="(comma separated)" value={form.tags} onChange={set('tags')} />
        <Field label="Preview text" hint="(optional; otherwise the first paragraph is used)" textarea wide
               value={form.preview_description} onChange={set('preview_description')} rows={2} maxLength={1000} />
      </div>

      <div className="editor-images">
        <div>
          <ImageField label="Hero photo (optional)" value={form.hero_media_id} previews={previews}
                      onChange={(id, src) => { addPreview(id, src); set('hero_media_id')(id); }} />
          <Field label="Hero description" hint="(for screen readers)" value={form.hero_alt} onChange={set('hero_alt')} />
        </div>
        <div>
          <ImageField label="Cover photo (optional)" value={form.cover_media_id} previews={previews}
                      onChange={(id, src) => { addPreview(id, src); set('cover_media_id')(id); }} />
          <Field label="Cover caption" value={form.cover_caption} onChange={set('cover_caption')} />
        </div>
      </div>

      <h4 className="editor-section-title">Content</h4>
      <p className="admin-hint">In any text box, leave a blank line to start a new paragraph, and wrap words in **double asterisks** to make them bold.</p>
      <div className="section-list">
        {form.sections.map((s, i) => (
          <SectionEditor key={s.key} section={s} index={i} count={form.sections.length}
                         previews={previews} addPreview={addPreview}
                         onUpdate={(fn) => setSections((list) => list.map((x) => (x.key === s.key ? fn(x) : x)))}
                         onMove={(d) => setSections((list) => move(list, i, d))}
                         onRemove={() => setSections((list) => list.filter((x) => x.key !== s.key))} />
        ))}
      </div>
      <div className="section-add">
        <select className="admin-input" value={addType} onChange={(e) => setAddType(e.target.value)} aria-label="Section type">
          {SECTION_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <button type="button" className="admin-btn" onClick={() => setSections((list) => [...list, blankSection(addType)])}>
          + Add section
        </button>
      </div>

      <EditorActions busy={busy} error={error} onCancel={onDone} onDelete={postId ? remove : null}>
        {form.published ? (
          <>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={busy}>Save changes</button>
            <button type="button" className="admin-btn" disabled={busy} onClick={() => save(false)}>Unpublish</button>
          </>
        ) : (
          <>
            <button type="button" className="admin-btn admin-btn-primary" disabled={busy} onClick={() => save(true)}>Publish</button>
            <button type="submit" className="admin-btn" disabled={busy}>Save draft</button>
          </>
        )}
      </EditorActions>
    </form>
  );
}

export default function NewslettersPanel() {
  const { data: posts, error, reload } = useAdminList('/api/admin/posts');
  const [editing, setEditing] = useState(null); // null | 'new' | post id

  if (editing) {
    return (
      <section className="admin-panel">
        <NewsletterEditor key={editing} postId={editing === 'new' ? null : editing}
                          onDone={() => { setEditing(null); reload(); }} />
      </section>
    );
  }

  return (
    <section className="admin-panel" aria-labelledby="posts-heading">
      <div className="admin-list-header">
        <h2 id="posts-heading" className="admin-panel-title">Newsletters</h2>
        <button type="button" className="admin-btn admin-btn-primary" onClick={() => setEditing('new')}>+ New newsletter</button>
      </div>
      {error && <div className="admin-error" role="alert">{error}</div>}
      {posts === null && !error && <p className="admin-empty">Loading…</p>}
      {posts?.length === 0 && <p className="admin-empty">No newsletters yet.</p>}
      {posts?.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Title</th><th>Date</th><th>Status</th><th>Edited</th><th><span className="visually-hidden">Actions</span></th></tr></thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}<div className="admin-muted">/{p.slug}</div></td>
                  <td data-label="Date">{p.date_label}</td>
                  <td><span className={`admin-badge ${p.published ? 'admin-badge-active' : 'admin-badge-expired'}`}>
                    {p.published ? 'Published' : 'Draft'}</span></td>
                  <td data-label="Edited">{formatDate(p.updated_at)}</td>
                  <td className="admin-actions">
                    <Link className="admin-btn" to={`/study-abroad-newsletter/${p.slug}`}>{p.published ? 'View' : 'Preview'}</Link>
                    <button type="button" className="admin-btn" onClick={() => setEditing(p.id)}>Edit</button>
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
