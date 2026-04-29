// src/components/Layout.js
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/products.css";
import "../styles/custRepDashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

function Layout({ children, notificationCount = 0, onAlertClick = () => {} }) {
  const fullName = localStorage.getItem("fullName") || "User";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="market-dashboard-container">
      <header className="market-header">
        <div className="market-header-title">
          <div className="market-brand-mark">JB</div>
          <div>
            <span className="market-logo">Bidme</span>
            <span className="market-subtitle">Marketplace</span>
          </div>
        </div>

        <div className="market-user-info">
          <FontAwesomeIcon icon={faUserCircle} className="market-user-icon" />
          <span className="market-user-name">{fullName}</span>

          <button className="market-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="market-layout">
        <nav className="market-sidebar">
          <div className="market-sidebar-label">Navigation</div>

          <ul className="market-sidebar-menu">
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <span>🏠</span>
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/create"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <span>➕</span>
                Sell a Product
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/my-bids"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <span>💰</span>
                My Bids
              </NavLink>
            </li>

            <li
              className="market-alert-item"
              onClick={onAlertClick}
              role="button"
              tabIndex={0}
            >
              <span className="market-alert-left">
                <span>🔔</span>
                Alerts
              </span>

              {notificationCount > 0 && (
                <span className="market-notification-count">
                  {notificationCount}
                </span>
              )}
            </li>

            <li>
              <NavLink
                to="/faq"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <span>❓</span>
                FAQs
              </NavLink>
            </li>
          </ul>
        </nav>

        <main className="market-main-content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;