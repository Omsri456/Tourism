import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MapPin, LogIn, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Transport', path: '/transport' },
    { name: 'Stay', path: '/accommodations' },
    { name: 'Experiences', path: '/experiences' },
    { name: 'Guides', path: '/guides' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <MapPin className="logo-icon" />
          <span>Jharkhand<span className="logo-accent">Tourism</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-menu">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons Desktop */}
        <div className="nav-auth-desktop">
          {user ? (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="auth-btn logout-btn">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="auth-btn login-btn">
               <LogIn size={18} />
               <span>Login</span>
            </Link>
          )}
        </div>

         {/* Mobile Menu Button */}
         <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {/* Auth Buttons Mobile */}
          <div className="mobile-auth-divider"></div>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`mobile-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="mobile-nav-link mobile-logout-btn">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="mobile-nav-link mobile-login-btn" onClick={() => setIsOpen(false)}>
               <LogIn size={18} />
               <span>Login / Register</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
