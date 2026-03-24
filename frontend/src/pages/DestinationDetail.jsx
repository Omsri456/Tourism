import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchApi } from '../api';
import { MapPin, Calendar, Ticket, Compass, ArrowLeft } from 'lucide-react';
import './Destinations.css';

const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDestinationDetail = async () => {
      try {
        const data = await fetchApi(`/destinations/${id}`);
        setDestination(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getDestinationDetail();
  }, [id]);

  if (loading) return <div className="page" style={{textAlign: 'center', padding: '100px'}}><h2>Loading destination details...</h2></div>;
  if (error || !destination) {
    return <div className="page error-page"><h2>Destination Not Found</h2><p>{error}</p><Link to="/destinations" className="btn-primary">Back to Destinations</Link></div>;
  }

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
    <div className="destination-detail-page">
      <div 
        className="detail-hero" 
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${getValidImage(destination.images, 'https://placehold.co/1200x600/2c5e3b/ffffff?text=Destination')})` }}
      >
        <div className="detail-hero-content page">
          <Link to="/destinations" className="back-link"><ArrowLeft size={20} /> Back to Explorer</Link>
          <span className="badge">{destination.category}</span>
          <h1 className="detail-title">{destination.name}</h1>
          <p className="detail-location"><MapPin size={20}/> {destination.locationCoords?.lat ? 'Jharkhand' : 'Jharkhand'}</p>
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
              {destination.nearbyAttractions && destination.nearbyAttractions.length > 0 ? (
                destination.nearbyAttractions.map((place) => (
                  <li key={place._id}><Compass size={18} className="text-secondary"/> {place.name || place}</li>
                ))
              ) : (
                <li><Compass size={18} className="text-secondary"/> No specific nearby attractions listed</li>
              )}
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
                <p>{destination.bestTimeToVisit || 'Throughout the year'}</p>
              </div>
            </div>
            <div className="info-row">
              <Ticket className="info-icon" />
              <div>
                <h4>Entry Fee</h4>
                <p>{destination.entryFee || 'Free'}</p>
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
                 <small>Lat: {destination.locationCoords?.lat || 'N/A'}, Lng: {destination.locationCoords?.lng || 'N/A'}</small>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
