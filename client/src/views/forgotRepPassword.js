import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/forgotRepPassword.css';

export default function ForgotRepPassword() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      setMessage(data.message);
      setStatus(data.status);

      if (data.status === 'success') {
        setTimeout(() => navigate('/admin-login'), 2000);
      }
    } catch (err) {
      setMessage('Server error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="forgot-page">
      <section className="forgot-left-panel">
        <div className="forgot-brand-pill">Bidme Support</div>

        <h1>
          Reset your
          <br />
          account access.
        </h1>

        <p>
          Customer Representatives can request password reset approval securely.
          Once approved by an administrator, you’ll regain access.
        </p>
      </section>

      <section className="forgot-right-panel">
        <div className="forgot-card">
          <div className="forgot-card-header">
            <div className="forgot-icon">🔐</div>
            <div>
              <h2>Password Reset</h2>
              <p>Customer Representatives only</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="forgot-form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="forgot-btn">
              Send Request
            </button>
          </form>

          {message && (
            <p className={`forgot-message ${status}`}>
              {message}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}