import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import {
  Home,
  Destinations,
  DestinationDetail,
  Transport,
  Accommodations,
  Experiences,
  Guides,
  Login,
  Register,
  Dashboard
} from './pages';

import './App.css';
import './index.css'; // Ensure index.css is loaded for global styles

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetail />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/accommodations" element={<Accommodations />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
