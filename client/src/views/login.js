import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('Logging in...');

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setMsg(`Welcome, ${data.user.username}!`);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('fullName', data.user.username);
        navigate('/products');
      } else {
        setMsg(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setMsg('Server error. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="brand-pill">Bidme</div>

        <h1>
          Bid smarter.
          <br />
          Win faster.
        </h1>

        <p>
          Sign in to explore live auctions, place bids, track products,
          and manage your marketplace activity securely.
        </p>

        <div className="hero-stats">
          <div>
            <strong>Live</strong>
            <span>Auctions</span>
          </div>
          <div>
            <strong>Secure</strong>
            <span>Bidding</span>
          </div>
          <div>
            <strong>Fast</strong>
            <span>Checkout</span>
          </div>
        </div>
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card-header">
            <h2>Welcome back</h2>
            <p>Login to continue to your account</p>
          </div>

          <div className="form-group">
            <label>Email or username</label>
            <input
              type="text"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-links-row">
            <Link to="/forgot-password">Forgot password?</Link>
            <Link to="/admin-login">Admin login</Link>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          {msg && <p className="login-message">{msg}</p>}

          <div className="signup-row">
            <span>Don’t have an account?</span>
            <Link to="/signup">Create one</Link>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Login;