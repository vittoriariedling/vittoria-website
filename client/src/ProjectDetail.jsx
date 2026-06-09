import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import CodingProjectsData from '../../server/data/CodingProjects.json';
import './ProjectDetail.css';

function ProjectDetail() {
    const { id } = useParams();
    const [projects, setProjects] = useState(CodingProjectsData);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const response = await axios.get('http://localhost:5003/api/store-content');
                setProjects(response.data);
            } catch (error) {
                console.error("Using fallback project data:", error);
            }
        };
        loadProjects();
    }, []);

    const project = projects.find(p => String(p.id) === String(id));

    if (!project) {
        return (
            <div className="project-detail-container">
                <Container>
                    <Link to="/coding-projects" className="detail-back-link">← Back to Projects</Link>
                    <h2 style={{ color: '#cd496f', marginTop: 40 }}>Project not found.</h2>
                </Container>
            </div>
        );
    }

    const imgSrc = project.imageURL.startsWith('http')
        ? project.imageURL
        : new URL(`./assets/coding projects/${project.imageURL}`, import.meta.url).href;

    return (
        <div className="project-detail-container">
            <Container>

                <Link to="/coding-projects" className="pd-back-link">← All Projects</Link>

                {/* Hero */}
                <div className="pd-hero">
                    <div className="pd-hero-text">
                        <span className="pd-tag">{project.tag}</span>
                        <h1 className="pd-title">{project.title}</h1>
                        <p className="pd-description">
                            {project.description || "Full detailed documentation coming soon!"}
                        </p>

                        {/* Details grid — add more fields to your JSON to populate these */}
                        <div className="pd-meta-grid">
                            {project.year && (
                                <div className="pd-meta-item">
                                    <span className="pd-meta-label">Year</span>
                                    <span className="pd-meta-value">{project.year}</span>
                                </div>
                            )}
                            {project.tech && (
                                <div className="pd-meta-item">
                                    <span className="pd-meta-label">Technologies</span>
                                    <span className="pd-meta-value">{Array.isArray(project.tech) ? project.tech.join(', ') : project.tech}</span>
                                </div>
                            )}
                            {project.team && (
                                <div className="pd-meta-item">
                                    <span className="pd-meta-label">Team</span>
                                    <span className="pd-meta-value">{project.team}</span>
                                </div>
                            )}
                        </div>

                        <a
                            href={project.githubURL || "https://github.com"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pd-github-btn"
                        >
                            View on GitHub →
                        </a>
                    </div>

                    <div className="pd-hero-img-wrapper">
                        <img src={imgSrc} alt={project.title} className="pd-hero-img" />
                    </div>
                </div>

                {/* Extended write-up — use project.longDescription in your JSON for richer content */}
                {project.longDescription && (
                    <div className="pd-long-description">
                        {project.longDescription.split('\n').map((para, i) => (
                            para.trim() ? <p key={i}>{para}</p> : null
                        ))}
                    </div>
                )}

                {/* Extra images — add project.extraImages: [{src, caption}] to JSON */}
                {project.extraImages && project.extraImages.length > 0 && (
                    <div className="pd-extra-images">
                        {project.extraImages.map((img, i) => (
                            <figure key={i} className="pd-extra-figure">
                                <img src={img.src} alt={img.caption} />
                                {img.caption && <figcaption>{img.caption}</figcaption>}
                            </figure>
                        ))}
                    </div>
                )}

                <div className="pd-footer-nav">
                    <Link to="/coding-projects" className="pd-back-link">← Back to all projects</Link>
                </div>

            </Container>
        </div>
    );
}

export default ProjectDetail;
