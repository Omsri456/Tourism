import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter, Star } from 'lucide-react';
import { fetchApi } from '../api';
import ReviewModal from '../components/ReviewModal';
import './Directory.css';
import './Destinations.css';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Review Modal State
  const [reviewModalData, setReviewModalData] = useState({ isOpen: false, targetId: null, targetName: '' });

  const categories = ['All', 'Waterfalls', 'Wildlife and national parks', 'Nature tourism', 'Tribal culture and heritage', 'Adventure tourism'];

  useEffect(() => {
    const getDestinations = async () => {
      try {
        const data = await fetchApi('/destinations');
        setDestinations(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getDestinations();
  }, []);

  const filteredDestinations = destinations.filter(dest => {
    const matchesCategory = filter === 'All' || dest.category === filter;
    const matchesSearch = dest.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getValidImage = (imgArray, fallback) => {
    if (!imgArray || !imgArray.length) return fallback;
    let img = imgArray[0];
    if (!img || img === 'null' || img === 'undefined' || img.trim() === '') return fallback;
    
    img = img.replace(/\\/g, '/');
    if (!img.startsWith('/') && img.startsWith('uploads')) {
      img = `/${img}`;
    }
    
    if (img.startsWith('/uploads')) return `http://localhost:5000${img}`;
    return img;
  };

  return (
    <div className="destinations-page">
      <div className="directory-header" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506461883276-594a12b11dc3?auto=format&fit=crop&q=80')" }}>
        <h1 className="section-title">Explore Jharkhand</h1>
        <p className="section-subtitle">Discover hidden gems, cascading waterfalls, and dense forests.</p>
        
        <div className="search-filter-bar">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search destinations..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="category-filters">
          <Filter size={18} className="filter-icon" />
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="destinations-grid page">
        {loading ? (
          <div className="loading">Loading destinations...</div>
        ) : error ? (
          <div className="error">Error: {error}</div>
        ) : filteredDestinations.length > 0 ? (
          filteredDestinations.map(dest => (
            <div key={dest._id} className="dest-card glass-card">
              <div className="dest-image-wrapper">
                <img src={getValidImage(dest.images, 'https://placehold.co/600x400/2c5e3b/ffffff?text=Destination')} alt={dest.name} className="dest-image" />
                <span className="dest-badge">{dest.category}</span>
              </div>
              <div className="dest-info">
                <h3>{dest.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p className="dest-location" style={{ margin: 0 }}><MapPin size={16} /> {dest.locationCoords?.lat ? 'Jharkhand' : 'Jharkhand'}</p>
                  <span 
                     style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.9rem', color: '#fbbf24', fontWeight: 'bold' }}
                     onClick={() => setReviewModalData({ isOpen: true, targetId: dest._id, targetName: dest.name })}
                  >
                     <Star size={14} fill="currentColor"/> {dest.rating || 0} ({dest.reviewsCount || 0})
                  </span>
                </div>
                <p className="dest-desc-short" style={{ marginTop: '0.5rem' }}>{dest.description.substring(0, 80)}...</p>
                <Link to={`/destinations/${dest._id}`} className="btn-primary mt-auto">View Details</Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <h3>No destinations found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal 
        isOpen={reviewModalData.isOpen} 
        onClose={() => setReviewModalData({ isOpen: false, targetId: null, targetName: '' })} 
        targetId={reviewModalData.targetId} 
        targetModel="Destination" 
        targetName={reviewModalData.targetName} 
      />
    </div>
  );
};

export default Destinations;
