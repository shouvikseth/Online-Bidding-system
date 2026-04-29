import { useState, useEffect } from 'react';
import { Pencil, Trash2, Eye, Search, Users } from 'lucide-react';
import { Modal, Button } from 'react-bootstrap';
import '../styles/custRepDashboard.css';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [fadeUserId, setFadeUserId] = useState(null);
  const [updatedUserId, setUpdatedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/customer-rep/get-users');
      const data = await response.json();

      if (data.status === 'success') {
        setUsers(data.users);
      } else {
        alert('Error fetching users.');
      }
    };

    fetchUsers();
  }, []);

  const handleSaveUser = async () => {
    try {
      const response = await fetch(`/api/customer-rep/update-user/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editUser)
      });

      const data = await response.json();

      if (data.status === 'success') {
        setUsers((prev) =>
          prev.map((u) => (u.id === editUser.id ? editUser : u))
        );

        setUpdatedUserId(editUser.id);
        setShowEditModal(false);

        setTimeout(() => setUpdatedUserId(null), 2000);
      } else {
        alert('Failed to update user');
      }
    } catch (err) {
      console.error('Edit user error:', err);
      alert('Server error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setFadeUserId(userToDelete.id);

    setTimeout(async () => {
      try {
        const response = await fetch(`/api/customer-rep/delete-user/${userToDelete.id}`, {
          method: 'DELETE'
        });

        const data = await response.json();

        if (data.status === 'success') {
          setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
          setShowDeleteModal(false);
          setUserToDelete(null);
        } else {
          alert('Failed to delete user.');
          setFadeUserId(null);
        }
      } catch (err) {
        console.error('Delete user error:', err);
        alert('Server error.');
        setFadeUserId(null);
      }
    }, 300);
  };

  const filteredUsers = users.filter((user) => {
    const keyword = searchTerm.toLowerCase();

    return (
      user.username?.toLowerCase().includes(keyword) ||
      user.email?.toLowerCase().includes(keyword) ||
      user.full_name?.toLowerCase().includes(keyword) ||
      user.account_type?.toLowerCase().includes(keyword)
    );
  });

  const personalUsers = users.filter((user) => user.account_type === 'personal').length;
  const businessUsers = users.filter((user) => user.account_type === 'business').length;

  return (
    <div className="manage-page">
      <div className="manage-header">
        <div>
          <h2>Manage User Accounts</h2>
          <p>View, edit, and remove user accounts from the auction platform.</p>
        </div>

        <div className="manage-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by username, email, name, or account type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="auction-summary-grid">
        <div className="summary-card">
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </div>

        <div className="summary-card">
          <span>Filtered Users</span>
          <strong>{filteredUsers.length}</strong>
        </div>

        <div className="summary-card">
          <span>Personal</span>
          <strong>{personalUsers}</strong>
        </div>

        <div className="summary-card">
          <span>Business</span>
          <strong>{businessUsers}</strong>
        </div>
      </div>

      <div className="modern-table-card">
        <table className="modern-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Account Type</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className={
                  (fadeUserId === user.id ? 'fade-out' : '') +
                  (updatedUserId === user.id ? ' highlight-updated' : '')
                }
              >
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {user.username?.charAt(0)?.toUpperCase() || <Users size={16} />}
                    </div>

                    <div>
                      <span className="product-name">{user.username}</span>
                      <span className="user-subtext">
                        {user.full_name || 'No full name provided'}
                      </span>
                    </div>
                  </div>
                </td>

                <td>{user.email}</td>

                <td>
                  <span className={`account-badge ${user.account_type}`}>
                    {user.account_type}
                  </span>
                </td>

                <td>{user.country || '—'}</td>

                <td>
                  <div className="action-icons">
                    <button
                      className="icon-btn view"
                      title="View"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      className="icon-btn edit"
                      title="Edit"
                      onClick={() => {
                        setEditUser(user);
                        setShowEditModal(true);
                      }}
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      className="icon-btn delete"
                      title="Delete"
                      onClick={() => {
                        setUserToDelete(user);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-table">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedUser && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>User Details</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="modal-detail-grid">
              <p><strong>Username:</strong> {selectedUser.username}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Full Name:</strong> {selectedUser.full_name || '—'}</p>
              <p><strong>Business Name:</strong> {selectedUser.business_name || '—'}</p>
              <p><strong>Account Type:</strong> {selectedUser.account_type}</p>
              <p><strong>Country:</strong> {selectedUser.country || '—'}</p>
              <p>
                <strong>Created At:</strong>{' '}
                {new Date(selectedUser.created_at).toLocaleString()}
              </p>
            </div>
          </Modal.Body>
        </Modal>
      )}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={editUser?.username || ''}
                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={editUser?.email || ''}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={editUser?.full_name || ''}
                onChange={(e) => setEditUser({ ...editUser, full_name: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Business Name</label>
              <input
                type="text"
                className="form-control"
                value={editUser?.business_name || ''}
                onChange={(e) => setEditUser({ ...editUser, business_name: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Account Type</label>
              <select
                className="form-select"
                value={editUser?.account_type || ''}
                onChange={(e) => setEditUser({ ...editUser, account_type: e.target.value })}
              >
                <option value="personal">Personal</option>
                <option value="business">Business</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-control"
                value={editUser?.country || ''}
                onChange={(e) => setEditUser({ ...editUser, country: e.target.value })}
              />
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete <strong>{userToDelete?.username}</strong>?
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}