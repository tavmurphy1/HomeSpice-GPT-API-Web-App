import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
// Backend URL for API requests set in .env file
const API_BASE = import.meta.env.VITE_API_URL;

// This component allows users to log in with their email and password
// and navigate to the recipes page upon successful login.
function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('');
  const navigate = useNavigate();

  // Handles login button click event
  // Sends a POST request to the backend API with the user's email and password
  // If the login is successful, navigate to the recipes page
  // If there's an error, display the error message
  // If the server returns a message, display it
  // If the server returns an unexpected response, display a generic error message 
  function handleLogin() {
    fetch(`${API_BASE}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          navigate('/recipes');
        } else {
          setMessage(data.message || 'Login failed.');
        }
      })
      .catch(err => {
        console.error('Error logging in:', err);
        setMessage('An error occurred.');
      });
  }

  
  // Navigates to the create account page
  function goToCreateAccount() {
    navigate('/create-account');
  }

  function goToAboutPage() {
    navigate('/about');
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">
          Welcome to <br />
          HomeSlice!
        </h1>
        <p className="login-tagline">
          Discover new recipes.
          <br />
          Cook with what you have.
          <br />
          Make every meal unforgettable.
        </p>

        <div className="input-container">
          <input
            className="login-input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="input-container">
          <input
            className="login-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>

        <p className="or-text">Or</p>

        <button className="signup-button" onClick={goToCreateAccount}>
          Get Started — it's Free!
        </button>

        <button className="about-button" onClick={goToAboutPage}>
          About Me
        </button>

        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}

export default LoginPage;