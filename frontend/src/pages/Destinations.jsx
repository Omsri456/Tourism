import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { destinations } from '../data/mockData';
import { Search, MapPin, Filter } from 'lucide-react';
import './Destinations.css';

const Destinations = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Waterfalls', 'Wildlife', 'Nature', 'Cultural Heritage', 'Adventure'];

  const filteredDestinations = destinations.filter(dest => {
    const matchesCategory = filter === 'All' || dest.category === filter;
    const matchesSearch = dest.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="destinations-page">
      <div className="page-header">
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
        {filteredDestinations.length > 0 ? (
          filteredDestinations.map(dest => (
            <div key={dest.id} className="dest-card glass-card">
              <div className="dest-image-wrapper">
                <img src={dest.image} alt={dest.name} className="dest-image" />
                <span className="dest-badge">{dest.category}</span>
              </div>
              <div className="dest-info">
                <h3>{dest.name}</h3>
                <p className="dest-location"><MapPin size={16} /> {dest.location}</p>
                <p className="dest-desc-short">{dest.description.substring(0, 80)}...</p>
                <Link to={`/destinations/${dest.id}`} className="btn-primary mt-auto">View Details</Link>
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
