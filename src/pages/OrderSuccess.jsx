import { Link, useParams } from "react-router-dom";
import { useOrders } from "../context/OrdersContext";
import "./OrderSuccess.css";

function OrderSuccess() {
  const { id } = useParams();
  const { orders } = useOrders();

  const order = orders.find(
    (item) => item.id === id
  );

  if (!order) {
    return (
      <div className="order-not-found">

        <h1>Order Not Found</h1>

        <p>
          We couldn't find this order.
        </p>

        <Link to="/">
          Back to Home
        </Link>

      </div>
    );
  }

  return (
    <div className="order-success">

      <div className="success-icon">
        ✓
      </div>

      <h1>Order Placed Successfully!</h1>

      <p className="success-message">
        Thank you for ordering from Foodie.
      </p>

      <div className="order-details">

        <h2>Order Details</h2>

        <p>
          <strong>Order ID:</strong> {order.id}
        </p>

        <p>
          <strong>Date:</strong> {order.date}
        </p>

        <p>
          <strong>Status:</strong> {order.status}
        </p>

        <p>
          <strong>Total:</strong> ₹{order.total}
        </p>

      </div>

      <div className="success-buttons">

        <Link to="/orders">
          View My Orders
        </Link>

        <Link to="/">
          Continue Shopping
        </Link>

      </div>

    </div>
  );
}

export default OrderSuccess;