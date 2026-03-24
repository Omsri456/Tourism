import React, { useState, useEffect } from 'react';
import { UserCheck, MapPin, Star, MessageCircle, Navigation, Award, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../api';
import usePermissions from '../hooks/usePermissions';
import './Directory.css';

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { canBookGuide, isLoggedIn, role } = usePermissions();

  // Booking Modal State
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [bookingData, setBookingData] = useState({ date: '', numberOfPeople: 1, specialRequests: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const getGuides = async () => {
      try {
        const data = await fetchApi('/guides');
        setGuides(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    getGuides();
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingMessage({ type: '', text: '' });
    try {
      await fetchApi('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          bookingType: 'guide',
          guideId: selectedGuide._id,
          date: bookingData.date,
          numberOfPeople: bookingData.numberOfPeople,
          specialRequests: bookingData.specialRequests
        })
      });
      setBookingMessage({ type: 'success', text: 'Booking request sent successfully!' });
      setTimeout(() => setSelectedGuide(null), 2000);
    } catch (err) {
      setBookingMessage({ type: 'error', text: err.message || 'Booking failed' });
    } finally {
      setBookingLoading(false);
    }
  };

  const getValidImage = (img, fallback) => {
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
      <div className="directory-header" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80')" }}>
        <div className="directory-icon-bg"><UserCheck size={40} /></div>
        <h1 className="section-title">Verified Local Guides</h1>
        <p className="section-subtitle">Connect with trustworthy and experienced locals who know the land best.</p>
      </div>

      <div className="directory-grid">
         {loading ? (
           <div className="text-center py-5 w-100">
             <h3 style={{ textAlign: 'center' }}>Loading guides...</h3>
           </div>
         ) : error ? (
           <div className="text-center py-5 error w-100">
             <h3 style={{ textAlign: 'center' }}>Error loading data: {error}</h3>
           </div>
         ) : guides.length > 0 ? (
           guides.map(guide => (
             <div key={guide._id} className="dir-card glass-card" style={{ textAlign: 'center' }}>
                <div style={{ padding: '2rem 2rem 0', position: 'relative' }}>
                   <div style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto', overflow: 'hidden', border: '4px solid var(--color-surface)', boxShadow: 'var(--shadow-md)' }}>
                      <img src={getValidImage(guide.profileImage, 'https://placehold.co/400x400/2c5e3b/ffffff?text=Guide')} alt={guide.user?.name || 'Guide'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   </div>
                 <span style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--color-primary)' }}><Award size={28} /></span>
              </div>
              <div className="dir-content" style={{ alignItems: 'center' }}>
                 <h3 className="dir-title" style={{ fontSize: '1.5rem' }}>{guide.user?.name || 'Local Guide'}</h3>
                 <p className="dir-subtitle" style={{ justifyContent: 'center', marginBottom: '0.5rem' }}><MapPin size={16} /> {guide.location}</p>
                 <p style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                    &#8377;{guide.pricePerDay || 500} <span style={{fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 400}}>/ day</span>
                 </p>
                 
                 <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
                    <div style={{ textAlign: 'center' }}>
                       <div style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{guide.yearsOfExperience} Yrs</div>
                       <small style={{ color: 'var(--color-text-muted)' }}>Experience</small>
                    </div>
                    <div style={{ width: '1px', background: '#eee' }}></div>
                    <div style={{ textAlign: 'center' }}>
                       <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', color: 'var(--color-text-main)' }}>
                          <Star size={14} fill="var(--color-accent)" color="var(--color-accent)"/> {guide.rating}
                       </div>
                       <small style={{ color: 'var(--color-text-muted)' }}>{guide.reviews} Reviews</small>
                    </div>
                 </div>
                 
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    {guide.areasOfExpertise && guide.areasOfExpertise.length > 0 ? guide.areasOfExpertise.map((exp, idx) => (
                      <span key={idx} className="badge" style={{ backgroundColor: 'rgba(212, 111, 77, 0.1)', color: 'var(--color-secondary)' }}><Navigation size={12} style={{marginRight: '3px', display: 'inline-block'}}/>{exp}</span>
                    )) : <span className="badge" style={{ backgroundColor: 'rgba(212, 111, 77, 0.1)', color: 'var(--color-secondary)' }}>General Guide</span>}
                 </div>
                 
                 {/* Role-based action buttons */}
                 <div style={{ width: '100%', display: 'flex', gap: '1rem', marginTop: 'auto' }}>

                    {/* Book Guide — role-based */}
                    {!isLoggedIn ? (
                      <Link to="/login" className="btn-primary" style={{ flex: 3, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                        <Lock size={14} /> Login to Book
                      </Link>
                    ) : canBookGuide ? (
                      <button className="btn-primary" style={{ flex: 3, justifyContent: 'center' }} onClick={() => { setSelectedGuide(guide); setBookingMessage({ type: '', text: '' }); }}>Book Guide</button>
                    ) : role === 'Guide' ? (
                      <div style={{ flex: 1, padding: '0.6rem', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.82rem', color: '#64748b', textAlign: 'center' }}>
                        🧭 You are a guide
                      </div>
                    ) : null}
                 </div>
              </div>
           </div>
          ))
         ) : (
           <div className="text-center py-5 w-100">
             <h3 style={{ textAlign: 'center' }}>No guides found</h3>
           </div>
         )}
      </div>

      {/* Booking Modal */}
      {selectedGuide && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-card" style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Book Guide: {selectedGuide.user?.name}</h3>
              <button 
                onClick={() => setSelectedGuide(null)}
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
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Date</label>
                <input 
                  type="date" 
                  required 
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingData.date}
                  onChange={e => setBookingData({...bookingData, date: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Number of People</label>
                <input 
                  type="number" 
                  required 
                  min="1"
                  value={bookingData.numberOfPeople}
                  onChange={e => setBookingData({...bookingData, numberOfPeople: parseInt(e.target.value)})}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Special Requests (Optional)</label>
                <textarea 
                  rows="3"
                  value={bookingData.specialRequests}
                  onChange={e => setBookingData({...bookingData, specialRequests: e.target.value})}
                  placeholder="Need a specific focus? Meeting point preferences?"
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>Total Estimated Price:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  &#8377;{(selectedGuide.pricePerDay || 500) * (bookingData.numberOfPeople || 1)}
                </span>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={bookingLoading || bookingMessage.type === 'success'}
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '0.5rem' }}
              >
                {bookingLoading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guides;
