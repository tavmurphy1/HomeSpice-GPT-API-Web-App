import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth }                          from '../firebaseConfig';
import '../styles/CreateAccountPage.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';

function CreateAccountPage() {
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage]               = useState('');
  const navigate = useNavigate();

  async function handleCreateAccount() {
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      //creates the user with email and pass
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      console.log('[Create Account] Signed up user:', user.uid);

      const token = await user.getIdToken();
      console.log('[CreateAccount] Token fetched.');

      // fetch and stringify the user, and user id
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uid: user.uid, email: user.email })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('[Create Account] Profile save failed:', res.status, errText);
        setMessage('Account created, but failed to save profile.');
      } else {
        console.log('[Create Account] Profile saved successfully');
      }

      // NAVIGATE TO PANTRY PAGE after account creation, user is logged in
      navigate('/pantry');

    } catch (err: any) {
      console.error('[Create Account] Signup error:', err);
      setMessage(err.message || 'An error occurred during signup.');
    }
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
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="input-container">
          <input
            className="create-account-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div className="input-container">
          <input
            className="create-account-input"
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          className="create-account-button"
          onClick={handleCreateAccount}
          disabled={!email || !password || !confirmPassword}
        >
          Create Account
        </button>

        {message && <p className="create-account-message">{message}</p>}
      </div>
    </div>
  );
}

export default CreateAccountPage;
