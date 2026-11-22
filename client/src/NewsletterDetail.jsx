import { Link, useParams } from 'react-router-dom';
import PageStatus from './PageStatus';
import RichText from './RichText';
import { EntryGardenLeft, EntryGardenRight } from './garden/scenes';
import { useSite } from './site/context';
import useApi from './useApi';
import './NewsletterDetail.css';

/** A framed photo with an optional caption. */
function Figure({ image, caption, alt, className = '', lazy = true }) {
  if (!image?.src) return null;
  return (
    <figure className={`entry-figure ${className}`}>
      <div className="photo-frame">
        <img src={image.src} width={image.width} height={image.height} alt={alt ?? caption ?? ''}
             loading={lazy ? 'lazy' : 'eager'} />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/** Renders one stored section (same section types as the original newsletters). */
function Section({ s }) {
  switch (s.type) {
    case 'paragraph':
      return <RichText text={s.content} />;
    case 'callout':
      return <h2 className="entry-subhead">{s.content}</h2>;
    case 'image':
      return <Figure image={s} caption={s.caption} className="entry-figure-wide" />;
    case 'photo-left':
    case 'photo-right':
      return (
        <div className={`entry-split ${s.type}`}>
          <Figure image={s} caption={s.caption} />
          {s.text && <div className="entry-split-text"><RichText text={s.text} /></div>}
        </div>
      );
    case 'three-photos':
      return (
        <div className="entry-trio">
          {(s.photos ?? []).map((p, i) => <Figure key={i} image={p} caption={p.caption} />)}
        </div>
      );
    case 'quote':
      return (
        <blockquote className="entry-quote">
          {s.label && <span className="eyebrow">{s.label}</span>}
          <RichText text={s.content} />
        </blockquote>
      );
    default:
      return null;
  }
}

function NewsletterDetail() {
  const { slug } = useParams();
  const { site } = useSite();
  const { data: issue, loading, error, notFound } = useApi(`/api/posts/${encodeURIComponent(slug)}`);

  const lead = issue?.heroImage ?? issue?.coverPhoto;
  const leadIsCover = !issue?.heroImage && !!issue?.coverPhoto;

  return (
    <div className="page entry-page">
      <EntryGardenLeft />
      <EntryGardenRight />

      <article className="entry-sheet paper">
        <Link to="/study-abroad-newsletter" className="text-link entry-back">← All newsletters</Link>

        {loading && <PageStatus loading />}
        {error && <PageStatus message="Couldn't load this issue right now. Please try again later." />}
        {notFound && (
          <div className="entry-missing">
            <h1 className="entry-title">Issue not found</h1>
            <p>That newsletter doesn&apos;t exist (or the link is wrong).</p>
          </div>
        )}

        {issue && (
          <>
            <div className="eyebrow entry-meta">
              {[issue.date, site.author && `By ${site.author}`].filter(Boolean).join(' · ')}
            </div>
            <h1 className="entry-title">{issue.title}</h1>
            {issue.previewDescription && <p className="entry-lede">{issue.previewDescription}</p>}

            {lead && (
              <Figure image={lead} lazy={false} className="entry-figure-wide entry-lead"
                      caption={leadIsCover ? issue.coverCaption : undefined}
                      alt={leadIsCover ? issue.coverAlt : issue.heroAlt} />
            )}
            {issue.heroImage && issue.coverPhoto && (
              <Figure image={issue.coverPhoto} caption={issue.coverCaption} alt={issue.coverAlt}
                      className="entry-cover" lazy={false} />
            )}

            <div className="entry-body">
              {issue.sections.map((s, i) => <Section key={i} s={s} />)}
            </div>

            <footer className="entry-footer">
              {/* The one sign-off for every issue (from the private site content). */}
              {site.signoff && <span className="entry-thanks">{site.signoff}</span>}
              <Link to="/study-abroad-newsletter" className="text-link">All newsletters ↗</Link>
            </footer>
          </>
        )}
      </article>
    </div>
  );
}

export default NewsletterDetail;
