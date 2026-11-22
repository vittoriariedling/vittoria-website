import './PageStatus.css';

/** Shared loading / error message for content pages. */
export default function PageStatus({ loading, message }) {
  return (
    <div className="page-status" role={loading ? 'status' : 'alert'}>
      {loading && <div className="page-status-spinner" />}
      <p>{message ?? (loading ? 'Loading…' : "Couldn't load this right now. Please try again later.")}</p>
    </div>
  );
}
