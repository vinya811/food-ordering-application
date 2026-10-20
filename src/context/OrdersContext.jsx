
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { useAuth } from "./AuthContext";

const OrdersContext = createContext();

const STORAGE_KEY = "foodieOrdersByUser";

function getUserEmail(user) {
  return user?.email?.trim().toLowerCase() || "";
}

function getSavedOrders(email) {
  if (!email) return [];

  try {
    const allOrders = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "{}"
    );

    return allOrders[email] || [];
  } catch {
    return [];
  }
}

export function OrdersProvider({ children }) {
  const { user } = useAuth();
  const email = getUserEmail(user);

  const [orders, setOrders] = useState(() =>
    getSavedOrders(email)
  );

  // Load the correct orders whenever the logged-in account changes.
  useEffect(() => {
    setOrders(getSavedOrders(email));
  }, [email]);

  const placeOrder = (cart, deliveryDetails, total) => {
    if (!email) {
      throw new Error("Please log in before placing an order.");
    }

    const newOrder = {
      id: `ORD-${Date.now()}`,
      items: cart,
      deliveryDetails,
      total,
      status: "Order Placed",
      date: new Date().toLocaleDateString()
    };

    // Save the order under this user's email only.
    const allOrders = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "{}"
    );

    const userOrders = allOrders[email] || [];

    allOrders[email] = [newOrder, ...userOrders];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(allOrders)
    );

    setOrders(allOrders[email]);

    return newOrder;
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        placeOrder
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}
