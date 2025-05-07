import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateAccountPage.css';


const API_BASE = 'http://127.0.0.1:8080';
console.log('API_BASE is:', API_BASE);

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

    fetch(`${API_BASE}/user/create-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        console.log('Create Account response status:', res.status);
        const text = await res.text();
        console.log('Create Account raw body:', text);
        if (!res.ok) throw new Error(`Server returned ${res.status}: ${text}`);
        return JSON.parse(text);
      })
      .then((data) => {
        if (data.id) {
          navigate('/login');
        } else {
          setMessage('Failed to create account.');
        }
      })
      .catch((err) => {
        console.error('Error creating account:', err);
        setMessage('An error occurred while creating the account.');
      });
  }

  function goToHome() {
    navigate('/login');
  }

  return (
    <div className="create-account-container">
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