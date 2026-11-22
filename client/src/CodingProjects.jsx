import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CardImage from './CardImage';
import PageStatus from './PageStatus';
import {
  ProjectsGardenBottom, ProjectsGardenBottomRight, ProjectsGardenLeft, ProjectsGardenRight, ProjectsGardenTop,
} from './garden/scenes';
import { usePage } from './site/context';
import useApi from './useApi';
import './CodingProjects.css';

const pad2 = (n) => String(n).padStart(2, '0');

function Arrow({ dir }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d={dir === 'left' ? 'M15 9H3m5-5L3 9l5 5' : 'M3 9h12m-5-5 5 5-5 5'} fill="none" stroke="currentColor"
            strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Position of card i relative to the active card, wrapping around (…, -1, 0, 1, …). */
function offsetOf(i, active, n) {
  let d = (i - active + n) % n;
  if (d > n / 2) d -= n;
  return d;
}

function Carousel({ projects }) {
  const n = projects.length;
  const [active, setActive] = useState(0);
  const touch = useRef(null);
  const go = (delta) => setActive((a) => (a + delta + n) % n);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  };
  const onTouchStart = (e) => { touch.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touch.current = null;
  };

  return (
    <section className="carousel" aria-roledescription="carousel" aria-label="Coding projects"
             onKeyDown={onKeyDown}>
      <div className="carousel-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {projects.map((project, i) => {
          const offset = offsetOf(i, active, n);
          const visible = Math.abs(offset) <= 1;
          const isActive = offset === 0;
          return (
            <article key={project.id} className="carousel-card" data-offset={Math.max(-2, Math.min(2, offset))}
                     aria-hidden={!visible} aria-roledescription="slide"
                     aria-label={`${i + 1} of ${n}: ${project.title}`}>
              <CardImage image={project.image} index={i} />
              <div className="carousel-card-body">
                <h2 className="carousel-card-title">
                  {isActive ? (
                    // Stretched link: the whole active card opens the project.
                    <Link to={`/coding-projects/${project.id}`} className="stretched-link">{project.title}</Link>
                  ) : project.title}
                </h2>
                {project.tag && <span className="tag-pill">{project.tag}</span>}
              </div>
              {visible && !isActive && (
                <button type="button" className="carousel-card-select" tabIndex={-1}
                        aria-label={`Show ${project.title}`} onClick={() => setActive(i)} />
              )}
            </article>
          );
        })}
      </div>

      <div className="carousel-controls">
        <button type="button" className="btn-round" onClick={() => go(-1)} aria-label="Previous project">
          <Arrow dir="left" />
        </button>
        <span className="carousel-count" aria-live="polite">{pad2(active + 1)} / {pad2(n)}</span>
        <button type="button" className="btn-round filled" onClick={() => go(1)} aria-label="Next project">
          <Arrow dir="right" />
        </button>
      </div>
      <div className="carousel-dots">
        {projects.map((p, i) => (
          <button key={p.id} type="button" className={i === active ? 'active' : ''} onClick={() => setActive(i)}
                  aria-label={`Go to project ${i + 1}`} aria-current={i === active} />
        ))}
      </div>
    </section>
  );
}

function CodingProjects() {
  const page = usePage('projects');
  const { data: projects, loading, error } = useApi('/api/projects');

  return (
    <div className="page projects-page">
      <ProjectsGardenTop />
      <ProjectsGardenRight />
      <ProjectsGardenBottom />
      <ProjectsGardenLeft />
      <ProjectsGardenBottomRight />
      <div className="page-inner">
        {page.title && <h1 className="page-title">{page.title}</h1>}
        {page.intro && <p className="page-intro">{page.intro}</p>}
        {loading && <PageStatus loading />}
        {error && <PageStatus message="Couldn't load projects right now. Please try again later." />}
        {projects?.length > 0 && <Carousel projects={projects} />}
      </div>
    </div>
  );
}

export default CodingProjects;
