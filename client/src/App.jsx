import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Home from "./Home.jsx";
import CodingProjects from "./CodingProjects.jsx";
import ProjectDetail from "./ProjectDetail.jsx";
import Newsletter from "./Newsletter.jsx";
import NewsletterDetail from "./NewsletterDetail.jsx";
import Books from "./Books.jsx";
import "./Home.css";
import TravelMap from './TravelMap';

function App() {
    return (
        <Router>
            <Navbar />
            <div className="main-content-wrapper">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/coding-projects" element={<CodingProjects />} />
                    <Route path="/coding-projects/:id" element={<ProjectDetail />} />
                    <Route path="/study-abroad-newsletter" element={<Newsletter />} />
                    <Route path="/study-abroad-newsletter/:slug" element={<NewsletterDetail />} />
                    <Route path="/what-im-reading" element={<Books />} />
                    <Route path="/around-the-world" element={<TravelMap />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App;
