import { useSearchParams } from 'react-router-dom';
import { AdminGardenLeft, AdminGardenRight } from '../garden/scenes';
import BooksPanel from './BooksPanel';
import InvitesPanel from './InvitesPanel';
import NewslettersPanel from './NewslettersPanel';
import PlacesPanel from './PlacesPanel';
import ProjectsPanel from './ProjectsPanel';
import UsersPanel from './UsersPanel';
import './Admin.css';

const TABS = [
  ['newsletters', 'Newsletters', NewslettersPanel],
  ['places', 'Map', PlacesPanel],
  ['books', 'Books', BooksPanel],
  ['projects', 'Projects', ProjectsPanel],
  ['people', 'People', () => (<><InvitesPanel /><UsersPanel /></>)],
];

export default function AdminPage() {
  const [params, setParams] = useSearchParams();
  const current = TABS.find(([id]) => id === params.get('tab')) ?? TABS[0];
  const Panel = current[2];

  return (
    <div className="admin-page">
      <AdminGardenLeft />
      <AdminGardenRight />
      <div className="admin-container">
        <header className="admin-header">
          <h1 className="admin-title">admin.</h1>
          <p className="admin-intro">Write and publish newsletters, update the map, books and projects, and manage who has access.</p>
        </header>
        <nav className="admin-tabs" aria-label="Admin sections">
          {TABS.map(([id, label]) => (
            <button key={id} type="button" className={`admin-tab ${id === current[0] ? 'active' : ''}`}
                    aria-current={id === current[0] ? 'page' : undefined}
                    onClick={() => setParams(id === TABS[0][0] ? {} : { tab: id })}>
              {label}
            </button>
          ))}
        </nav>
        <Panel key={current[0]} />
      </div>
    </div>
  );
}
