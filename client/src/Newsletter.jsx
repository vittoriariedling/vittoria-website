import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { allNewsletters } from './assets/newsletters/index.js';
import './Newsletter.css';

const REGIONS = ['All', 'Madrid', 'Europe', 'Africa', 'Asia', 'US'];

// Get the first image section from a newsletter for the preview card
const getPreviewImage = (sections) => {
  const img = sections.find(s => s.type === 'image' || s.type === 'photo-left' || s.type === 'photo-right');
  if (!img) return null;
  return img.src || (img.photos && img.photos[0]?.src) || null;
};

// Get a short preview blurb from the first paragraph
const getPreviewText = (sections, previewDescription) => {
  if (previewDescription) return previewDescription;
  const para = sections.find(s => s.type === 'paragraph');
  if (!para) return '';
  return para.content.length > 180 ? para.content.slice(0, 180) + '…' : para.content;
};

function Newsletter() {
  const [activeRegion, setActiveRegion] = useState('All');

  const filtered = activeRegion === 'All'
    ? allNewsletters
    : allNewsletters.filter(n => n.region === activeRegion);

  return (
    <div className="newsletter-container">
      <Container>

        {/* ── Page Header ─────────────────────────────────────── */}
        <div className="newsletter-page-header text-center mb-5">
          <h1 className="newsletter-page-title">Study Abroad Newsletter</h1>
          <p className="newsletter-page-description">
            Every week while studying in Madrid, I wrote a newsletter for my friends and family back home —
            capturing the food, the late nights, the classes, and all the beautiful chaos of living in Spain.
            I also traveled to 20+ cities across Europe, Africa, and Asia! 🥐
          </p>
        </div>

        {/* ── Filter Pills ─────────────────────────────────────── */}
        <div className="newsletter-filter-row mb-5">
        {REGIONS.map(region => (
            <button
            key={region}
            className={`filter-pill ${activeRegion === region ? 'active' : ''}`}
            onClick={() => setActiveRegion(region)}
            >
            {region === 'All'     ? 'All Issues' :
                region === 'Madrid'  ? 'Madrid' :
                region === 'Europe'  ? 'Europe' :
                region === 'Africa'  ? 'Africa' :
                region === 'Asia'    ? 'Asia' :
                region === 'US'      ? 'US' : region}
            </button>
        ))}
        </div>


        {/* ── Preview Cards Grid ───────────────────────────────── */}
        <Row className="g-4 justify-content-center">
          {filtered.map((issue) => {
            const previewImg = getPreviewImage(issue.sections);
            const previewText = getPreviewText(issue.sections, issue.previewDescription);

            return (
              <Col key={issue.id} xs={12} sm={6} lg={4}>
                <Link
                  to={`/study-abroad-newsletter/${issue.slug}`}
                  className="newsletter-preview-card-link"
                >
                  <article className="newsletter-preview-card">

                    {/* Photo */}
                    {previewImg && (
                      <div className="preview-card-img-wrapper">
                        <img src={previewImg} alt={issue.title} className="preview-card-img" />
                        <div className="preview-card-img-overlay" />
                        {issue.region && (
                            <span className="preview-region-badge">{issue.region}</span>
                        )}
                      </div>
                    )}

                    <div className="preview-card-body">
                      <span className="preview-card-date">{issue.date}</span>
                      <h3 className="preview-card-title">{issue.title}</h3>
                      <p className="preview-card-text">{previewText}</p>
                      <span className="preview-read-more">Read more →</span>
                    </div>

                  </article>
                </Link>
              </Col>
            );
          })}
        </Row>

        {filtered.length === 0 && (
            <div className="newsletter-empty">
                <p>No issues yet for this region - check back soon!</p>
            </div>
        )}


      </Container>

      <p className="newsletter-count">
        {filtered.length} {filtered.length === 1 ? 'issue' : 'issues'}
        {activeRegion !== 'All' ? ` from ${activeRegion}` : ' total'}
      </p>
    </div>
  );
}

export default Newsletter;
