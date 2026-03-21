import React, { useState, useEffect } from 'react';
import { Home, MapPin, Star, Coffee, Lock } from 'lucide-react';
import { fetchApi } from '../api';
import usePermissions from '../hooks/usePermissions';
import { Link } from 'react-router-dom';
import './Directory.css';

const Accommodations = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('All');

  const { isLoggedIn } = usePermissions();

  // Booking Modal State
  const [selectedStay, setSelectedStay] = useState(null);
  const [bookingData, setBookingData] = useState({ checkInDate: '', checkOutDate: '', numberOfPeople: 1, specialRequests: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });

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

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingMessage({ type: '', text: '' });

    try {
      await fetchApi('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          bookingType: 'accommodation',
          accommodationId: selectedStay._id,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          numberOfPeople: bookingData.numberOfPeople,
          specialRequests: bookingData.specialRequests
        }),
      });
      setBookingMessage({ type: 'success', text: `Booking confirmed! Check your Dashboard > My Bookings.` });
      setBookingLoading(false);
      setTimeout(() => setSelectedStay(null), 2000);
    } catch (err) {
      setBookingMessage({ type: 'error', text: err.message || 'Failed to create booking' });
      setBookingLoading(false);
    }
  };

  const checkIn = new Date(bookingData.checkInDate);
  const checkOut = new Date(bookingData.checkOutDate);
  let nights = 0;
  if (!isNaN(checkIn) && !isNaN(checkOut)) {
    nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  }
  const totalPrice = selectedStay && nights > 0 ? selectedStay.pricePerNight * nights : 0;

  return (
    <div className="directory-page">
      <div className="directory-header" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80')" }}>
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
                    <span className="rating-badge"><Star size={14} fill="currentColor"/> {stay.rating || 0}</span>
                 </div>
                 
                 <div style={{ marginTop: '1rem' }}>
                    {!isLoggedIn ? (
                      <Link to="/login" className="btn-primary" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                        <Lock size={14} /> Login to Book
                      </Link>
                    ) : (
                      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setSelectedStay(stay); setBookingMessage({ type: '', text: '' }); }}>Book Now</button>
                    )}
                 </div>
              </div>
           </div>
         ))) : (
           <div className="text-center py-5 w-100">
             <h3 style={{ textAlign: 'center' }}>No accommodations found</h3>
           </div>
         )}
      </div>

      {/* Booking Modal */}
      {selectedStay && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-card" style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Reserve: {selectedStay.name}</h3>
              <button 
                onClick={() => setSelectedStay(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}
              >
                &times;
              </button>
            </div>

            {bookingMessage.text && (
              <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', backgroundColor: bookingMessage.type === 'success' ? '#dcfce7' : '#fee2e2', color: bookingMessage.type === 'success' ? '#166534' : '#991b1b' }}>
                {bookingMessage.text}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Check-In</label>
                    <input 
                      type="date" 
                      required 
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingData.checkInDate}
                      onChange={e => setBookingData({...bookingData, checkInDate: e.target.value})}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Check-Out</label>
                    <input 
                      type="date" 
                      required 
                      min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                      value={bookingData.checkOutDate}
                      onChange={e => setBookingData({...bookingData, checkOutDate: e.target.value})}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Number of Guests</label>
                <input 
                  type="number" 
                  required 
                  min="1"
                  max="10"
                  value={bookingData.numberOfPeople}
                  onChange={e => setBookingData({...bookingData, numberOfPeople: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Special Requests (Optional)</label>
                <textarea 
                  rows="3"
                  value={bookingData.specialRequests}
                  onChange={e => setBookingData({...bookingData, specialRequests: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                  placeholder="Any room preferences, late check-in needs, etc."
                ></textarea>
              </div>

              <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Price per night</span>
                  <span>₹{selectedStay.pricePerNight}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Nights</span>
                  <span>{nights > 0 ? nights : '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--color-primary)' }}>₹{totalPrice}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={bookingLoading || nights <= 0}
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem', opacity: (bookingLoading || nights <= 0) ? 0.7 : 1 }}
              >
                {bookingLoading ? 'Processing...' : (nights <= 0 ? 'Select Valid Dates' : `Pay ₹${totalPrice}`)}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accommodations;
