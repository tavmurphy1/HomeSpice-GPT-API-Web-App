import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';  
import { auth } from '../firebaseConfig';                   
import '../styles/LoginPage.css';

function LoginPage() {
  // Controlled inputs for the user’s email and password
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  // message is used to surface errors or feedback to the user
  const [message, setMessage]   = useState('');
  const navigate = useNavigate();

  /** 
   * handleLogin:
   * 1. Attempt to sign in with Firebase Auth
   * 2. On success, get the ID token for future API calls
   * 3. Navigate to /recipes (or wherever your app goes post-login)
   * 4. On failure, display the error message from Firebase
   */
  async function handleLogin() {
    // Try Firebase email/password sign-in
    try {
    // Try firebase sign-in
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.log('[LoginPage] Logged in user:', user.uid);

        // NOTE: Token operations now handled by AuthContext.tsx
        // Grab the Firebase ID token (JWT) for server-side verification if needed
        // const idToken = await user.getIdToken();
        // console.log('ID Token:', idToken);
        // TODO: store this token (e.g. in localStorage) or attach it to future fetch calls

      // Redirect to your pantry page
      navigate('/pantry');

      } catch (err: any) {
        // Firebase returns a descriptive error message
        console.error('Firebase login error:', err);
        // Show a friendly message to the user
        setMessage(err.message || 'Login failed. Please try again.');
      }
  }
  // Navigate to the signup page
  function goToCreateAccount() {
    navigate('/create-account');
  }

  // Navigate to your About page
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

        {/* Email input */}
        <div className="input-container">
          <input
            className="login-input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        {/* Password input */}
        <div className="input-container">
          <input
            className="login-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {/* Login button triggers Firebase sign-in */}
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>

        <p className="or-text">Or</p>

        {/* Navigate to the Create Account (sign-up) page */}
        <button className="signup-button" onClick={goToCreateAccount}>
          Get Started — it's Free!
        </button>

        {/* Navigate to your About page */}
        <button className="about-button" onClick={goToAboutPage}>
          About Me
        </button>

        {/* Show any error or status message here */}
        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
