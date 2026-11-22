import { Link } from 'react-router-dom';
import CardImage from './CardImage';
import PageStatus from './PageStatus';
import { NewsletterGarden } from './garden/scenes';
import { usePage } from './site/context';
import useApi from './useApi';
import './Newsletter.css';

function Newsletter() {
  const page = usePage('newsletter');
  const { data: issues, loading, error } = useApi('/api/posts');

  return (
    <div className="page newsletter-page">
      <NewsletterGarden />
      <div className="page-inner">
        {page.title && <h1 className="page-title">{page.title}</h1>}
        {page.intro && <p className="page-intro">{page.intro}</p>}

        {loading && <PageStatus loading />}
        {error && <PageStatus message="Couldn't load the newsletter right now. Please try again later." />}

        {issues && (
          <ol className="newsletter-grid">
            {issues.map((issue, i) => (
              <li key={issue.id}>
                <Link to={`/study-abroad-newsletter/${issue.slug}`} className="newsletter-card">
                  <CardImage image={issue.previewImage} index={i} alt="" />
                  <div className="newsletter-card-body">
                    {issue.date && <div className="eyebrow">{issue.date}</div>}
                    <h2 className="newsletter-card-title">{issue.title}</h2>
                    {issue.previewText && <p className="newsletter-card-preview">{issue.previewText}</p>}
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export default Newsletter;
