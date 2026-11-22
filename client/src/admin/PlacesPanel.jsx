import { useState } from 'react';
import { api, errorMessage } from '../auth/api';
import { CONTINENTS, COUNTRIES, US_STATES } from '../geo';
import { EditorActions, Field, ImageField, formError } from './editing';
import useAdminList from './useAdminList';

const EMPTY = {
  kind: 'country', code: '', name: '', continent: '', status: 'visited',
  description: '', newsletter_slugs: [], photo_media_id: null,
};

function PlaceEditor({ place, previews, addPreview, posts, onDone }) {
  const [form, setForm] = useState(place ? { ...EMPTY, ...place, continent: place.continent ?? '' } : EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const options = form.kind === 'country' ? COUNTRIES : US_STATES;

  const pick = (code) => {
    const row = options.find((o) => o[0] === code);
    setForm((f) => ({ ...f, code, name: row?.[1] ?? '', continent: row?.[2] ?? f.continent }));
  };
  const toggleSlug = (slug) => setForm((f) => ({
    ...f,
    newsletter_slugs: f.newsletter_slugs.includes(slug)
      ? f.newsletter_slugs.filter((s) => s !== slug) : [...f.newsletter_slugs, slug],
  }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const body = { ...form, continent: form.kind === 'country' ? form.continent || null : null };
    delete body.id;
    delete body.updated_at;
    try {
      if (place) await api.put(`/api/admin/places/${place.id}`, body);
      else await api.post('/api/admin/places', body);
      onDone();
    } catch (err) {
      setError(formError(err));
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Remove ${form.name} from the map?`)) return;
    setBusy(true);
    try {
      await api.delete(`/api/admin/places/${place.id}`);
      onDone();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <form className="admin-form editor" onSubmit={save}>
      <h3 className="admin-subtitle">{place ? `Edit ${place.name}` : 'Add a place'}</h3>
      {!place && (
        <div className="admin-segmented" role="radiogroup" aria-label="Kind of place">
          {[['country', 'Country'], ['state', 'US state']].map(([value, label]) => (
            <label key={value} className={`admin-segment ${form.kind === value ? 'active' : ''}`}>
              <input type="radio" name="kind" value={value} checked={form.kind === value}
                     onChange={() => setForm({ ...EMPTY, kind: value })} />
              {label}
            </label>
          ))}
        </div>
      )}
      <div className="admin-form-grid">
        <label className="admin-field">
          <span>{form.kind === 'country' ? 'Country' : 'State'}</span>
          <select className="admin-input" required value={form.code} onChange={(e) => pick(e.target.value)} disabled={Boolean(place)}>
            <option value="">Choose…</option>
            {options.map(([code, name]) => <option key={code} value={code}>{name} ({code})</option>)}
          </select>
        </label>
        <Field label="Name shown" required value={form.name} onChange={set('name')} maxLength={200} />
        {form.kind === 'country' && (
          <label className="admin-field">
            <span>Continent</span>
            <select className="admin-input" value={form.continent} onChange={(e) => set('continent')(e.target.value)}>
              <option value="">—</option>
              {CONTINENTS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
        )}
        <label className="admin-field">
          <span>Status</span>
          <select className="admin-input" value={form.status} onChange={(e) => set('status')(e.target.value)}>
            <option value="visited">Visited</option>
            <option value="lived">Lived here</option>
          </select>
        </label>
        <Field label="Description" textarea wide value={form.description} onChange={set('description')} maxLength={5000} />
      </div>

      <ImageField label="Photo (optional)" value={form.photo_media_id} previews={previews}
                  onChange={(id, src) => { addPreview(id, src); set('photo_media_id')(id); }} />

      <fieldset className="editor-checklist">
        <legend>Linked newsletters</legend>
        {posts.length === 0 && <p className="admin-muted">No newsletters yet.</p>}
        {posts.map((p) => (
          <label key={p.slug} className="admin-toggle">
            <input type="checkbox" checked={form.newsletter_slugs.includes(p.slug)} onChange={() => toggleSlug(p.slug)} />
            {p.title}{!p.published && <span className="admin-muted"> (draft)</span>}
          </label>
        ))}
      </fieldset>

      <EditorActions busy={busy} error={error} onCancel={onDone} onDelete={place ? remove : null}>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={busy}>{place ? 'Save' : 'Add to map'}</button>
      </EditorActions>
    </form>
  );
}

export default function PlacesPanel() {
  const { data, setData, error, reload } = useAdminList('/api/admin/places');
  const { data: posts } = useAdminList('/api/admin/posts');
  const [editing, setEditing] = useState(null); // null | 'new' | place
  const addPreview = (id, src) => {
    if (id && src) setData((d) => ({ ...d, previews: { ...d.previews, [id]: src } }));
  };

  if (editing && data) {
    return (
      <section className="admin-panel">
        <PlaceEditor place={editing === 'new' ? null : editing} previews={data.previews} addPreview={addPreview}
                     posts={posts ?? []} onDone={() => { setEditing(null); reload(); }} />
      </section>
    );
  }

  const titles = Object.fromEntries((posts ?? []).map((p) => [p.slug, p.title]));
  const group = (kind) => (data?.places ?? []).filter((p) => p.kind === kind);

  return (
    <section className="admin-panel" aria-labelledby="places-heading">
      <div className="admin-list-header">
        <h2 id="places-heading" className="admin-panel-title">Around the world</h2>
        <button type="button" className="admin-btn admin-btn-primary" onClick={() => setEditing('new')} disabled={!data}>
          + Add a place
        </button>
      </div>
      {error && <div className="admin-error" role="alert">{error}</div>}
      {!data && !error && <p className="admin-empty">Loading…</p>}
      {data && [['country', 'Countries'], ['state', 'US states']].map(([kind, heading]) => (
        <div key={kind} className="places-group">
          <h3 className="admin-subtitle">{heading} ({group(kind).length})</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <tbody>
                {group(kind).map((p) => (
                  <tr key={p.id}>
                    <td>{p.name} <span className="admin-muted">{p.code}</span></td>
                    <td><span className={`admin-badge ${p.status === 'lived' ? 'admin-badge-revoked' : 'admin-badge-used'}`}>
                      {p.status === 'lived' ? 'Lived here' : 'Visited'}</span></td>
                    <td className="admin-muted">{p.newsletter_slugs.map((s) => titles[s] ?? s).join(', ')}</td>
                    <td className="admin-actions">
                      <button type="button" className="admin-btn" onClick={() => setEditing(p)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </section>
  );
}
