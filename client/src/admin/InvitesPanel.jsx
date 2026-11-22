import { useState } from 'react';
import { api, errorMessage } from '../auth/api';
import CopyLink from './CopyLink';
import { formatDate, statusLabel } from './format';
import useAdminList from './useAdminList';

const EXPIRY_OPTIONS = [1, 3, 7, 14, 30, 90];
const EMPTY_FORM = { kind: 'link', email: '', max_uses: 10, expires_in_days: 7, note: '' };

export default function InvitesPanel() {
  const { data: invites, error: loadError, reload: load } = useAdminList('/api/admin/invites');
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setBusy(true);
    const isEmail = form.kind === 'email';
    try {
      const { data } = await api.post('/api/admin/invites', {
        kind: form.kind,
        email: isEmail ? form.email : null,
        max_uses: isEmail ? 1 : Number(form.max_uses),
        expires_in_days: Number(form.expires_in_days),
        note: form.note.trim() || null,
      });
      setCreated(data);
      setForm({ ...EMPTY_FORM, kind: form.kind });
      load();
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const onRevoke = async (invite) => {
    const who = invite.email || invite.note || 'this shareable link';
    if (!window.confirm(`Revoke the invite for ${who}? The link will stop working immediately.`)) return;
    try {
      await api.post(`/api/admin/invites/${invite.id}/revoke`);
      load();
    } catch (err) {
      window.alert(errorMessage(err));
    }
  };

  const visible = (invites ?? []).filter((i) => showInactive || i.status === 'active');
  const inactiveCount = (invites ?? []).filter((i) => i.status !== 'active').length;

  return (
    <section className="admin-panel" aria-labelledby="invites-heading">
      <h2 id="invites-heading" className="admin-panel-title">Invites</h2>

      <form className="admin-form" onSubmit={onCreate}>
        <div className="admin-segmented" role="radiogroup" aria-label="Invite type">
          {[['link', 'Shareable link'], ['email', 'For one email']].map(([value, label]) => (
            <label key={value} className={`admin-segment ${form.kind === value ? 'active' : ''}`}>
              <input type="radio" name="kind" value={value} checked={form.kind === value}
                     onChange={set('kind')} />
              {label}
            </label>
          ))}
        </div>
        <p className="admin-hint">
          {form.kind === 'link'
            ? 'Anyone with the link can sign up, until it runs out of uses or expires.'
            : 'Single use, and only works for this email address.'}
        </p>

        <div className="admin-form-grid">
          {form.kind === 'email' ? (
            <label className="admin-field admin-field-wide">
              <span>Email</span>
              <input className="admin-input" type="email" required value={form.email} onChange={set('email')}
                     placeholder="friend@example.com" />
            </label>
          ) : (
            <label className="admin-field">
              <span>Max signups</span>
              <input className="admin-input" type="number" min={1} max={1000} required
                     value={form.max_uses} onChange={set('max_uses')} />
            </label>
          )}
          <label className="admin-field">
            <span>Expires in</span>
            <select className="admin-input" value={form.expires_in_days} onChange={set('expires_in_days')}>
              {EXPIRY_OPTIONS.map((d) => <option key={d} value={d}>{d} day{d > 1 ? 's' : ''}</option>)}
            </select>
          </label>
          <label className="admin-field admin-field-wide">
            <span>Note <small>(optional, only you see it)</small></span>
            <input className="admin-input" maxLength={200} value={form.note} onChange={set('note')}
                   placeholder={form.kind === 'link' ? 'e.g. Family group chat' : 'e.g. Roommate'} />
          </label>
        </div>

        {formError && <div className="admin-error" role="alert">{formError}</div>}
        <button type="submit" className="admin-btn admin-btn-primary" disabled={busy}>
          {busy ? 'Creating…' : 'Create invite link'}
        </button>
      </form>

      {created && (
        <div className="admin-created" role="status">
          <div className="admin-created-header">
            <strong>
              Invite created{created.email ? ` for ${created.email}` : ''}. Copy it now: you won't see it again.
            </strong>
            <button type="button" className="admin-btn-link" onClick={() => setCreated(null)}>Dismiss</button>
          </div>
          <CopyLink url={created.url} label="New invite link" />
        </div>
      )}

      <div className="admin-list-header">
        <h3 className="admin-subtitle">Your invites</h3>
        {inactiveCount > 0 && (
          <label className="admin-toggle">
            <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} />
            Show used, expired &amp; revoked ({inactiveCount})
          </label>
        )}
      </div>

      {loadError && <div className="admin-error" role="alert">{loadError}</div>}
      {invites === null && !loadError && <p className="admin-empty">Loading…</p>}
      {invites !== null && visible.length === 0 && (
        <p className="admin-empty">No {showInactive ? '' : 'active '}invites yet.</p>
      )}

      {visible.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>For</th>
                <th>Signups</th>
                <th>Expires</th>
                <th>Status</th>
                <th><span className="visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <div>{inv.email || 'Shareable link'}</div>
                    {inv.note && <div className="admin-muted">{inv.note}</div>}
                  </td>
                  <td data-label="Signups">{inv.use_count} / {inv.max_uses}</td>
                  <td data-label="Expires">{formatDate(inv.expires_at)}</td>
                  <td><span className={`admin-badge admin-badge-${inv.status}`}>{statusLabel(inv.status)}</span></td>
                  <td className="admin-actions">
                    {inv.status === 'active' && (
                      <button type="button" className="admin-btn admin-btn-danger" onClick={() => onRevoke(inv)}>
                        Revoke
                      </button>
                    )}
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
