import React, { useEffect, useMemo, useState } from "react";
import { Bell, Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/products.css";
import Layout from "./layout";

const calculateTimeLeft = (closingDate) => {
  const difference = +new Date(closingDate) - +new Date();

  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

function ProductList() {
  const [products, setProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [sortOption, setSortOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState([]);
  const [colorFilter, setColorFilter] = useState([]);
  const [storageFilter, setStorageFilter] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`/api/notifications?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setNotificationCount(data.length);
      });
  }, []);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);

        const initialTimes = {};
        data.forEach((product) => {
          initialTimes[product.id] = calculateTimeLeft(product.closing_date);
        });
        setTimeLeft(initialTimes);
      })
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = {};
      products.forEach((product) => {
        updated[product.id] = calculateTimeLeft(product.closing_date);
      });
      setTimeLeft(updated);
    }, 1000);

    return () => clearInterval(timer);
  }, [products]);

  const handleView = (id) => navigate(`/product?id=${id}`);

  const handleClearFilters = () => {
    setBrandFilter([]);
    setColorFilter([]);
    setStorageFilter([]);
    setSearchTerm("");
    setSortOption("");
  };

  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target;

    const setterMap = {
      brand: setBrandFilter,
      color: setColorFilter,
      storage: setStorageFilter,
    };

    const valueMap = {
      brand: brandFilter,
      color: colorFilter,
      storage: storageFilter,
    };

    const currentValues = valueMap[category];

    setterMap[category](
      checked
        ? [...currentValues, value]
        : currentValues.filter((item) => item !== value)
    );
  };

  const handleClearNotifications = async () => {
    try {
      const response = await fetch("/api/notifications/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: localStorage.getItem("userId") }),
      });

      if (response.ok) {
        setNotifications([]);
        setNotificationCount(0);
        setShowNotifications(false);
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.toLowerCase();

    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(keyword) ||
        product.brand?.toLowerCase().includes(keyword) ||
        product.color?.toLowerCase().includes(keyword) ||
        product.storage?.toLowerCase().includes(keyword);

      const matchesBrand =
        brandFilter.length === 0 || brandFilter.includes(product.brand);

      const matchesColor =
        colorFilter.length === 0 || colorFilter.includes(product.color);

      const matchesStorage =
        storageFilter.length === 0 || storageFilter.includes(product.storage);

      return matchesSearch && matchesBrand && matchesColor && matchesStorage;
    });

    filtered.sort((a, b) => {
      const now = new Date();
      const aEnded = new Date(a.closing_date) < now;
      const bEnded = new Date(b.closing_date) < now;

      if (aEnded && !bEnded) return 1;
      if (!aEnded && bEnded) return -1;

      if (sortOption === "price-asc") return Number(a.price) - Number(b.price);
      if (sortOption === "price-desc") return Number(b.price) - Number(a.price);
      if (sortOption === "brand-asc") return a.brand?.localeCompare(b.brand);
      if (sortOption === "brand-desc") return b.brand?.localeCompare(a.brand);
      if (sortOption === "time-left") {
        return new Date(a.closing_date) - new Date(b.closing_date);
      }
      if (sortOption === "time-left-desc") {
        return new Date(b.closing_date) - new Date(a.closing_date);
      }

      return 0;
    });

    return filtered;
  }, [products, searchTerm, brandFilter, colorFilter, storageFilter, sortOption]);

  const getUniqueValues = (field) =>
    Array.from(new Set(products.map((p) => p[field]).filter(Boolean)));

  const openProducts = products.filter(
    (product) => new Date(product.closing_date) > new Date()
  ).length;

  const closedProducts = products.length - openProducts;

  return (
    <Layout
      notificationCount={notificationCount}
      onAlertClick={() => setShowNotifications(true)}
    >
      <div className="marketplace-page">
        <div className="marketplace-header">
          <div>
            <h1>Browse Auctions</h1>
            <p>
              Discover active listings, filter by phone specifications, and bid
              before the auction closes.
            </p>
          </div>
        </div>

        <div className="marketplace-summary-grid">
          <div className="market-summary-card">
            <span>Total Listings</span>
            <strong>{products.length}</strong>
          </div>

          <div className="market-summary-card">
            <span>Open Auctions</span>
            <strong>{openProducts}</strong>
          </div>

          <div className="market-summary-card">
            <span>Closed Auctions</span>
            <strong>{closedProducts}</strong>
          </div>

          <div className="market-summary-card">
            <span>Showing</span>
            <strong>{filteredProducts.length}</strong>
          </div>
        </div>

        <div className="market-toolbar">
          <div className="market-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, brand, color, or storage..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="market-filter-btn"
          >
            <Filter size={18} />
            Filters
          </button>

          <div className="market-sort">
            <SlidersHorizontal size={18} />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="brand-asc">Brand: A to Z</option>
              <option value="brand-desc">Brand: Z to A</option>
              <option value="time-left">Time: Least to Most</option>
              <option value="time-left-desc">Time: Most to Least</option>
            </select>
          </div>
        </div>

        {filtersOpen && (
          <div className="market-filters-panel">
            {["brand", "color", "storage"].map((category) => (
              <div key={category} className="market-filter-group">
                <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>

                {getUniqueValues(category).map((val, idx) => {
                  const selectedValues =
                    category === "brand"
                      ? brandFilter
                      : category === "color"
                      ? colorFilter
                      : storageFilter;

                  return (
                    <label key={idx} className="market-checkbox">
                      <input
                        type="checkbox"
                        value={val}
                        checked={selectedValues.includes(val)}
                        onChange={(e) => handleCheckboxChange(e, category)}
                      />
                      <span>{val}</span>
                    </label>
                  );
                })}
              </div>
            ))}

            <button onClick={handleClearFilters} className="clear-filters-button">
              Clear Filters
            </button>
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <div className="modern-product-grid">
            {filteredProducts.map((product) => {
              const isEnded = new Date(product.closing_date) < new Date();
              const remaining = timeLeft[product.id];

              return (
                <div
                  key={product.id}
                  className={`modern-product-card ${isEnded ? "disabled" : ""}`}
                  onClick={() => !isEnded && handleView(product.id)}
                >
                  <div className="modern-product-image-wrap">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="modern-product-image"
                    />

                    <span className={`auction-status ${isEnded ? "closed" : "open"}`}>
                      {isEnded ? "Closed" : "Open"}
                    </span>
                  </div>

                  <div className="modern-product-body">
                    <h2>{product.name}</h2>
                    <p className="modern-product-brand">{product.brand}</p>

                    <div className="modern-product-meta">
                      <span>{product.storage}</span>
                      <span>{product.color}</span>
                    </div>

                    <div className="modern-product-price">
                      ${Number(product.price).toFixed(2)}
                    </div>

                    {remaining ? (
                      <p className="modern-product-timer">
                        Ends in {remaining.days}d {remaining.hours}h{" "}
                        {remaining.minutes}m {remaining.seconds}s
                      </p>
                    ) : (
                      <p className="modern-product-ended">Auction Closed</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-products-wrapper">
            <p className="no-products-message">
              No products found matching your search.
            </p>
          </div>
        )}
      </div>

      {showNotifications && (
        <div className="notification-overlay">
          <div className="notification-card-modern">
            <div className="notification-header-modern">
              <h3>
                <Bell size={18} /> Notifications
              </h3>
              <button onClick={() => setShowNotifications(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="notification-list-modern">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n.id} className="notification-item-modern">
                    <p>{n.message}</p>
                    <small>{n.created_at}</small>
                  </div>
                ))
              ) : (
                <p>No notifications available.</p>
              )}
            </div>

            <button
              onClick={handleClearNotifications}
              className="modern-submit-btn"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default ProductList;