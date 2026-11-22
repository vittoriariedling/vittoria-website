import { useState } from 'react';
import { formatDateTime } from './format';
import useAdminList from './useAdminList';

const RECENT_LIMIT = 100;

function eventsUrl(filter) {
  const params = new URLSearchParams({ limit: String(RECENT_LIMIT) });
  if (filter?.user_id) params.set('user_id', filter.user_id);
  if (filter?.ip) params.set('ip', filter.ip);
  return `/api/admin/logins?${params}`;
}

function Account({ name, email }) {
  return (
    <>
      <div>{name}</div>
      <div className="admin-muted">{email}</div>
    </>
  );
}

export default function LoginsPanel() {
  const { data: summary, error: summaryError } = useAdminList('/api/admin/logins/summary');
  // { user_id, ip, label } when looking at one account + IP, else null
  const [filter, setFilter] = useState(null);
  const { data: events, error: eventsError } = useAdminList(eventsUrl(filter));

  const showHistory = (row) => {
    setFilter({ user_id: row.user_id, ip: row.ip, label: `${row.display_name} from ${row.ip ?? 'unknown IP'}` });
    document.getElementById('login-events-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="admin-panel" aria-labelledby="logins-heading">
      <h2 id="logins-heading" className="admin-panel-title">Logins</h2>
      <p className="admin-panel-help">
        Every login and failed password attempt on an account, with the IP address it came from.
        Attempts on emails that don't have an account aren't recorded. History is kept for 180 days.
      </p>

      <div className="admin-list-header">
        <h3 className="admin-subtitle">By account and IP</h3>
      </div>
      {summaryError && <div className="admin-error" role="alert">{summaryError}</div>}
      {summary === null && !summaryError && <p className="admin-empty">Loading…</p>}
      {summary?.length === 0 && <p className="admin-empty">No logins recorded yet.</p>}
      {summary?.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>IP address</th>
                <th>Logins</th>
                <th>Failed</th>
                <th>First seen</th>
                <th>Last seen</th>
                <th><span className="visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row) => (
                <tr key={`${row.user_id}|${row.ip}`}>
                  <td><Account name={row.display_name} email={row.email} /></td>
                  <td data-label="IP"><code>{row.ip ?? '—'}</code></td>
                  <td data-label="Logins">{row.successes}</td>
                  <td data-label="Failed">{row.failures}</td>
                  <td data-label="First seen">{formatDateTime(row.first_seen)}</td>
                  <td data-label="Last seen">{formatDateTime(row.last_seen)}</td>
                  <td className="admin-actions">
                    <button type="button" className="admin-btn" onClick={() => showHistory(row)}>History</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-list-header" style={{ marginTop: 32 }}>
        <h3 id="login-events-heading" className="admin-subtitle">
          {filter ? `Attempts by ${filter.label}` : 'Recent attempts'}
        </h3>
        {filter && (
          <button type="button" className="admin-btn-link" onClick={() => setFilter(null)}>Show everyone</button>
        )}
      </div>
      {eventsError && <div className="admin-error" role="alert">{eventsError}</div>}
      {events === null && !eventsError && <p className="admin-empty">Loading…</p>}
      {events?.length === 0 && <p className="admin-empty">Nothing here.</p>}
      {events?.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Account</th>
                <th>IP address</th>
                <th>Result</th>
                <th>Browser</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td>{formatDateTime(e.created_at)}</td>
                  <td><Account name={e.display_name} email={e.email} /></td>
                  <td data-label="IP"><code>{e.ip ?? '—'}</code></td>
                  <td>
                    <span className={`admin-badge admin-badge-${e.success ? 'active' : 'revoked'}`}>
                      {e.success ? 'Logged in' : 'Failed'}
                    </span>
                  </td>
                  <td data-label="Browser" className="admin-muted" title={e.user_agent ?? ''}
                      style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.user_agent ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {events.length === RECENT_LIMIT && (
            <p className="admin-hint">Showing the latest {RECENT_LIMIT}.</p>
          )}
        </div>
      )}
    </section>
  );
}
