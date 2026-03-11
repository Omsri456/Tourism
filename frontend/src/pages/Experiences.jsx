import React from 'react';
import { experiences } from '../data/mockData';
import { Music, MapPin, Clock, Users } from 'lucide-react';
import './Directory.css';

const Experiences = () => {
  return (
    <div className="directory-page">
      <div className="directory-header">
        <div className="directory-icon-bg"><Music size={40} /></div>
        <h1 className="section-title">Cultural Experiences</h1>
        <p className="section-subtitle">Immerse yourself in the rich tribal traditions, dances, and art of Jharkhand.</p>
      </div>

      <div className="directory-grid">
         {experiences.map(exp => (
           <div key={exp.id} className="dir-card glass-card">
              <div className="dir-image-wrapper">
                 <img src={exp.image} alt={exp.name} className="dir-image" />
              </div>
              <div className="dir-content">
                 <h3 className="dir-title">{exp.name}</h3>
                 <p className="dir-subtitle"><MapPin size={16} /> {exp.location}</p>
                 <p style={{fontSize: '0.95rem', color: '#444', marginBottom: '1.5rem', lineHeight: '1.6'}}>{exp.description}</p>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#555' }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Clock size={16}/> Duration: {exp.duration}</div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Users size={16}/> Host: {exp.organizer}</div>
                 </div>
                 
                 <div className="dir-price">
                    <span>{exp.price} / person</span>
                 </div>
                 <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Reserve Spot</button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default Experiences;
