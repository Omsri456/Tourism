import React, { useState } from 'react';
import { accommodations } from '../data/mockData';
import { Home, MapPin, Star, Coffee } from 'lucide-react';
import './Directory.css';

const Accommodations = () => {
  const [filterType, setFilterType] = useState('All');

  const types = ['All', 'Hotel', 'Eco-lodge', 'Tribal Homestay'];

  const filteredStays = accommodations.filter(
    stay => filterType === 'All' || stay.type === filterType
  );

  return (
    <div className="directory-page">
      <div className="directory-header">
        <div className="directory-icon-bg"><Home size={40} /></div>
        <h1 className="section-title">Accommodation Finder</h1>
        <p className="section-subtitle">Discover comfortable stays, from premium hotels to rustic tribal homestays.</p>
        
        <div className="category-filters" style={{ marginTop: '2rem' }}>
          {types.map(type => (
            <button 
              key={type} 
              className={`filter-btn ${filterType === type ? 'active' : ''}`}
              onClick={() => setFilterType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="directory-grid">
         {filteredStays.map(stay => (
           <div key={stay.id} className="dir-card glass-card">
              <div className="dir-image-wrapper">
                 <img src={stay.image} alt={stay.name} className="dir-image" />
                 <span className="dir-type-badge">{stay.type}</span>
              </div>
              <div className="dir-content">
                 <h3 className="dir-title">{stay.name}</h3>
                 <p className="dir-subtitle"><MapPin size={16} /> {stay.location}</p>
                 <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>{stay.distanceToAttraction}</p>
                 
                 <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {stay.facilities.map((fac, idx) => (
                      <span key={idx} className="badge"><Coffee size={12} style={{marginRight: '3px', display: 'inline-block'}}/>{fac}</span>
                    ))}
                 </div>
                 
                 <div className="dir-price">
                    <span>{stay.price}</span>
                    <span className="rating-badge"><Star size={14} fill="currentColor"/> {stay.rating}</span>
                 </div>
                 <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>Book Now</button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default Accommodations;
