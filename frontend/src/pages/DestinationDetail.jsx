import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { destinations } from '../data/mockData';
import { MapPin, Calendar, Ticket, Compass, ArrowLeft } from 'lucide-react';
import './Destinations.css';

const DestinationDetail = () => {
  const { id } = useParams();
  const destination = destinations.find(d => d.id === id);

  if (!destination) {
    return <div className="page error-page"><h2>Destination Not Found</h2><Link to="/destinations" className="btn-primary">Back to Destinations</Link></div>;
  }

  return (
    <div className="destination-detail-page">
      <div 
        className="detail-hero" 
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${destination.image})` }}
      >
        <div className="detail-hero-content page">
          <Link to="/destinations" className="back-link"><ArrowLeft size={20} /> Back to Explorer</Link>
          <span className="badge">{destination.category}</span>
          <h1 className="detail-title">{destination.name}</h1>
          <p className="detail-location"><MapPin size={20}/> {destination.location}</p>
        </div>
      </div>

      <div className="detail-content-wrapper page">
        <div className="detail-main">
          <section className="detail-section">
            <h2>About this place</h2>
            <p className="detail-desc">{destination.description}</p>
          </section>

          <section className="detail-section">
            <h2>Nearby Attractions</h2>
            <ul className="nearby-list">
              {destination.nearby.map((place, idx) => (
                <li key={idx}><Compass size={18} className="text-secondary"/> {place}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="detail-sidebar">
          <div className="info-card glass-card">
            <h3>Key Information</h3>
            <div className="info-row">
              <Calendar className="info-icon" />
              <div>
                <h4>Best Time to Visit</h4>
                <p>{destination.bestTime}</p>
              </div>
            </div>
            <div className="info-row">
              <Ticket className="info-icon" />
              <div>
                <h4>Entry Fee</h4>
                <p>{destination.entryFee}</p>
              </div>
            </div>
            <div className="action-buttons">
              <Link to="/transport" className="btn-primary w-100">Find Transport to Here</Link>
              <Link to="/accommodations" className="btn-outline w-100">Find Stays Nearby</Link>
            </div>
          </div>
          
           <div className="map-placeholder">
              <div className="map-inner">
                 <MapPin size={40} className="text-secondary mb-2" />
                 <p>Interactive Map View</p>
                 <small>Lat: {destination.coordinates.lat}, Lng: {destination.coordinates.lng}</small>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
