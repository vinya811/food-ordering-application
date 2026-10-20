import { Link } from "react-router-dom";
import { useOrders } from "../context/OrdersContext";
import "./Orders.css";

function Orders() {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="empty-orders">

        <div className="empty-orders-icon">
          📦
        </div>

        <h1>No Orders Yet</h1>

        <p>
          You haven't placed any orders yet.
        </p>

        <Link to="/">
          Start Ordering
        </Link>

      </div>
    );
  }

  return (
    <div className="orders-page">

      <h1>My Orders 📦</h1>

      <div className="orders-list">

        {orders.map((order) => (
          <div
            className="order-card"
            key={order.id}
          >

            <div className="order-header">

              <div>
                <h2>
                  Order #{order.id}
                </h2>

                <p>
                  {order.date}
                </p>
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
                    {item.emoji} {item.name} × {item.quantity}
                  </span>

                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>

                </div>
              ))}

            </div>

            <div className="order-footer">

              <span>
                Total
              </span>

              <strong>
                ₹{order.total}
              </strong>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Orders;