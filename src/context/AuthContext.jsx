import {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("foodieUser");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Login user
  const login = (account) => {
    localStorage.setItem(
      "foodieUser",
      JSON.stringify(account)
    );

    setUser(account);
  };

  // Update logged-in user's profile
  const updateUser = (updatedData) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...updatedData
    };

    // Update current logged-in user
    localStorage.setItem(
      "foodieUser",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);

    // Also update the saved account
    // so the new details remain after logout/login.
    try {
      const accounts = JSON.parse(
        localStorage.getItem("foodieAccounts") || "[]"
      );

      if (Array.isArray(accounts)) {
        const updatedAccounts = accounts.map(
          (account) => {
            if (
              account.email?.trim().toLowerCase() ===
              user.email?.trim().toLowerCase()
            ) {
              return {
                ...account,
                ...updatedData
              };
            }

            return account;
          }
        );

        localStorage.setItem(
          "foodieAccounts",
          JSON.stringify(updatedAccounts)
        );
      }
    } catch {
      console.error("Could not update saved account.");
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("foodieUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        updateUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}