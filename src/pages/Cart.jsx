import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

function Cart() {
    const navigate = useNavigate();
  const {
    cart,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
  } = useCart();

  const deliveryFee = cart.length > 0 ? 40 : 0;
  const total = cartTotal + deliveryFee;

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">
          🛒
        </div>

        <h1>Your cart is empty</h1>

        <p>
          Add some delicious food to your cart first.
        </p>

        <Link to="/">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">

      <h1>Your Cart 🛒</h1>

      <div className="cart-container">

        {/* CART ITEMS */}
        <div className="cart-items">

          {cart.map((item) => (
            <div
              className="cart-item"
              key={item.id}
            >

              <div className="cart-food-image">
                {item.emoji}
              </div>

              <div className="cart-food-info">

                <h3>{item.name}</h3>

                <p>{item.description}</p>

                <strong>
                  ₹{item.price}
                </strong>

              </div>

              {/* QUANTITY */}
              <div className="quantity-controls">

                <button
                  onClick={() =>
                    decreaseQuantity(item.id)
                  }
                >
                  −
                </button>

                <span>
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    increaseQuantity(item.id)
                  }
                >
                  +
                </button>

              </div>

              {/* ITEM TOTAL */}
              <div className="cart-item-total">
                ₹{item.price * item.quantity}
              </div>

              {/* REMOVE */}
              <button
                className="remove-btn"
                onClick={() =>
                  removeFromCart(item.id)
                }
              >
                Remove
              </button>

            </div>
          ))}

        </div>


        {/* ORDER SUMMARY */}
        <div className="order-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{cartTotal}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>₹{deliveryFee}</span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <strong>
              ₹{total}
            </strong>
          </div>

          <button
  className="checkout-btn"
  onClick={() => navigate("/checkout")}
>
  Proceed to Checkout
</button>

        </div>

      </div>

    </div>
  );
}

export default Cart;