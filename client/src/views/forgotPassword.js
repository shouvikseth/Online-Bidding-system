import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/login.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('Sending reset link...');
    setStatus('');

    try {
      const res = await fetch('/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMsg(data.message);
      setStatus(res.ok ? 'success' : 'error');
    } catch (err) {
      console.error(err);
      setMsg('Server error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="brand-pill">Bidme</div>

        <h1>
          Reset your
          <br />
          password.
        </h1>

        <p>
          Enter your registered email address and we’ll send instructions to help
          you regain access to your account securely.
        </p>
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card-header">
            <h2>Forgot Password</h2>
            <p>Request a password reset link</p>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button">
            Request Password Reset
          </button>

          {msg && (
            <p className={`login-message ${status}`}>
              {msg}
            </p>
          )}

          <div className="signup-row">
            <span>Remember your password?</span>
            <Link to="/login">Back to Sign In</Link>
          </div>
        </form>
      </section>
    </div>
  );
}