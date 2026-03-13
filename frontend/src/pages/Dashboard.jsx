import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchApi } from '../api';
import './Dashboard.css';
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
  X
} from 'lucide-react';

const EMPTY_EXPERIENCE = {
    title: '', description: '', location: '',
    category: 'Cultural Music', duration: '', price: '',
};

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('profile');

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
        location: '', bio: '', yearsOfExperience: '',
        languagesSpoken: '', areasOfExpertise: '', phone: '', email: '',
    });
    const [guideMessage, setGuideMessage] = useState({ type: '', text: '' });
    const [guideLoading, setGuideLoading] = useState(false);

    // ── Fetch my experiences when tab opens ─────────────────────────────
    useEffect(() => {
        if (activeTab === 'my-experiences' && (user?.role === 'Organizer' || user?.role === 'Admin')) {
            fetchMyExperiences();
        }
    }, [activeTab]);

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

    const handleGuideSubmit = async (e) => {
        e.preventDefault();
        setGuideLoading(true);
        setGuideMessage({ type: '', text: '' });
        try {
            const payload = {
                ...guideData,
                languagesSpoken: guideData.languagesSpoken.split(',').map(s => s.trim()).filter(Boolean),
                areasOfExpertise: guideData.areasOfExpertise.split(',').map(s => s.trim()).filter(Boolean),
                yearsOfExperience: Number(guideData.yearsOfExperience),
                contactInfo: { phone: guideData.phone, email: guideData.email },
            };
            delete payload.phone;
            delete payload.email;

            await fetchApi('/guides/profile', { method: 'POST', body: JSON.stringify(payload) });
            setGuideMessage({ type: 'success', text: 'Guide profile saved successfully!' });
        } catch (err) {
            setGuideMessage({ type: 'error', text: err.message || 'Failed to save profile' });
        } finally {
            setGuideLoading(false);
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
                    {(user.role === 'Organizer' || user.role === 'Admin') && (<>
                        <button className={activeTab === 'my-experiences' ? 'active' : ''} onClick={() => setActiveTab('my-experiences')}>
                            <List /> My Experiences
                        </button>
                        <button className={activeTab === 'create-experience' ? 'active' : ''} onClick={() => setActiveTab('create-experience')}>
                            <PlusCircle /> Create Experience
                        </button>
                    </>)}
                    {(user.role === 'Guide' || user.role === 'Admin') && (
                        <button className={activeTab === 'guide-profile' ? 'active' : ''} onClick={() => setActiveTab('guide-profile')}>
                            <Activity /> Guide Profile
                        </button>
                    )}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="dashboard-main">

                {/* ── Profile Tab ── */}
                {activeTab === 'profile' && (
                    <div className="dashboard-card">
                        <h2>Profile Overview</h2>
                        <p className="subtitle">Your account details and role information</p>
                        <div className="profile-info-grid">
                            <div className="info-item"><label><User /> Full Name</label><p>{user.name}</p></div>
                            <div className="info-item"><label><Mail /> Email Address</label><p>{user.email}</p></div>
                            <div className="info-item"><label><CheckCircle /> Account Status</label><p>Verified</p></div>
                            <div className="info-item"><label><MapPin /> Member Since</label><p>{new Date().getFullYear()}</p></div>
                        </div>
                    </div>
                )}

                {/* ── My Experiences Tab ── */}
                {activeTab === 'my-experiences' && (
                    <div className="dashboard-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <h2>My Experiences</h2>
                                <p className="subtitle">Manage all the experiences you've created</p>
                            </div>
                            <button className="submit-btn" style={{ width: 'auto', padding: '0.6rem 1.2rem' }} onClick={() => setActiveTab('create-experience')}>
                                <PlusCircle size={16} /> Add New
                            </button>
                        </div>

                        {myExpLoading && <p style={{ textAlign: 'center' }}>Loading...</p>}
                        {myExpError && <div className="status-message error"><AlertCircle /> {myExpError}</div>}

                        {!myExpLoading && myExperiences.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                <List size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                                <h3>No experiences yet</h3>
                                <p>Click "Add New" to create your first experience</p>
                            </div>
                        )}

                        <div className="my-exp-list">
                            {myExperiences.map(exp => (
                                <div key={exp._id} className="my-exp-card">
                                    {exp.images?.[0] && (
                                        <img src={`http://localhost:5000${exp.images[0]}`} alt={exp.title} className="my-exp-img" />
                                    )}
                                    <div className="my-exp-info">
                                        <h4>{exp.title}</h4>
                                        <p><MapPin size={13} /> {exp.location} &nbsp;|&nbsp; <Calendar size={13} /> {exp.duration} &nbsp;|&nbsp; <DollarSign size={13} /> ₹{exp.price}</p>
                                        <span className="exp-category-badge">{exp.category}</span>
                                    </div>
                                    <div className="my-exp-actions">
                                        <button className="btn-edit" onClick={() => startEdit(exp)}><Edit2 size={15} /> Edit</button>
                                        <button className="btn-delete" onClick={() => setDeleteConfirmId(exp._id)}><Trash2 size={15} /> Delete</button>
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
                                    <div className="input-with-icon"><Calendar />
                                        <input type="number" name="yearsOfExperience" value={guideData.yearsOfExperience} onChange={handleGuideChange} placeholder="e.g. 5" required min="0" />
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

                            <button type="submit" className="submit-btn" disabled={guideLoading}>
                                {guideLoading ? 'Saving...' : 'Save Guide Profile'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
