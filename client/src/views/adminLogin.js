import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/adminLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.status === 'success') {
        if (data.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (data.role === 'customer_rep') {
          navigate('/customer-rep-dashboard');
        } else {
          setError('Unknown role');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="staff-login-page">
      <section className="staff-login-hero">
        <div className="staff-brand-pill">Bidme Staff</div>

        <h1>
          Manage auctions.
          <br />
          Support users.
        </h1>

        <p>
          Secure staff portal for admins and customer representatives to manage
          customer support, sales reports, password requests, and auction activity.
        </p>

        <div className="staff-feature-grid">
          <div>
            <strong>Admin</strong>
            <span>Reports & reps</span>
          </div>
          <div>
            <strong>Support</strong>
            <span>User requests</span>
          </div>
          <div>
            <strong>Secure</strong>
            <span>Role-based access</span>
          </div>
        </div>
      </section>

      <section className="staff-login-panel">
        <form className="staff-login-card" onSubmit={handleLogin}>
          <div className="staff-login-card-header">
            <div className="staff-icon">JB</div>
            <div>
              <h2>Staff Login</h2>
              <p>Admins and customer reps only</p>
            </div>
          </div>

          <div className="staff-form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter staff username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="staff-form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter staff password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="staff-login-links">
            <Link to="/forgot-rep-password">
              Forgot customer rep password?
            </Link>
          </div>

          <button type="submit" className="staff-login-button">
            Login to Dashboard
          </button>

          {error && <p className="staff-login-error">{error}</p>}

          <div className="staff-back-row">
            <Link to="/">← Back to User Login</Link>
          </div>
        </form>
      </section>
    </div>
  );
}