import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateAccountPage.css';

const API_BASE = import.meta.env.VITE_API_URL;

function CreateAccountPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  function handleCreateAccount() {
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    fetch(`${API_BASE}/create-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
          navigate('/login');
        } else if (data.error) {
          setMessage(data.error);
        } else {
          setMessage('Unexpected response from server.');
        }
      })
      .catch((err) => {
        console.error('Error creating account:', err);
        setMessage('An error occurred while creating the account.');
      });
  }

  // Navigate to the home (login) page
  function goToHome() {
    navigate('/login');
  }

  return (
    <div className="create-account-container">
      {/* Top-right home button */}
      <div className="home-button-container">
        <button className="home-button-top-right" onClick={goToHome}>
          Home
        </button>
      </div>

      <div className="create-account-box">
        <h1 className="create-account-title">Create Your Account</h1>
        <p className="create-account-tagline">
          Enter your information into the fields below, then click "Create Account" to start discovering delicious recipes!
        </p>

        <div className="input-container">
          <input
            className="create-account-input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-container">
          <input
            className="create-account-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="input-container">
          <input
            className="create-account-input"
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button className="create-account-button" onClick={handleCreateAccount}>
          Create Account
        </button>

        {message && <p className="create-account-message">{message}</p>}
      </div>
    </div>
  );
}

export default CreateAccountPage;