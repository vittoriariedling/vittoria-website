import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { allNewsletters } from './assets/newsletters/index.js';
import './NewsletterDetail.css';

/* ═══════════════════════════════════════════════════════════
   REUSABLE SECTION COMPONENTS
   ═══════════════════════════════════════════════════════════ */

/** Three photos side by side in one horizontal row */
function ThreePhotoRow({ photos }) {
  return (
    <div className="section-three-photo-row">
      {photos.map((photo, i) => (
        <figure key={i} className="three-photo-item">
          <img src={photo.src} alt={photo.caption || ''} loading="lazy" />
          {photo.caption && <figcaption>{photo.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

/** Single photo on the LEFT, text on the RIGHT */
function PhotoLeft({ src, caption, text }) {
  return (
    <div className="section-photo-text photo-left">
      <figure className="pt-figure">
        <img src={src} alt={caption || ''} loading="lazy" />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
      <div className="pt-text">
        <p>{text}</p>
      </div>
    </div>
  );
}

/** Single photo on the RIGHT, text on the LEFT */
function PhotoRight({ src, caption, text }) {
  return (
    <div className="section-photo-text photo-right">
      <div className="pt-text">
        <p>{text}</p>
      </div>
      <figure className="pt-figure">
        <img src={src} alt={caption || ''} loading="lazy" />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION RENDERER — maps section.type → component
   ═══════════════════════════════════════════════════════════ */
function renderSection(section, index) {
  switch (section.type) {

    case 'paragraph':
      return <p key={index} className="detail-paragraph">{section.content}</p>;

    case 'callout':
      return (
        <h2 key={index} className="detail-callout">
          {section.content}
        </h2>
      );

    case 'image':
      return (
        <figure key={index} className="detail-single-image">
          <img src={section.src} alt={section.caption || ''} loading="lazy" />
          {section.caption && <figcaption>{section.caption}</figcaption>}
        </figure>
      );

    // ── reusable layouts ─────────────────────────────────────

    /** Three photos in one row.
     *  Usage in JS file: { type: "three-photos", photos: [{src, caption}, ...] } */
    case 'three-photos':
      return <ThreePhotoRow key={index} photos={section.photos} />;

    /** Photo LEFT, text RIGHT.
     *  Usage: { type: "photo-left", src, caption, text } */
    case 'photo-left':
      return <PhotoLeft key={index} src={section.src} caption={section.caption} text={section.text} />;

    /** Photo RIGHT, text LEFT.
     *  Usage: { type: "photo-right", src, caption, text } */
    case 'photo-right':
      return <PhotoRight key={index} src={section.src} caption={section.caption} text={section.text} />;

    default:
      return null;
  }
}

/* ═══════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
function NewsletterDetail() {
  const { slug } = useParams();
  const issue = allNewsletters.find(n => n.slug === slug);

  if (!issue) {
    return (
      <div className="detail-not-found">
        <Container>
          <h2>Issue not found.</h2>
          <Link to="/study-abroad-newsletter" className="detail-back-link">← Back to Newsletter</Link>
        </Container>
      </div>
    );
  }

  // Split the lead paragraph (first section if it's a paragraph) out of the
  // body so it can sit next to the cover photo in the header block.
  const sections = issue.sections || [];
  const hasLeadParagraph = sections[0]?.type === 'paragraph';
  const leadParagraph = hasLeadParagraph ? sections[0] : null;
  const bodySections = hasLeadParagraph ? sections.slice(1) : sections;

  return (
    <div className="detail-container">

      {/* ── Wide hero band (full-bleed) ───────────────────── */}
      {issue.heroImage && (
        <div className="detail-hero">
          <img src={issue.heroImage} alt={issue.heroAlt || issue.title || ''} />
        </div>
      )}

      <Container>

        {/* Back link */}
        <Link to="/study-abroad-newsletter" className="detail-back-link">
          ← All Issues
        </Link>

        {/* ── Header: cover photo beside title + intro ────── */}
        <header className={`detail-header ${issue.coverPhoto ? 'has-cover' : ''}`}>

          {issue.coverPhoto && (
            <figure className="detail-cover">
              <img src={issue.coverPhoto} alt={issue.coverAlt || issue.title || ''} />
              {issue.coverCaption && <figcaption>{issue.coverCaption}</figcaption>}
            </figure>
          )}

          <div className="detail-header-text">
            <div className="detail-meta">
              {issue.region && <span className="detail-region-badge">{issue.region}</span>}
              {issue.date && <span className="detail-date">{issue.date}</span>}
            </div>
            <h1 className="detail-title">{issue.title}</h1>
            {leadParagraph && (
              <p className="detail-lead">{leadParagraph.content}</p>
            )}
          </div>
        </header>

        {/* ── Body ─────────────────────────────────────────── */}
        <div className="detail-body">
          {bodySections.map((section, i) => renderSection(section, i))}
        </div>

        {/* Footer nav */}
        <div className="detail-footer-nav">
          <Link to="/study-abroad-newsletter" className="detail-back-link">
            ← Back to all issues
          </Link>
        </div>

      </Container>
    </div>
  );
}

export default NewsletterDetail;
