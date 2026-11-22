// Shared building blocks for the content editors on the admin page.
/* eslint-disable react-refresh/only-export-components */
import { useRef, useState } from 'react';
import { api, errorMessage } from '../auth/api';

/** Upload one image file; resolves to { id, src, width, height }. */
export async function uploadImage(file) {
  const { data } = await api.post(`/api/admin/media?filename=${encodeURIComponent(file.name)}`, file, {
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
  });
  return data;
}

/** Friendlier messages for validation errors on long forms ("Section 3: needs text"). */
export function formError(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail) && detail.length) {
    const { loc = [], msg = '' } = detail[0];
    const clean = msg.replace(/^Value error, /, '');
    const path = loc.filter((p) => p !== 'body');
    const s = path.indexOf('sections');
    if (s !== -1 && typeof path[s + 1] === 'number') return `Section ${path[s + 1] + 1}: ${clean}`;
    const field = path.filter((p) => typeof p === 'string').pop();
    return field ? `${field.replaceAll('_', ' ')}: ${clean}` : clean;
  }
  return errorMessage(err);
}

/** Turn a title into a URL slug: "Week 3: Toledo!" -> "week-3-toledo". */
export function slugify(text) {
  return text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 200);
}

/**
 * An image picker: thumbnail + Upload/Replace/Remove.
 * `value` is a media id (or null); `previews` maps ids to thumbnail URLs.
 * onChange(id, src) is called after an upload (src lets the parent show it).
 */
export function ImageField({ label, value, previews, onChange, compact = false }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const src = value ? previews[value] : null;

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const media = await uploadImage(file);
      onChange(media.id, media.src);
    } catch (err) {
      setError(errorMessage(err, "Couldn't upload that image."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`image-field ${compact ? 'compact' : ''}`}>
      {label && <span className="image-field-label">{label}</span>}
      <div className="image-field-body">
        <div className="image-field-thumb">
          {src ? <img src={src} alt="" /> : <span>{busy ? 'Uploading…' : 'No photo'}</span>}
        </div>
        <div className="image-field-actions">
          <button type="button" className="admin-btn" disabled={busy} onClick={() => input.current?.click()}>
            {busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}
          </button>
          {value && !busy && (
            <button type="button" className="admin-btn-link" onClick={() => onChange(null, null)}>Remove</button>
          )}
        </div>
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={onFile} />
      {error && <div className="admin-error" role="alert">{error}</div>}
    </div>
  );
}

/** Labelled text input / textarea bound to form[key]. */
export function Field({ label, hint, value, onChange, textarea = false, wide = false, ...props }) {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <label className={`admin-field ${wide ? 'admin-field-wide' : ''}`}>
      <span>{label}{hint && <small> {hint}</small>}</span>
      <Tag className="admin-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)}
           rows={textarea ? 4 : undefined} {...props} />
    </label>
  );
}

/** Save / cancel / delete row shown under every editor. */
export function EditorActions({ busy, error, onCancel, onDelete, children }) {
  return (
    <>
      {error && <div className="admin-error" role="alert">{error}</div>}
      <div className="editor-actions">
        {children}
        <button type="button" className="admin-btn" onClick={onCancel} disabled={busy}>Cancel</button>
        {onDelete && (
          <button type="button" className="admin-btn admin-btn-danger editor-delete" onClick={onDelete} disabled={busy}>
            Delete
          </button>
        )}
      </div>
    </>
  );
}

/** Move item i of a list by delta (-1 up, +1 down). */
export function move(list, i, delta) {
  const j = i + delta;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}
