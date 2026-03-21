import React, { useState, useEffect } from 'react';
import { Home, MapPin, Star, Coffee } from 'lucide-react';
import { fetchApi } from '../api';
import ReviewModal from '../components/ReviewModal';
import './Directory.css';

const Accommodations = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('All');

  // Review Modal State
  const [reviewModalData, setReviewModalData] = useState({ isOpen: false, targetId: null, targetName: '' });

  const types = ['All', 'Hotel', 'Eco-lodge', 'Tribal Homestay'];

  useEffect(() => {
    const getAccommodations = async () => {
      try {
        const data = await fetchApi('/accommodations');
        setAccommodations(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    getAccommodations();
  }, []);

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
         {loading ? (
           <div className="text-center py-5 w-100">
             <h3 style={{ textAlign: 'center' }}>Loading accommodations...</h3>
           </div>
         ) : error ? (
           <div className="text-center py-5 error w-100">
             <h3 style={{ textAlign: 'center' }}>Error loading data: {error}</h3>
           </div>
         ) : filteredStays.length > 0 ? (
           filteredStays.map(stay => (
             <div key={stay._id} className="dir-card glass-card">
              <div className="dir-image-wrapper">
                 <img src={stay.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'} alt={stay.name} className="dir-image" />
                 <span className="dir-type-badge">{stay.type}</span>
              </div>
              <div className="dir-content">
                 <h3 className="dir-title">{stay.name}</h3>
                 <p className="dir-subtitle"><MapPin size={16} /> {stay.location}</p>
                 <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
                   Nearby Attraction: {stay.nearbyDestinations && stay.nearbyDestinations.length > 0 ? stay.nearbyDestinations[0].name || stay.nearbyDestinations[0] : 'N/A'}
                 </p>
                 
                 <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {stay.facilities.map((fac, idx) => (
                      <span key={idx} className="badge"><Coffee size={12} style={{marginRight: '3px', display: 'inline-block'}}/>{fac}</span>
                    ))}
                 </div>
                 
                 <div className="dir-price">
                    <span>₹{stay.pricePerNight} / night</span>
                    <span 
                       className="rating-badge" 
                       style={{ cursor: 'pointer' }}
                       onClick={() => setReviewModalData({ isOpen: true, targetId: stay._id, targetName: stay.name })}
                    >
                       <Star size={14} fill="currentColor"/> {stay.rating || 0} ({stay.reviewsCount || 0})
                    </span>
                 </div>
                 <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>Book Now</button>
              </div>
           </div>
         ))) : (
           <div className="text-center py-5 w-100">
             <h3 style={{ textAlign: 'center' }}>No accommodations found</h3>
           </div>
         )}
      </div>

      {/* Review Modal */}
      <ReviewModal 
        isOpen={reviewModalData.isOpen} 
        onClose={() => setReviewModalData({ isOpen: false, targetId: null, targetName: '' })} 
        targetId={reviewModalData.targetId} 
        targetModel="Accommodation" 
        targetName={reviewModalData.targetName} 
      />
    </div>
  );
};

export default Accommodations;
