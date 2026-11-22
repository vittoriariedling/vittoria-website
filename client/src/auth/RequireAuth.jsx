import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context';
import './Auth.css';

export function FullPageSpinner() {
  return (
    <div className="auth-page" aria-busy="true">
      <div className="auth-spinner" role="status">
        <span className="visually-hidden">Loading…</span>
      </div>
    </div>
  );
}

/** Renders children only for signed-in users; otherwise sends them to /login
 *  and remembers where they were going. */
export default function RequireAuth({ children, admin = false }) {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <FullPageSpinner />;
  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
