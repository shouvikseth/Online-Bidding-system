import React, { useEffect, useState } from "react";
import { Bell, Clock, DollarSign, Gavel } from "lucide-react";
import "../styles/products.css";
import Layout from "./layout";

function MyBids() {
  const [bids, setBids] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/bids/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setBids(data))
      .catch((err) => console.error("Failed to fetch bids", err));
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/notifications?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setNotificationCount(data.length);
      })
      .catch((err) => console.error("Failed to fetch notifications", err));
  }, [userId]);

  const isAuctionActive = (closingDate) => {
    return new Date(closingDate) > new Date();
  };

  const activeBids = bids.filter((bid) => isAuctionActive(bid.closing_date)).length;
  const closedBids = bids.length - activeBids;
  const highestBid =
    bids.length > 0
      ? Math.max(...bids.map((bid) => Number(bid.bid_amount || 0)))
      : 0;

  return (
    <Layout
      notificationCount={notificationCount}
      onAlertClick={() => setShowNotifications(true)}
    >
      <div className="bids-page">
        <div className="bids-header">
          <div>
            <h1>My Bids</h1>
            <p>Track your manual and automatic bids across active and closed auctions.</p>
          </div>
        </div>

        <div className="bids-summary-grid">
          <div className="bid-summary-card">
            <Gavel size={20} />
            <span>Total Bids</span>
            <strong>{bids.length}</strong>
          </div>

          <div className="bid-summary-card">
            <Clock size={20} />
            <span>Active Auctions</span>
            <strong>{activeBids}</strong>
          </div>

          <div className="bid-summary-card">
            <Bell size={20} />
            <span>Closed Auctions</span>
            <strong>{closedBids}</strong>
          </div>

          <div className="bid-summary-card">
            <DollarSign size={20} />
            <span>Highest Bid</span>
            <strong>${highestBid.toFixed(2)}</strong>
          </div>
        </div>

        {bids.length > 0 ? (
          <div className="bids-grid">
            {bids.map((bid, idx) => {
              const active = isAuctionActive(bid.closing_date);

              return (
                <div key={idx} className={`modern-bid-card ${!active ? "closed" : ""}`}>
                  <div className="bid-image-wrap">
                    <img
                      src={`/uploads/${bid.image_url}`}
                      alt={bid.product_name}
                      className="bid-image"
                    />

                    <span className={`bid-status ${active ? "active" : "closed"}`}>
                      {active ? "Active" : "Closed"}
                    </span>
                  </div>

                  <div className="bid-card-body">
                    <h2>{bid.product_name}</h2>
                    <p className="bid-brand">{bid.brand || "Unknown Brand"}</p>

                    <div className="bid-info-row">
                      <span>Your Bid</span>
                      <strong>${Number(bid.bid_amount).toFixed(2)}</strong>
                    </div>

                    <div className="bid-info-row">
                      <span>Placed On</span>
                      <strong>{bid.created_at}</strong>
                    </div>

                    <div className="bid-type-box">
                      {bid.auto_bid ? (
                        <>
                          <span>Auto Bid</span>
                          <p>
                            Max: ${bid.max_limit} · Increment: ${bid.increment}
                          </p>
                        </>
                      ) : (
                        <>
                          <span>Manual Bid</span>
                          <p>Placed directly by you</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-bids-card">
            <Gavel size={38} />
            <h2>No bids yet</h2>
            <p>You have not placed any bids. Browse products and start bidding.</p>
          </div>
        )}

        {showNotifications && (
          <div className="notification-overlay">
            <div className="notification-card-modern">
              <div className="notification-header-modern">
                <h3>
                  <Bell size={18} /> Notifications
                </h3>
                <button onClick={() => setShowNotifications(false)}>×</button>
              </div>

              <div className="notification-list-modern">
                {notifications.length > 0 ? (
                  notifications.map((note, idx) => (
                    <div key={idx} className="notification-item-modern">
                      <p>{note.message}</p>
                      <small>{note.created_at}</small>
                    </div>
                  ))
                ) : (
                  <p>No notifications available.</p>
                )}
              </div>

              <button
                onClick={() => setShowNotifications(false)}
                className="modern-submit-btn"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default MyBids;