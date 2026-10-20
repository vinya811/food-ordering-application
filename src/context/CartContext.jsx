import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { useAuth } from "./AuthContext";

const CartContext = createContext();

const STORAGE_KEY = "foodieCartsByUser";

function getUserEmail(user) {
  return user?.email?.trim().toLowerCase() || "";
}

function getSavedCart(email) {
  if (!email) return [];

  try {
    const allCarts = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "{}"
    );

    return allCarts[email] || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();

  const email = getUserEmail(user);

  const [cart, setCart] = useState(() =>
    getSavedCart(email)
  );

  // Load the correct cart whenever the logged-in account changes.
  useEffect(() => {
    setCart(getSavedCart(email));
  }, [email]);

  // Save the current user's cart.
  useEffect(() => {
    if (!email) return;

    try {
      const allCarts = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "{}"
      );

      allCarts[email] = cart;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(allCarts)
      );
    } catch {
      console.error("Could not save cart.");
    }
  }, [cart, email]);

  const addToCart = (food) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === food.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === food.id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...food,
          quantity: 1
        }
      ];
    });
  };

  const removeFromCart = (foodId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== foodId
      )
    );
  };

  const increaseQuantity = (foodId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === foodId
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    );
  };

  const decreaseQuantity = (foodId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === foodId
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cartCount,
        cartTotal,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}