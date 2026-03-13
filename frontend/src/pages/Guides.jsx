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

  return (
    <div className="directory-page">
      <div className="directory-header">
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
                      <img src={'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'} alt={guide.user?.name || 'Guide'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   </div>
                 <span style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--color-primary)' }}><Award size={28} /></span>
              </div>
              <div className="dir-content" style={{ alignItems: 'center' }}>
                 <h3 className="dir-title" style={{ fontSize: '1.5rem' }}>{guide.user?.name || 'Local Guide'}</h3>
                 <p className="dir-subtitle" style={{ justifyContent: 'center' }}><MapPin size={16} /> {guide.location}</p>
                 
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
                    {/* Message button — only for non-guides who are logged in */}
                    {isLoggedIn && role !== 'Guide' && (
                      <button className="btn-outline" style={{ flex: 1, padding: '0.6rem', display: 'flex', justifyContent: 'center' }}>
                        <MessageCircle size={18} />
                      </button>
                    )}

                    {/* Book Guide — role-based */}
                    {!isLoggedIn ? (
                      <Link to="/login" className="btn-primary" style={{ flex: 3, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                        <Lock size={14} /> Login to Book
                      </Link>
                    ) : canBookGuide ? (
                      <button className="btn-primary" style={{ flex: 3, justifyContent: 'center' }}>Book Guide</button>
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
    </div>
  );
};

export default Guides;
