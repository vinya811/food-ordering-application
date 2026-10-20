import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">🍔 Foodie</Link>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/menu">Menu</Link>

        <Link to="/orders">Orders</Link>

        <Link to="/cart" className="cart-link">
          🛒 Cart

          {cartCount > 0 && (
            <span className="cart-count">
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <>
            <Link to="/account" className="account-link">
              👤 My Account
            </Link>

            <span className="user-name">
              {user.name || user.email}
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>

            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;