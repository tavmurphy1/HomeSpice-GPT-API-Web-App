import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AboutPage.css';
import { useAuth } from '../context/AuthContext';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const goToHome = () => navigate('/login');

  // To check if the user is logged in
  const { user } = useAuth();
  return (
    <div className="about-container" style={{ position: 'relative' }}>
      {/* Show Home button only if not logged in */}
      {!user && (
        <div className="home-button-container">
          <button className ="home-button" onClick={goToHome}>
            Home
          </button>
        </div>
      )}

      {/* Hero section
          Includes title and description of the app
      */}

      <section className="hero-section">
        <h1>About HomeSlice</h1>
        <p>
          HomeSlice is your go-to app for turning leftover ingredients from your pantry into delicious meals. 
          Our mission is to reduce food waste and inspire creativity in the kitchen.
          With our smart recipe matching engine, you can easily find recipes that fit your available ingredients. 
          Whether you're a seasoned chef or a beginner, HomeSlice makes cooking fun and easy.
        </p>
      </section>

      {/* Application feature section
          Includes description of our app
      */}
      <section className="features-section">
        <div className="feature">
          <h2>🧠 AI 🤖</h2>
          <p>Makes use of OpenAI to take ingredients and store it for the user</p>
        </div>
        <div className="feature">
          <h2>🍽️ Personalized Recipes 🍽️ </h2>
          <p>Application generates delicious recipes based off of ingredients provided</p>
        </div>
        <div className="feature">
          <h2>📱 Easy to Use 🖥️</h2>
          <p>Create an account, login and get ready to save recipes!</p>
        </div>
      </section>

      {/* Section for developer information */}
      <section className="team-section">
        <h2>Meet the Developers</h2>
        <div className="team-grid">
          <div className="dev-card">
            <h3>Alan Chan</h3>
            <p>Aspiring Software Developer, Oregon State University Student</p>
          </div>
          <div className="dev-card">
            <h3>Masseeh Safi</h3>
            <p>Filler description</p>
          </div>
          <div className="dev-card">
            <h3>Tavner Murphy</h3>
            <p>Filler description.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
