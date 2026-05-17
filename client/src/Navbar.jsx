import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

function Navbar() {
  return (
    // Added 'm-0' to force the bottom margin gap to zero
    <nav className="navbar navbar-expand-lg navbar-dark py-5 custom-navbar cute-navbar-font m-0 fixed-top">
      <div className="container-fluid align-items-center">
        
        {/* Title Link */}
        <Link className="navbar-brand cute-brand-font ms-4" to="/">
          Vittoria's Personal Website
        </Link>
        
        {/* Mobile Toggle Button */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto me-5 align-items-center">
            <li className="nav-item px-4">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item px-4">
              <Link className="nav-link" to="/coding-projects">Coding Projects</Link>
            </li>
            <li className="nav-item px-4">
              <Link className="nav-link" to="/study-abroad-newsletter">Study Abroad Newsletter</Link>
            </li>
            <li className="nav-item px-4">
              <Link className="nav-link" to="/opinions-in-the-world">Opinions on the World</Link>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;