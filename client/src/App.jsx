import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from "./Home.jsx";
import CodingProjects from "./CodingProjects.jsx"
import Newsletter from "./Newsletter.jsx"
import Opinions from "./Opinions.jsx"
import Books from "./Books.jsx"
import "./Home.css"

function App() {
    return (
        <Router>
            <Navbar />
            <div className="main-content-wrapper">
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/coding-projects" element={<CodingProjects />} />
                    <Route path="/study-abroad-newsletter" element={<Newsletter />} />
                    <Route path="/opinions-in-the-world" element={<Opinions />} />
                    <Route path="/books" element={<Books />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;