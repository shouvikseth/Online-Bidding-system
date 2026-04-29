import { useState, useEffect } from 'react';
import { Trash2, Search, DollarSign } from 'lucide-react';
import '../styles/custRepDashboard.css';

export default function ManageBids() {
  const [bids, setBids] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  useEffect(() => {
    fetch('/api/customer-rep/get-bids')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setBids(data.bids);
        } else {
          alert('Error fetching bids.');
        }
      });
  }, []);

  const filteredBids = bids.filter((bid) => {
    const keyword = searchTerm.toLowerCase();
    const productName = bid.product_name?.toLowerCase() || '';
    const username = bid.username?.toLowerCase() || '';
    const bidAmount = Number(bid.bid_amount);

    const matchesSearch =
      productName.includes(keyword) || username.includes(keyword);

    const minOk = minAmount === '' || bidAmount >= Number(minAmount);
    const maxOk = maxAmount === '' || bidAmount <= Number(maxAmount);

    return matchesSearch && minOk && maxOk;
  });

  const totalBidValue = filteredBids.reduce(
    (sum, bid) => sum + Number(bid.bid_amount || 0),
    0
  );

  const highestBid =
    filteredBids.length > 0
      ? Math.max(...filteredBids.map((bid) => Number(bid.bid_amount || 0)))
      : 0;

  const handleDeleteBid = async (bidId) => {
    if (!window.confirm('Are you sure you want to delete this bid?')) return;

    try {
      const res = await fetch(`/api/customer-rep/delete-bid/${bidId}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (data.status === 'success') {
        setBids((prev) => prev.filter((bid) => bid.id !== bidId));
      } else {
        alert('Failed to delete bid.');
      }
    } catch (err) {
      console.error('Delete bid error:', err);
      alert('Server error.');
    }
  };

  return (
    <div className="manage-page">
      <div className="manage-header">
        <div>
          <h2>Manage Bids</h2>
          <p>Review user bids, filter by amount, and remove invalid or suspicious bids.</p>
        </div>
      </div>

      <div className="auction-summary-grid">
        <div className="summary-card">
          <span>Total Bids</span>
          <strong>{bids.length}</strong>
        </div>

        <div className="summary-card">
          <span>Filtered Bids</span>
          <strong>{filteredBids.length}</strong>
        </div>

        <div className="summary-card">
          <span>Total Bid Value</span>
          <strong>${totalBidValue.toFixed(2)}</strong>
        </div>

        <div className="summary-card">
          <span>Highest Bid</span>
          <strong>${highestBid.toFixed(2)}</strong>
        </div>
      </div>

      <div className="bid-filter-card">
        <div className="manage-search bid-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by product or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="amount-filter-group">
          <div className="amount-input">
            <DollarSign size={16} />
            <input
              type="number"
              placeholder="Min amount"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
          </div>

          <div className="amount-input">
            <DollarSign size={16} />
            <input
              type="number"
              placeholder="Max amount"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="modern-table-card">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Username</th>
              <th>Bid Amount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBids.map((bid) => (
              <tr key={bid.id}>
                <td>
                  <span className="product-name">{bid.product_name}</span>
                </td>

                <td>{bid.username || '—'}</td>

                <td>
                  <span className="bid-amount">
                    ${Number(bid.bid_amount).toFixed(2)}
                  </span>
                </td>

                <td>
                  <div className="action-icons">
                    <button
                      className="icon-btn delete"
                      title="Delete"
                      onClick={() => handleDeleteBid(bid.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredBids.length === 0 && (
              <tr>
                <td colSpan="4" className="empty-table">
                  No bids found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}