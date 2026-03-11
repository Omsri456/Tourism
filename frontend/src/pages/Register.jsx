import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Briefcase, ArrowRight, AlertCircle } from 'lucide-react';
import { fetchApi } from '../api';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Tourist'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (data.token) {
        // Log them in immediately after registering
        login(data.token, {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role
        });
        navigate('/');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <User size={30} />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join us to explore the best of Jharkhand</p>
        </div>

        {error && (
          <div className="error-message">
             <AlertCircle size={20} />
             <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div className="form-input-wrapper">
              <User className="input-icon" size={20} />
              <input
                className="form-input"
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="form-input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                className="form-input"
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="form-input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                className="form-input"
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="role">Account Type</label>
            <div className="form-input-wrapper">
              <Briefcase className="input-icon" size={20} />
              <select
                className="form-select"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Tourist">Tourist</option>
                <option value="Guide">Local Guide</option>
                <option value="Organizer">Experience Organizer</option>
              </select>
            </div>
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
