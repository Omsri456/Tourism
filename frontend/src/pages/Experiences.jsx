import React, { useState, useEffect } from 'react';
import { Music, MapPin, Clock, Users } from 'lucide-react';
import { fetchApi } from '../api';
import './Directory.css';

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  return (
    <div className="directory-page">
      <div className="directory-header">
        <div className="directory-icon-bg"><Music size={40} /></div>
        <h1 className="section-title">Cultural Experiences</h1>
        <p className="section-subtitle">Immerse yourself in the rich tribal traditions, dances, and art of Jharkhand.</p>
      </div>

      <div className="directory-grid">
         {loading ? (
           <div className="text-center py-5 w-100">
             <h3 style={{ textAlign: 'center' }}>Loading experiences...</h3>
           </div>
         ) : error ? (
           <div className="text-center py-5 error w-100">
             <h3 style={{ textAlign: 'center' }}>Error loading data: {error}</h3>
           </div>
         ) : experiences.length > 0 ? (
           experiences.map(exp => (
             <div key={exp._id} className="dir-card glass-card">
              <div className="dir-image-wrapper">
                 <img src={exp.images?.[0] || 'https://images.unsplash.com/photo-1544604555-52fb9cc7d14e?auto=format&fit=crop&q=80'} alt={exp.title} className="dir-image" />
              </div>
              <div className="dir-content">
                 <h3 className="dir-title">{exp.title}</h3>
                 <p className="dir-subtitle"><MapPin size={16} /> {exp.location}</p>
                 <p style={{fontSize: '0.95rem', color: '#444', marginBottom: '1.5rem', lineHeight: '1.6'}}>{exp.description}</p>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#555' }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Clock size={16}/> Duration: {exp.duration}</div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Users size={16}/> Host: {exp.organizerInfo?.name || exp.organizer?.name || 'Local Organizer'}</div>
                 </div>
                 
                 <div className="dir-price">
                    <span>₹{exp.price} / person</span>
                 </div>
                 <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Reserve Spot</button>
              </div>
           </div>
         ))) : (
           <div className="text-center py-5 w-100">
             <h3 style={{ textAlign: 'center' }}>No experiences found</h3>
           </div>
         )}
      </div>
    </div>
  );
};

export default Experiences;
