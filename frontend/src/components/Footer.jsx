import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          
          <div className="footer-section">
            <h3 className="footer-logo">Jharkhand<span className="logo-accent">Tourism</span></h3>
            <p className="footer-desc">
              Discover the uncharted beauty, rich tribal heritage, and thrilling adventures in the heart of eastern India.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon"><Facebook size={20} /></a>
              <a href="#" className="social-icon"><Twitter size={20} /></a>
              <a href="#" className="social-icon"><Instagram size={20} /></a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/destinations">Explore Destinations</Link></li>
              <li><Link to="/experiences">Cultural Experiences</Link></li>
              <li><Link to="/accommodations">Find a Stay</Link></li>
              <li><Link to="/guides">Local Guides</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><Link to="/">Help Center</Link></li>
              <li><Link to="/">Safety Guidelines</Link></li>
              <li><Link to="/">Contact Us</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact Info</h4>
            <ul className="footer-contact">
              <li><MapPin size={18} className="contact-icon" /> Directorate of Tourism, Ranchi, Jharkhand</li>
              <li><Phone size={18} className="contact-icon" /> +91 1800-123-4567</li>
              <li><Mail size={18} className="contact-icon" /> info@jharkhandtourism.gov.in</li>
            </ul>
          </div>

        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Smart Tourism Platform Jharkhand. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
