import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/context';
import { useSite } from './site/context';
import './Navbar.css';

const LINKS = [
  ['/study-abroad-newsletter', 'newsletter'],
  ['/around-the-world', 'around the world'],
  ['/what-im-reading', "what i’m reading"],
  ['/coding-projects', 'coding projects'],
];

function Navbar() {
  const { user, logout } = useAuth();
  const { site } = useSite();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const onLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="site-nav">
      <Link className="site-nav-logo" to="/" onClick={() => setOpen(false)}>
        {site.siteName ?? ' '}
      </Link>

      <button type="button" className="site-nav-toggle" aria-expanded={open} aria-controls="site-nav-links"
              aria-label="Menu" onClick={() => setOpen((o) => !o)}>
        <span /><span /><span />
      </button>

      {/* Clicking any link closes the mobile menu */}
      <nav id="site-nav-links" className={`site-nav-links ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
        {LINKS.map(([to, label]) => (
          <NavLink key={to} to={to} className="site-nav-link">{label}</NavLink>
        ))}
        <span className="site-nav-divider" aria-hidden="true" />
        {user?.role === 'admin' && <NavLink to="/admin" className="site-nav-link site-nav-quiet">admin</NavLink>}
        <button type="button" className="site-nav-link site-nav-quiet" onClick={onLogout}
                title={user ? `Logged in as ${user.email}` : undefined}>
          log out
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
