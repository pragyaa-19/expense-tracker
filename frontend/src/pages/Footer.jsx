import React from "react";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer bg-dark text-light py-4 mt-5 border-top border-secondary">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">

        {/* App Name & Tagline */}
        <div className="text-center text-md-start mb-3 mb-md-0">
          <h5 className="m-0 footer-title">
            💰 Expense Tracker
          </h5>
          <small className="text-muted">Track • Save • Grow</small>
        </div>

        {/* Navigation Links */}
        <div className="footer-links d-flex flex-wrap justify-content-center gap-3 mb-3 mb-md-0">
          <a href="/" className="footer-link text-decoration-none text-light">Home</a>
          <a href="/add-expenses" className="footer-link text-decoration-none text-light">Add Expense</a>
          <a href="/all-expenses" className="footer-link text-decoration-none text-light">All Expenses</a>
          <a href="/profile" className="footer-link text-decoration-none text-light">Profile</a>
          <a href="/about" className="footer-link text-decoration-none text-light">About</a>
        </div>

        {/* Social Icons */}
        <div className="footer-social d-flex gap-3">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-light">
            <i className="bi bi-github" style={{ fontSize: "1.2rem" }}></i>
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-light">
            <i className="bi bi-twitter" style={{ fontSize: "1.2rem" }}></i>
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-light">
            <i className="bi bi-linkedin" style={{ fontSize: "1.2rem" }}></i>
          </a>
        </div>

      </div>

      <div className="text-center mt-3 small text-muted">
        © {new Date().getFullYear()} Expense Tracker. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
