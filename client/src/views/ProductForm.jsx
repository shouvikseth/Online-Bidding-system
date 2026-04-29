import React, { useEffect, useState } from "react";
import { Bell, CalendarClock, ImagePlus, PackagePlus, Send, X } from "lucide-react";
import Layout from "./layout";
import "../styles/ProductForm.css";

function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    brand: "",
    storage: "",
    ram: "",
    color: "",
    screenSize: "",
    reservePrice: "",
    closingDate: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, key === "reservePrice" && value.trim() === "" ? "" : value);
    });

    data.append("productImage", image);

    try {
      const response = await fetch("/api/auctions", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("Product submitted successfully!");
        setFormData({
          name: "",
          price: "",
          brand: "",
          storage: "",
          ram: "",
          color: "",
          screenSize: "",
          reservePrice: "",
          closingDate: "",
        });
        setImage(null);
        setPreview(null);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert("Server error: " + result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error occurred while submitting.");
    }
  };

  const formField = (label, name, type = "text", placeholder = "") => (
    <div className="modern-form-field">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        required={name !== "reservePrice"}
      />
    </div>
  );

  return (
    <Layout
      notificationCount={notificationCount}
      onAlertClick={() => setShowNotifications(true)}
    >
      <div className="sell-product-page">
        <div className="sell-header">
          <div>
            <h1>Sell a Product</h1>
            <p>Create a new auction listing with product details, reserve price, closing time, and image.</p>
          </div>

          <div className="sell-header-card">
            <PackagePlus size={22} />
            <span>New Auction</span>
          </div>
        </div>

        {successMessage && (
          <div className="sell-success-toast">
            {successMessage}
          </div>
        )}

        <div className="sell-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-section-title">
              <PackagePlus size={18} />
              <span>Product Information</span>
            </div>

            <div className="modern-form-grid">
              {formField("Name", "name", "text", "Enter product name")}
              {formField("Price", "price", "number", "Enter price in USD")}
              {formField("Brand", "brand", "text", "Apple, Samsung, Google")}
              {formField("Storage", "storage", "text", "128GB, 256GB")}
              {formField("RAM", "ram", "text", "8GB, 16GB")}
              {formField("Color", "color", "text", "Black, White, Blue")}
              {formField("Screen Size", "screenSize", "text", "6.5 inches")}
              {formField("Reserve Price", "reservePrice", "number", "Optional reserve price")}
            </div>

            <div className="form-section-title">
              <CalendarClock size={18} />
              <span>Auction Settings</span>
            </div>

            <div className="modern-form-grid">
              <div className="modern-form-field">
                <label>Closing Date</label>
                <input
                  type="datetime-local"
                  name="closingDate"
                  value={formData.closingDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-section-title">
              <ImagePlus size={18} />
              <span>Product Image</span>
            </div>

            <div className="upload-box">
              <input
                id="productImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />

              <label htmlFor="productImage">
                <ImagePlus size={24} />
                <strong>Upload product image</strong>
                <span>PNG, JPG, or JPEG</span>
              </label>
            </div>

            {preview && (
              <div className="preview-card">
                <div>
                  <strong>Image Preview</strong>
                  <p>Your uploaded image will appear on the auction card.</p>
                </div>
                <img src={preview} alt="Preview" />
              </div>
            )}

            <button type="submit" className="modern-submit-auction-btn">
              <Send size={18} />
              Submit Auction
            </button>
          </form>
        </div>
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
          </div>
        </div>
      )}
    </Layout>
  );
}

export default ProductForm;