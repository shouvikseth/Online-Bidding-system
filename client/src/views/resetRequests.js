import { useEffect, useState } from 'react';
import { KeyRound, UserRound, CheckCircle2 } from 'lucide-react';
import '../styles/createCustRep.css';

export default function ResetRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('/admin/reset-requests')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setRequests(data.requests);
        }
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const response = await fetch('/admin/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: selectedUser, password: newPassword }),
    });

    const data = await response.json();

    if (data.status === 'success') {
      setStatus('success');
      setMessage('Password reset successfully.');
      setNewPassword('');
      setRequests((prev) => prev.filter((r) => r.username !== selectedUser));
      setSelectedUser('');
    } else {
      setStatus('error');
      setMessage(data.message || 'Reset failed.');
    }
  };

  return (
    <div className="reset-page">
      <aside className="reset-request-panel">
        <div className="reset-panel-header">
          <KeyRound size={20} />
          <div>
            <h3>Pending Requests</h3>
            <p>{requests.length} request(s)</p>
          </div>
        </div>

        <div className="reset-request-list">
          {requests.length > 0 ? (
            requests.map((req) => (
              <button
                key={req.id}
                className={`reset-request-item ${
                  selectedUser === req.username ? 'active' : ''
                }`}
                onClick={() => {
                  setSelectedUser(req.username);
                  setMessage('');
                  setStatus(null);
                }}
              >
                <UserRound size={18} />
                <span>{req.username}</span>
              </button>
            ))
          ) : (
            <div className="empty-reset-list">
              <CheckCircle2 size={26} />
              <p>No pending requests</p>
            </div>
          )}
        </div>
      </aside>

      <section className="reset-detail-panel">
        {requests.length === 0 ? (
          <div className="reset-empty-state">
            <CheckCircle2 size={42} />
            <h2>All caught up</h2>
            <p>There are no pending customer representative password reset requests.</p>
          </div>
        ) : selectedUser ? (
          <>
            <div className="rep-form-header">
              <div className="rep-icon">🔐</div>
              <div>
                <h2>Reset Password</h2>
                <p>Create a new password for <strong>{selectedUser}</strong>.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rep-form-card">
              <div className="rep-form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="rep-submit-btn">
                Reset Password
              </button>

              {message && (
                <p className={`rep-form-message ${status}`}>
                  {message}
                </p>
              )}
            </form>
          </>
        ) : (
          <div className="reset-empty-state">
            <UserRound size={42} />
            <h2>Select a request</h2>
            <p>Choose a customer representative from the left panel to reset their password.</p>
          </div>
        )}
      </section>
    </div>
  );
}