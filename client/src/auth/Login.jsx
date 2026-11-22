import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthCard, { Field, FormError } from './AuthCard';
import { errorMessage } from './api';
import { safeRedirect, useAuth } from './context';
import { FullPageSpinner } from './RequireAuth';

export default function Login() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = safeRedirect(location.state?.from);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (status === 'loading') return <FullPageSpinner />;
  if (status === 'authenticated') return <Navigate to={from} replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Welcome back">
      <form onSubmit={onSubmit}>
        <FormError message={error} />
        <Field label="Email" id="email" type="email" autoComplete="username" required autoFocus
               value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label="Password" id="password" type="password" autoComplete="current-password" required
               value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="auth-button" disabled={busy}>
          {busy ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="auth-footnote">
        Need an account, or forgot your password?<br />
        Ask the site owner for an invite or reset link.
      </p>
    </AuthCard>
  );
}
