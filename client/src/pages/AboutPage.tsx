import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AboutPage.css';

export default function AboutPage() {
  const navigate = useNavigate();

  // Navigate to the home (login) page
  function goToHome() {
    navigate('/login');
  }

  return (
    <div className="about-page">
      {/* Top-right home button */}
      <div className="home-button-container">
        <button className="home-button-top-right" onClick={goToHome}>
          Home
        </button>
      </div>

      {/* ── Mission Statement ── */}
      <section className="about-section mission">
        <h2>Our Mission</h2>
        <p>
          RANDOM RANDOM RANDOM
        </p>
      </section>

      {/* ── Authors ── */}
      <section className="about-section authors">
        <h2>Meet the Authors</h2>
        <div className="author-list">
          <div className="author-card">
            <div className="author-image" />
            <h3>Alan Chan</h3>
            <p>Developer</p>
          </div>
          <div className="author-card">
            <div className="author-image" />
            <h3>Masseeh Safi</h3>
            <p>Developer</p>
          </div>
          <div className="author-card">
            <div className="author-image" />
            <h3>Tavner Murphy</h3>
            <p>Developer</p>
          </div>
        </div>
      </section>
    </div>
  );
}