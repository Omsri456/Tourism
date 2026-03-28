import React, { useState } from 'react';
import { generateItinerary } from '../api';
import './Itinerary.css';

const Itinerary = () => {
    const [formData, setFormData] = useState({ budget: '', days: '', interests: '' });
    const [options, setOptions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setError('');
        setOptions(null);
        
        if (!formData.budget || !formData.days || !formData.interests) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            setLoading(true);
            const res = await generateItinerary(formData);
            setOptions(res.options);
        } catch (err) {
            setError(err.response?.data?.message || 'Error generating itinerary');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="itinerary-page">
            <div className="itinerary-header">
                <h1>AI Itinerary Planner</h1>
                <p>Plan your perfect trip based on your budget, days, and interests.</p>
            </div>

            <div className="itinerary-container">
                <div className="itinerary-form-wrapper">
                    <form className="itinerary-form" onSubmit={handleGenerate}>
                        <div className="form-group">
                            <label>Budget (₹)</label>
                            <input 
                                type="number" 
                                name="budget" 
                                placeholder="e.g. 5000" 
                                value={formData.budget} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Days</label>
                            <input 
                                type="number" 
                                name="days" 
                                placeholder="e.g. 2" 
                                value={formData.days} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Interests</label>
                            <input 
                                type="text" 
                                name="interests" 
                                placeholder="e.g. Nature + Tribal Culture" 
                                value={formData.interests} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <button type="submit" disabled={loading} className="generate-btn">
                            {loading ? 'Generating...' : 'Generate Itinerary'}
                        </button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                </div>

                {options && (
                    <div className="itinerary-results">
                        <h2>Your Itinerary Options</h2>
                        <div className="options-container">
                            {options.map((opt, idx) => (
                                <div key={idx} className={`itinerary-option ${opt.isWithinBudget ? 'in-budget' : 'over-budget'}`}>
                                    <div className="option-header">
                                        <h3>{opt.title}</h3>
                                        <div className="cost-info">
                                            Est. Cost: <span>₹{opt.totalCost}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="itinerary-days">
                                        {opt.plan.map((dayPlan, dayIdx) => (
                                            <div key={dayIdx} className="day-card">
                                                <h4>Day {dayPlan.day}</h4>
                                                <ul className="activity-list">
                                                    {dayPlan.activities.map((act, i) => (
                                                        <li key={i}>{act}</li>
                                                    ))}
                                                    {dayPlan.stay && <li className="stay-item">{dayPlan.stay}</li>}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {!opt.isWithinBudget && (
                                        <p className="budget-warning">Note: This option slightly exceeds your budget.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Itinerary;
