import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthCard, { Field, FormError } from './AuthCard';
import { api, errorMessage } from './api';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from './context';
import { FullPageSpinner } from './RequireAuth';
import useTokenCheck from './useTokenCheck';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const reset = useTokenCheck('/api/auth/password-reset/check', token);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  if (reset.state === 'checking') return <FullPageSpinner />;

  if (done) {
    return (
      <AuthCard title="Password updated" subtitle="You've been logged out everywhere. Log in with your new password.">
        <Link className="auth-button auth-button-link" to="/login">Go to login</Link>
      </AuthCard>
    );
  }

  if (reset.state === 'invalid') {
    return (
      <AuthCard title="Reset link not valid">
        <p className="auth-subtitle">
          {token ? reset.error : 'This page needs a reset link.'}
          <br />Ask the site owner for a new one.
        </p>
        <Link className="auth-link" to="/login">Back to login</Link>
      </AuthCard>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      await api.post('/api/auth/password-reset', { token, password });
      setDone(true);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Choose a new password" subtitle={`For ${reset.data.email}`}>
      <form onSubmit={onSubmit}>
        <FormError message={error} />
        {/* Hidden username field helps password managers save the right entry. */}
        <input type="email" autoComplete="username" value={reset.data.email} readOnly hidden />
        <Field label="New password" id="password" type="password" autoComplete="new-password" required autoFocus
               minLength={PASSWORD_MIN_LENGTH} maxLength={PASSWORD_MAX_LENGTH}
               value={password} onChange={(e) => setPassword(e.target.value)}
               hint={`At least ${PASSWORD_MIN_LENGTH} characters.`} />
        <Field label="Confirm new password" id="confirm" type="password" autoComplete="new-password" required
               value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <button type="submit" className="auth-button" disabled={busy}>
          {busy ? 'Saving…' : 'Set new password'}
        </button>
      </form>
    </AuthCard>
  );
}
