import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Tent, Camera, Map } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <img 
          src="https://images.unsplash.com/photo-1543085698-500e2bcaa8e3?auto=format&fit=crop&q=80" 
          alt="Hundru Falls Jharkhand" 
          className="hero-image"
        />
        <div className="hero-content">
          <span className="badge hero-badge">Welcome to the Land of Forests</span>
          <h1 className="hero-title">Discover the Unseen Beauty of <span className="hero-accent">Jharkhand</span></h1>
          <p className="hero-subtitle">
            Explore majestic waterfalls, vibrant tribal culture, diverse wildlife, and untouched nature. Your smart travel companion.
          </p>
          <div className="hero-actions">
            <Link to="/destinations" className="btn-primary">
              <Compass size={20} /> Start Exploring
            </Link>
            <Link to="/experiences" className="btn-outline hero-btn-outline">
              Cultural Experiences
            </Link>
          </div>
        </div>
      </section>

      {/* Features / Quick Links */}
      <section className="features-section page">
        <h2 className="section-title">Everything You Need</h2>
        <p className="section-subtitle">A centralized tourism ecosystem for a seamless travel experience.</p>
        
        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper"><Map size={32} className="feature-icon" /></div>
            <h3>Destinations</h3>
            <p>Find waterfalls, wildlife sanctuaries, and historical sites mapped just for you.</p>
            <Link to="/destinations" className="feature-link">Explore Places &rarr;</Link>
          </div>
          
          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper"><Tent size={32} className="feature-icon" /></div>
            <h3>Stay & Transport</h3>
            <p>Book local eco-lodges, rural homestays, and find the best routes to travel.</p>
            <div className="feature-links-row">
              <Link to="/accommodations" className="feature-link">Stays &rarr;</Link>
              <Link to="/transport" className="feature-link">Transport &rarr;</Link>
            </div>
          </div>
          
          <div className="feature-card glass-card">
            <div className="feature-icon-wrapper"><Camera size={32} className="feature-icon" /></div>
            <h3>Local Guides</h3>
            <p>Connect with verified locals to experience the authentic culture and hidden gems.</p>
            <Link to="/guides" className="feature-link">Find Guides &rarr;</Link>
          </div>
        </div>
      </section>

      {/* High-level category showcase */}
      <section className="categories-section">
        <div className="page">
          <h2 className="section-title">Experience the Diversity</h2>
          
          <div className="categories-grid">
            <div className="category-card">
              <img src="https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80" alt="Nature" />
              <div className="category-content">
                <h3>Nature & Waterfalls</h3>
                <Link to="/destinations">View All</Link>
              </div>
            </div>
            
            <div className="category-card">
              <img src="https://images.unsplash.com/photo-1544604555-52fb9cc7d14e?auto=format&fit=crop&q=80" alt="Culture" />
              <div className="category-content">
                <h3>Tribal Heritage</h3>
                <Link to="/experiences">Discover</Link>
              </div>
            </div>

            <div className="category-card">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80" alt="Adventure" />
              <div className="category-content">
                <h3>Wildlife & Adventure</h3>
                <Link to="/destinations">Explore</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
