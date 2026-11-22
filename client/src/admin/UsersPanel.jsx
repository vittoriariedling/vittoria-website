import { useState } from 'react';
import { api, errorMessage } from '../auth/api';
import { useAuth } from '../auth/context';
import CopyLink from './CopyLink';
import { formatDate } from './format';
import useAdminList from './useAdminList';

export default function UsersPanel() {
  const { user: me } = useAuth();
  const { data: users, setData: setUsers, error: loadError } = useAdminList('/api/admin/users');
  const [resetLink, setResetLink] = useState(null); // { user, url, expires_at }
  const [pending, setPending] = useState(null); // id of the user being changed

  const act = async (user, fn) => {
    setPending(user.id);
    try {
      await fn();
    } catch (err) {
      window.alert(errorMessage(err));
    } finally {
      setPending(null);
    }
  };

  const update = (user, body, confirmText) => {
    if (confirmText && !window.confirm(confirmText)) return;
    act(user, async () => {
      const { data } = await api.patch(`/api/admin/users/${user.id}`, body);
      setUsers((list) => list.map((u) => (u.id === data.id ? data : u)));
    });
  };

  const makeResetLink = (user) => {
    if (!window.confirm(`Create a password reset link for ${user.display_name}? Any earlier reset link for them stops working.`)) return;
    act(user, async () => {
      const { data } = await api.post(`/api/admin/users/${user.id}/password-reset`);
      setResetLink({ user, ...data });
    });
  };

  return (
    <section className="admin-panel" aria-labelledby="users-heading">
      <h2 id="users-heading" className="admin-panel-title">Users</h2>

      {resetLink && (
        <div className="admin-created" role="status">
          <div className="admin-created-header">
            <strong>
              Reset link for {resetLink.user.display_name}, valid until {formatDate(resetLink.expires_at)}.
              Copy it now: you won't see it again.
            </strong>
            <button type="button" className="admin-btn-link" onClick={() => setResetLink(null)}>Dismiss</button>
          </div>
          <CopyLink url={resetLink.url} label="Password reset link" />
        </div>
      )}

      {loadError && <div className="admin-error" role="alert">{loadError}</div>}
      {users === null && !loadError && <p className="admin-empty">Loading…</p>}

      {users?.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th><span className="visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isMe = u.id === me.id;
                const busy = pending === u.id;
                return (
                  <tr key={u.id} className={u.is_active ? '' : 'admin-row-inactive'}>
                    <td>
                      <div>{u.display_name}{isMe && <span className="admin-muted"> (you)</span>}</div>
                      <div className="admin-muted">{u.email}</div>
                    </td>
                    <td data-label="Role">{u.role === 'admin' ? 'Admin' : 'Member'}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${u.is_active ? 'active' : 'revoked'}`}>
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td data-label="Joined">{formatDate(u.created_at)}</td>
                    <td className="admin-actions">
                      {!isMe && (
                        <>
                          {u.is_active && (
                            <button type="button" className="admin-btn" disabled={busy} onClick={() => makeResetLink(u)}>
                              Reset link
                            </button>
                          )}
                          <button type="button" className="admin-btn" disabled={busy}
                                  onClick={() => (u.role === 'admin'
                                    ? update(u, { role: 'member' }, `Remove admin access from ${u.display_name}?`)
                                    : update(u, { role: 'admin' }, `Make ${u.display_name} an admin? They'll be able to invite people and manage users, including you.`))}>
                            {u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                          </button>
                          {u.is_active ? (
                            <button type="button" className="admin-btn admin-btn-danger" disabled={busy}
                                    onClick={() => update(u, { is_active: false }, `Deactivate ${u.display_name}? They'll be logged out everywhere.`)}>
                              Deactivate
                            </button>
                          ) : (
                            <button type="button" className="admin-btn" disabled={busy}
                                    onClick={() => update(u, { is_active: true })}>
                              Reactivate
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
