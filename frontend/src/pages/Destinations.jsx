import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter } from 'lucide-react';
import { fetchApi } from '../api';
import './Destinations.css';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

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
                <img src={dest.images?.[0] || 'https://images.unsplash.com/photo-1543085698-500e2bcaa8e3?auto=format&fit=crop&q=80'} alt={dest.name} className="dest-image" />
                <span className="dest-badge">{dest.category}</span>
              </div>
              <div className="dest-info">
                <h3>{dest.name}</h3>
                <p className="dest-location"><MapPin size={16} /> {dest.locationCoords?.lat ? 'Jharkhand' : 'Jharkhand'}</p>
                <p className="dest-desc-short">{dest.description.substring(0, 80)}...</p>
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
    </div>
  );
};

export default Destinations;
