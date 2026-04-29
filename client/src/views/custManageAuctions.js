import { useState, useEffect } from 'react';
import { Eye, Trash2, Flag, Search } from 'lucide-react';
import { Modal, Button } from 'react-bootstrap';
import '../styles/custRepDashboard.css';

export default function ManageAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [auctionToDelete, setAuctionToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/customer-rep/get-auctions')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setAuctions(data.auctions);
        }
      });
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleString();
  };

  const isClosed = (dateStr) => {
    const now = new Date();
    const closing = new Date(dateStr);
    return !isNaN(closing) && closing < now;
  };

  const hasMissingFields = (auction) => {
    return !auction.brand || !auction.storage || !auction.screen_size || !auction.ram;
  };

  const isSuspicious = (auction) => {
    const invalidPrice = !auction.price || auction.price <= 0;
    const suspiciousName = /test|asd|xxx/i.test(auction.name);
    return invalidPrice || suspiciousName;
  };

  const getFlagReason = (auction) => {
    if (isSuspicious(auction)) {
      return 'Suspicious auction name or invalid price.';
    }

    if (hasMissingFields(auction)) {
      return 'Missing required fields such as brand, RAM, storage, or screen size.';
    }

    return '';
  };

  const filteredAuctions = auctions.filter((auction) => {
    const keyword = searchTerm.toLowerCase();

    return (
      auction.name?.toLowerCase().includes(keyword) ||
      auction.brand?.toLowerCase().includes(keyword) ||
      auction.seller?.toLowerCase().includes(keyword)
    );
  });

  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    const priority = (auction) => {
      if (isSuspicious(auction)) return 2;
      if (hasMissingFields(auction)) return 1;
      return 0;
    };

    return priority(b) - priority(a);
  });

  const handleDelete = async () => {
    if (!auctionToDelete) return;

    fetch(`/api/customer-rep/delete-auction/${auctionToDelete.id}`, {
      method: 'DELETE'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setAuctions(auctions.filter((a) => a.id !== auctionToDelete.id));
          setShowDeleteModal(false);
          setAuctionToDelete(null);
        } else {
          alert('Failed to delete auction');
        }
      });
  };

  return (
    <div className="manage-page">
      <div className="manage-header">
        <div>
          <h2>Manage Auctions</h2>
          <p>Review active and closed auctions, inspect suspicious listings, and remove invalid auctions.</p>
        </div>

        <div className="manage-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by product, brand, or seller..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="auction-summary-grid">
        <div className="summary-card">
          <span>Total Auctions</span>
          <strong>{auctions.length}</strong>
        </div>

        <div className="summary-card">
          <span>Open</span>
          <strong>{auctions.filter((a) => !isClosed(a.closing_date)).length}</strong>
        </div>

        <div className="summary-card">
          <span>Closed</span>
          <strong>{auctions.filter((a) => isClosed(a.closing_date)).length}</strong>
        </div>

        <div className="summary-card danger">
          <span>Flagged</span>
          <strong>{auctions.filter((a) => isSuspicious(a) || hasMissingFields(a)).length}</strong>
        </div>
      </div>

      <div className="modern-table-card">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Brand</th>
              <th>Seller</th>
              <th>Ends On</th>
              <th>Status</th>
              <th>Review</th>
            </tr>
          </thead>

          <tbody>
            {sortedAuctions.map((auction) => {
              const suspicious = isSuspicious(auction);
              const missing = hasMissingFields(auction);
              const closed = isClosed(auction.closing_date);

              return (
                <tr key={auction.id}>
                  <td>
                    <div className="product-cell">
                      <span className="product-name">{auction.name}</span>

                      {(suspicious || missing) && (
                        <span className={`flag-chip ${suspicious ? 'danger' : 'warning'}`}>
                          <Flag size={14} />
                          {suspicious ? 'Suspicious' : 'Incomplete'}
                          <span className="flag-tooltip">{getFlagReason(auction)}</span>
                        </span>
                      )}
                    </div>
                  </td>

                  <td>{auction.brand || '—'}</td>
                  <td>{auction.seller || '—'}</td>
                  <td>{formatDate(auction.closing_date)}</td>

                  <td>
                    <span className={`status-badge ${closed ? 'closed' : 'open'}`}>
                      {closed ? 'Closed' : 'Open'}
                    </span>
                  </td>

                  <td>
                    <div className="action-icons">
                      <button
                        className="icon-btn view"
                        title="View"
                        onClick={() => {
                          setSelectedAuction(auction);
                          setShowViewModal(true);
                        }}
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        className="icon-btn delete"
                        title="Delete"
                        onClick={() => {
                          setAuctionToDelete(auction);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {sortedAuctions.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-table">
                  No auctions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showViewModal && selectedAuction && (
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Auction Details</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="modal-detail-grid">
              <p><strong>Product:</strong> {selectedAuction.name}</p>
              <p><strong>Brand:</strong> {selectedAuction.brand || '—'}</p>
              <p><strong>Seller:</strong> {selectedAuction.seller || '—'}</p>
              <p><strong>Price:</strong> ${selectedAuction.price}</p>
              <p><strong>Closing Date:</strong> {formatDate(selectedAuction.closing_date)}</p>
              <p>
                <strong>Status:</strong>{' '}
                {isClosed(selectedAuction.closing_date) ? 'Closed' : 'Open'}
              </p>
            </div>
          </Modal.Body>
        </Modal>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete auction{' '}
          <strong>{auctionToDelete?.name}</strong>?
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Auction
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}