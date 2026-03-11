import React, { useState, useContext } from 'react';
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
  Activity
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Experience Form State
    const [experienceData, setExperienceData] = useState({
        title: '',
        description: '',
        location: '',
        category: 'Cultural Music',
        duration: '',
        price: '',
    });
    const [experienceImage, setExperienceImage] = useState(null);

    // Guide Profile Form State
    const [guideData, setGuideData] = useState({
        location: '',
        bio: '',
        yearsOfExperience: '',
        languagesSpoken: '',
        areasOfExpertise: '',
        phone: '',
        email: '',
    });
    const [guideMessage, setGuideMessage] = useState({ type: '', text: '' });
    const [guideLoading, setGuideLoading] = useState(false);

    const handleGuideChange = (e) => {
        setGuideData({ ...guideData, [e.target.name]: e.target.value });
    };

    const handleGuideSubmit = async (e) => {
        e.preventDefault();
        setGuideLoading(true);
        setGuideMessage({ type: '', text: '' });
        try {
            // Convert comma-separated strings to arrays
            const payload = {
                ...guideData,
                languagesSpoken: guideData.languagesSpoken.split(',').map(s => s.trim()).filter(Boolean),
                areasOfExpertise: guideData.areasOfExpertise.split(',').map(s => s.trim()).filter(Boolean),
                yearsOfExperience: Number(guideData.yearsOfExperience),
                contactInfo: { phone: guideData.phone, email: guideData.email },
            };
            delete payload.phone;
            delete payload.email;

            await fetchApi('/guides/profile', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            setGuideMessage({ type: 'success', text: 'Guide profile saved successfully!' });
        } catch (err) {
            setGuideMessage({ type: 'error', text: err.message || 'Failed to save profile' });
        } finally {
            setGuideLoading(false);
        }
    };

    const handleExperienceChange = (e) => {
        setExperienceData({ ...experienceData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setExperienceImage(e.target.files[0]);
    };

    const handleExperienceSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const formData = new FormData();
            Object.keys(experienceData).forEach(key => {
                formData.append(key, experienceData[key]);
            });
            if (experienceImage) {
                formData.append('image', experienceImage);
            }

            await fetchApi('/experiences', {
                method: 'POST',
                body: formData
            });

            setMessage({ type: 'success', text: 'Cultural Experience created successfully!' });
            setExperienceData({
                title: '',
                description: '',
                location: '',
                category: 'Cultural Music',
                duration: '',
                price: '',
            });
            setExperienceImage(null);
            // Reset file input
            e.target.reset();
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to create experience' });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="dashboard-loading">Loading...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-sidebar">
                <div className="user-profile-summary">
                    <div className="user-avatar-large">
                        {user.name.charAt(0)}
                    </div>
                    <h3>{user.name}</h3>
                    <span className="user-role-badge">{user.role}</span>
                </div>
                
                <nav className="dashboard-nav">
                    <button 
                        className={activeTab === 'profile' ? 'active' : ''} 
                        onClick={() => setActiveTab('profile')}
                    >
                        <User /> Profile Overview
                    </button>
                    {(user.role === 'Organizer' || user.role === 'Admin') && (
                        <button 
                            className={activeTab === 'create-experience' ? 'active' : ''} 
                            onClick={() => setActiveTab('create-experience')}
                        >
                            <PlusCircle /> Create Experience
                        </button>
                    )}
                    {(user.role === 'Guide' || user.role === 'Admin') && (
                        <button 
                            className={activeTab === 'guide-profile' ? 'active' : ''} 
                            onClick={() => setActiveTab('guide-profile')}
                        >
                            <Activity /> Guide Profile
                        </button>
                    )}
                </nav>
            </div>

            <div className="dashboard-main">
                {activeTab === 'profile' && (
                    <div className="dashboard-card profile-card">
                        <h2>Welcome back, {user.name}!</h2>
                        <p className="subtitle">Manage your account and view your activities here.</p>
                        
                        <div className="profile-info-grid">
                            <div className="info-item">
                                <label><User /> Full Name</label>
                                <p>{user.name}</p>
                            </div>
                            <div className="info-item">
                                <label><Mail /> Email Address</label>
                                <p>{user.email}</p>
                            </div>
                            <div className="info-item">
                                <label><CheckCircle /> Account Status</label>
                                <p>Verified</p>
                            </div>
                            <div className="info-item">
                                <label><MapPin /> Member Since</label>
                                <p>{new Date().getFullYear()}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'create-experience' && (
                    <div className="dashboard-card form-card">
                        <h2>Create New Cultural Experience</h2>
                        <p className="subtitle">Share your local culture and traditions with tourists.</p>

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
                                    <div className="input-with-icon">
                                        <Activity />
                                        <input 
                                            type="text" 
                                            name="title" 
                                            value={experienceData.title}
                                            onChange={handleExperienceChange}
                                            placeholder="e.g. Chhau Dance Workshop"
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    name="description" 
                                    value={experienceData.description}
                                    onChange={handleExperienceChange}
                                    placeholder="Describe the experience in detail..."
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Location</label>
                                    <div className="input-with-icon">
                                        <MapPin />
                                        <input 
                                            type="text" 
                                            name="location" 
                                            value={experienceData.location}
                                            onChange={handleExperienceChange}
                                            placeholder="e.g. Seraikela"
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select 
                                        name="category" 
                                        value={experienceData.category}
                                        onChange={handleExperienceChange}
                                    >
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
                                    <div className="input-with-icon">
                                        <Calendar />
                                        <input 
                                            type="text" 
                                            name="duration" 
                                            value={experienceData.duration}
                                            onChange={handleExperienceChange}
                                            placeholder="e.g. 3 Hours"
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Price (per person)</label>
                                    <div className="input-with-icon">
                                        <DollarSign />
                                        <input 
                                            type="number" 
                                            name="price" 
                                            value={experienceData.price}
                                            onChange={handleExperienceChange}
                                            placeholder="e.g. 500"
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Experience Image</label>
                                <div className="file-input-wrapper">
                                    <input 
                                        type="file" 
                                        id="experience-image" 
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                    <label htmlFor="experience-image" className="file-input-label">
                                        <Image /> {experienceImage ? experienceImage.name : 'Select an image'}
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Creating...' : 'Publish Experience'}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'guide-profile' && (
                    <div className="dashboard-card form-card">
                        <h2>My Guide Profile</h2>
                        <p className="subtitle">Set up your profile so tourists can discover and book you as a local guide.</p>

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
                                    <div className="input-with-icon">
                                        <MapPin />
                                        <input
                                            type="text"
                                            name="location"
                                            value={guideData.location}
                                            onChange={handleGuideChange}
                                            placeholder="e.g. Ranchi, Jharkhand"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Years of Experience</label>
                                    <div className="input-with-icon">
                                        <Calendar />
                                        <input
                                            type="number"
                                            name="yearsOfExperience"
                                            value={guideData.yearsOfExperience}
                                            onChange={handleGuideChange}
                                            placeholder="e.g. 5"
                                            required
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Bio / About You</label>
                                <textarea
                                    name="bio"
                                    value={guideData.bio}
                                    onChange={handleGuideChange}
                                    placeholder="Tell tourists about yourself, your expertise, and what makes you a great guide..."
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Languages Spoken <span style={{fontWeight:400, color:'#94a3b8'}}>(comma-separated)</span></label>
                                    <div className="input-with-icon">
                                        <Activity />
                                        <input
                                            type="text"
                                            name="languagesSpoken"
                                            value={guideData.languagesSpoken}
                                            onChange={handleGuideChange}
                                            placeholder="e.g. Hindi, English, Santali"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Areas of Expertise <span style={{fontWeight:400, color:'#94a3b8'}}>(comma-separated)</span></label>
                                    <div className="input-with-icon">
                                        <MapPin />
                                        <input
                                            type="text"
                                            name="areasOfExpertise"
                                            value={guideData.areasOfExpertise}
                                            onChange={handleGuideChange}
                                            placeholder="e.g. Wildlife, Tribal Culture, Waterfalls"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Contact Phone</label>
                                    <div className="input-with-icon">
                                        <User />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={guideData.phone}
                                            onChange={handleGuideChange}
                                            placeholder="e.g. +91 98765 43210"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Contact Email</label>
                                    <div className="input-with-icon">
                                        <Mail />
                                        <input
                                            type="email"
                                            name="email"
                                            value={guideData.email}
                                            onChange={handleGuideChange}
                                            placeholder="e.g. guide@example.com"
                                        />
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
