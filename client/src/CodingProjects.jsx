import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import { Container } from "react-bootstrap";
import './CodingProjects.css';
import CodingProjectsData from '../../server/data/CodingProjects.json';

function CodingProjects() {
    const API_BASE_URL = 'http://localhost:5003';
    const [projects, setProjects] = useState(CodingProjectsData);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/store-content`);
                setProjects(response.data);
            } catch (error) {
                console.error("Could not load project data, using fallback structures:", error);
            }
        };
        loadProjects();
    }, []);

    return (
        <div className="projects-container">
            <Container>

                {/* ── Page Header ───────────────────────────────── */}
                <div className="projects-page-header text-center mb-5">
                    <h1 className="projects-page-title">My Coding Projects</h1>
                    <p className="projects-page-description">
                        A collection of things I've built — from machine learning models to full-stack web apps.
                        I'm passionate about the intersection of software, data, and real-world impact.
                        Click any card to learn more. 🌸
                    </p>
                </div>

                {/* ── Cards Grid ────────────────────────────────── */}
                <Row className="justify-content-center g-4">
                    {projects.map((project) => (
                        <Col key={project.id || project.title} xs={12} sm={6} lg={4}>
                            <Link
                                to={`/coding-projects/${project.id}`}
                                className="project-card-link"
                            >
                                <Card className="project-card">
                                    <Card.Img
                                        className="project-card-img"
                                        variant="top"
                                        src={
                                            project.imageURL.startsWith('http')
                                                ? project.imageURL
                                                : new URL(`./assets/coding projects/${project.imageURL}`, import.meta.url).href
                                        }
                                        alt={project.title}
                                    />
                                    <Card.Body className="project-body cute-navbar-font">
                                        <div>
                                            <Card.Title className="project-card-title cute-brand-font mb-2">
                                                {project.title}
                                            </Card.Title>
                                            <span className="project-tag">
                                                {project.tag}
                                            </span>
                                        </div>

                                        {/* Stop propagation so GitHub link still works independently */}
                                        <div
                                            className="github-link-wrapper"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <a
                                                href={project.githubURL || "https://github.com"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="github-link-btn fs-6"
                                            >
                                                GitHub →
                                            </a>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>

            </Container>
        </div>
    );
}

export default CodingProjects;