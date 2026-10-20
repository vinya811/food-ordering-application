import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";

import "./Account.css";

function Account() {
  const navigate = useNavigate();

  const { user, updateUser, logout } = useAuth();
  const { orders } = useOrders();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));

    setMessage("");
  };

  const handleSave = (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();

    if (!name || !email) {
      setMessage("Please enter both name and email.");
      return;
    }

    updateUser({
      name,
      email
    });

    setFormData({
      name,
      email
    });

    setIsEditing(false);
    setMessage("Profile updated successfully! ✅");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="account-page">
      <div className="account-card">

        <div className="account-icon">
          👤
        </div>

        <h1>My Account</h1>

        {isEditing ? (
          <form
            className="edit-profile-form"
            onSubmit={handleSave}
          >
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <div className="edit-buttons">
              <button
                type="submit"
                className="save-profile-btn"
              >
                💾 Save Changes
              </button>

              <button
                type="button"
                className="cancel-edit-btn"
                onClick={() => {
                  setIsEditing(false);

                  setFormData({
                    name: user?.name || "",
                    email: user?.email || ""
                  });

                  setMessage("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="account-info">

              <div className="account-item">
                <span>Full Name</span>
                <strong>
                  {user?.name || "User"}
                </strong>
              </div>

              <div className="account-item">
                <span>Email</span>
                <strong>
                  {user?.email || "No email"}
                </strong>
              </div>

              <div className="account-item">
                <span>Total Orders</span>
                <strong>
                  {orders.length}
                </strong>
              </div>

            </div>

            <button
              className="edit-profile-btn"
              onClick={() => {
                setIsEditing(true);
                setMessage("");
              }}
            >
              ✏️ Edit Profile
            </button>
          </>
        )}

        {message && (
          <p className="profile-message">
            {message}
          </p>
        )}

        <button
          className="orders-btn"
          onClick={() => navigate("/orders")}
        >
          📦 View My Orders
        </button>

        <button
          className="logout-account-btn"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

      </div>
    </div>
  );
}

export default Account;