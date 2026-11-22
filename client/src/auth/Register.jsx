import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import AuthCard, { Field, FormError } from './AuthCard';
import { errorMessage } from './api';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, useAuth } from './context';
import { FullPageSpinner } from './RequireAuth';
import useTokenCheck from './useTokenCheck';

export default function Register() {
  const { status, register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('invite');
  const invite = useTokenCheck('/api/auth/invites/check', token);

  const [form, setForm] = useState({ display_name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (status === 'loading' || invite.state === 'checking') return <FullPageSpinner />;
  if (status === 'authenticated') return <Navigate to="/" replace />;

  if (invite.state === 'invalid') {
    return (
      <AuthCard title="Invite link not valid">
        <p className="auth-subtitle">
          {token ? invite.error : 'You need an invite link to create an account.'}
          <br />Ask the site owner for a new one.
        </p>
        <Link className="auth-link" to="/login">Already have an account? Log in</Link>
      </AuthCard>
    );
  }

  const lockedEmail = invite.data.email; // set for email invites
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      await register({
        invite_token: token,
        email: lockedEmail || form.email,
        display_name: form.display_name,
        password: form.password,
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Create your account" subtitle="You've been invited! Set up your login below.">
      <form onSubmit={onSubmit}>
        <FormError message={error} />
        <Field label="Your name" id="display_name" autoComplete="name" required maxLength={100} autoFocus
               value={form.display_name} onChange={set('display_name')} />
        <Field label="Email" id="email" type="email" autoComplete="username" required
               value={lockedEmail || form.email} onChange={set('email')} readOnly={Boolean(lockedEmail)}
               hint={lockedEmail ? 'This invite is for this email address.' : undefined} />
        <Field label="Password" id="password" type="password" autoComplete="new-password" required
               minLength={PASSWORD_MIN_LENGTH} maxLength={PASSWORD_MAX_LENGTH}
               value={form.password} onChange={set('password')}
               hint={`At least ${PASSWORD_MIN_LENGTH} characters. A short phrase works great.`} />
        <Field label="Confirm password" id="confirm" type="password" autoComplete="new-password" required
               value={form.confirm} onChange={set('confirm')} />
        <button type="submit" className="auth-button" disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <Link className="auth-link" to="/login">Already have an account? Log in</Link>
    </AuthCard>
  );
}
