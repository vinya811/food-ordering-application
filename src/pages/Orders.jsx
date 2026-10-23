import { Link } from "react-router-dom";
import { useOrders } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";
import "./Orders.css";

function Orders() {
  const { user } = useAuth();
  const { orders } = useOrders();

  if (!user) {
    return (
      <div className="orders-page login-required-page">
        <div className="login-required-card">
          <div className="login-required-icon">
            🔐
          </div>

          <h1>Login to View Your Orders</h1>

          <p>
            Please login to your Foodie account to see
            your current and previous orders.
          </p>

          <Link
            to="/login"
            className="login-required-btn"
          >
            Login to Continue
          </Link>

          <p className="signup-prompt">
            Don't have an account?{" "}
            <Link to="/signup">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Your Orders 📦</h1>

        <p>
          Track your current and previous orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-orders-icon">
            🍽️
          </div>

          <h2>No Orders Yet</h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <Link
            to="/menu"
            className="browse-menu-btn"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div
              className="order-card"
              key={order.id}
            >
              <div className="order-top">
                <div>
                  <h2>{order.id}</h2>
                  <p>{order.date}</p>
                </div>

                <span className="order-status">
                  {order.status}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div
                    className="order-item"
                    key={item.id}
                  >
                    <span>
                      {item.emoji} {item.name} x {item.quantity}
                    </span>

                    <span>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-bottom">
                <strong>
                  Total: ₹{order.total}
                </strong>

                <Link
                  to={"/order-success/" + order.id}
                  className="view-order-btn"
                >
                  View Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;