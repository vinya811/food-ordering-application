import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { useAuth } from "./AuthContext";

const OrdersContext = createContext();

function getUserEmail(user) {
  return user?.email?.trim().toLowerCase() || "";
}

export function OrdersProvider({ children }) {
  const { user } = useAuth();

  const email = getUserEmail(user);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // LOAD ORDERS FROM MONGODB
  // =========================

  useEffect(() => {
    if (!email) {
      setOrders([]);
      return;
    }

    const loadOrders = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          "http://localhost:5000/api/orders/" +
            encodeURIComponent(email)
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(
            "Could not load orders:",
            data.message
          );

          setOrders([]);
          return;
        }

        setOrders(data);

      } catch (error) {
        console.error(
          "Could not connect to orders server:",
          error
        );

        setOrders([]);

      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [email]);


  // =========================
  // PLACE ORDER
  // =========================

  const placeOrder = async (
    cart,
    deliveryDetails,
    total
  ) => {
    if (!email) {
      throw new Error(
        "Please log in before placing an order."
      );
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            userEmail: email,
            items: cart,
            deliveryDetails,
            total
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not place order."
        );
      }

      // Add the newly created order to the
      // current user's orders immediately.
      setOrders((currentOrders) => [
        data.order,
        ...currentOrders
      ]);

      return data.order;

    } catch (error) {
      console.error(
        "Place order error:",
        error
      );

      throw error;
    }
  };


  return (
    <OrdersContext.Provider
      value={{
        orders,
        placeOrder,
        loading
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}


export function useOrders() {
  return useContext(OrdersContext);
}