import React, { useState, useEffect } from 'react';
import { Bus, Clock, IndianRupee, Map, Star } from 'lucide-react';
import { fetchApi } from '../api';
import ReviewModal from '../components/ReviewModal';
import './Directory.css';

const Transport = () => {
  const [transportRoutes, setTransportRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  // Review Modal State
  const [reviewModalData, setReviewModalData] = useState({ isOpen: false, targetId: null, targetName: '' });

  useEffect(() => {
    const getTransports = async () => {
      try {
        const data = await fetchApi('/transport');
        setTransportRoutes(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    getTransports();
  }, []);

  const filteredRoutes = transportRoutes.filter(route => {
    return (
      route.origin.toLowerCase().includes(fromLocation.toLowerCase()) &&
      route.destination.toLowerCase().includes(toLocation.toLowerCase())
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
        {loading ? (
           <div className="text-center py-5">
             <h3 style={{ textAlign: 'center' }}>Loading transport options...</h3>
           </div>
        ) : error ? (
           <div className="text-center py-5 error">
             <h3 style={{ textAlign: 'center' }}>Error loading data: {error}</h3>
           </div>
        ) : filteredRoutes.length > 0 ? (
          filteredRoutes.map(route => (
            <div key={route._id} className="transport-card glass-card">
              <div className="route-endpoint">
                <span className="badge">Origin</span>
                <h3>{route.origin}</h3>
              </div>
              
              <div className="route-connector">
                 <Bus size={24} />
                 <div className="route-line"></div>
                 <small>{route.modeOfTransport}</small>
              </div>

              <div className="route-endpoint">
                 <span className="badge">Destination</span>
                 <h3>{route.destination}</h3>
              </div>

              <div className="transport-details">
                 <div className="transport-meta">
                   <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Clock size={16} className="text-secondary" /> {route.estimatedTime}</div>
                   <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><IndianRupee size={16} className="text-secondary"/> ₹{route.approximateCost}</div>
                 </div>
                 <p className="transport-desc">{route.suggestedRoute}</p>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                   <button className="btn-outline" style={{ padding: '0.5rem 1rem'}}>View Schedule</button>
                   <span 
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 'bold' }}
                      onClick={() => setReviewModalData({ isOpen: true, targetId: route._id, targetName: `${route.origin} to ${route.destination} via ${route.modeOfTransport}` })}
                   >
                      <Star size={14} fill="currentColor"/> {route.rating || 0} ({route.reviewsCount || 0})
                   </span>
                 </div>
              </div>
            </div>
          ))
        ) : (
           <div className="text-center py-5">
             <h3 style={{ textAlign: 'center' }}>No routes found</h3>
           </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal 
        isOpen={reviewModalData.isOpen} 
        onClose={() => setReviewModalData({ isOpen: false, targetId: null, targetName: '' })} 
        targetId={reviewModalData.targetId} 
        targetModel="Transport" 
        targetName={reviewModalData.targetName} 
      />
    </div>
  );
};

export default Transport;
