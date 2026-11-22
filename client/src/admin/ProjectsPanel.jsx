import { useState } from 'react';
import { api, errorMessage } from '../auth/api';
import { EditorActions, Field, ImageField, formError, move } from './editing';
import useAdminList from './useAdminList';

const EMPTY = {
  title: '', tag: '', year: '', team: '', github_url: '', tech: '',
  description: '', long_description: '', image_media_id: null, extra_images: [],
};

function ProjectEditor({ project, previews, addPreview, onDone }) {
  const [form, setForm] = useState(project ? {
    ...EMPTY,
    ...Object.fromEntries(Object.entries(project).filter(([, v]) => v !== null)),
    tech: project.tech.join(', '),
  } : EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const setExtras = (fn) => setForm((f) => ({ ...f, extra_images: fn(f.extra_images) }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const body = {
      title: form.title, tag: form.tag, year: form.year, team: form.team, github_url: form.github_url,
      tech: form.tech.split(',').map((t) => t.trim()).filter(Boolean),
      description: form.description, long_description: form.long_description,
      image_media_id: form.image_media_id,
      extra_images: form.extra_images.filter((x) => x.media_id)
        .map((x) => ({ media_id: x.media_id, caption: x.caption || null })),
    };
    try {
      if (project) await api.put(`/api/admin/projects/${project.id}`, body);
      else await api.post('/api/admin/projects', body);
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
      await api.delete(`/api/admin/projects/${project.id}`);
      onDone();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <form className="admin-form editor" onSubmit={save}>
      <h3 className="admin-subtitle">{project ? 'Edit project' : 'Add a project'}</h3>
      <div className="admin-form-grid">
        <Field label="Title" wide required value={form.title} onChange={set('title')} maxLength={300} />
        <Field label="Tag" hint="(shown on the card)" value={form.tag} onChange={set('tag')} maxLength={200} />
        <Field label="Year" value={form.year} onChange={set('year')} maxLength={20} />
        <Field label="Team" hint="(optional)" value={form.team} onChange={set('team')} maxLength={300} />
        <Field label="GitHub link" hint="(optional)" type="url" value={form.github_url} onChange={set('github_url')}
               placeholder="https://github.com/…" />
        <Field label="Tech" hint="(comma separated)" wide value={form.tech} onChange={set('tech')} />
        <Field label="Short description" textarea wide value={form.description} onChange={set('description')} />
        <Field label="Full description" hint="(optional, on the project page)" textarea wide rows={6}
               value={form.long_description} onChange={set('long_description')} />
      </div>

      <ImageField label="Main image" value={form.image_media_id} previews={previews}
                  onChange={(id, src) => { addPreview(id, src); set('image_media_id')(id); }} />

      <h4 className="editor-section-title">More images</h4>
      <div className="section-list">
        {form.extra_images.map((x, i) => (
          <div key={x.key ?? x.media_id ?? i} className="section-card section-photo">
            <ImageField compact value={x.media_id} previews={previews} onChange={(id, src) => {
              addPreview(id, src);
              setExtras((list) => list.map((y, j) => (j === i ? { ...y, media_id: id } : y)));
            }} />
            <div className="section-photo-fields">
              <Field label="Caption" wide value={x.caption}
                     onChange={(caption) => setExtras((list) => list.map((y, j) => (j === i ? { ...y, caption } : y)))} />
              <div className="section-card-tools">
                <button type="button" className="admin-btn-icon" onClick={() => setExtras((l) => move(l, i, -1))}
                        disabled={i === 0} aria-label="Move image up">↑</button>
                <button type="button" className="admin-btn-icon" onClick={() => setExtras((l) => move(l, i, 1))}
                        disabled={i === form.extra_images.length - 1} aria-label="Move image down">↓</button>
                <button type="button" className="admin-btn-icon danger" aria-label="Remove image"
                        onClick={() => setExtras((l) => l.filter((_, j) => j !== i))}>×</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="admin-btn" onClick={() => setExtras((l) => [...l, { key: Date.now(), media_id: null, caption: '' }])}>
        + Add image
      </button>

      <EditorActions busy={busy} error={error} onCancel={onDone} onDelete={project ? remove : null}>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={busy}>{project ? 'Save' : 'Add project'}</button>
      </EditorActions>
    </form>
  );
}

export default function ProjectsPanel() {
  const { data, setData, error, reload } = useAdminList('/api/admin/projects');
  const [editing, setEditing] = useState(null);
  const [orderError, setOrderError] = useState('');
  const addPreview = (id, src) => {
    if (id && src) setData((d) => ({ ...d, previews: { ...d.previews, [id]: src } }));
  };

  const reorder = async (i, delta) => {
    const ids = move(data.projects, i, delta).map((p) => p.id);
    setOrderError('');
    try {
      const { data: next } = await api.put('/api/admin/projects-order', { ids });
      setData(next);
    } catch (err) {
      setOrderError(errorMessage(err));
    }
  };

  if (editing && data) {
    return (
      <section className="admin-panel">
        <ProjectEditor project={editing === 'new' ? null : editing} previews={data.previews} addPreview={addPreview}
                       onDone={() => { setEditing(null); reload(); }} />
      </section>
    );
  }

  return (
    <section className="admin-panel" aria-labelledby="projects-heading">
      <div className="admin-list-header">
        <h2 id="projects-heading" className="admin-panel-title">Coding projects</h2>
        <button type="button" className="admin-btn admin-btn-primary" onClick={() => setEditing('new')} disabled={!data}>
          + Add a project
        </button>
      </div>
      {(error || orderError) && <div className="admin-error" role="alert">{error || orderError}</div>}
      {!data && !error && <p className="admin-empty">Loading…</p>}
      {data && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <tbody>
              {data.projects.map((p, i) => (
                <tr key={p.id}>
                  <td className="admin-thumb-cell wide">
                    {p.image_media_id && data.previews[p.image_media_id] ? <img src={data.previews[p.image_media_id]} alt="" /> : <span />}
                  </td>
                  <td>{p.title}<div className="admin-muted">{[p.tag, p.year].filter(Boolean).join(' · ')}</div></td>
                  <td className="admin-actions">
                    <button type="button" className="admin-btn-icon" onClick={() => reorder(i, -1)} disabled={i === 0}
                            aria-label={`Move ${p.title} earlier`}>↑</button>
                    <button type="button" className="admin-btn-icon" onClick={() => reorder(i, 1)}
                            disabled={i === data.projects.length - 1} aria-label={`Move ${p.title} later`}>↓</button>
                    <button type="button" className="admin-btn" onClick={() => setEditing(p)}>Edit</button>
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
