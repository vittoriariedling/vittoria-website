import { Link, useParams } from 'react-router-dom';
import PageStatus from './PageStatus';
import { EntryGardenLeft, EntryGardenRight } from './garden/scenes';
import useApi from './useApi';
// Shares the paper-sheet article layout with the newsletter entry page.
import './NewsletterDetail.css';
import './ProjectDetail.css';

function ProjectDetail() {
  const { id } = useParams();
  const { data: project, loading, error, notFound } = useApi(`/api/projects/${encodeURIComponent(id)}`);

  return (
    <div className="page entry-page">
      <EntryGardenLeft />
      <EntryGardenRight />

      <article className="entry-sheet paper">
        <Link to="/coding-projects" className="text-link entry-back">← All projects</Link>

        {loading && <PageStatus loading />}
        {error && <PageStatus message="Couldn't load this project right now. Please try again later." />}
        {notFound && (
          <div className="entry-missing">
            <h1 className="entry-title">Project not found</h1>
            <p>That project doesn&apos;t exist (or the link is wrong).</p>
          </div>
        )}

        {project && (
          <>
            {project.tag && <span className="tag-pill">{project.tag}</span>}
            <h1 className="entry-title project-title">{project.title}</h1>
            {project.description && <p className="entry-lede">{project.description}</p>}

            {(project.year || project.team || project.tech.length > 0) && (
              <dl className="project-meta">
                {project.year && <div><dt className="eyebrow">Year</dt><dd>{project.year}</dd></div>}
                {project.team && <div><dt className="eyebrow">Team</dt><dd>{project.team}</dd></div>}
                {project.tech.length > 0 && (
                  <div><dt className="eyebrow">Built with</dt><dd>{project.tech.join(', ')}</dd></div>
                )}
              </dl>
            )}

            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn project-github">
                View on GitHub ↗
              </a>
            )}

            {project.image && (
              <figure className="entry-figure entry-figure-wide entry-lead">
                <div className="photo-frame">
                  <img src={project.image.src} width={project.image.width} height={project.image.height}
                       alt={project.title} />
                </div>
              </figure>
            )}

            {project.longDescription && (
              <div className="entry-body">
                {project.longDescription.split('\n').map((para, i) => (para.trim() ? <p key={i}>{para}</p> : null))}
              </div>
            )}

            {project.extraImages.length > 0 && (
              <div className="entry-trio">
                {project.extraImages.map((img, i) => (
                  <figure key={i} className="entry-figure">
                    <div className="photo-frame">
                      <img src={img.src} width={img.width} height={img.height} alt={img.caption || ''} loading="lazy" />
                    </div>
                    {img.caption && <figcaption>{img.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            )}

            <footer className="entry-footer">
              <span className="entry-thanks">Thanks for looking.</span>
              <Link to="/coding-projects" className="text-link">All projects ↗</Link>
            </footer>
          </>
        )}
      </article>
    </div>
  );
}

export default ProjectDetail;
