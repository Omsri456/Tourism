import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchApi } from '../api';
import './Dashboard.css';
import { useLocation, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  MapPin, 
  PlusCircle, 
  Calendar, 
  DollarSign, 
  Image, 
  CheckCircle, 
  AlertCircle,
  Activity,
  List,
  Edit2,
  Trash2,
  X,
  BookOpen,
  ClipboardList,
  Clock,
  Users
} from 'lucide-react';

const EMPTY_EXPERIENCE = {
    title: '', description: '', location: '',
    category: 'Cultural Music', duration: '', price: '',
};

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'profile');

    // ── Create Experience State ────────────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [experienceData, setExperienceData] = useState(EMPTY_EXPERIENCE);
    const [experienceImage, setExperienceImage] = useState(null);

    // ── My Experiences State ───────────────────────────────────────────────
    const [myExperiences, setMyExperiences] = useState([]);
    const [myExpLoading, setMyExpLoading] = useState(false);
    const [myExpError, setMyExpError] = useState('');
    const [editingExp, setEditingExp] = useState(null);   // null = not editing; obj = editing
    const [editImage, setEditImage] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editMessage, setEditMessage] = useState({ type: '', text: '' });
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // ── Guide Profile State ────────────────────────────────────────────────
    const [guideData, setGuideData] = useState({
        location: '', bio: '', yearsOfExperience: '', pricePerDay: '',
        languagesSpoken: '', areasOfExpertise: '', phone: '', email: '',
    });
    const [guideMessage, setGuideMessage] = useState({ type: '', text: '' });
    const [guideLoading, setGuideLoading] = useState(false);
    const [guideImage, setGuideImage] = useState(null);

    // ── My Bookings State (Tourist) ────────────────────────────────────────
    const [myBookings, setMyBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);

    // ── Organizer Reservations State ───────────────────────────────────────
    const [reservations, setReservations] = useState([]);
    const [reservationsLoading, setReservationsLoading] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState(null);

    // ── Admin State ────────────────────────────────────────────────────────
    const [adminStats, setAdminStats] = useState(null);
    const [adminStatsLoading, setAdminStatsLoading] = useState(false);
    
    const [accData, setAccData] = useState({ name: '', details: '', type: 'Hotel', location: '', pricePerNight: '', rating: '5' });
    const [accImage, setAccImage] = useState(null);
    const [accLoading, setAccLoading] = useState(false);
    const [accMessage, setAccMessage] = useState({ type: '', text: '' });

    const [transData, setTransData] = useState({ type: 'Bus', route: '', price: '', schedule: '', description: '' });
    const [transLoading, setTransLoading] = useState(false);
    const [transMessage, setTransMessage] = useState({ type: '', text: '' });

    // ── Fetch data when tab changes ─────────────────────────────────────
    useEffect(() => {
        if (activeTab === 'my-experiences' && (user?.role === 'Organizer' || user?.role === 'Admin')) {
            fetchMyExperiences();
        }
        if (activeTab === 'my-bookings') {
            fetchMyBookings();
        }
        if (activeTab === 'reservations' && (user?.role === 'Organizer' || user?.role === 'Guide' || user?.role === 'Admin')) {
            fetchReservations();
        }
        if (activeTab === 'admin-overview' && user?.role === 'Admin') {
            fetchAdminStats();
        }
        if ((activeTab === 'guide-profile' || activeTab === 'profile') && (user?.role === 'Guide' || user?.role === 'Admin')) {
            fetchGuideProfile();
        }
    }, [activeTab]);

    const fetchAdminStats = async () => {
        setAdminStatsLoading(true);
        try {
            const data = await fetchApi('/admin/stats');
            setAdminStats(data);
        } catch (err) {
            console.error(err);
        } finally {
            setAdminStatsLoading(false);
        }
    };

    const fetchMyBookings = async () => {
        setBookingsLoading(true);
        try {
            const data = await fetchApi('/bookings/my');
            setMyBookings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setBookingsLoading(false);
        }
    };

    const fetchReservations = async () => {
        setReservationsLoading(true);
        try {
            const endpoint = user?.role === 'Guide' ? '/bookings/guide' : '/bookings/organizer';
            const data = await fetchApi(endpoint);
            setReservations(data);
        } catch (err) {
            console.error(err);
        } finally {
            setReservationsLoading(false);
        }
    };

    const fetchGuideProfile = async () => {
        setGuideLoading(true);
        try {
            const data = await fetchApi('/guides/profile');
            if (data) {
                setGuideData({
                    location: data.location || '',
                    bio: data.bio || '',
                    yearsOfExperience: data.yearsOfExperience || '',
                    pricePerDay: data.pricePerDay || '',
                    languagesSpoken: data.languagesSpoken ? data.languagesSpoken.join(', ') : '',
                    areasOfExpertise: data.areasOfExpertise ? data.areasOfExpertise.join(', ') : '',
                    phone: data.contactInfo?.phone || '',
                    email: data.contactInfo?.email || '',
                    profileImage: data.profileImage || '',
                });
            }
        } catch (err) {
            console.error('Failed to load profile', err);
        } finally {
            setGuideLoading(false);
        }
    };

    const handleReservationStatus = async (bookingId, status) => {
        setStatusUpdating(bookingId);
        try {
            await fetchApi(`/bookings/${bookingId}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status }),
            });
            setReservations(prev => prev.map(b => b._id === bookingId ? { ...b, status } : b));
        } catch (err) {
            alert('Failed to update status: ' + err.message);
        } finally {
            setStatusUpdating(null);
        }
    };

    const fetchMyExperiences = async () => {
        setMyExpLoading(true);
        setMyExpError('');
        try {
            const data = await fetchApi('/experiences/mine');
            setMyExperiences(data);
        } catch (err) {
            setMyExpError(err.message || 'Failed to load experiences');
        } finally {
            setMyExpLoading(false);
        }
    };

    // ── Create Experience ────────────────────────────────────────────────
    const handleExperienceChange = (e) =>
        setExperienceData({ ...experienceData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => setExperienceImage(e.target.files[0]);

    const handleExperienceSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const formData = new FormData();
            Object.keys(experienceData).forEach(key => formData.append(key, experienceData[key]));
            if (experienceImage) formData.append('image', experienceImage);

            await fetchApi('/experiences', { method: 'POST', body: formData });
            setMessage({ type: 'success', text: 'Experience published successfully!' });
            setExperienceData(EMPTY_EXPERIENCE);
            setExperienceImage(null);
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to create experience' });
        } finally {
            setLoading(false);
        }
    };

    // ── Edit Experience ───────────────────────────────────────────────────
    const startEdit = (exp) => {
        setEditingExp({ ...exp });
        setEditImage(null);
        setEditMessage({ type: '', text: '' });
    };

    const handleEditChange = (e) =>
        setEditingExp({ ...editingExp, [e.target.name]: e.target.value });

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setEditMessage({ type: '', text: '' });
        try {
            const formData = new FormData();
            ['title', 'description', 'location', 'category', 'duration', 'price'].forEach(key => {
                formData.append(key, editingExp[key]);
            });
            if (editImage) formData.append('image', editImage);

            await fetchApi(`/experiences/${editingExp._id}`, { method: 'PUT', body: formData });
            setEditMessage({ type: 'success', text: 'Experience updated!' });
            setEditingExp(null);
            fetchMyExperiences();
        } catch (err) {
            setEditMessage({ type: 'error', text: err.message || 'Update failed' });
        } finally {
            setEditLoading(false);
        }
    };

    // ── Delete Experience ─────────────────────────────────────────────────
    const handleDelete = async (id) => {
        try {
            await fetchApi(`/experiences/${id}`, { method: 'DELETE' });
            setMyExperiences(prev => prev.filter(e => e._id !== id));
            setDeleteConfirmId(null);
        } catch (err) {
            alert('Delete failed: ' + err.message);
        }
    };

    // ── Guide Profile ─────────────────────────────────────────────────────
    const handleGuideChange = (e) => setGuideData({ ...guideData, [e.target.name]: e.target.value });
    const handleGuideImageChange = (e) => setGuideImage(e.target.files[0]);

    const handleGuideSubmit = async (e) => {
        e.preventDefault();
        setGuideLoading(true);
        setGuideMessage({ type: '', text: '' });
        try {
            const formData = new FormData();
            formData.append('location', guideData.location);
            formData.append('bio', guideData.bio);
            formData.append('yearsOfExperience', Number(guideData.yearsOfExperience));
            formData.append('pricePerDay', Number(guideData.pricePerDay));
            formData.append('languagesSpoken', JSON.stringify(guideData.languagesSpoken.split(',').map(s => s.trim()).filter(Boolean)));
            formData.append('areasOfExpertise', JSON.stringify(guideData.areasOfExpertise.split(',').map(s => s.trim()).filter(Boolean)));
            formData.append('contactInfo', JSON.stringify({ phone: guideData.phone, email: guideData.email }));
            if (guideImage) formData.append('profileImage', guideImage);

            await fetchApi('/guides/profile', { method: 'POST', body: formData });
            setGuideMessage({ type: 'success', text: 'Guide profile saved successfully!' });
            setGuideImage(null);
        } catch (err) {
            setGuideMessage({ type: 'error', text: err.message || 'Failed to save profile' });
        } finally {
            setGuideLoading(false);
        }
    };

    // ── Admin Handlers ────────────────────────────────────────────────────
    const handleAccChange = (e) => setAccData({ ...accData, [e.target.name]: e.target.value });
    const handleAccImage = (e) => setAccImage(e.target.files[0]);

    const handleAccSubmit = async (e) => {
        e.preventDefault();
        setAccLoading(true);
        setAccMessage({ type: '', text: '' });
        try {
            const formData = new FormData();
            Object.keys(accData).forEach(key => formData.append(key, accData[key]));
            if (accImage) formData.append('image', accImage);

            await fetchApi('/accommodations', { method: 'POST', body: formData });
            setAccMessage({ type: 'success', text: 'Accommodation added successfully!' });
            setAccData({ name: '', details: '', type: 'Hotel', location: '', pricePerNight: '', rating: '5' });
            setAccImage(null);
        } catch (err) {
            setAccMessage({ type: 'error', text: err.message || 'Failed to add accommodation' });
        } finally {
            setAccLoading(false);
        }
    };

    const handleTransChange = (e) => setTransData({ ...transData, [e.target.name]: e.target.value });

    const handleTransSubmit = async (e) => {
        e.preventDefault();
        setTransLoading(true);
        setTransMessage({ type: '', text: '' });
        try {
            await fetchApi('/transport', { 
                method: 'POST', 
                body: JSON.stringify(transData) 
            });
            setTransMessage({ type: 'success', text: 'Transport route added successfully!' });
            setTransData({ type: 'Bus', route: '', price: '', schedule: '', description: '' });
        } catch (err) {
            setTransMessage({ type: 'error', text: err.message || 'Failed to add transport' });
        } finally {
            setTransLoading(false);
        }
    };

    if (!user) return <div className="dashboard-loading">Loading...</div>;

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-profile">
                    <div className="profile-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <h3>{user.name}</h3>
                        <span className="role-badge">{user.role}</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
                        <User /> Profile Overview
                    </button>
                    {/* Tourist + Guide: My Bookings */}
                    {(user.role === 'Tourist' || user.role === 'Guide' || user.role === 'Admin') && (
                        <button className={activeTab === 'my-bookings' ? 'active' : ''} onClick={() => setActiveTab('my-bookings')}>
                            <BookOpen /> My Bookings
                        </button>
                    )}
                    {(user.role === 'Organizer' || user.role === 'Admin') && (<>
                        <button className={activeTab === 'my-experiences' ? 'active' : ''} onClick={() => setActiveTab('my-experiences')}>
                            <List /> My Experiences
                        </button>
                        <button className={activeTab === 'create-experience' ? 'active' : ''} onClick={() => setActiveTab('create-experience')}>
                            <PlusCircle /> Create Experience
                        </button>
                    </>)}
                    {(user.role === 'Organizer' || user.role === 'Guide' || user.role === 'Admin') && (
                        <button className={activeTab === 'reservations' ? 'active' : ''} onClick={() => setActiveTab('reservations')}>
                            <ClipboardList /> {user.role === 'Guide' ? 'Client Bookings' : 'Reservations'}
                        </button>
                    )}
                    {(user.role === 'Guide' || user.role === 'Admin') && (
                        <button className={activeTab === 'guide-profile' ? 'active' : ''} onClick={() => setActiveTab('guide-profile')}>
                            <Activity /> Guide Profile
                        </button>
                    )}
                    {user.role === 'Admin' && (
                        <>
                            <div className="sidebar-divider">ADMIN CONTROLS</div>
                            <button className={activeTab === 'admin-overview' ? 'active' : ''} onClick={() => setActiveTab('admin-overview')}>
                                <Activity /> Platform Overview
                            </button>
                            <button className={activeTab === 'admin-accommodations' ? 'active' : ''} onClick={() => setActiveTab('admin-accommodations')}>
                                <MapPin /> Add Accommodation
                            </button>
                            <button className={activeTab === 'admin-transport' ? 'active' : ''} onClick={() => setActiveTab('admin-transport')}>
                                <Clock /> Add Transport
                            </button>
                        </>
                    )}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="dashboard-main">

                {/* ── Profile Tab ── */}
                {activeTab === 'profile' && (
                    <div className="dashboard-card profile-enhanced-card">
                        <div className="profile-enhanced-header">
                            <div className="profile-enhanced-avatar">
                                {guideData.profileImage ? (
                                    <img src={guideData.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                ) : (
                                    <span>{user.name?.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <div className="profile-enhanced-titles">
                                <h2>{user.name}</h2>
                                <span className="profile-enhanced-role">{user.role}</span>
                                <p className="profile-enhanced-email"><Mail size={14} /> {user.email}</p>
                            </div>
                        </div>

                        <div className="profile-info-grid" style={{ marginTop: '2rem' }}>
                            <div className="info-item">
                                <label><CheckCircle className="icon-success" /> Account Status</label>
                                <p className="status-verified">Verified Member</p>
                            </div>
                            <div className="info-item">
                                <label><MapPin className="icon-primary" /> Member Since</label>
                                <p>January {new Date().getFullYear()}</p>
                            </div>
                            <div className="info-item">
                                <label><Activity className="icon-warning" /> Permissions</label>
                                <p>Standard {user.role} Access</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── My Bookings Tab (Tourist / Guide) ── */}
                {activeTab === 'my-bookings' && (
                    <div className="dashboard-card">
                        <h2>My Bookings</h2>
                        <p className="subtitle">All your experience reservations in one place</p>

                        {bookingsLoading && <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>Loading bookings...</p>}

                        {!bookingsLoading && myBookings.length === 0 && (
                            <div className="empty-state">
                                <BookOpen size={52} />
                                <h3>No bookings yet</h3>
                                <p>Browse <Link to="/experiences" style={{ color: '#2e7d32', fontWeight: 700 }}>Cultural Experiences</Link> and reserve a spot!</p>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {myBookings.map(booking => (
                                <div key={booking._id} className="booking-list-card">
                                    <div className="booking-list-info">
                                        <h4>
                                            {booking.bookingType === 'guide' 
                                                ? `Guide Booking: ${booking.guide?.user?.name || 'Local Guide'}` 
                                                : booking.experience?.title || 'Experience'}
                                        </h4>
                                        <p>
                                            <Calendar size={13} /> {new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            &nbsp;·&nbsp;
                                            <Users size={13} /> {booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'person' : 'people'}
                                            &nbsp;·&nbsp;
                                            <DollarSign size={13} /> &#8377;{booking.totalPrice}
                                        </p>
                                        {booking.bookingType === 'experience' && booking.experience?.location && (
                                            <p><MapPin size={12} /> Location: {booking.experience.location}</p>
                                        )}
                                        {booking.bookingType === 'guide' && booking.guide && (
                                            <div style={{ marginTop: '0.4rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '6px', fontSize: '0.85rem' }}>
                                                <strong>Contact Info:</strong>
                                                {booking.guide.contactInfo?.phone && <div><User size={12}/> Phone: {booking.guide.contactInfo.phone}</div>}
                                                {booking.guide.contactInfo?.email && <div><Mail size={12}/> Email: {booking.guide.contactInfo.email}</div>}
                                            </div>
                                        )}
                                        {booking.specialRequests && (
                                            <p style={{ marginTop: '0.5rem', fontStyle: 'italic', fontSize: '0.85rem', color: '#64748b' }}>
                                                <strong>Notes:</strong> "{booking.specialRequests}"
                                            </p>
                                        )}
                                    </div>
                                    <span className={`booking-status-badge status-${booking.status}`}>
                                        {booking.status === 'pending' && '🟡 Pending'}
                                        {booking.status === 'confirmed' && '🟢 Confirmed'}
                                        {booking.status === 'cancelled' && '🔴 Cancelled'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Reservations / Client Bookings Tab (Organizer / Guide) ── */}
                {activeTab === 'reservations' && (
                    <div className="dashboard-card">
                        <h2>{user.role === 'Guide' ? 'Client Bookings' : 'Reservations'}</h2>
                        <p className="subtitle">
                            {user.role === 'Guide' 
                                ? 'Tourists who have requested your guide services' 
                                : 'Tourists who have booked your experiences'}
                        </p>

                        {reservationsLoading && <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>Loading records...</p>}

                        {!reservationsLoading && reservations.length === 0 && (
                            <div className="empty-state">
                                <ClipboardList size={52} />
                                <h3>No clients yet</h3>
                                <p>When tourists book with you, their requests will appear here.</p>
                            </div>
                        )}

                        <div className="reservations-grid">
                            {reservations.map(booking => (
                                <div key={booking._id} className="reservation-ticket">
                                    <div className="ticket-header">
                                        <div className="tourist-info">
                                            <div className="tourist-avatar">
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <h4>{booking.tourist?.name || 'Tourist'}</h4>
                                                <span className="tourist-email">{booking.tourist?.email}</span>
                                            </div>
                                        </div>
                                        <span className={`status-pill status-${booking.status}`}>
                                            {booking.status.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    <div className="ticket-body">
                                        <div className="ticket-detail-row">
                                            <span className="ticket-label"><Calendar size={14} /> Date</span>
                                            <span className="ticket-value">{new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <div className="ticket-detail-row">
                                            <span className="ticket-label"><Users size={14} /> Group Size</span>
                                            <span className="ticket-value">{booking.numberOfPeople} Guests</span>
                                        </div>
                                        <div className="ticket-detail-row">
                                            <span className="ticket-label"><DollarSign size={14} /> Total Pay</span>
                                            <span className="ticket-value highlight-price">&#8377;{booking.totalPrice}</span>
                                        </div>
                                        {booking.experience && (
                                            <div className="ticket-detail-row full-width">
                                                <span className="ticket-label"><MapPin size={14} /> Experience</span>
                                                <span className="ticket-value">{booking.experience.title}</span>
                                            </div>
                                        )}
                                        {booking.specialRequests && (
                                            <div className="ticket-notes">
                                                <strong>Note:</strong> {booking.specialRequests}
                                            </div>
                                        )}
                                    </div>

                                    {booking.status === 'pending' && (
                                        <div className="ticket-actions">
                                            <button
                                                className="btn-accept"
                                                disabled={statusUpdating === booking._id}
                                                onClick={() => handleReservationStatus(booking._id, 'confirmed')}
                                            >
                                                <CheckCircle size={16} /> Accept Booking
                                            </button>
                                            <button
                                                className="btn-decline"
                                                disabled={statusUpdating === booking._id}
                                                onClick={() => handleReservationStatus(booking._id, 'cancelled')}
                                            >
                                                <X size={16} /> Decline
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── My Experiences Tab ── */}
                {activeTab === 'my-experiences' && (
                    <div className="dashboard-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div>
                                <h2>My Experiences</h2>
                                <p className="subtitle">Manage all the experiences you've published</p>
                            </div>
                            <button className="submit-btn" style={{ width: 'auto', padding: '0.6rem 1.2rem', marginTop: 0 }} onClick={() => setActiveTab('create-experience')}>
                                <PlusCircle size={16} /> Add New
                            </button>
                        </div>

                        {/* Stats bar */}
                        {myExperiences.length > 0 && (
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                {[
                                    { label: 'Total', value: myExperiences.length, color: '#2e7d32' },
                                    { label: 'With Image', value: myExperiences.filter(e => e.images?.length > 0).length, color: '#1d4ed8' },
                                    { label: 'Categories', value: new Set(myExperiences.map(e => e.category)).size, color: '#7c3aed' },
                                ].map(stat => (
                                    <div key={stat.label} style={{ flex: 1, padding: '0.9rem 1rem', borderRadius: '12px', background: '#f8fafc', border: '1.5px solid #e2e8f0', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {myExpLoading && <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Loading your experiences...</p>}
                        {myExpError && <div className="status-message error"><AlertCircle /> {myExpError}</div>}

                        {!myExpLoading && myExperiences.length === 0 && (
                            <div className="empty-state">
                                <List size={52} />
                                <h3>No experiences yet</h3>
                                <p>Click "Add New" to publish your first cultural experience</p>
                            </div>
                        )}

                        <div className="my-exp-list">
                            {myExperiences.map(exp => (
                                <div key={exp._id} className="my-exp-card">
                                    {exp.images?.[0] ? (
                                        <img src={exp.images[0]} alt={exp.title} className="my-exp-img" />
                                    ) : (
                                        <div className="my-exp-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                                            <Image size={24} style={{ color: '#cbd5e1' }} />
                                        </div>
                                    )}
                                    <div className="my-exp-info">
                                        <h4>{exp.title}</h4>
                                        <p>
                                            <MapPin size={12} /> {exp.location}
                                            &nbsp;·&nbsp;
                                            <Calendar size={12} /> {exp.duration}
                                            &nbsp;·&nbsp;
                                            <DollarSign size={12} /> &#8377;{exp.price}
                                        </p>
                                        <span className="exp-category-badge">{exp.category}</span>
                                    </div>
                                    <div className="my-exp-actions">
                                        <button className="btn-edit" onClick={() => startEdit(exp)}><Edit2 size={14} /> Edit</button>
                                        <button className="btn-delete" onClick={() => setDeleteConfirmId(exp._id)}><Trash2 size={14} /> Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Edit Modal ── */}
                {editingExp && (
                    <div className="modal-overlay">
                        <div className="modal-card">
                            <div className="modal-header">
                                <h3><Edit2 size={18} /> Edit Experience</h3>
                                <button className="modal-close" onClick={() => setEditingExp(null)}><X size={20} /></button>
                            </div>

                            {editMessage.text && (
                                <div className={`status-message ${editMessage.type}`}>
                                    {editMessage.type === 'success' ? <CheckCircle /> : <AlertCircle />}
                                    {editMessage.text}
                                </div>
                            )}

                            <form className="dashboard-form" onSubmit={handleEditSubmit}>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input type="text" name="title" value={editingExp.title} onChange={handleEditChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea name="description" value={editingExp.description} onChange={handleEditChange} rows="3" required />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Location</label>
                                        <input type="text" name="location" value={editingExp.location} onChange={handleEditChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select name="category" value={editingExp.category} onChange={handleEditChange}>
                                            <option>Cultural Music</option>
                                            <option>Traditional Dance</option>
                                            <option>Tribal Crafts</option>
                                            <option>Local Cuisine</option>
                                            <option>Festivals</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Duration</label>
                                        <input type="text" name="duration" value={editingExp.duration} onChange={handleEditChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Price (₹)</label>
                                        <input type="number" name="price" value={editingExp.price} onChange={handleEditChange} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Replace Image (optional)</label>
                                    <div className="file-input-wrapper">
                                        <input type="file" id="edit-image" onChange={e => setEditImage(e.target.files[0])} accept="image/*" />
                                        <label htmlFor="edit-image" className="file-input-label">
                                            <Image /> {editImage ? editImage.name : 'Choose new image...'}
                                        </label>
                                    </div>
                                </div>
                                <button type="submit" className="submit-btn" disabled={editLoading}>
                                    {editLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── Delete Confirm Modal ── */}
                {deleteConfirmId && (
                    <div className="modal-overlay">
                        <div className="modal-card" style={{ maxWidth: '420px' }}>
                            <div className="modal-header">
                                <h3><Trash2 size={18} /> Confirm Delete</h3>
                                <button className="modal-close" onClick={() => setDeleteConfirmId(null)}><X size={20} /></button>
                            </div>
                            <p style={{ color: '#64748b', margin: '1rem 0 1.5rem' }}>
                                Are you sure you want to delete this experience? This action cannot be undone.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn-delete" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleDelete(deleteConfirmId)}>
                                    Yes, Delete
                                </button>
                                <button className="submit-btn" style={{ flex: 1, background: '#64748b' }} onClick={() => setDeleteConfirmId(null)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Create Experience Tab ── */}
                {activeTab === 'create-experience' && (
                    <div className="dashboard-card form-card">
                        <h2>Create New Cultural Experience</h2>
                        <p className="subtitle">Share authentic Jharkhand experiences with tourists.</p>

                        {message.text && (
                            <div className={`status-message ${message.type}`}>
                                {message.type === 'success' ? <CheckCircle /> : <AlertCircle />}
                                {message.text}
                            </div>
                        )}

                        <form className="dashboard-form" onSubmit={handleExperienceSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Experience Title</label>
                                    <div className="input-with-icon"><Activity />
                                        <input type="text" name="title" value={experienceData.title} onChange={handleExperienceChange} placeholder="e.g. Chhau Dance Workshop" required />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea name="description" value={experienceData.description} onChange={handleExperienceChange} placeholder="Describe what participants will experience..." rows="4" required />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Location</label>
                                    <div className="input-with-icon"><MapPin />
                                        <input type="text" name="location" value={experienceData.location} onChange={handleExperienceChange} placeholder="e.g. Seraikela" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select name="category" value={experienceData.category} onChange={handleExperienceChange}>
                                        <option>Cultural Music</option>
                                        <option>Traditional Dance</option>
                                        <option>Tribal Crafts</option>
                                        <option>Local Cuisine</option>
                                        <option>Festivals</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Duration</label>
                                    <div className="input-with-icon"><Calendar />
                                        <input type="text" name="duration" value={experienceData.duration} onChange={handleExperienceChange} placeholder="e.g. 3 Hours" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Price (per person)</label>
                                    <div className="input-with-icon"><DollarSign />
                                        <input type="number" name="price" value={experienceData.price} onChange={handleExperienceChange} placeholder="e.g. 500" required />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Experience Image</label>
                                <div className="file-input-wrapper">
                                    <input type="file" id="experience-image" onChange={handleImageChange} accept="image/*" />
                                    <label htmlFor="experience-image" className="file-input-label">
                                        <Image /> {experienceImage ? experienceImage.name : 'Select an image'}
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Publishing...' : 'Publish Experience'}
                            </button>
                        </form>
                    </div>
                )}

                {/* ── Guide Profile Tab ── */}
                {activeTab === 'guide-profile' && (
                    <div className="dashboard-card form-card">
                        <h2>My Guide Profile</h2>
                        <p className="subtitle">Set up your profile so tourists can discover and book you.</p>

                        {guideMessage.text && (
                            <div className={`status-message ${guideMessage.type}`}>
                                {guideMessage.type === 'success' ? <CheckCircle /> : <AlertCircle />}
                                {guideMessage.text}
                            </div>
                        )}

                        <form className="dashboard-form" onSubmit={handleGuideSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Your Location</label>
                                    <div className="input-with-icon"><MapPin />
                                        <input type="text" name="location" value={guideData.location} onChange={handleGuideChange} placeholder="e.g. Ranchi, Jharkhand" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Years of Experience</label>
                                    <div className="input-with-icon"><Activity />
                                        <input type="number" name="yearsOfExperience" value={guideData.yearsOfExperience} onChange={handleGuideChange} placeholder="e.g. 5" required min="0" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Price Per Day (₹)</label>
                                    <div className="input-with-icon"><DollarSign />
                                        <input type="number" name="pricePerDay" value={guideData.pricePerDay || ''} onChange={handleGuideChange} placeholder="e.g. 1000" required min="0" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Bio / About You</label>
                                <textarea name="bio" value={guideData.bio} onChange={handleGuideChange} placeholder="Tell tourists about yourself and your expertise..." rows="4" required />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Languages Spoken <span style={{fontWeight:400,color:'#94a3b8'}}>(comma-separated)</span></label>
                                    <div className="input-with-icon"><Activity />
                                        <input type="text" name="languagesSpoken" value={guideData.languagesSpoken} onChange={handleGuideChange} placeholder="e.g. Hindi, English, Santali" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Areas of Expertise <span style={{fontWeight:400,color:'#94a3b8'}}>(comma-separated)</span></label>
                                    <div className="input-with-icon"><MapPin />
                                        <input type="text" name="areasOfExpertise" value={guideData.areasOfExpertise} onChange={handleGuideChange} placeholder="e.g. Wildlife, Tribal Culture" required />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Contact Phone</label>
                                    <div className="input-with-icon"><User />
                                        <input type="tel" name="phone" value={guideData.phone} onChange={handleGuideChange} placeholder="+91 98765 43210" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Contact Email</label>
                                    <div className="input-with-icon"><Mail />
                                        <input type="email" name="email" value={guideData.email} onChange={handleGuideChange} placeholder="guide@example.com" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Profile Image (Optional)</label>
                                <div className="file-input-wrapper">
                                    <input type="file" id="guide-image" onChange={handleGuideImageChange} accept="image/*" />
                                    <label htmlFor="guide-image" className="file-input-label">
                                        <Image /> {guideImage ? guideImage.name : 'Select a profile picture'}
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="submit-btn" disabled={guideLoading}>
                                {guideLoading ? 'Saving...' : 'Save Guide Profile'}
                            </button>
                        </form>
                    </div>
                )}

                {/* ── Admin Overview Tab ── */}
                {activeTab === 'admin-overview' && user?.role === 'Admin' && (
                    <div className="dashboard-card admin-overview-card">
                        <div className="admin-header">
                            <h2>Platform Overview</h2>
                            <p className="subtitle">Real-time statistics and activity for the Jharkhand Tourism Platform.</p>
                        </div>
                        
                        {adminStatsLoading ? (
                            <div className="loading-state">
                                <Activity className="spin-icon" />
                                <p>Gathering real-time statistics...</p>
                            </div>
                        ) : adminStats ? (
                            <>
                                <div className="admin-stats-grid">
                                    <div className="admin-stat-card primary">
                                        <div className="stat-icon-wrapper"><Users /></div>
                                        <div className="stat-info">
                                            <span className="stat-value">{adminStats.users}</span>
                                            <span className="stat-label">Total Users</span>
                                        </div>
                                    </div>
                                    <div className="admin-stat-card success">
                                        <div className="stat-icon-wrapper"><BookOpen /></div>
                                        <div className="stat-info">
                                            <span className="stat-value">{adminStats.bookings}</span>
                                            <span className="stat-label">Total Bookings</span>
                                        </div>
                                    </div>
                                    <div className="admin-stat-card warning">
                                        <div className="stat-icon-wrapper"><DollarSign /></div>
                                        <div className="stat-info">
                                            <span className="stat-value">₹{adminStats.totalRevenue?.toLocaleString() || 0}</span>
                                            <span className="stat-label">Total Revenue</span>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="section-title">Directory Listings</h3>
                                <div className="admin-stats-grid secondary-grid">
                                    <div className="admin-stat-card neutral">
                                        <div className="stat-icon-wrapper"><Activity /></div>
                                        <div className="stat-info">
                                            <span className="stat-value">{adminStats.experiences}</span>
                                            <span className="stat-label">Experiences</span>
                                        </div>
                                    </div>
                                    <div className="admin-stat-card neutral">
                                        <div className="stat-icon-wrapper"><List /></div>
                                        <div className="stat-info">
                                            <span className="stat-value">{adminStats.accommodations}</span>
                                            <span className="stat-label">Stays</span>
                                        </div>
                                    </div>
                                    <div className="admin-stat-card neutral">
                                        <div className="stat-icon-wrapper"><Clock /></div>
                                        <div className="stat-info">
                                            <span className="stat-value">{adminStats.transports}</span>
                                            <span className="stat-label">Routes</span>
                                        </div>
                                    </div>
                                    <div className="admin-stat-card neutral">
                                        <div className="stat-icon-wrapper"><MapPin /></div>
                                        <div className="stat-info">
                                            <span className="stat-value">{adminStats.destinations}</span>
                                            <span className="stat-label">Destinations</span>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="section-title">Recent Activity</h3>
                                {adminStats.recentBookings?.length > 0 ? (
                                    <div className="recent-activity-list">
                                        {adminStats.recentBookings.map(b => (
                                            <div key={b._id} className="activity-item">
                                                <div className="activity-avatar">
                                                    <User size={16} />
                                                </div>
                                                <div className="activity-details">
                                                    <p>
                                                        <strong>{b.tourist?.name || 'Tourist'}</strong> booked 
                                                        {" "}<span className="highlight-text">{b.experience?.title || b.guide?.user?.name || 'an event'}</span>
                                                    </p>
                                                    <span className="activity-time">{new Date(b.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="activity-status">
                                                    <span className={`status-badge ${b.status}`}>{b.status}</span>
                                                    <span className="activity-price">₹{b.totalPrice}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <ClipboardList size={40} />
                                        <p>No recent bookings found.</p>
                                    </div>
                                )}
                            </>
                        ) : null}
                    </div>
                )}

                {/* ── Admin Add Accommodation Tab ── */}
                {activeTab === 'admin-accommodations' && user?.role === 'Admin' && (
                    <div className="dashboard-card">
                        <h2>Add Accommodation</h2>
                        <p className="subtitle">List a new hotel, homestay, or resort on the platform.</p>

                        {accMessage.text && (
                            <div className={`status-message ${accMessage.type}`}>
                                {accMessage.type === 'success' ? <CheckCircle /> : <AlertCircle />}
                                {accMessage.text}
                            </div>
                        )}

                        <form className="dashboard-form" onSubmit={handleAccSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Accommodation Name</label>
                                    <div className="input-with-icon"><Activity />
                                        <input type="text" name="name" value={accData.name} onChange={handleAccChange} placeholder="e.g. The Royal Residency" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Type</label>
                                    <div className="input-with-icon"><List />
                                        <select name="type" value={accData.type} onChange={handleAccChange}>
                                            <option value="Hotel">Hotel</option>
                                            <option value="Hostel">Hostel</option>
                                            <option value="Homestay">Homestay</option>
                                            <option value="Resort">Resort</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Location</label>
                                    <div className="input-with-icon"><MapPin />
                                        <input type="text" name="location" value={accData.location} onChange={handleAccChange} placeholder="e.g. Ranchi" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Price Per Night (₹)</label>
                                    <div className="input-with-icon"><DollarSign />
                                        <input type="number" name="pricePerNight" value={accData.pricePerNight} onChange={handleAccChange} placeholder="e.g. 2000" required />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Details / Description</label>
                                <textarea name="details" value={accData.details} onChange={handleAccChange} placeholder="Describe the accommodation and amenities..." rows="4" required />
                            </div>

                            <div className="form-group">
                                <label>Cover Image</label>
                                <div className="file-input-wrapper">
                                    <input type="file" id="acc-image" onChange={handleAccImage} accept="image/*" required />
                                    <label htmlFor="acc-image" className="file-input-label">
                                        <Image /> {accImage ? accImage.name : 'Choose cover image...'}
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="submit-btn" disabled={accLoading}>
                                {accLoading ? 'Publishing...' : 'Publish Accommodation'}
                            </button>
                        </form>
                    </div>
                )}

                {/* ── Admin Add Transport Tab ── */}
                {activeTab === 'admin-transport' && user?.role === 'Admin' && (
                    <div className="dashboard-card">
                        <h2>Add Transport Route</h2>
                        <p className="subtitle">Add a new bus, train, or cab service route.</p>

                        {transMessage.text && (
                            <div className={`status-message ${transMessage.type}`}>
                                {transMessage.type === 'success' ? <CheckCircle /> : <AlertCircle />}
                                {transMessage.text}
                            </div>
                        )}

                        <form className="dashboard-form" onSubmit={handleTransSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Transport Type</label>
                                    <div className="input-with-icon"><Activity />
                                        <select name="type" value={transData.type} onChange={handleTransChange}>
                                            <option value="Bus">Bus</option>
                                            <option value="Flight">Flight</option>
                                            <option value="Train">Train</option>
                                            <option value="Cab">Cab</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Route</label>
                                    <div className="input-with-icon"><MapPin />
                                        <input type="text" name="route" value={transData.route} onChange={handleTransChange} placeholder="e.g. Ranchi to Netarhat" required />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Schedule (Frequency/Time)</label>
                                    <div className="input-with-icon"><Clock />
                                        <input type="text" name="schedule" value={transData.schedule} onChange={handleTransChange} placeholder="e.g. Daily 8:00 AM" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Estimated Price (₹)</label>
                                    <div className="input-with-icon"><DollarSign />
                                        <input type="number" name="price" value={transData.price} onChange={handleTransChange} placeholder="e.g. 500" required />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description / Details</label>
                                <textarea name="description" value={transData.description} onChange={handleTransChange} placeholder="e.g. AC Volvo seater, pickup from Main Station..." rows="3" required />
                            </div>

                            <button type="submit" className="submit-btn" disabled={transLoading}>
                                {transLoading ? 'Publishing...' : 'Publish Transport'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
