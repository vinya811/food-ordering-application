import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";

import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    cartTotal,
    clearCart
  } = useCart();

  const { placeOrder } = useOrders();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const deliveryFee = cart.length > 0 ? 40 : 0;
  const total = cartTotal + deliveryFee;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      navigate("/cart");
      return;
    }

    const order = await placeOrder(
      cart,
      formData,
      total
    );

    clearCart();

    navigate(`/order-success/${order.id}`);
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">
          🛒
        </div>

        <h1>Your cart is empty</h1>

        <p>
          Add some food before checking out.
        </p>

        <button
          onClick={() => navigate("/")}
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">

      <h1>Checkout</h1>

      <div className="checkout-container">

        {/* DELIVERY FORM */}

        <div className="checkout-form">

          <h2>Delivery Details</h2>

          <form onSubmit={handleSubmit}>

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />


            <label>
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />


            <label>
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter delivery address"
              rows="4"
              required
            />


            <div className="form-row">

              <div>
                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>


              <div>
                <label>
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  required
                />
              </div>

            </div>


            <button
              type="submit"
              className="place-order-btn"
            >
              Place Order
            </button>

          </form>

        </div>


        {/* ORDER SUMMARY */}

        <div className="checkout-summary">

          <h2>Your Order</h2>

          {cart.map((item) => (
            <div
              className="checkout-item"
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


          <hr />

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{cartTotal}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>₹{deliveryFee}</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;