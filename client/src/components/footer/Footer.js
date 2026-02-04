import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import logo from "../../assets/Share.png";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Logo and Description */}
        <div className="footer-section">
          <div className="footer-logo">
            <img src={logo} alt="App Logo" className="footer-logo-img" />
            <h3>Share</h3>
          </div>
          <p className="footer-description">
            Connect, share, and discover amazing content with our community.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/createpost">Create Post</Link>
            </li>
            <li>
              <Link to="/aboutus">About Us</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h4>Support</h4>
          <ul className="footer-links">
            <li>
              <a href="#help">Help Center</a>
            </li>
            <li>
              <a href="#privacy">Privacy Policy</a>
            </li>
            <li>
              <a href="#terms">Terms of Service</a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4>Connect With Us</h4>
          <ul className="footer-links">
            <li>
              <a href="mailto:contact@share.com">contact@share.com</a>
            </li>
            <li>
              <a href="#facebook">Facebook</a>
            </li>
            <li>
              <a href="#twitter">Twitter</a>
            </li>
            <li>
              <a href="#instagram">Instagram</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Share. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;