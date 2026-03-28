import React, { useState, useEffect } from 'react';
import { Music, MapPin, Clock, Users, Lock, X, CheckCircle, AlertCircle, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../api';
import usePermissions from '../hooks/usePermissions';
import ReviewModal from '../components/ReviewModal';
import { Star } from 'lucide-react';
import './Directory.css';

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { canBookExperience, isLoggedIn, role } = usePermissions();

  // Booking modal state
  const [bookingExp, setBookingExp] = useState(null);
  const [bookingData, setBookingData] = useState({ date: '', numberOfPeople: 1, specialRequests: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMsg, setBookingMsg] = useState({ type: '', text: '' });

  // Review Modal State
  const [reviewModalData, setReviewModalData] = useState({ isOpen: false, targetId: null, targetName: '' });

  useEffect(() => {
    const getExperiences = async () => {
      try {
        const data = await fetchApi('/experiences');
        setExperiences(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    getExperiences();
  }, []);

  const openBookingModal = (exp) => {
    setBookingExp(exp);
    setBookingData({ date: '', numberOfPeople: 1, specialRequests: '' });
    setBookingMsg({ type: '', text: '' });
  };

  const closeModal = () => { setBookingExp(null); setBookingMsg({ type: '', text: '' }); };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingMsg({ type: '', text: '' });
    try {
      await fetchApi('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          bookingType: 'experience',
          experienceId: bookingExp._id,
          date: bookingData.date,
          numberOfPeople: bookingData.numberOfPeople,
          specialRequests: bookingData.specialRequests,
        }),
      });
      setBookingMsg({ type: 'success', text: `Booking confirmed! Check your Dashboard > My Bookings.` });
      setBookingLoading(false);
    } catch (err) {
      setBookingMsg({ type: 'error', text: err.message || 'Failed to create booking' });
      setBookingLoading(false);
    }
  };

  const totalPrice = bookingExp ? bookingExp.price * bookingData.numberOfPeople : 0;

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
    <div className="directory-page">
      <div className="directory-header" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80')" }}>
        <div className="directory-icon-bg"><Music size={40} /></div>
        <h1 className="section-title">Cultural Experiences</h1>
        <p className="section-subtitle">Immerse yourself in the rich tribal traditions, dances, and art of Jharkhand.</p>
      </div>

      <div className="directory-grid">
         {loading ? (
           <div className="text-center py-5 w-100"><h3 style={{ textAlign: 'center' }}>Loading experiences...</h3></div>
         ) : error ? (
           <div className="text-center py-5 error w-100"><h3 style={{ textAlign: 'center' }}>Error: {error}</h3></div>
         ) : experiences.length > 0 ? (
           experiences.map(exp => (
             <div key={exp._id} className="dir-card glass-card">
              <div className="dir-image-wrapper">
                 <img src={getValidImage(exp.images, 'https://placehold.co/600x400/2c5e3b/ffffff?text=Experience')} alt={exp.title} className="dir-image" />
              </div>
              <div className="dir-content">
                 <h3 className="dir-title">{exp.title}</h3>
                 <p className="dir-subtitle"><MapPin size={16} /> {exp.location}</p>
                 <p style={{fontSize: '0.95rem', color: '#444', marginBottom: '1.5rem', lineHeight: '1.6'}}>{exp.description}</p>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#555' }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Clock size={16}/> Duration: {exp.duration}</div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Users size={16}/> Host: {exp.organizerInfo?.name || exp.organizer?.name || 'Local Organizer'}</div>
                 </div>
                 <div className="dir-price" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span>&#8377;{exp.price} / person</span>
                   <span 
                      className="rating-badge" 
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.9rem', color: 'var(--color-primary)' }}
                      onClick={() => setReviewModalData({ isOpen: true, targetId: exp._id, targetName: exp.title })}
                   >
                      <Star size={14} fill="currentColor"/> {exp.rating || 0} ({exp.reviewsCount || 0})
                   </span>
                 </div>

                 {!isLoggedIn ? (
                   <Link to="/login" className="btn-secondary" style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                     <Lock size={14} /> Login to Reserve
                   </Link>
                 ) : canBookExperience ? (
                   <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => openBookingModal(exp)}>
                     Reserve Spot
                   </button>
                 ) : (
                   <div style={{ marginTop: '1rem', padding: '0.6rem', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
                     {role === 'Organizer' ? '🎭 As an organizer, you host experiences' : 'Not available for your role'}
                   </div>
                 )}
              </div>
           </div>
         ))) : (
           <div className="text-center py-5 w-100"><h3 style={{ textAlign: 'center' }}>No experiences found</h3></div>
         )}
      </div>

      {/* ── Booking Modal ── */}
      {bookingExp && (
        <div className="booking-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="booking-modal">
            <div className="booking-modal-header">
              <div>
                <h3>{bookingExp.title}</h3>
                <p><MapPin size={13} /> {bookingExp.location} &nbsp;·&nbsp; <Clock size={13} /> {bookingExp.duration}</p>
              </div>
              <button className="booking-close-btn" onClick={closeModal}><X size={20} /></button>
            </div>

            {bookingMsg.text && (
              <div className={`booking-msg ${bookingMsg.type}`}>
                {bookingMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {bookingMsg.text}
              </div>
            )}

            {!bookingMsg.type || bookingMsg.type === 'error' ? (
              <form onSubmit={handleBookingSubmit} className="booking-form">
                <div className="booking-form-group">
                  <label><CalendarDays size={14} /> Select Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingData.date}
                    onChange={e => setBookingData({ ...bookingData, date: e.target.value })}
                  />
                </div>
                <div className="booking-form-group">
                  <label><Users size={14} /> Number of People</label>
                  <div className="people-counter">
                    <button type="button" onClick={() => setBookingData(p => ({ ...p, numberOfPeople: Math.max(1, p.numberOfPeople - 1) }))}>−</button>
                    <span>{bookingData.numberOfPeople}</span>
                    <button type="button" onClick={() => setBookingData(p => ({ ...p, numberOfPeople: p.numberOfPeople + 1 }))}>+</button>
                  </div>
                </div>
                <div className="booking-form-group">
                  <label>Special Requests (optional)</label>
                  <textarea
                    rows="2"
                    placeholder="Any dietary requirements, accessibility needs..."
                    value={bookingData.specialRequests}
                    onChange={e => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                  />
                </div>
                <div className="booking-price-summary">
                  <span>&#8377;{bookingExp.price} × {bookingData.numberOfPeople} {bookingData.numberOfPeople === 1 ? 'person' : 'people'}</span>
                  <span className="booking-total">Total: &#8377;{totalPrice}</span>
                </div>
                <button type="submit" className="booking-submit-btn" disabled={bookingLoading}>
                  {bookingLoading ? 'Confirming...' : `Confirm Booking · ₹${totalPrice}`}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <Link to="/dashboard" state={{ tab: 'my-bookings' }} className="booking-submit-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  View My Bookings
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal 
        isOpen={reviewModalData.isOpen} 
        onClose={() => setReviewModalData({ isOpen: false, targetId: null, targetName: '' })} 
        targetId={reviewModalData.targetId} 
        targetModel="CulturalExperience" 
        targetName={reviewModalData.targetName} 
      />
    </div>
  );
};

export default Experiences;
