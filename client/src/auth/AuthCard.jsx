import { CornerSprig } from '../garden/scenes';
import './Auth.css';

// Public pages (not logged in): show nothing personal.
export default function AuthCard({ title, subtitle, children }) {
  return (
    <main className="auth-page">
      <div className="auth-card-wrap">
        <CornerSprig className="auth-garden auth-garden-tl" />
        <CornerSprig className="auth-garden auth-garden-br" />
        <div className="auth-card">
          <h1 className="auth-title">{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          {children}
        </div>
      </div>
    </main>
  );
}

export function FormError({ message }) {
  if (!message) return null;
  return <div className="auth-error" role="alert">{message}</div>;
}

export function Field({ label, id, hint, ...inputProps }) {
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} className="auth-input" {...inputProps} />
      {hint && <small className="auth-hint">{hint}</small>}
    </div>
  );
}
