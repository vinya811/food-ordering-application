
import { useState } from "react";
import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const email = formData.email.trim().toLowerCase();

    let accounts = [];

    try {
      // Read all registered accounts.
      accounts = JSON.parse(
        localStorage.getItem("foodieAccounts") || "[]"
      );

      if (!Array.isArray(accounts)) {
        accounts = [];
      }

      // Support accounts saved using the older single-account format.
      const oldAccount = localStorage.getItem("foodieAccount");

      if (oldAccount) {
        const parsedOldAccount = JSON.parse(oldAccount);

        const alreadySaved = accounts.some(
          (account) =>
            account.email?.trim().toLowerCase() ===
            parsedOldAccount.email?.trim().toLowerCase()
        );

        if (parsedOldAccount.email && !alreadySaved) {
          accounts.push(parsedOldAccount);
        }
      }
    } catch {
      setError("Could not read saved accounts. Please try again.");
      return;
    }

    // Find the account matching both email and password.
    const account = accounts.find(
      (savedAccount) =>
        savedAccount.email?.trim().toLowerCase() === email &&
        savedAccount.password === formData.password
    );

    if (!account) {
      setError("Incorrect email or password.");
      return;
    }

    // Save the updated account list if an older account was migrated.
    localStorage.setItem(
      "foodieAccounts",
      JSON.stringify(accounts)
    );

    // Update the active login session.
    login({
      name: account.name,
      email: account.email
    });

    // Return to the requested protected page, or Home by default.
    const destination = location.state?.from;
    const requestedPath =
      destination?.pathname?.startsWith("/") &&
      !destination.pathname.startsWith("//")
        ? destination.pathname
        : "/";

    navigate(requestedPath, { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">🍔</div>

        <h1>Welcome Back!</h1>

        <p className="login-subtitle">
          Login to continue ordering delicious food.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit">Login</button>
        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
