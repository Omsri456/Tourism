import React, { useState } from 'react';
import { transportRoutes } from '../data/mockData';
import { Bus, Clock, IndianRupee, Map } from 'lucide-react';
import './Directory.css';

const Transport = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  const filteredRoutes = transportRoutes.filter(route => {
    return (
      route.from.toLowerCase().includes(fromLocation.toLowerCase()) &&
      route.to.toLowerCase().includes(toLocation.toLowerCase())
    );
  });

  return (
    <div className="directory-page">
      <div className="directory-header">
        <div className="directory-icon-bg"><Map size={40} /></div>
        <h1 className="section-title">Local Transport Info</h1>
        <p className="section-subtitle">Find the best routes and modes of transport across Jharkhand.</p>
        
        <div className="search-filter-bar flex gap-4 max-w-2xl mx-auto" style={{ display: 'flex', gap: '1rem', maxWidth: '600px', margin: '2rem auto 0' }}>
          <input 
            type="text" 
            placeholder="From (e.g. Ranchi)" 
            className="search-input flex-1"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="To (e.g. Betla)" 
            className="search-input flex-1"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
          />
        </div>
      </div>

      <div className="transport-list">
        {filteredRoutes.length > 0 ? (
          filteredRoutes.map(route => (
            <div key={route.id} className="transport-card glass-card">
              <div className="route-endpoint">
                <span className="badge">Origin</span>
                <h3>{route.from}</h3>
              </div>
              
              <div className="route-connector">
                 <Bus size={24} />
                 <div className="route-line"></div>
                 <small>{route.mode}</small>
              </div>

              <div className="route-endpoint">
                 <span className="badge">Destination</span>
                 <h3>{route.to}</h3>
              </div>

              <div className="transport-details">
                 <div className="transport-meta">
                   <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Clock size={16} className="text-secondary" /> {route.time}</div>
                   <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><IndianRupee size={16} className="text-secondary"/> {route.cost}</div>
                 </div>
                 <p className="transport-desc">{route.details}</p>
                 <button className="btn-outline mt-3" style={{ marginTop: '1rem', padding: '0.5rem 1rem'}}>View Schedule</button>
              </div>
            </div>
          ))
        ) : (
           <div className="text-center py-5">
             <h3 style={{ textAlign: 'center' }}>No routes found</h3>
           </div>
        )}
      </div>
    </div>
  );
};

export default Transport;
