import React from 'react';
import { guides } from '../data/mockData';
import { UserCheck, MapPin, Star, MessageCircle, Navigation, Award } from 'lucide-react';
import './Directory.css';

const Guides = () => {
  return (
    <div className="directory-page">
      <div className="directory-header">
        <div className="directory-icon-bg"><UserCheck size={40} /></div>
        <h1 className="section-title">Verified Local Guides</h1>
        <p className="section-subtitle">Connect with trustworthy and experienced locals who know the land best.</p>
      </div>

      <div className="directory-grid">
         {guides.map(guide => (
           <div key={guide.id} className="dir-card glass-card" style={{ textAlign: 'center' }}>
              <div style={{ padding: '2rem 2rem 0', position: 'relative' }}>
                 <div style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto', overflow: 'hidden', border: '4px solid var(--color-surface)', boxShadow: 'var(--shadow-md)' }}>
                    <img src={guide.image} alt={guide.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 </div>
                 <span style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--color-primary)' }}><Award size={28} /></span>
              </div>
              <div className="dir-content" style={{ alignItems: 'center' }}>
                 <h3 className="dir-title" style={{ fontSize: '1.5rem' }}>{guide.name}</h3>
                 <p className="dir-subtitle" style={{ justifyContent: 'center' }}><MapPin size={16} /> {guide.location}</p>
                 
                 <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
                    <div style={{ textAlign: 'center' }}>
                       <div style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{guide.experience}</div>
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
                    {guide.expertise.map((exp, idx) => (
                      <span key={idx} className="badge" style={{ backgroundColor: 'rgba(212, 111, 77, 0.1)', color: 'var(--color-secondary)' }}><Navigation size={12} style={{marginRight: '3px', display: 'inline-block'}}/>{exp}</span>
                    ))}
                 </div>
                 
                 <div style={{ width: '100%', display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                    <button className="btn-outline" style={{ flex: 1, padding: '0.6rem', display: 'flex', justifyContent: 'center' }}><MessageCircle size={18} /></button>
                    <button className="btn-primary" style={{ flex: 3, justifyContent: 'center' }}>Book Guide</button>
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default Guides;
