import { useState } from 'react';
import '../styles/createCustRep.css';

export default function CreateCustomerRep() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/admin/create-customer-rep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setStatus('success');
        setMessage('Customer Representative created successfully!');
        setUsername('');
        setPassword('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Server error.');
    }
  };

  return (
    <div className="rep-form-page">
      <div className="rep-form-header">
        <div className="rep-icon">👤</div>
        <div>
          <h2>Create Customer Representative</h2>
          <p>Add a new staff member to assist users and manage requests.</p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="rep-form-card">
        <div className="rep-form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter representative username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="rep-form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="rep-submit-btn">
          Create Representative
        </button>

        {message && (
          <p className={`rep-form-message ${status}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}