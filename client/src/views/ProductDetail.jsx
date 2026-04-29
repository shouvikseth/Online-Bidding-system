import React, { useEffect, useState } from "react";
import { ArrowLeft, Clock, DollarSign, Gavel, History, X } from "lucide-react";
import "../styles/ProductDetail.css";

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  const query = new URLSearchParams(window.location.search);
  const productId = query.get("id");

  const fetchHistory = async () => {
    const res = await fetch(`/api/bid-history/${productId}`);
    const data = await res.json();
    setHistory(data);
    setShowHistory(true);
  };

  useEffect(() => {
    if (productId) {
      fetch(`/api/product?id=${productId}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch((err) => console.error("Failed to load product:", err));
    }
  }, [productId]);

  if (!product) {
    return <div className="product-loading">Loading product...</div>;
  }

  const isClosed = new Date(product.closing_date) < new Date();

  return (
    <div className="product-detail-page">
      <a href="/products" className="detail-back-link">
        <ArrowLeft size={18} />
        Back to Browse
      </a>

      <div className="detail-card">
        <div className="detail-image-panel">
          <img
            src={product.image_url}
            alt={product.name}
            className="detail-product-image"
          />

          <span className={`detail-status ${isClosed ? "closed" : "open"}`}>
            {isClosed ? "Auction Closed" : "Auction Open"}
          </span>
        </div>

        <div className="detail-info-panel">
          <div className="detail-title-row">
            <div>
              <h1>{product.name}</h1>
              <p>{product.brand || "Unknown Brand"}</p>
            </div>
          </div>

          <div className="detail-price-box">
            <DollarSign size={22} />
            <div>
              <span>Starting Price</span>
              <strong>${product.price}</strong>
            </div>
          </div>

          <div className="detail-spec-grid">
            <div>
              <span>Storage</span>
              <strong>{product.storage || "—"}</strong>
            </div>

            <div>
              <span>RAM</span>
              <strong>{product.ram || "—"}</strong>
            </div>

            <div>
              <span>Color</span>
              <strong>{product.color || "—"}</strong>
            </div>

            <div>
              <span>Screen Size</span>
              <strong>{product.screen_size || "—"}</strong>
            </div>
          </div>

          <div className="detail-date-box">
            <Clock size={18} />
            <div>
              <span>Closing Date</span>
              <strong>{product.closing_date}</strong>
            </div>
          </div>

          <div className="detail-actions">
            <button
              onClick={() => (window.location.href = `/bid?id=${product.id}`)}
              className="detail-primary-btn"
              disabled={isClosed}
            >
              <Gavel size={18} />
              {isClosed ? "Bidding Closed" : "Place a Bid"}
            </button>

            <button onClick={fetchHistory} className="detail-secondary-btn">
              <History size={18} />
              View Bid History
            </button>
          </div>
        </div>
      </div>

      {showHistory && (
        <div className="history-overlay">
          <div className="history-modal">
            <div className="history-header">
              <div>
                <h3>Bid History</h3>
                <p>{product.name}</p>
              </div>

              <button onClick={() => setShowHistory(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="history-list">
              {history.length > 0 ? (
                history.map((entry, idx) => (
                  <div key={idx} className="history-item">
                    <div>
                      <strong>${Number(entry.bid_amount).toFixed(2)}</strong>
                      <span>
                        User {entry.user_id} · {entry.auto_bid ? "Auto Bid" : "Manual Bid"}
                      </span>
                    </div>
                    <small>{entry.created_at}</small>
                  </div>
                ))
              ) : (
                <div className="history-empty">
                  No bid history available for this product.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;